/**
 * Spring physics animation hook
 * Provides natural, physics-based animations using spring dynamics
 */

import { useCallback, useEffect, useRef, useState } from "react";

export interface SpringConfig {
  /**
   * Stiffness of the spring (10-300)
   * Higher values = faster/snappier movement
   */
  stiffness: number;

  /**
   * Damping coefficient (0.1-1.0)
   * Higher values = less oscillation/bounce
   */
  damping: number;

  /**
   * Mass of the object (0.1-10)
   * Higher values = slower movement
   */
  mass: number;

  /**
   * Velocity threshold for rest (default: 0.01)
   * When velocity is below this, animation stops
   */
  restVelocity?: number;

  /**
   * Displacement threshold for rest (default: 0.01)
   * When displacement is below this, animation stops
   */
  restDelta?: number;
}

export interface UseSpringReturn {
  /**
   * Current animated value
   */
  value: number;

  /**
   * Current velocity
   */
  velocity: number;

  /**
   * Whether the spring is currently animating
   */
  isAnimating: boolean;

  /**
   * Set a new target value to animate towards
   */
  setTarget: (newTarget: number) => void;

  /**
   * Stop the animation immediately
   */
  stop: () => void;

  /**
   * Set the current value without animation
   */
  setValue: (newValue: number) => void;
}

/**
 * Spring animation presets
 */
export const SPRING_PRESETS = {
  /**
   * Gentle, smooth animation with subtle bounce
   */
  gentle: {
    stiffness: 120,
    damping: 14,
    mass: 1,
  },
  /**
   * Responsive, balanced animation
   */
  responsive: {
    stiffness: 180,
    damping: 12,
    mass: 0.8,
  },
  /**
   * Snappy, fast animation with minimal bounce
   */
  snappy: {
    stiffness: 280,
    damping: 20,
    mass: 0.5,
  },
  /**
   * Bouncy animation with noticeable spring effect
   */
  bouncy: {
    stiffness: 200,
    damping: 8,
    mass: 1.2,
  },
} as const;

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Spring physics hook with RK4 integration
 * @param initialValue Initial value
 * @param config Spring configuration or preset name
 * @returns Spring animation state and controls
 */
export function useSpring(
  initialValue: number,
  config: SpringConfig | keyof typeof SPRING_PRESETS = "responsive",
): UseSpringReturn {
  // Resolve config from preset if needed
  const springConfig: SpringConfig = typeof config === "string" ? SPRING_PRESETS[config] : config;

  const { stiffness, damping, mass, restVelocity = 0.01, restDelta = 0.01 } = springConfig;

  const [value, setValue] = useState(initialValue);
  const [isAnimating, setIsAnimating] = useState(false);

  const targetRef = useRef(initialValue);
  const velocityRef = useRef(0);
  const valueRef = useRef(initialValue);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Update value ref when state changes
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  /**
   * Spring force calculation
   */
  const calculateSpringForce = useCallback(
    (position: number, velocity: number, target: number) => {
      const displacement = target - position;
      const springForce = stiffness * displacement;
      const dampingForce = -damping * velocity;
      const acceleration = (springForce + dampingForce) / mass;
      return acceleration;
    },
    [stiffness, damping, mass],
  );

  /**
   * RK4 integration step for smooth physics
   */
  const integrate = useCallback(
    (position: number, velocity: number, target: number, dt: number) => {
      // If user prefers reduced motion, snap to target instantly
      if (prefersReducedMotion()) {
        return { position: target, velocity: 0 };
      }

      // RK4 integration
      const k1v = calculateSpringForce(position, velocity, target);
      const k1x = velocity;

      const k2v = calculateSpringForce(
        position + k1x * dt * 0.5,
        velocity + k1v * dt * 0.5,
        target,
      );
      const k2x = velocity + k1v * dt * 0.5;

      const k3v = calculateSpringForce(
        position + k2x * dt * 0.5,
        velocity + k2v * dt * 0.5,
        target,
      );
      const k3x = velocity + k2v * dt * 0.5;

      const k4v = calculateSpringForce(position + k3x * dt, velocity + k3v * dt, target);
      const k4x = velocity + k3v * dt;

      const newVelocity = velocity + (dt / 6) * (k1v + 2 * k2v + 2 * k3v + k4v);
      const newPosition = position + (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);

      return { position: newPosition, velocity: newVelocity };
    },
    [calculateSpringForce],
  );

  /**
   * Animation tick
   */
  const tick = useCallback(
    (timestamp: number) => {
      const deltaTime = lastTimeRef.current === 0 ? 16 : timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Clamp delta time to prevent large jumps (60fps = 16.67ms)
      const dt = Math.min(deltaTime, 64) / 1000;

      const { position, velocity: newVelocity } = integrate(
        valueRef.current, // Use ref, not state
        velocityRef.current,
        targetRef.current,
        dt,
      );

      // Check if spring has come to rest
      const isAtRest =
        Math.abs(newVelocity) < restVelocity && Math.abs(targetRef.current - position) < restDelta;

      if (isAtRest) {
        // Snap to target and stop
        setValue(targetRef.current);
        velocityRef.current = 0;
        setIsAnimating(false);
        animationFrameRef.current = null;
        return;
      }

      // Update state
      setValue(position);
      velocityRef.current = newVelocity;

      // Continue animation
      animationFrameRef.current = requestAnimationFrame(tick);
    },
    [integrate, restVelocity, restDelta], // No value dependency
  );

  /**
   * Set a new target value
   */
  const setTarget = useCallback(
    (newTarget: number) => {
      targetRef.current = newTarget;

      // Start animation if not already running
      if (!isAnimating) {
        setIsAnimating(true);
        lastTimeRef.current = 0;
        animationFrameRef.current = requestAnimationFrame(tick);
      }
    },
    [isAnimating, tick],
  );

  /**
   * Stop animation immediately
   */
  const stop = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsAnimating(false);
    velocityRef.current = 0;
  }, []);

  /**
   * Set value without animation
   */
  const setValueImmediate = useCallback(
    (newValue: number) => {
      stop();
      setValue(newValue);
      targetRef.current = newValue;
      velocityRef.current = 0;
    },
    [stop],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    value,
    velocity: velocityRef.current,
    isAnimating,
    setTarget,
    stop,
    setValue: setValueImmediate,
  };
}

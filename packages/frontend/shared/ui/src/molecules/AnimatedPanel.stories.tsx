/**
 * AnimatedPanel component stories
 */

import type { Meta } from "@storybook/react";
import { useState } from "react";
import { Button } from "../atoms/Button";
import { Text } from "../atoms/Text";
import { AnimatedPanel } from "./AnimatedPanel";

const meta = {
  title: "Molecules/AnimatedPanel",
  component: AnimatedPanel,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AnimatedPanel>;

export default meta;

/**
 * Demo component with toggle button
 */
function AnimatedPanelDemo({
  position,
  animation,
}: {
  position: "left" | "right" | "bottom" | "top" | "center";
  animation: "slide" | "fade" | "fade-scale";
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
        }}
      >
        <Button variant="primary" onPress={() => setIsVisible(!isVisible)}>
          {isVisible ? "Hide" : "Show"} Panel
        </Button>
      </div>

      {position === "center" ? (
        <AnimatedPanel
          isVisible={isVisible}
          position={position}
          animation={animation}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: isVisible ? "translate(-50%, -50%)" : "translate(-50%, -50%) scale(0.95)",
            backgroundColor: "var(--bg-secondary)",
            borderRadius: "8px",
            padding: "32px",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border-color)",
            width: "400px",
          }}
        >
          <Text size="lg" weight="semibold" color="fg-primary">
            Centered Modal Panel
          </Text>
          <div style={{ marginTop: "16px" }}>
            <Text size="base" color="fg-secondary">
              This panel animates from the center with a scale effect.
            </Text>
          </div>
        </AnimatedPanel>
      ) : (
        <AnimatedPanel
          isVisible={isVisible}
          position={position}
          animation={animation}
          style={{
            position: "absolute",
            ...(position === "left" && { left: 0, top: 0, bottom: 0, width: "300px" }),
            ...(position === "right" && { right: 0, top: 0, bottom: 0, width: "300px" }),
            ...(position === "bottom" && { left: 0, right: 0, bottom: 0, height: "200px" }),
            ...(position === "top" && { left: 0, right: 0, top: 0, height: "200px" }),
            backgroundColor: "var(--bg-secondary)",
            borderRight: position === "left" ? "1px solid var(--border-color)" : undefined,
            borderLeft: position === "right" ? "1px solid var(--border-color)" : undefined,
            borderTop: position === "bottom" ? "1px solid var(--border-color)" : undefined,
            borderBottom: position === "top" ? "1px solid var(--border-color)" : undefined,
            padding: "24px",
          }}
        >
          <Text size="lg" weight="semibold" color="fg-primary">
            {position.charAt(0).toUpperCase() + position.slice(1)} Panel
          </Text>
          <div style={{ marginTop: "16px" }}>
            <Text size="base" color="fg-secondary">
              This panel slides in from the {position}.
            </Text>
          </div>
        </AnimatedPanel>
      )}
    </div>
  );
}

export const SlideFromLeft = {
  render: () => <AnimatedPanelDemo position="left" animation="slide" />,
};

export const SlideFromRight = {
  render: () => <AnimatedPanelDemo position="right" animation="slide" />,
};

export const SlideFromBottom = {
  render: () => <AnimatedPanelDemo position="bottom" animation="slide" />,
};

export const SlideFromTop = {
  render: () => <AnimatedPanelDemo position="top" animation="slide" />,
};

export const FadeScaleCenter = {
  render: () => <AnimatedPanelDemo position="center" animation="fade-scale" />,
};

export const FadeOnly = {
  render: () => <AnimatedPanelDemo position="left" animation="fade" />,
};

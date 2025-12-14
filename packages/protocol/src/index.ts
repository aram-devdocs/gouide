// @gouide/protocol - Generated Protocol Types
// This file re-exports all generated protobuf types for the Gouide protocol.
// DO NOT EDIT - regenerate with `pnpm codegen`

// Common types (timestamps, errors, pagination, streaming metadata)
export * from "./generated/gouide/v1/common_pb.js";

// Handshake protocol (Hello/Welcome, Control service types)
export * from "./generated/gouide/v1/handshake_pb.js";

// Workspace operations (files, directories, buffers)
export * from "./generated/gouide/v1/workspace_pb.js";

// Editor operations (edits, syntax tokens, diagnostics)
export * from "./generated/gouide/v1/editor_pb.js";

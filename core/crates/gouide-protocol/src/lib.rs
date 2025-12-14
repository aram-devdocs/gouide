//! Generated protocol types for Gouide daemon/client communication.
//!
//! This crate provides Rust types generated from the protobuf definitions in `protocol/`.
//! All types are in the `gouide::v1` module, matching the protobuf package structure.
//!
//! # Usage
//!
//! ```ignore
//! use gouide_protocol::{Hello, Welcome, Handshake};
//! ```

#![allow(clippy::derive_partial_eq_without_eq)]

pub mod gouide {
    pub mod v1 {
        tonic::include_proto!("gouide.v1");
    }
}

// Re-export common types at crate root for convenience
pub use gouide::v1::*;

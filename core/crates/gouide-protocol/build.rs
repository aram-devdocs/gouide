//! Build script for gouide-protocol
//!
//! Compiles protobuf definitions from protocol/ into Rust types using tonic-build.
//! The generated code ends up in `OUT_DIR` and is included at compile time.

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let protos = [
        "../../../protocol/gouide/v1/common.proto",
        "../../../protocol/gouide/v1/handshake.proto",
        "../../../protocol/gouide/v1/workspace.proto",
        "../../../protocol/gouide/v1/editor.proto",
    ];

    // Re-run if any proto file changes
    for proto in &protos {
        println!("cargo:rerun-if-changed={proto}");
    }

    tonic_build::configure()
        .build_server(true)
        .build_client(true)
        .compile_protos(&protos, &["../../../protocol"])?;

    Ok(())
}

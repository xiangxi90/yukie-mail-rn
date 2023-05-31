use std::io::Result;
use std::{env, fs};
fn main() -> Result<()> {
    // let mut config = prost_build::Config::new();
    // config
    //     .out_dir("src/proto")
    //     .type_attribute(".", "#[derive(serde::Serialize,serde::Deserialize)]")
    //     .compile_protos(
    //         &["src/protobuf/command.proto", "src/protobuf/mail_base.proto"],
    //         &["src/protobuf"],
    //     )
    //     .unwrap();

    // tonic_build::configure()
    //     .type_attribute(".", "#[derive(serde::Serialize,serde::Deserialize)]")
    //     .out_dir("src/proto")
    //     .compile(
    //         &["idl/command.proto", "idl/mail_base.proto"],
    //         &["idl/"],
    //     )
    //     .unwrap();
    Ok(())
}

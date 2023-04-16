#[cfg(feature = "jni")]
pub mod android_ffi;
#[cfg(feature = "ffi")]
pub mod c_ffi;
mod string;
use string::StringPtr;

// string ffi

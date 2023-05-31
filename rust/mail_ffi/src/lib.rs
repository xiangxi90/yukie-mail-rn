// #[cfg(target_os = "android")]
#[cfg(feature = "android_jni")]
pub mod android_ffi;
#[cfg(feature = "android_jni")]
pub(crate) mod bridge;

#[cfg(feature = "ffi")]
pub mod c_ffi;
#[macro_use]
pub(crate) mod logger;
pub(crate) mod string;
pub(crate) mod uds;

// string ffi
#[cfg(test)]
mod test;

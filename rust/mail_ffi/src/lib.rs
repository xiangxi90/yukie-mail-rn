#[cfg(feature = "jni")]
pub mod android_ffi;
#[cfg(feature = "ffi")]
pub mod c_ffi;
mod string;
mod uds;

// string ffi
#[cfg(test)]
mod test;

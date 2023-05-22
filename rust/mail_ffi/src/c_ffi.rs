use string::StringPtr;

#[no_mangle]
pub unsafe extern "C" fn rust_string_ptr(s: *mut String) -> *mut StringPtr {
    Box::into_raw(Box::new(StringPtr::from(&**s)))
}

#[no_mangle]
pub unsafe extern "C" fn rust_string_destroy(s: *mut String) {
    let _ = Box::from_raw(s);
}

#[no_mangle]
pub unsafe extern "C" fn rust_string_ptr_destroy(s: *mut StringPtr) {
    let _ = Box::from_raw(s);
}

#[no_mangle]
pub unsafe extern "C" fn hello_world(name: *mut StringPtr) -> *mut String {
    let name = (*name).as_str();
    let response = format!("Hello {}!", name);
    Box::into_raw(Box::new(response))
}

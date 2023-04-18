use jni::objects::{JClass, JString};
use jni::sys::jstring;
use jni::JNIEnv;

#[no_mangle]
pub unsafe extern "C" fn Java_com_yukie_1mail_1rn_YukieMailBridge_helloWorld(
    mut env: JNIEnv,
    _: JClass,
    name: JString,
) -> jstring {
    let name: String = env.get_string(&name).unwrap().into();
    let response = format!("Hello {}!", name);
    env.new_string(response).unwrap().into_raw()
}

/// 在应用启动时调用该函数，唤起工作进程
#[no_mangle]
pub unsafe extern "C" fn Java_com_yukie_1mail_1rn_YukieMailBridge_init(
    mut env: JNIEnv,
    _: JClass,
    name: JString,
) -> jstring {
    let name: String = env.get_string(&name).unwrap().into();
    let response = format!("Hello {}!", name);
    env.new_string(response).unwrap().into_raw()
}

/// 考虑到最终使用到react层的时候，还是只能使用json，
/// 故而在调用invoke接口时，直接使用json进行通信，
/// 只在部分传入数据极大的接口，使用protobuf
#[no_mangle]
pub unsafe extern "C" fn Java_com_yukie_1mail_1rn_YukieMailBridge_invoke_async(
    mut env: JNIEnv,
    _: JClass,
    name: JString,
) -> jstring {
    let name: String = env.get_string(&name).unwrap().into();
    let response = format!("Hello {}!", name);
    env.new_string(response).unwrap().into_raw()
}

/// 考虑到最终使用到react层的时候，还是只能使用json，
/// 故而在调用invoke接口时，直接使用json进行通信，
/// 只在部分传入数据极大的接口，使用protobuf
#[no_mangle]
pub unsafe extern "C" fn Java_com_yukie_1mail_1rn_YukieMailBridge_invoke(
    mut env: JNIEnv,
    _: JClass,
    name: JString,
) -> jstring {
    let name: String = env.get_string(&name).unwrap().into();
    let response = format!("Hello {}!", name);
    env.new_string(response).unwrap().into_raw()
}

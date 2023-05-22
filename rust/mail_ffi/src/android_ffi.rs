extern crate yukie_mail;
use dotenvy::dotenv;
use jni::objects::{JByteArray, JClass, JObject, JObjectArray, JString};
use jni::sys::{jboolean, jbyteArray, jint, jstring};
use jni::JNIEnv;
use log::debug;
use std::env;
use yukie_mail::client::{invoke_sync, ClientRequest};
use yukie_mail::tonic_server::start_server;

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
pub unsafe extern "C" fn Java_com_yukie_1mail_1rn_YukieMailBridge_createWorker(
    mut env: JNIEnv,
    _: JClass,
    user_id: JString,
) -> jboolean {
    let user_id: String = env.get_string(&user_id).unwrap().into();
    debug!("android create worker by :{}", user_id);
    dotenv().ok();
    let socket_path = env::var("UNIX_DOMAIN_SOCKET").expect("UNIX_DOMAIN_SOCKET must be set");
    let max_thread_nums: usize = env::var("MAX_THREAD_NUMS")
        .expect("UNIX_DOMAIN_SOCKET must be set")
        .parse()
        .unwrap();
    start_server(max_thread_nums, &socket_path).unwrap();
    return 1;
}

/// 考虑到最终使用到react层的时候，还是只能使用json，
/// 故而在调用invoke接口时，直接使用json进行通信，
/// 只在部分传入数据极大的接口，使用protobuf
#[no_mangle]
pub unsafe extern "C" fn Java_com_yukie_1mail_1rn_YukieMailBridge_invokeWorker<'a>(
    mut env: JNIEnv<'a>,
    _: JClass<'a>,
    command_id: jint,
    payload: JByteArray<'a>,
) -> JByteArray<'a> {
    let command_id = command_id;
    let payload: Vec<u8> = env.convert_byte_array(payload).unwrap();
    let request = ClientRequest::new(command_id, payload);
    let socket_path = env::var("UNIX_DOMAIN_SOCKET").expect("UNIX_DOMAIN_SOCKET must be set");

    let response = invoke_sync(socket_path, request).unwrap();
    env.byte_array_from_slice(response.as_slice()).unwrap()
}

/// 考虑到最终使用到react层的时候，还是只能使用json，
/// 故而在调用invoke接口时，直接使用json进行通信，
/// 只在部分传入数据极大的接口，使用protobuf
#[no_mangle]
pub unsafe extern "C" fn Java_com_yukie_1mail_1rn_YukieMailBridge_asyncInvokeWorker(
    mut env: JNIEnv,
    _: JClass,
    command_id: jint,
    payload: JString,
) -> jstring {
    let command_id = command_id;
    let payload: String = env.get_string(&payload).unwrap().into();
    debug!("android invoke worker: {}::{}", command_id, payload);
    let response = format!("async invoke {}!", payload);
    env.new_string(response).unwrap().into_raw()
}

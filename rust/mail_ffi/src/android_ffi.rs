extern crate yukie_mail;
use crate::bridge::runtime::{spawn,block_on};
use crate::bridge::start_bridge;
use crate::debug;
use jni::objects::{JByteArray, JClass, JObject, JObjectArray, JString};
use jni::sys::{jboolean, jbyteArray, jint, jstring};
use jni::JNIEnv;
use yukie_mail::client::{invoke, ClientRequest};
use yukie_mail::tonic_server;

#[no_mangle]
pub unsafe extern "C" fn Java_com_yukie_1mail_1rn_rust_1service_RustBridge_helloWorld(
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
pub unsafe extern "C" fn Java_com_yukie_1mail_1rn_rust_1service_RustBridge_createWorker(
    mut env: JNIEnv,
    _: JClass,
    user_id: JString,
    socket_path: JString,
    jni_bridge: JObject,
) -> jboolean {
    start_bridge(&env, jni_bridge);
    let user_id: String = env.get_string(&user_id).unwrap().into();
    let socket_path: String = env.get_string(&socket_path).unwrap().into();
    debug!("android create worker by :{},{}", user_id, socket_path);

    // let max_thread_nums: usize = max_thread_nums as usize;
    block_on(async move { tonic_server::start(&socket_path).await });
    return 1;
}

/// 在应用启动时调用该函数，唤起工作进程
#[no_mangle]
pub unsafe extern "C" fn Java_com_yukie_1mail_1rn_YukieMailServer_createWorker(
    mut env: JNIEnv,
    _: JClass,
    user_id: JString,
    socket_path: JString,
    jni_bridge: JObject,
) -> jboolean {
    start_bridge(&env, jni_bridge);
    let user_id: String = env.get_string(&user_id).unwrap().into();
    let socket_path: String = env.get_string(&socket_path).unwrap().into();
    debug!("android create worker by :{},{}", user_id, socket_path);

    // let max_thread_nums: usize = max_thread_nums as usize;
    spawn(async move { tonic_server::start(&socket_path).await });
    return 1;
}

/// 考虑到最终使用到react层的时候，还是只能使用json，
/// 故而在调用invoke接口时，直接使用json进行通信，
/// 只在部分传入数据极大的接口，使用protobuf
#[no_mangle]
pub unsafe extern "C" fn Java_com_yukie_1mail_1rn_rust_1service_RustBridge_invokeWorker<'a>(
    mut env: JNIEnv<'a>,
    _: JClass<'a>,
    command_id: jint,
    payload: JByteArray<'a>,
    socket_path: JString,
    jni_bridge: JObject,
) -> JByteArray<'a> {
    let command_id = command_id;
    let payload: Vec<u8> = env.convert_byte_array(payload).unwrap();
    let request = ClientRequest::new(command_id, payload);
    let socket_path: String = env.get_string(&socket_path).unwrap().into();

    let response = block_on(async move { invoke(socket_path, request).await.unwrap_or_default() });
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

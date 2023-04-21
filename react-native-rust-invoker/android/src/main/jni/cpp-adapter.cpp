#include <jni.h>
#include "react-native-rust-invoker.h"
#include "log.h"

extern "C" JNIEXPORT jdouble JNICALL
Java_com_react-native-rust-invoker_impl_react-native-rust-invokerModuleImpl_nativeMultiply(JNIEnv *env, jclass type, jdouble num1, jdouble num2)
{
    LOGI("Calling nativeMultiply");
    return react-native-rust-invoker::multiply(num1, num2);
}
package com.yukie_mail_rn;

import android.content.Context;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.yukie_mail_rn.rust_service.RustBridge;

import kotlin.UByteArray;

// 该模块用于暴露出给React Native 调用的接口，目前只需要调用invoke即可
// 使用时传入command对应command id以及request pb化数据
// 返回对应response 的pb数据
public class YukieMailBridge extends ReactContextBaseJavaModule {

    @Override
    public String getName() {
        return "YukieMailBridge";
    }

    public static RustBridge bridge = new RustBridge();

    public YukieMailBridge(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public byte[] invoke(int commandId, UByteArray payloadString) {
        Log.d("Rust_LIB", String.format("invoke rust %d:%s", commandId, payloadString));
        return bridge.invoke(commandId, payloadString, "/data/data/com.yukie_mail_rn/mail_server.socket");
    }

    @ReactMethod
    public void asyncInvoke(int commandId, UByteArray payloadString, Promise promise) {
        Log.d("Rust_LIB", String.format("async invoke rust %d:%s", commandId, payloadString));
        try {
            byte[] resp = bridge.invoke(commandId, payloadString, "/data/data/com.yukie_mail_rn/mail_server.socket");
            promise.resolve(resp);
        } catch (Exception e) {
            Log.w("Rust_Lib",e.getMessage());
            promise.reject("Invoke Failed", e);
        }
    }

}
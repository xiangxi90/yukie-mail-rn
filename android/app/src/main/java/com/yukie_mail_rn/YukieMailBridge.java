package com.yukie_mail_rn;

import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


public class YukieMailBridge extends ReactContextBaseJavaModule {
    static {
        System.loadLibrary("mail_ffi");
    }

    @Override
    public String getName() {
        return "YukieMailBridge";
    }

    public YukieMailBridge(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void sayHelloWorld(String name, Promise promise) {
        Log.d("====test_rust_lib======","say hello");
        promise.resolve(helloWorld(name));
    }

    private static native String helloWorld(String seed);
}
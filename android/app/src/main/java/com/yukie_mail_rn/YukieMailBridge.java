package com.yukie_mail_rn;

import android.util.Log;

import javax.print.DocFlavor.BYTE_ARRAY;

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
        Log.d("Rust_LIB", "===say_hello===");
        promise.resolve(helloWorld(name));
    }

    @ReactMethod
    public void createAppWorker(String userId) {
        if (!createWorker(userId)) {
            Log.d("Rust_LIB", "<<Monitor created failed>>");
        } else {
            Log.d("Rust_LIB", "<<Monitor created success>>");
        }
        if (!connectToWorker()) {
            Log.d("Rust_LIB", "<<Connect To Monitor failed>>");
        } else {
            Log.d("Rust_LIB", "<<Connect To Monitor success>>");
        }
    }

    @ReactMethod
    public byte[] invoke(int commandId, byte[] payloadString) {
        Log.d("Rust_LIB", String.format("invoke rust %d", commandId));
        return invokeWorker(commandId, payloadString);
    }

    @ReactMethod
    public String asyncInvoke(int commandId, String payloadString) {
        Log.d("Rust_LIB", String.format("async invoke rust %d:%s", commandId, payloadString));
        return invokeWorker(commandId, payloadString);
    }

    private static native String helloWorld(String seed);

    /**
     * Native方法，创建一个rust子进程.
     *
     * @param userId
     *               当前进程的用户ID,子进程重启当前进程时需要用到当前进程的用户ID.
     * @return 如果子进程创建成功返回true，否则返回false
     */
    private native boolean createWorker(String userId);

    /**
     * Native方法，让当前进程连接到rust进程.
     *
     * @return 连接成功返回true，否则返回false
     */
    private native boolean connectToWorker();

    /**
     * Native方法，让当前进程连接到rust进程.
     * sync方式
     *
     * @return 连接成功返回true，否则返回false
     */
    private native byte[] invokeWorker(int commandId, byte[] payloadString);

    /**
     * Native方法，让当前进程连接到rust进程.
     * async方式
     *
     * @return 连接成功返回true，否则返回false
     */
    private native String asyncInvokeWorker(int commandId, String payloadString);
}
package com.yukie_mail_rn.rust_service;
import android.util.Log;

import kotlin.UByteArray;

public class RustBridge {
    static {
        System.loadLibrary("mail_ffi");
    }

    public interface OnMessageListener {
        void onMessage(int what, MessageData data);
    }

    public RustBridge() {
        Log.d("Rust Bridge","Init Rust Bridge");
    }

    public void start() {
        Log.d("Rust Bridge","Mail Server Start");
        this.createWorker("YUKIE_MAIL_RN","/data/data/com.yukie_mail_rn/", this);
    }

    public String hello(String name) {
        Log.d("Rust Bridge","Hello World");
        return this.helloWorld(name);
    }

    public byte[] invoke(int commandId, UByteArray payload, String socket_path) {
        Log.d("Rust_LIB", String.format("async invoke rust %d:%s at %s", commandId, payload, socket_path));
        try {
            return this.invokeWorker(commandId, payload, socket_path, this);
        } catch (Exception e) {
            Log.w("Rust Bridge",e.getMessage());
            return new byte[]{};
        }
    }

    /**
     * Native方法，让当前进程连接到rust进程.
     * sync方式
     *
     * @return 连接成功返回true，否则返回false
     */
    private native byte[] invokeWorker(int commandId, UByteArray payload, String socket_path, Object bridge);

    /**
     * Native 方法，主要用于测试时使用，可以简单判断Rust Lib是否加载成功
     */
    private static native String helloWorld(String seed);

    /**
     * Native方法，创建一个rust子进程.
     *
     * @param userId
     *               当前进程的用户ID,子进程重启当前进程时需要用到当前进程的用户ID.
     * @return 如果子进程创建成功返回true，否则返回false
     */
    public native boolean createWorker(String userId, String socket_path, Object bridge);
}

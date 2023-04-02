#! /bin/bash
mkdir -p ../../android/app/src/main/jniLibs
mkdir -p ../../android/app/src/main/jniLibs/x86
mkdir -p ../../android/app/src/main/jniLibs/x86_64
mkdir -p ../../android/app/src/main/jniLibs/arm64-v8a
mkdir -p ../../android/app/src/main/jniLibs/armeabi-v7a
cp ./target/i686-linux-android/release/libmail_ffi.so ../../android/app/src/main/jniLibs/x86/libmail_ffi.so
cp ./target/aarch64-linux-android/release/libmail_ffi.so ../../android/app/src/main/jniLibs/arm64-v8a/libmail_ffi.so
cp ./target/armv7-linux-androideabi/release/libmail_ffi.so ../../android/app/src/main/jniLibs/armeabi-v7a/libmail_ffi.so
cp ./target/x86_64-linux-android/release/libmail_ffi.so ../../android/app/src/main/jniLibs/x86_64/libmail_ffi.so
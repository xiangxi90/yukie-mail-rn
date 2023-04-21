package com.react-native-rust-invoker;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.react-native-rust-invoker.impl.react-native-rust-invokerModuleImpl;
import java.util.Map;
import java.util.HashMap;

public class react-native-rust-invokerModule extends Nativereact-native-rust-invokerSpec {
    private react-native-rust-invokerModuleImpl implementation;

    react-native-rust-invokerModule(ReactApplicationContext context) {
        super(context);
        implementation = new react-native-rust-invokerModuleImpl();
    }

    @Override
    @NonNull
    public String getName() {
        return react-native-rust-invokerModuleImpl.NAME;
    }

    @Override
    public double turboMultiply(double num1, double num2) {
        return implementation.turboMultiply(num1, num2);
    }

    @Override
    public void add(double a, double b, Promise promise) {
        implementation.add(a, b, promise);
    }
}
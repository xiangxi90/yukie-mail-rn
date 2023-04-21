package com.react-native-rust-invoker;

import androidx.annotation.Nullable;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.TurboReactPackage;
import com.facebook.react.module.model.ReactModuleInfo;

import com.react-native-rust-invoker.impl.react-native-rust-invokerModuleImpl;

import java.util.Collections;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

public class react-native-rust-invokerPackage extends TurboReactPackage {

    @Nullable
    @Override
    public NativeModule getModule(String name, ReactApplicationContext reactContext) {
        if (name.equals(react-native-rust-invokerModuleImpl.NAME)) {
            return new react-native-rust-invokerModule(reactContext);
        } else {
            return null;
        }
    }

    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return () -> {
                final Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();
                    moduleInfos.put(
                        react-native-rust-invokerModuleImpl.NAME,
                        new ReactModuleInfo(
                        react-native-rust-invokerModuleImpl.NAME,
                        react-native-rust-invokerModuleImpl.NAME,
                        false, // canOverrideExistingModule
                        false, // needsEagerInit
                        true, // hasConstants
                        false, // isCxxModule
                        true // isTurboModule
                    ));
                return moduleInfos;
            };
    }
}
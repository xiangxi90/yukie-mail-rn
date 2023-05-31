package com.yukie_mail_rn;

import static com.yukie_mail_rn.YukieMailBridge.bridge;

import android.app.Service;
import android.os.IBinder;
import android.content.Intent;
import android.util.Log;

import androidx.annotation.Nullable;

public class YukieMailServer extends Service {
    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        Log.d("Yukie Mail","Start Mail Server");
        super.onCreate();
        String resp = bridge.hello("ls");
        Log.d("Yukie Mail",resp);
        try {
            bridge.start();
        } catch (Exception e) {
            Log.w("Yukie Mail",e.getMessage());
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d("Yukie Mail","Mail Server onStartCommand");
        return super.onStartCommand(intent, flags, startId);
    }
}

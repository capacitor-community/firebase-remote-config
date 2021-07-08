package com.getcapacitor.community.firebaserc;

import static com.getcapacitor.community.firebaserc.Constant.ERROR_MISSING_KEY;

import android.Manifest;
import android.Manifest;
import android.content.Context;
import android.os.Bundle;
import androidx.annotation.NonNull;
import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.remoteconfig.FirebaseRemoteConfigSettings;
import com.google.firebase.remoteconfig.FirebaseRemoteConfigValue;
import java.util.Collections;
import java.util.Iterator;
import java.util.Objects;

@CapacitorPlugin(
  name = "FirebaseRemoteConfig",
  permissions = {
    @Permission(
      strings = { Manifest.permission.ACCESS_NETWORK_STATE },
      alias = "network"
    ),
    @Permission(strings = { Manifest.permission.INTERNET }, alias = "internet"),
  }
)
public class FirebaseRemoteConfig extends Plugin {
  public static final String TAG = "FirebaseRemoteConfig";

  private com.google.firebase.remoteconfig.FirebaseRemoteConfig mFirebaseRemoteConfig;

  @Override
  public void load() {
    super.load();

    this.mFirebaseRemoteConfig =
      com.google.firebase.remoteconfig.FirebaseRemoteConfig.getInstance();

    String fileName = bridge
      .getActivity()
      .getPreferences(Context.MODE_PRIVATE)
      .getString("FirebaseRemoteConfigDefaults", "");
    if (fileName.isEmpty()) {
      this.mFirebaseRemoteConfig.setDefaultsAsync(
          Collections.<String, Object>emptyMap()
        );
    } else {
      Context context = bridge.getActivity().getApplicationContext();
      int resourceId = context
        .getResources()
        .getIdentifier(fileName, "xml", context.getPackageName());
      this.mFirebaseRemoteConfig.setDefaultsAsync(resourceId);
    }
  }

  @PluginMethod
  public void initialize(PluginCall call) {
    int minFetchTimeInSecs = call.getInt("minimumFetchIntervalInSeconds", 3600);
    FirebaseRemoteConfigSettings configSettings = new FirebaseRemoteConfigSettings.Builder()
      .setMinimumFetchIntervalInSeconds(minFetchTimeInSecs)
      .build();
    this.mFirebaseRemoteConfig.setConfigSettingsAsync(configSettings);

    call.success();
  }

  @PluginMethod
  public void fetch(final PluginCall call) {
    this.mFirebaseRemoteConfig.fetch()
      .addOnCompleteListener(
        bridge.getActivity(),
        new OnCompleteListener<Void>() {

          @Override
          public void onComplete(@NonNull Task<Void> task) {
            if (task.isSuccessful()) {
              call.success();
            } else if (task.isCanceled()) {
              call.error(
                Objects.requireNonNull(task.getException()).getMessage()
              );
            } else {
              call.error(
                Objects.requireNonNull(task.getException()).getMessage()
              );
            }
          }
        }
      );
  }

  @PluginMethod
  public void activate(final PluginCall call) {
    this.mFirebaseRemoteConfig.activate()
      .addOnCompleteListener(
        bridge.getActivity(),
        new OnCompleteListener<Boolean>() {

          @Override
          public void onComplete(@NonNull Task<Boolean> task) {
            if (task.isSuccessful()) {
              call.success();
            } else if (task.isCanceled()) {
              call.error(
                Objects.requireNonNull(task.getException()).getMessage()
              );
            } else {
              call.error(
                Objects.requireNonNull(task.getException()).getMessage()
              );
            }
          }
        }
      );
  }

  @PluginMethod
  public void fetchAndActivate(final PluginCall call) {
    this.mFirebaseRemoteConfig.fetchAndActivate()
      .addOnCompleteListener(
        bridge.getActivity(),
        new OnCompleteListener<Boolean>() {

          @Override
          public void onComplete(@NonNull Task<Boolean> task) {
            if (task.isSuccessful()) {
              call.success();
            } else if (task.isCanceled()) {
              call.error(
                Objects.requireNonNull(task.getException()).getMessage()
              );
            } else {
              call.error(
                Objects.requireNonNull(task.getException()).getMessage()
              );
            }
          }
        }
      )
      .addOnFailureListener(
        new OnFailureListener() {

          @Override
          public void onFailure(@NonNull Exception e) {
            call.error(e.getLocalizedMessage());
          }
        }
      );
  }

  @PluginMethod
  public void getBoolean(PluginCall call) {
    if (call.hasOption("key")) {
      String key = call.getString("key");
      JSObject result = new JSObject();
      result.put("key", key);
      result.put("value", getFirebaseRCValue(key).asBoolean());
      result.put("source", getFirebaseRCValue(key).getSource());
      call.success(result);
    } else {
      call.error(ERROR_MISSING_KEY);
    }
  }

  @PluginMethod
  public void getByteArray(PluginCall call) {
    if (call.hasOption("key")) {
      String key = call.getString("key");
      JSObject result = new JSObject();
      result.put("key", key);
      result.put("value", getFirebaseRCValue(key).asByteArray());
      result.put("source", getFirebaseRCValue(key).getSource());
      call.success(result);
    } else {
      call.error(ERROR_MISSING_KEY);
    }
  }

  @PluginMethod
  public void getNumber(PluginCall call) {
    if (call.hasOption("key")) {
      String key = call.getString("key");
      JSObject result = new JSObject();
      result.put("key", key);
      result.put("value", getFirebaseRCValue(key).asDouble());
      result.put("source", getFirebaseRCValue(key).getSource());
      call.success(result);
    } else {
      call.error(ERROR_MISSING_KEY);
    }
  }

  @PluginMethod
  public void getString(PluginCall call) {
    if (call.hasOption("key")) {
      String key = call.getString("key");
      JSObject result = new JSObject();
      result.put("key", key);
      result.put("value", getFirebaseRCValue(key).asString());
      result.put("source", getFirebaseRCValue(key).getSource());
      call.success(result);
    } else {
      call.error(ERROR_MISSING_KEY);
    }
  }

  private FirebaseRemoteConfigValue getFirebaseRCValue(String key) {
    return this.mFirebaseRemoteConfig.getValue(key);
  }
}

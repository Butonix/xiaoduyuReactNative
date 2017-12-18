package com.xiaoduyureactnative;

import android.app.Application;

import com.facebook.react.ReactApplication;
// import cn.reactnative.modules.weibo.WeiboPackage;
import cn.reactnative.modules.qq.QQPackage;
import com.theweflex.react.WeChatPackage;
import im.shimo.react.cookie.CookieManagerPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.cboy.rn.splashscreen.SplashScreenReactPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import cn.jpush.reactnativejpush.JPushPackage;

public class MainApplication extends Application implements ReactApplication {

  // 设置为 true 将不弹出 toast
  private boolean SHUTDOWN_TOAST = true;
  // 设置为 true 将不打印 log
  private boolean SHUTDOWN_LOG = true;

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            // new WeiboPackage(),
            new QQPackage(),
            new WeChatPackage(),
            new CookieManagerPackage(),
            new PickerPackage(),
            new SplashScreenReactPackage(),
            new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG)
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}

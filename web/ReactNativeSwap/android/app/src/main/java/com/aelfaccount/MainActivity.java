package com.aelf.aelfmarketmaker;

import com.facebook.react.ReactActivity;
import android.os.Bundle; // react-native-splash-screen
import org.devio.rn.splashscreen.SplashScreen; // react-native-splash-screen

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    SplashScreen.show(this, R.style.SplashScreenTheme); // react-native-splash-screen
    return "aelfAccount";
  }
}

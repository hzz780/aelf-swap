# README
React Native: 0.63.3 with expo SDK

AccountTemplate is separated from a third-party project for aelf.


## eslint & eslint-hooks

```bash
npm run postinstall
```

## Extra Dependencies

Expo: https://docs.expo.io/

```bash
npm install --global expo-cli
```

## 1.How to dev

Follow this doc: https://reactnative.cn/docs/getting-started.

## 2.How to run on device

https://reactnative.dev/docs/running-on-device

`iOS: please config Signing & Capabilities in xCode.`

## 3.Copy from this project

If you copy the package.json from this project.

```bash
# iOS
FYI AppDelegate.h AppDelegate.h.m Podfile Info.plist Image.scassets
# Android
FYI MainApplication.java android/settings.gradle android/app/build.gradle android/build.gradle AndroidManifest.xml:
# You can get more information of config from the different components docs of this project.
```

### 3.1.Check the version of Expo

Each Expo SDK version depends on a React Native version 

https://docs.expo.io/versions/latest/

### 3.2.Config react-native-unimodules iOS & Android

https://github.com/unimodules/react-native-unimodules

## 4.Package && Production && Publish

### Android APK

FYI: https://reactnative.dev/docs/signed-apk-android#generating-the-release-apk

We set a default keystore for you in android/app/src

`#file: aelf-template-key.keystore  #password: loveaelf #alias: my-key-alias`

### iOS ipa

https://wiki.genexus.com/commwiki/servlet/wiki?34616,HowTo%3A+Create+an+.ipa+file+from+XCode

## 5.Build & Publish (Integrate fastlane & firim)

Make sure you install the dependencies for react-native.

You can follow this doc: https://reactnative.cn/docs/getting-started.

You can find more operations in 
[build&publish.md](https://github.com/AElfProject/aelf-boilerplate/blob/dev/web/aelfAccountTemplateRN/build%26publish.md).

### Install fasltlane

```bash
# Install the latest Xcode command line tools:
xcode-select --install

# Install fastlane using
## Using RubyGems
sudo gem install fastlane -NV
## Alternatively using Homebrew
brew install fastlane
```

### Config and run

```bash
# Navigate to your iOS or Android app and find fastlane
# Android
set your own json_key_file & package_name in Appfile
set your api_token & dingtalk_access_token in Fastfile
# iOS
set your own app_identifier & apple_id & itc_team_id & team_id
set your api_token & dingtalk_access_token in Fastfile
## Check Matchfile, use your own storage to manage certificates & provisioning profiles.
## git_url("https://github.com/hzz780/fastlane-certificates")
```

```bash
# build & publish
npm run firmim
# npm run firim:android
# npm run firim:ios
```

## Track Crash

### Firebase

### Android
**1.On the Firebase console, add a new Android application and enter your projects details.**

**2.Download the google-services.json file**

**3.Replace : /android/app/google-services.json.**

### iOS
**1.On the Firebase console, add a new iOS application and enter your projects details.**

**2.Download the GoogleService-Info.plist file.**

**3.Replace : ios/GoogleService-Info.plist.**

[https://rnfirebase.io/](https://rnfirebase.io/)

[https://rnfirebase.io/crashlytics/usage](https://rnfirebase.io/crashlytics/usage)

## Q&A

### 1.Permission denied @rb_sysopen $/Users/xx/.fastlane/spaceship/xx/cookie

```bash
#please delete any existing fastlane cookies. The authentication endpoint has changed recently 
rm $HOME/.fastlane/spaceship/*/cookie
```
# Android and iOS Product Build Guide

This project is configured as an Expo app for Android and iOS production builds.

## Product Identity

- App name: Pregnancy Nutrition Coach
- Android package: `com.pregnancynutrition.coach`
- iOS bundle identifier: `com.pregnancynutrition.coach`
- App version: `1.0.0`
- Android version code: `1`
- iOS build number: `1`
- Android target SDK: `35`

## Local Verification

Run these before store builds:

```sh
npm install
npm run generate-assets
npm run export:android
npm run export:ios
```

Both export commands should complete without JS bundle errors.

## Android Product

Use this for Google Play Console upload:

```sh
npx eas login
npm run build:android
```

The production Android profile builds an `.aab` app bundle. The first run will ask about Android signing. Let EAS manage the keystore unless you already have a production keystore.

Optional internal testing APK:

```sh
npm run build:android:preview
```

## iOS Product

Use this for App Store / TestFlight build:

```sh
npx eas login
npm run build:ios
```

This requires an Apple Developer account. EAS will ask for Apple credentials and signing setup on first build.

## Store Requirements Still Outside The Codebase

- Google Play Console account.
- Apple Developer account for iOS.
- Hosted privacy policy URL.
- App screenshots and feature graphic.
- Google Play Data Safety form.
- Google Play Health Apps declaration if requested.
- Content rating questionnaire.
- App review submission.

## Current Privacy Model

The current app stores profile and report values on-device using secure storage. It does not create accounts, upload data to a server, use ads, or share user data with third parties.

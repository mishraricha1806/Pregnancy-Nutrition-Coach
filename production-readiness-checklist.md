# Production Readiness Checklist

## Completed In This Repo

- iOS and Android Expo app foundation.
- Android package name: `com.pregnancynutrition.coach`.
- Android `versionCode`: `1`.
- iOS bundle identifier: `com.pregnancynutrition.coach`.
- Secure local profile/report persistence and local checklist persistence.
- First-run medical disclaimer and consent screen.
- In-app reset for saved profile and checklist data.
- App icon, adaptive icon, and splash image assets.
- EAS production profile for Android App Bundle builds.
- Explicit Android target SDK 35 build properties for Google Play's current target API rule.
- Play Store listing draft.
- Privacy policy draft.
- Android and iOS bundle smoke tests.
- Journey, meal swap, and grocery list engagement features.
- Premium coming-soon screen with roadmap cards, pricing prototype, and clear note that no subscription or payment is enabled.
- Visual home dashboard, generated hero image asset, and bottom navigation.
- Multi-step onboarding.
- Settings screen and 7-day tracker history.
- Reusable "nutrition guidance only, not medical advice" notice across onboarding, home, plan, reports, grocery, symptoms, tracker, and settings.

## Required Before Play Store Submission

- Replace privacy policy contact section with legal/business name and support email.
- Host the privacy policy on a public HTTPS URL.
- Confirm final app name, package name, logo, and brand ownership.
- Test on at least one real Android device.
- Confirm the EAS production build resolves target SDK 35 in Play Console pre-launch checks.
- Create Google Play Console app.
- Complete Play Console Data Safety form using the current local-only data model.
- Complete Health Apps declaration, if Play Console asks due to pregnancy/health content.
- Complete content rating questionnaire.
- Upload screenshots and feature graphic.
- Run production build with EAS and upload the generated `.aab`.

## Build Command

```sh
npm run generate-assets
npx eas login
npm run build:android
```

The first production EAS build will ask about Android app signing. Let EAS manage the keystore unless you already have a signing key.

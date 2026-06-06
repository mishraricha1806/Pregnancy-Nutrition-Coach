# Pregnancy Nutrition Coach

Cross-platform iOS and Android pregnancy nutrition coaching app built with Expo and React Native.

## Features

- Profile personalization by age, height, pre-pregnancy weight, current weight, pregnancy month, due date, pregnancy count, baby count, activity, allergies, and cuisine.
- Diet categories: vegetarian, non-vegetarian, eggetarian, and vegan.
- Lab-aware guidance for hemoglobin, ferritin, vitamin B12, vitamin D, glucose, blood pressure, gestational diabetes, thyroid disorder, and severe nausea.
- BMI and pregnancy weight-gain range calculation.
- Month-wise nutrition focus from month 1 to month 9.
- Full-day meal plan with substitutions.
- Meal swap controls for alternate breakfast, lunch, snack, dinner, and bedtime ideas.
- Month-wise pregnancy journey with baby growth, mother focus, and preparation prompts.
- Auto grocery list by diet category.
- Symptom manager for nausea, acidity, constipation, swelling, and cravings.
- Daily checklist for hydration, protein, iron, calcium, fruits, vegetables, prenatal supplement reminder, and movement.
- Safety alerts and doctor-review boundaries.
- Free and premium prototype screen for product planning.

## Run

```sh
npm install
npm run generate-assets
npm start
```

Then:

- Press `i` for iOS simulator.
- Press `a` for Android emulator.
- Scan the QR code with Expo Go on a physical device.

## Medical Boundary

This app gives food guidance only. Abnormal reports, medicines, supplement doses, scans, and high-risk pregnancy decisions must be reviewed with an OB/GYN.

## Production Build

Install and log in to EAS CLI, then create an Android App Bundle for Play Store upload:

```sh
npm run generate-assets
npx eas login
npm run build:android
```

The Play Store requires a privacy policy URL, store listing, screenshots, content rating, data safety form, app signing, and review submission through Google Play Console.

See [free-premium-project-prototype.md](free-premium-project-prototype.md) for the product split between free and premium features.

See [android-ios-product-build.md](android-ios-product-build.md) for Android and iOS product build steps.

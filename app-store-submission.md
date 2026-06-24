# App Store Submission Checklist

This file is the App Store handoff checklist for Pregnancy Nutrition Coach.

## App Store Connect Setup

Create a new app in App Store Connect:

- Platform: iOS
- Name: Pregnancy Nutrition Coach
- Primary language: English
- Bundle ID: `com.pregnancynutrition.coach`
- SKU: `com.pregnancynutrition.coach`
- User access: full access for the Apple Developer account owner

## Build And Submit

```sh
npm install
npm run generate-assets
npx eas login
npm run build:ios
npm run submit:ios
```

Alternative one-step build and submit:

```sh
npm run build-submit:ios
```

EAS will ask for Apple Developer credentials and signing setup on the first iOS build.

## App Information

- Category: Health & Fitness
- Age rating: complete Apple's questionnaire honestly. The app contains health/nutrition guidance but no explicit content.
- Price: Free for the first version.
- In-app purchases: Not enabled in the current build. Premium is a coming-soon roadmap and pricing prototype screen only.

## Subtitle

Pregnancy meal plans by month

## Promotional Text

Personalized pregnancy nutrition guidance with meal plans, grocery lists, symptom tips, and month-wise journey support.

## Description

Pregnancy Nutrition Coach helps expecting mothers plan safer, more balanced meals from month 1 to month 9. The app personalizes guidance using pregnancy month, diet category, weight profile, symptoms, and optional report values.

Free features include:

- Vegetarian, non-vegetarian, eggetarian, and vegan meal planning.
- Month-wise pregnancy nutrition focus.
- Full-day meal plans with meal swaps.
- Grocery list support.
- BMI and pregnancy weight-gain guidance.
- Report-aware food alerts for iron, B12, vitamin D, glucose, and blood pressure.
- Symptom tips for nausea, acidity, constipation, swelling, and cravings.
- Daily checklist for hydration, protein, iron, calcium, fruits, vegetables, prenatal reminder, and movement.
- Clear doctor-review reminders and urgent-symptom warnings.

Medical disclaimer:

Pregnancy Nutrition Coach provides general pregnancy nutrition suggestions only. It is not medical advice, diagnosis, treatment, or a substitute for an OB/GYN, dietitian, or emergency care. It does not prescribe medicines or supplement doses. Always consult your OB/GYN for abnormal reports, high-risk pregnancy, medicines, supplements, scans, severe symptoms, or urgent concerns.

## Keywords

pregnancy,nutrition,meal planner,pregnancy diet,prenatal,vegetarian,vegan,iron,gestational diabetes

## Support URL

Replace with your public support/contact page.

## Marketing URL

Optional. Replace with your public landing page if available.

## Privacy Policy URL

Required. Host `privacy-policy.md` on a public HTTPS URL before submission.

## App Privacy Label Draft

Current build has no account system, no backend upload, no ads, and no third-party tracking.

Suggested App Store privacy answers for the current build:

- Data collected: Health & Fitness, User Content, Other Data may apply if Apple considers pregnancy profile/report values as collected by the app.
- Linked to user: No, if data remains only on device and is not transmitted to you or third parties.
- Used for tracking: No.
- Third-party advertising: No.
- Analytics: No.
- Data shared with third parties: No.

Review Apple's exact definitions in App Store Connect before final submission. If analytics, accounts, cloud sync, crash reporting, ads, subscriptions, or backend APIs are added later, update this section and the privacy policy.

## Screenshots Needed

Prepare screenshots for:

- iPhone 6.7-inch
- iPhone 6.5-inch or 6.9-inch if App Store Connect asks
- iPad screenshots only if you want to market iPad support

Suggested screenshot flow:

1. Consent/disclaimer screen.
2. Profile setup.
3. Plan page with meal plan and swaps.
4. Grocery list.
5. Journey page.
6. Premium coming-soon roadmap page.

## Review Notes

Suggested review note:

This app provides general pregnancy nutrition suggestions only. It is not medical advice, diagnosis, treatment, or a substitute for an OB/GYN, dietitian, or emergency care. It does not prescribe medicines or supplement doses. All profile and report values are stored locally on device using secure storage. No account, backend, ads, analytics, or tracking are enabled in this version.

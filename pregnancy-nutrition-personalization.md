# Pregnancy Nutrition Coach Personalization Blueprint

This product should generate pregnancy nutrition guidance from month 1 through month 9/due date, personalized by the mother's profile, pregnancy details, diet preference, symptoms, and lab reports. It must act as a nutrition coach, not a medical prescriber.

## 1. Required User Inputs

### Personal profile
- Age
- Height
- Pre-pregnancy weight
- Current weight
- Pregnancy month or week
- Due date
- Activity level
- Food allergies or intolerances
- Country/cuisine preference

### Pregnancy profile
- Pregnancy count: first pregnancy, second pregnancy, third or more
- Baby count: singleton, twins, triplets or more
- High-risk flags:
  - Gestational diabetes
  - High blood pressure or preeclampsia risk
  - Thyroid disorder
  - PCOS
  - Severe nausea/vomiting
  - Previous low birth weight or preterm birth
  - Doctor-advised bed rest

### Diet category
- Vegetarian
- Non-vegetarian
- Eggetarian
- Vegan

### Lab report inputs
- Hemoglobin
- Ferritin
- Serum iron / TIBC / transferrin saturation, if available
- Vitamin B12
- Vitamin D
- Calcium
- Thyroid reports: TSH, T3, T4, if applicable
- Blood sugar reports: fasting glucose, post-meal glucose, HbA1c, OGTT, if applicable
- Blood pressure readings
- Urine protein, if applicable

## 2. Personalization Logic

### BMI and weight gain
Calculate pre-pregnancy BMI:

```text
BMI = pre_pregnancy_weight_kg / (height_m * height_m)
```

Use BMI to estimate recommended pregnancy weight gain range.

For singleton pregnancy:
- BMI below 18.5: target gain 28-40 lb / 12.5-18 kg
- BMI 18.5-24.9: target gain 25-35 lb / 11.5-16 kg
- BMI 25.0-29.9: target gain 15-25 lb / 7-11.5 kg
- BMI 30.0 or above: target gain 11-20 lb / 5-9 kg

For twin pregnancy:
- BMI below 18.5: target gain 50-62 lb / 22.5-28 kg
- BMI 18.5-24.9: target gain 37-54 lb / 17-24.5 kg
- BMI 25.0-29.9: target gain 31-50 lb / 14-23 kg
- BMI 30.0 or above: target gain 25-42 lb / 11.5-19 kg

For triplets or more, show: "Your weight-gain target must be set by your OB/GYN."

### Calories by trimester
Use trimester as a starting point, then adjust based on weight-gain trend, activity, baby count, and medical conditions.

- First trimester: usually no extra calories needed
- Second trimester: about 340 extra calories/day
- Third trimester: about 450 extra calories/day

Do not recommend weight loss during pregnancy unless explicitly instructed by the user's clinician.

### Age factor
- Under 18: flag as higher supervision need; emphasize clinician/dietitian review.
- 18-34: use standard pathway unless risk factors exist.
- 35 or above: flag advanced maternal age; pay closer attention to blood pressure, blood sugar, protein, iron, and fetal growth monitoring.

### Pregnancy count factor
- First pregnancy: include more education and symptom guidance.
- Second or later pregnancy: ask about previous pregnancy complications, anemia, gestational diabetes, BP issues, C-section, preterm birth, breastfeeding status, and recovery gap.
- Closely spaced pregnancy: increase attention to iron, folate, calcium, vitamin D, B12, and protein adequacy.

## 3. Lab-Based Decision Rules

These rules should generate food guidance and "speak to your doctor" alerts. They should not prescribe treatment doses.

### Iron / hemoglobin
- If hemoglobin is below 11 g/dL, flag possible anemia and recommend doctor review.
- If ferritin is low or iron deficiency is noted in the report, prioritize iron-rich meals and vitamin C pairing.
- If hemoglobin is very low, symptoms are severe, or the user reports dizziness, breathlessness, fainting, chest pain, or palpitations, show urgent medical review guidance.

Food coaching:
- Vegetarian: lentils, chana, rajma, soy, tofu, spinach, amaranth, sesame, dates, fortified cereals.
- Non-vegetarian: eggs, chicken, fish, lean meat, plus plant iron sources.
- Eggetarian: eggs plus vegetarian iron sources.
- Vegan: lentils, beans, tofu, tempeh, seeds, greens, fortified foods.
- Add vitamin C with iron meals: lemon, amla, guava, orange, tomato.
- Avoid tea/coffee close to iron-rich meals.

### Vitamin B12
- If low and vegetarian/vegan/eggetarian, show stronger alert because food sources may be limited.
- Vegan users should be advised to discuss B12 supplementation with a clinician.

### Vitamin D / calcium
- If vitamin D or calcium is low, increase calcium-rich foods and doctor review.
- Vegetarian: milk, curd, paneer, ragi, sesame.
- Vegan: fortified plant milk, calcium-set tofu, sesame, ragi, greens.
- Non-vegetarian/eggetarian: include dairy if accepted; eggs and fish can support vitamin D but may not be enough.

### Blood sugar / gestational diabetes
If gestational diabetes or abnormal glucose is reported:
- Prefer smaller, more frequent meals.
- Pair carbohydrates with protein, fat, and fiber.
- Avoid sugar drinks, large fruit-only snacks, sweets, refined flour-heavy meals.
- Track fasting and post-meal readings if the clinician has asked for it.
- Recommend dietitian/doctor review for exact carbohydrate targets.

### Blood pressure / swelling
If high BP, preeclampsia risk, or concerning swelling is reported:
- Recommend immediate clinician follow-up if BP is high or symptoms include headache, vision changes, severe swelling, upper abdominal pain, or shortness of breath.
- Avoid high-salt packaged foods.
- Maintain protein and hydration unless clinician has restricted fluids.

## 4. Diet Category Meal Planning

Every plan should be divided by diet category.

### Vegetarian
Protein sources:
- Dal, chana, rajma, sprouts, soy chunks, tofu, paneer, curd, milk, nuts, seeds.

Sample day:
- Early: soaked almonds or fruit
- Breakfast: besan chilla with curd
- Mid-morning: guava or orange
- Lunch: roti, dal, vegetable, curd, salad
- Snack: roasted chana or sprouts
- Dinner: vegetable khichdi with curd
- Bedtime: milk

### Non-vegetarian
Protein sources:
- Eggs, chicken, fish low in mercury, lean meat, dal, dairy, nuts.

Sample day:
- Early: fruit or nuts
- Breakfast: egg omelet with toast or idli-sambar
- Mid-morning: curd and fruit
- Lunch: rice/roti, chicken/fish, dal, vegetable
- Snack: boiled egg or makhana
- Dinner: roti, vegetable, dal or light chicken soup
- Bedtime: milk

### Eggetarian
Protein sources:
- Eggs, dal, chana, rajma, paneer, curd, tofu, nuts, seeds.

Sample day:
- Early: nuts or fruit
- Breakfast: egg bhurji with roti or oats with milk
- Mid-morning: citrus fruit
- Lunch: dal, rice/roti, vegetable, curd
- Snack: boiled egg or sprouts
- Dinner: paneer/tofu vegetable with roti
- Bedtime: milk

### Vegan
Protein sources:
- Dal, chana, rajma, tofu, tempeh, soy chunks, sprouts, peanuts, nuts, seeds, fortified plant milk.

Sample day:
- Early: nuts or fruit
- Breakfast: tofu scramble or oats with fortified soy milk
- Mid-morning: guava/orange
- Lunch: rice/roti, dal/chana, vegetable, salad
- Snack: hummus, roasted chana, or sprouts
- Dinner: tofu/soy vegetable with millet/roti
- Bedtime: fortified plant milk

Vegan plans must always check B12, vitamin D, calcium, iodine, iron, protein, and omega-3 adequacy.

## 5. Month-by-Month Focus

### Month 1
- Focus: folate, hydration, food safety, nausea management.
- Small frequent meals.
- Avoid long fasting gaps.

### Month 2
- Focus: nausea, vomiting, protein tolerance.
- Use dry snacks, bland meals, ginger if clinician allows.

### Month 3
- Focus: iron, folate, B12, first-trimester report review.
- Start building a stable meal rhythm.

### Month 4
- Focus: protein, calcium, energy increase.
- Appetite may improve; avoid overeating refined foods.

### Month 5
- Focus: iron, omega-3, fiber, constipation.
- Add low-mercury fish for non-vegetarian users or plant omega-3 for vegetarian/vegan users.

### Month 6
- Focus: blood sugar awareness, weight-gain trend, protein.
- Adjust carb quality and portion sizes if glucose is abnormal.

### Month 7
- Focus: heartburn, smaller meals, calcium, hydration.
- Avoid heavy late dinners.

### Month 8
- Focus: swelling, BP watch, iron, protein, easy digestion.
- Keep meals nutrient-dense and moderate in salt.

### Month 9
- Focus: light digestible meals, constipation prevention, hydration, labor prep.
- Plan easy meals and snacks for hospital/postpartum transition.

## 6. Daily Output Format

Each generated plan should include:

- Personal risk summary
- Current pregnancy month/week
- Weight-gain status: below range, within range, or above range
- Lab alerts
- Diet category selected
- Full-day meal plan
- Substitutions
- Foods to avoid
- Symptoms management tip
- Doctor-review reminders

Example:

```text
Profile: 29 years, month 5, vegetarian, singleton pregnancy
BMI status: normal pre-pregnancy BMI
Weight trend: within expected range
Report flags: low hemoglobin

Today focus: iron + protein + vitamin C

Breakfast: besan chilla with curd and mint chutney
Mid-morning: guava
Lunch: roti, palak dal, vegetable, salad with lemon
Snack: roasted chana and coconut water
Dinner: vegetable khichdi with curd
Bedtime: milk

Avoid tea/coffee within 1-2 hours of iron-rich meals.
Please discuss low hemoglobin with your OB/GYN before changing supplements.
```

## 7. Safety Boundaries

The app must not:
- Diagnose disease.
- Prescribe iron, calcium, vitamin D, thyroid medicine, insulin, aspirin, or any medicine.
- Promise baby gender, fetal growth, normal delivery, or cure of complications.
- Recommend fasting, detox, weight-loss diets, or unverified supplements.

The app must:
- Tell users to consult their OB/GYN for abnormal reports.
- Escalate urgent symptoms clearly.
- Keep food safety guidance visible.
- Personalize suggestions while staying conservative.

## 8. Clinical Source Anchors

- CDC pregnancy weight gain recommendations by pre-pregnancy BMI.
- CDC calorie guidance: no usual extra calories in first trimester, about 340/day in second, about 450/day in third.
- WHO anemia cutoff in pregnancy: hemoglobin below 11 g/dL.
- ACOG general pregnancy nutrition guidance: prenatal vitamin, folic acid, iron, calcium, vitamin D, choline, omega-3, food safety.
- FDA/EPA fish guidance: choose low-mercury fish; avoid high-mercury fish.

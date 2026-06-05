import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const COLORS = {
  ink: "#1f2933",
  muted: "#607080",
  paper: "#fbfaf7",
  surface: "#ffffff",
  line: "#d9ded8",
  leaf: "#2f6f5e",
  berry: "#9a3f5c",
  gold: "#b7791f",
  sky: "#3f6b91",
  danger: "#a13d3d",
  softLeaf: "#e8f2ec",
  softBerry: "#f7e8ee",
  softGold: "#fff2d7",
  softBlue: "#eef5fa"
};

const INITIAL_PROFILE = {
  age: "",
  height: "",
  preWeight: "",
  currentWeight: "",
  month: "1",
  dueDate: "",
  pregnancyCount: "first",
  babyCount: "singleton",
  activity: "light",
  diet: "vegetarian",
  hemoglobin: "",
  ferritin: "",
  b12: "",
  vitaminD: "",
  glucose: "",
  bp: "normal",
  gestationalDiabetes: false,
  thyroid: false,
  severeNausea: false,
  allergies: "",
  cuisine: "Indian"
};

const SAMPLE_PROFILE = {
  ...INITIAL_PROFILE,
  age: "29",
  height: "162",
  preWeight: "58",
  currentWeight: "63",
  month: "5",
  hemoglobin: "10.8",
  ferritin: "18",
  b12: "240",
  vitaminD: "24",
  glucose: "86"
};

const INITIAL_TRACKER = {
  water: false,
  protein: false,
  iron: false,
  calcium: false,
  fruits: false,
  vegetables: false,
  prenatal: false,
  walk: false
};

const STORAGE_KEYS = {
  consent: "pnc.consentAccepted",
  profile: "pnc.secure.profile",
  tracker: "pnc.tracker"
};

const DIETS = [
  ["vegetarian", "Vegetarian"],
  ["nonVegetarian", "Non-veg"],
  ["eggetarian", "Eggetarian"],
  ["vegan", "Vegan"]
];

const PREGNANCY_COUNTS = [
  ["first", "First"],
  ["second", "Second"],
  ["thirdPlus", "Third+"]
];

const BABY_COUNTS = [
  ["singleton", "Singleton"],
  ["twins", "Twins"],
  ["triplets", "Triplets+"]
];

const ACTIVITY = [
  ["light", "Light"],
  ["moderate", "Moderate"],
  ["rest", "Rest"]
];

const BP = [
  ["normal", "Normal"],
  ["elevated", "High"],
  ["unknown", "Unknown"]
];

const MONTH_FOCUS = {
  1: ["Folate", "Hydration", "Nausea care"],
  2: ["Small meals", "Protein tolerance", "Vomiting watch"],
  3: ["Iron", "Folate", "B12"],
  4: ["Protein", "Calcium", "Steady gain"],
  5: ["Iron", "Omega-3", "Fiber"],
  6: ["Blood sugar", "Weight trend", "Protein"],
  7: ["Heartburn care", "Calcium", "Hydration"],
  8: ["BP watch", "Iron", "Easy digestion"],
  9: ["Light meals", "Constipation care", "Labor prep"]
};

const JOURNEY = {
  1: {
    baby: "Early development begins. Many users are still confirming pregnancy and adjusting to nausea or fatigue.",
    mother: "Focus on hydration, gentle foods, folate, and avoiding long fasting gaps.",
    prep: "Book or confirm the first OB/GYN visit and start a report folder."
  },
  2: {
    baby: "Major organs continue forming, so steady nutrition and food safety matter.",
    mother: "Nausea and smell sensitivity can peak. Small frequent meals are useful.",
    prep: "Keep simple snacks ready and note vomiting frequency if severe."
  },
  3: {
    baby: "The first trimester is closing and screening/report review usually becomes important.",
    mother: "Iron, folate, B12, and protein rhythm become the focus.",
    prep: "Review hemoglobin, ferritin, thyroid, and vitamin reports with the doctor."
  },
  4: {
    baby: "Growth becomes more noticeable and appetite may improve.",
    mother: "Add more protein and calcium while keeping meals balanced.",
    prep: "Start tracking weekly weight trend if the doctor recommends it."
  },
  5: {
    baby: "Movement may become easier to notice for many mothers.",
    mother: "Iron, omega-3, fiber, and hydration are the main nutrition focus.",
    prep: "Plan iron-rich meals and keep constipation prevention steady."
  },
  6: {
    baby: "Growth continues quickly and glucose screening may be discussed.",
    mother: "Balance carbs with protein and fiber, especially if glucose is abnormal.",
    prep: "Prepare questions about glucose, BP, and weight gain for the next visit."
  },
  7: {
    baby: "The third trimester starts and meal comfort becomes important.",
    mother: "Heartburn and fullness are common. Smaller meals can help.",
    prep: "Keep easy dinners ready and review urgent warning signs."
  },
  8: {
    baby: "Baby is gaining weight and maternal energy needs stay high.",
    mother: "Watch swelling, BP, iron, protein, and sleep comfort.",
    prep: "Prepare hospital documents and simple freezer/pantry meals."
  },
  9: {
    baby: "Due date is close and the plan should stay light, safe, and digestible.",
    mother: "Hydration, constipation prevention, and steady energy are key.",
    prep: "Pack snacks for the hospital bag and plan postpartum support meals."
  }
};

const MEAL_PLANS = {
  vegetarian: {
    label: "Vegetarian",
    meals: [
      ["Early", "Warm water, 4 soaked almonds, and a small banana if nausea is present."],
      ["Breakfast", "Besan chilla with curd and mint chutney."],
      ["Mid-morning", "Guava or orange for vitamin C."],
      ["Lunch", "Roti, palak dal, mixed vegetable, curd, and salad with lemon."],
      ["Snack", "Roasted chana or sprouts chaat."],
      ["Dinner", "Vegetable khichdi with curd or paneer vegetable with roti."],
      ["Bedtime", "Milk, or curd if milk is not tolerated."]
    ],
    substitutions: "Swap dal with chana, rajma, soy chunks, tofu, paneer, curd, ragi, sesame, nuts, or seeds."
  },
  nonVegetarian: {
    label: "Non-vegetarian",
    meals: [
      ["Early", "Fruit or nuts with water."],
      ["Breakfast", "Egg omelet with whole-grain toast, or idli-sambar."],
      ["Mid-morning", "Curd and citrus fruit."],
      ["Lunch", "Rice or roti with chicken or low-mercury fish, dal, vegetable, and salad."],
      ["Snack", "Boiled egg, makhana, or peanut chaat."],
      ["Dinner", "Light chicken soup with roti and vegetables, or dal-rice with salad."],
      ["Bedtime", "Milk or curd."]
    ],
    substitutions: "Use egg, chicken, low-mercury fish, lean meat, dal, dairy, nuts, and seeds. Keep fish cooked thoroughly."
  },
  eggetarian: {
    label: "Eggetarian",
    meals: [
      ["Early", "Nuts or fruit."],
      ["Breakfast", "Egg bhurji with roti, or oats with milk."],
      ["Mid-morning", "Orange, amla, or guava."],
      ["Lunch", "Dal, rice or roti, vegetable, curd, and lemon salad."],
      ["Snack", "Boiled egg or sprouts chaat."],
      ["Dinner", "Paneer or tofu vegetable with roti."],
      ["Bedtime", "Milk or curd."]
    ],
    substitutions: "Rotate eggs with dal, chana, rajma, paneer, tofu, curd, peanuts, and seeds."
  },
  vegan: {
    label: "Vegan",
    meals: [
      ["Early", "Fruit, soaked nuts, and water."],
      ["Breakfast", "Tofu scramble or oats with fortified soy milk."],
      ["Mid-morning", "Guava or orange."],
      ["Lunch", "Rice or roti with dal or chana, vegetable, and salad with lemon."],
      ["Snack", "Hummus, roasted chana, or sprouts."],
      ["Dinner", "Tofu or soy vegetable with millet or roti."],
      ["Bedtime", "Fortified plant milk."]
    ],
    substitutions: "Prioritize dal, beans, tofu, tempeh, soy chunks, fortified plant milk, sesame, ragi, chia, flax, nuts, and seeds."
  }
};

const MEAL_SWAPS = {
  vegetarian: {
    Early: [
      "Warm water with soaked raisins and 2 walnuts.",
      "Plain toast or khakra with a few nuts if nausea is present."
    ],
    Breakfast: [
      "Vegetable oats with curd.",
      "Idli with sambar and coconut chutney.",
      "Paneer paratha with curd."
    ],
    "Mid-morning": [
      "Amla or orange with a handful of roasted makhana.",
      "Apple with peanut or sesame chikki."
    ],
    Lunch: [
      "Ragi roti, chana masala, vegetable, and lemon salad.",
      "Rice, rajma, curd, and cucumber salad."
    ],
    Snack: [
      "Makhana roasted with ghee and cumin.",
      "Peanut chaat with tomato, onion, and lemon."
    ],
    Dinner: [
      "Moong dal dosa with vegetable filling.",
      "Dal-rice with lauki or pumpkin sabzi."
    ],
    Bedtime: [
      "Warm milk with no added sugar.",
      "Curd with a small fruit if milk is not tolerated."
    ]
  },
  nonVegetarian: {
    Breakfast: [
      "Boiled eggs with vegetable upma.",
      "Egg dosa with sambar."
    ],
    Lunch: [
      "Roti with chicken curry, dal, vegetable, and salad.",
      "Rice with low-mercury fish curry and vegetable."
    ],
    Snack: [
      "Boiled egg with fruit.",
      "Chicken sandwich with whole-grain bread."
    ],
    Dinner: [
      "Clear chicken soup with roti and vegetable.",
      "Egg curry with rice and salad."
    ]
  },
  eggetarian: {
    Breakfast: [
      "Egg bhurji with roti and curd.",
      "Vegetable omelet with toast."
    ],
    Lunch: [
      "Dal, rice, vegetable, curd, and boiled egg.",
      "Paneer roti roll with salad."
    ],
    Snack: [
      "Boiled egg with coconut water.",
      "Sprouts chaat with lemon."
    ],
    Dinner: [
      "Tofu vegetable with roti.",
      "Egg curry with rice and salad."
    ]
  },
  vegan: {
    Breakfast: [
      "Tofu bhurji with roti.",
      "Oats with fortified soy milk, chia, and banana."
    ],
    Lunch: [
      "Rice, chana, vegetable, and lemon salad.",
      "Millet roti with soy chunks curry."
    ],
    Snack: [
      "Hummus with vegetable sticks.",
      "Roasted chana with fruit."
    ],
    Dinner: [
      "Tofu stir-fry with millet.",
      "Moong dal khichdi with vegetables."
    ],
    Bedtime: [
      "Fortified soy milk.",
      "Calcium-fortified plant curd."
    ]
  }
};

const GROCERY_BASE = {
  vegetarian: {
    Protein: ["dal", "chana", "rajma", "paneer", "curd", "tofu"],
    Produce: ["guava", "orange", "lemon", "spinach", "mixed vegetables", "cucumber"],
    Grains: ["roti flour", "rice", "oats", "ragi"],
    "Nuts and seeds": ["almonds", "walnuts", "sesame", "peanuts"],
    Safety: ["pasteurized milk or curd", "clean salad ingredients"]
  },
  nonVegetarian: {
    Protein: ["eggs", "chicken", "low-mercury fish", "dal", "curd"],
    Produce: ["citrus fruit", "lemon", "leafy greens", "mixed vegetables"],
    Grains: ["rice", "roti flour", "whole-grain bread"],
    "Nuts and seeds": ["almonds", "peanuts", "walnuts"],
    Safety: ["fully cooked meat/fish", "pasteurized dairy"]
  },
  eggetarian: {
    Protein: ["eggs", "dal", "paneer", "tofu", "curd", "sprouts"],
    Produce: ["orange", "amla", "guava", "leafy greens", "salad vegetables"],
    Grains: ["roti flour", "rice", "oats"],
    "Nuts and seeds": ["peanuts", "sesame", "almonds"],
    Safety: ["fully cooked eggs", "pasteurized dairy"]
  },
  vegan: {
    Protein: ["tofu", "soy chunks", "dal", "chana", "tempeh", "sprouts"],
    Produce: ["guava", "orange", "lemon", "greens", "mixed vegetables"],
    Grains: ["millet", "rice", "roti flour", "oats"],
    "Nuts and seeds": ["chia", "flax", "sesame", "walnuts", "peanuts"],
    Fortified: ["fortified soy milk", "fortified plant curd", "B12-fortified foods"]
  }
};

const FREE_FEATURES = [
  "Personalized pregnancy profile",
  "Diet categories: veg, non-veg, eggetarian, vegan",
  "Month-wise meal plan",
  "Meal swap ideas",
  "Basic report-aware alerts",
  "Grocery list",
  "Journey by pregnancy month",
  "Symptom tips",
  "Daily checklist",
  "Local data storage"
];

const PREMIUM_FEATURES = [
  {
    title: "7-day smart meal planner",
    description: "Auto-build a weekly meal calendar with swaps, leftovers, grocery quantities, and cuisine preference."
  },
  {
    title: "Report trend charts",
    description: "Track hemoglobin, ferritin, B12, vitamin D, glucose, BP, and weight changes over time."
  },
  {
    title: "Condition-focused plans",
    description: "Separate anemia-friendly, GDM-friendly, acidity-friendly, constipation-friendly, and high-BP cautious plans."
  },
  {
    title: "Family sharing",
    description: "A simple partner/family view with grocery tasks, hydration reminders, and doctor-visit prep."
  },
  {
    title: "Doctor visit kit",
    description: "Appointment notes, questions to ask, report checklist, and supplement reminder timing."
  },
  {
    title: "Postpartum nutrition mode",
    description: "Breastfeeding, C-section recovery, iron/protein recovery, and first 6-week meal support."
  }
];

const PRICING_PROTOTYPE = [
  ["Free", "Daily pregnancy nutrition basics", "Current app features"],
  ["Premium Monthly", "Advanced planning and tracking", "Suggested: INR 199/month"],
  ["Premium Yearly", "Best value for full pregnancy journey", "Suggested: INR 999/year"]
];

const SYMPTOM_TIPS = {
  nausea: "Small frequent meals, dry toast or crackers before getting up, fluids between meals, and doctor review if vomiting prevents fluids.",
  acidity: "Smaller dinners, avoid lying down right after meals, reduce spicy/fried foods, and keep late meals light.",
  constipation: "Add fiber from fruits, vegetables, dal, oats, chia/flax, and keep hydration steady.",
  swelling: "Avoid high-salt packaged foods and contact the doctor if swelling is sudden or comes with headache or vision changes.",
  cravings: "Pair cravings with protein or fiber. Keep sweets occasional and avoid sugar drinks, especially with glucose concerns."
};

function parseNumber(value, fallback = 0) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function hasNumber(value) {
  return Number.isFinite(Number.parseFloat(value));
}

function validationMessages(profile) {
  const messages = [];
  const age = parseNumber(profile.age);
  const height = parseNumber(profile.height);
  const preWeight = parseNumber(profile.preWeight);
  const currentWeight = parseNumber(profile.currentWeight);
  const month = parseNumber(profile.month);

  if (!hasNumber(profile.age) || age < 13 || age > 55) messages.push("Enter age between 13 and 55.");
  if (!hasNumber(profile.height) || height < 120 || height > 220) messages.push("Enter height between 120 and 220 cm.");
  if (!hasNumber(profile.preWeight) || preWeight < 30 || preWeight > 180) messages.push("Enter pre-pregnancy weight between 30 and 180 kg.");
  if (!hasNumber(profile.currentWeight) || currentWeight < 30 || currentWeight > 220) messages.push("Enter current weight between 30 and 220 kg.");
  if (!hasNumber(profile.month) || month < 1 || month > 9) messages.push("Enter pregnancy month from 1 to 9.");

  return messages;
}

function monthFrom(profile) {
  return Math.max(1, Math.min(9, Math.round(parseNumber(profile.month, 1))));
}

function bmiCategory(bmi) {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
}

function gainRange(category, babyCount) {
  if (babyCount === "triplets") return null;

  const singleton = {
    underweight: [12.5, 18],
    normal: [11.5, 16],
    overweight: [7, 11.5],
    obese: [5, 9]
  };
  const twins = {
    underweight: [22.5, 28],
    normal: [17, 24.5],
    overweight: [14, 23],
    obese: [11.5, 19]
  };

  return babyCount === "twins" ? twins[category] : singleton[category];
}

function expectedGainByMonth(range, month) {
  if (!range) return null;
  const progress = Math.max(0.08, Math.min(month / 9, 1));
  return [range[0] * progress, range[1] * progress];
}

function trimester(month) {
  if (month <= 3) return "First trimester";
  if (month <= 6) return "Second trimester";
  return "Third trimester";
}

function calorieNote(month) {
  if (month <= 3) return "No usual extra calories";
  if (month <= 6) return "About +340 kcal/day";
  return "About +450 kcal/day";
}

function calculatePlan(profile) {
  const age = parseNumber(profile.age);
  const heightM = parseNumber(profile.height, 1) / 100;
  const preWeight = parseNumber(profile.preWeight);
  const currentWeight = parseNumber(profile.currentWeight);
  const month = monthFrom(profile);
  const bmi = preWeight / (heightM * heightM);
  const category = bmiCategory(bmi);
  const totalRange = gainRange(category, profile.babyCount);
  const expectedRange = expectedGainByMonth(totalRange, month);
  const actualGain = currentWeight - preWeight;
  const hemoglobin = parseNumber(profile.hemoglobin);
  const ferritin = parseNumber(profile.ferritin);
  const b12 = parseNumber(profile.b12);
  const vitaminD = parseNumber(profile.vitaminD);
  const glucose = parseNumber(profile.glucose);

  let trend = "Doctor-led target";
  if (expectedRange) {
    if (actualGain < expectedRange[0] - 1) trend = "Below expected";
    else if (actualGain > expectedRange[1] + 1) trend = "Above expected";
    else trend = "Within expected";
  }

  const focus = [...MONTH_FOCUS[month]];
  const alerts = [];

  if (age < 18) alerts.push(["urgent", "Teen pregnancy needs closer OB/GYN and dietitian supervision."]);
  if (age >= 35) alerts.push(["watch", "Age 35 or above: watch BP, glucose, iron, and fetal growth reports closely."]);
  if (profile.pregnancyCount !== "first") alerts.push(["watch", "Review previous pregnancy anemia, diabetes, BP, preterm birth, C-section, and recovery gap."]);
  if (profile.babyCount === "triplets") alerts.push(["urgent", "Triplets or more need clinician-set nutrition and weight-gain targets."]);

  if (hemoglobin && hemoglobin < 11) {
    focus.push("Iron + vitamin C");
    alerts.push(["urgent", "Hemoglobin below 11 g/dL can indicate anemia in pregnancy. Discuss reports and supplements with the OB/GYN."]);
  }
  if (ferritin && ferritin < 30) {
    focus.push("Iron stores");
    alerts.push(["watch", "Ferritin looks low. Pair iron-rich foods with lemon, amla, guava, orange, tomato, or other vitamin C foods."]);
  }
  if (b12 && b12 < 300) alerts.push(["watch", "B12 may need attention, especially for vegetarian, eggetarian, and vegan diets."]);
  if (vitaminD && vitaminD < 30) alerts.push(["watch", "Vitamin D appears low. Review supplementation and calcium intake with the doctor."]);
  if (profile.gestationalDiabetes || glucose >= 95) {
    focus.push("Balanced carbs");
    alerts.push(["urgent", "Glucose/GDM flag: use smaller meals, avoid sugar drinks, and pair carbs with protein and fiber."]);
  }
  if (profile.bp === "elevated") {
    focus.push("BP watch");
    alerts.push(["urgent", "High BP or concerning swelling needs medical review, especially with headache, vision changes, or upper abdominal pain."]);
  }
  if (profile.thyroid) alerts.push(["watch", "Thyroid disorder: keep report follow-up and medicine timing separate from iron/calcium as advised."]);
  if (profile.severeNausea) alerts.push(["urgent", "Severe nausea: contact the doctor if vomiting prevents food or fluids."]);
  if (profile.diet === "vegan") alerts.push(["watch", "Vegan plans must actively cover B12, vitamin D, calcium, iodine, iron, protein, and omega-3."]);
  if (profile.allergies.trim()) alerts.push(["watch", `Avoid listed allergens: ${profile.allergies.trim()}.`]);

  alerts.push(["safety", "Avoid alcohol, tobacco, raw/undercooked foods, unpasteurized dairy, and high-mercury fish."]);

  return {
    actualGain,
    alerts,
    bmi,
    category,
    calorie: calorieNote(month),
    focus: Array.from(new Set(focus)),
    mealPlan: MEAL_PLANS[profile.diet],
    month,
    totalRange,
    trend,
    trimester: trimester(month)
  };
}

function Field({ label, value, onChangeText, keyboardType = "default", placeholder }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor="#91a0aa"
      />
    </View>
  );
}

function ChoiceGroup({ label, options, value, onChange }) {
  return (
    <View style={styles.choiceBlock}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.choiceWrap}>
        {options.map(([optionValue, optionLabel]) => (
          <TouchableOpacity
            key={optionValue}
            style={[styles.choice, value === optionValue && styles.choiceActive]}
            onPress={() => onChange(optionValue)}
          >
            <Text style={[styles.choiceText, value === optionValue && styles.choiceTextActive]}>
              {optionLabel}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function Toggle({ label, active, onPress }) {
  return (
    <TouchableOpacity style={[styles.toggle, active && styles.toggleActive]} onPress={onPress}>
      <View style={[styles.checkbox, active && styles.checkboxActive]}>
        {active ? <Text style={styles.checkMark}>✓</Text> : null}
      </View>
      <Text style={[styles.toggleText, active && styles.toggleTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function Card({ title, children }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Metric({ label, value }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("Plan");
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [tracker, setTracker] = useState(INITIAL_TRACKER);
  const [symptom, setSymptom] = useState("nausea");
  const [mealSwapIndexes, setMealSwapIndexes] = useState({});
  const [hydrated, setHydrated] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);

  const plan = useMemo(() => calculatePlan(profile), [profile]);
  const completed = Object.values(tracker).filter(Boolean).length;

  useEffect(() => {
    let mounted = true;

    async function loadSavedState() {
      try {
        const [savedConsent, savedProfile, savedTracker] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.consent),
          SecureStore.getItemAsync(STORAGE_KEYS.profile),
          AsyncStorage.getItem(STORAGE_KEYS.tracker)
        ]);

        if (!mounted) return;

        setConsentAccepted(savedConsent === "true");
        if (savedProfile) setProfile({ ...INITIAL_PROFILE, ...JSON.parse(savedProfile) });
        if (savedTracker) setTracker({ ...INITIAL_TRACKER, ...JSON.parse(savedTracker) });
      } catch {
        if (mounted) {
          setProfile(INITIAL_PROFILE);
          setTracker(INITIAL_TRACKER);
        }
      } finally {
        if (mounted) setHydrated(true);
      }
    }

    loadSavedState();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated || !consentAccepted) return;
    SecureStore.setItemAsync(STORAGE_KEYS.profile, JSON.stringify(profile));
  }, [consentAccepted, hydrated, profile]);

  useEffect(() => {
    if (!hydrated || !consentAccepted) return;
    AsyncStorage.setItem(STORAGE_KEYS.tracker, JSON.stringify(tracker));
  }, [consentAccepted, hydrated, tracker]);

  async function acceptConsent() {
    await AsyncStorage.setItem(STORAGE_KEYS.consent, "true");
    setConsentAccepted(true);
  }

  async function resetLocalData() {
    await Promise.all([
      SecureStore.deleteItemAsync(STORAGE_KEYS.profile),
      AsyncStorage.removeItem(STORAGE_KEYS.tracker)
    ]);
    setProfile(INITIAL_PROFILE);
    setTracker(INITIAL_TRACKER);
  }

  function loadSampleProfile() {
    setProfile(SAMPLE_PROFILE);
    setActiveTab("Plan");
  }

  function mealText(label, baseText) {
    const swaps = MEAL_SWAPS[profile.diet]?.[label] || MEAL_SWAPS.vegetarian[label] || [];
    const index = mealSwapIndexes[label] || 0;
    if (!swaps.length || index === 0) return baseText;
    return swaps[(index - 1) % swaps.length];
  }

  function swapMeal(label) {
    const swaps = MEAL_SWAPS[profile.diet]?.[label] || MEAL_SWAPS.vegetarian[label] || [];
    if (!swaps.length) return;
    setMealSwapIndexes((current) => ({
      ...current,
      [label]: ((current[label] || 0) + 1) % (swaps.length + 1)
    }));
  }

  function setProfileValue(key, value) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function renderProfile() {
    return (
      <>
        <Card title="Mother profile">
          <View style={styles.twoCol}>
            <Field label="Age" value={profile.age} onChangeText={(v) => setProfileValue("age", v)} keyboardType="numeric" />
            <Field label="Height (cm)" value={profile.height} onChangeText={(v) => setProfileValue("height", v)} keyboardType="numeric" />
            <Field label="Pre-pregnancy weight (kg)" value={profile.preWeight} onChangeText={(v) => setProfileValue("preWeight", v)} keyboardType="decimal-pad" />
            <Field label="Current weight (kg)" value={profile.currentWeight} onChangeText={(v) => setProfileValue("currentWeight", v)} keyboardType="decimal-pad" />
            <Field label="Pregnancy month" value={profile.month} onChangeText={(v) => setProfileValue("month", v)} keyboardType="numeric" />
            <Field label="Due date" value={profile.dueDate} onChangeText={(v) => setProfileValue("dueDate", v)} placeholder="DD/MM/YYYY" />
          </View>
          <ChoiceGroup label="Pregnancy count" options={PREGNANCY_COUNTS} value={profile.pregnancyCount} onChange={(v) => setProfileValue("pregnancyCount", v)} />
          <ChoiceGroup label="Baby count" options={BABY_COUNTS} value={profile.babyCount} onChange={(v) => setProfileValue("babyCount", v)} />
          <ChoiceGroup label="Activity" options={ACTIVITY} value={profile.activity} onChange={(v) => setProfileValue("activity", v)} />
        </Card>
        <Card title="Food preference">
          <ChoiceGroup label="Diet category" options={DIETS} value={profile.diet} onChange={(v) => setProfileValue("diet", v)} />
          <Field label="Cuisine preference" value={profile.cuisine} onChangeText={(v) => setProfileValue("cuisine", v)} />
          <Field label="Allergies / foods to avoid" value={profile.allergies} onChangeText={(v) => setProfileValue("allergies", v)} placeholder="Peanut, milk, gluten..." />
        </Card>
      </>
    );
  }

  function renderReports() {
    return (
      <>
        <Card title="Lab reports">
          <View style={styles.twoCol}>
            <Field label="Hemoglobin g/dL" value={profile.hemoglobin} onChangeText={(v) => setProfileValue("hemoglobin", v)} keyboardType="decimal-pad" />
            <Field label="Ferritin" value={profile.ferritin} onChangeText={(v) => setProfileValue("ferritin", v)} keyboardType="decimal-pad" />
            <Field label="Vitamin B12" value={profile.b12} onChangeText={(v) => setProfileValue("b12", v)} keyboardType="numeric" />
            <Field label="Vitamin D" value={profile.vitaminD} onChangeText={(v) => setProfileValue("vitaminD", v)} keyboardType="decimal-pad" />
            <Field label="Fasting glucose" value={profile.glucose} onChangeText={(v) => setProfileValue("glucose", v)} keyboardType="numeric" />
          </View>
          <ChoiceGroup label="Blood pressure" options={BP} value={profile.bp} onChange={(v) => setProfileValue("bp", v)} />
        </Card>
        <Card title="Medical flags">
          <Toggle label="Gestational diabetes" active={profile.gestationalDiabetes} onPress={() => setProfileValue("gestationalDiabetes", !profile.gestationalDiabetes)} />
          <Toggle label="Thyroid disorder" active={profile.thyroid} onPress={() => setProfileValue("thyroid", !profile.thyroid)} />
          <Toggle label="Severe nausea or vomiting" active={profile.severeNausea} onPress={() => setProfileValue("severeNausea", !profile.severeNausea)} />
        </Card>
      </>
    );
  }

  function renderPlan() {
    const validation = validationMessages(profile);
    if (validation.length > 0) {
      return (
        <>
          <Card title="Complete profile first">
            <Text style={styles.helperText}>
              Add the basic pregnancy profile before the app calculates BMI, weight trend, and meal guidance.
            </Text>
            {validation.map((item) => (
              <View key={item} style={styles.alert}>
                <Text style={styles.alertText}>{item}</Text>
              </View>
            ))}
          </Card>
          <TouchableOpacity style={styles.primaryAction} onPress={() => setActiveTab("Profile")}>
            <Text style={styles.primaryActionText}>Go to profile</Text>
          </TouchableOpacity>
          {__DEV__ ? (
            <TouchableOpacity style={styles.secondaryAction} onPress={loadSampleProfile}>
              <Text style={styles.secondaryActionText}>Load sample profile</Text>
            </TouchableOpacity>
          ) : null}
        </>
      );
    }

    const rangeText = plan.totalRange
      ? `${plan.totalRange[0]}-${plan.totalRange[1]} kg total`
      : "Doctor-led";

    return (
      <>
        <View style={styles.metricGrid}>
          <Metric label="BMI" value={`${plan.bmi.toFixed(1)} ${plan.category}`} />
          <Metric label="Weight trend" value={plan.trend} />
          <Metric label="Energy" value={plan.calorie} />
          <Metric label="Target gain" value={rangeText} />
        </View>
        <Card title={`${plan.trimester} | Month ${plan.month}`}>
          <View style={styles.tagWrap}>
            {plan.focus.map((item) => (
              <Text key={item} style={styles.tag}>{item}</Text>
            ))}
          </View>
        </Card>
        <Card title={`${plan.mealPlan.label} day plan`}>
          {plan.mealPlan.meals.map(([label, text]) => (
            <View key={label} style={styles.mealRow}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealLabel}>{label}</Text>
                <TouchableOpacity style={styles.swapButton} onPress={() => swapMeal(label)}>
                  <Text style={styles.swapButtonText}>Swap</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.mealText}>{mealText(label, text)}</Text>
            </View>
          ))}
          <Text style={styles.helperText}>{plan.mealPlan.substitutions}</Text>
        </Card>
        <Card title="Alerts and safety">
          {plan.alerts.map(([level, text]) => (
            <View key={text} style={[styles.alert, level === "urgent" && styles.alertUrgent]}>
              <Text style={styles.alertText}>{text}</Text>
            </View>
          ))}
        </Card>
      </>
    );
  }

  function renderSymptoms() {
    return (
      <>
        <Card title="Symptom manager">
          <ChoiceGroup
            label="Choose current symptom"
            options={[
              ["nausea", "Nausea"],
              ["acidity", "Acidity"],
              ["constipation", "Constipation"],
              ["swelling", "Swelling"],
              ["cravings", "Cravings"]
            ]}
            value={symptom}
            onChange={setSymptom}
          />
          <View style={styles.tipBox}>
            <Text style={styles.tipText}>{SYMPTOM_TIPS[symptom]}</Text>
          </View>
        </Card>
        <Card title="Urgent signs">
          {[
            "Heavy bleeding, fainting, chest pain, or severe breathlessness.",
            "Severe headache, vision changes, upper abdominal pain, or sudden swelling.",
            "Vomiting that prevents fluids or food.",
            "Reduced fetal movement after the stage when movement is being tracked."
          ].map((item) => (
            <View key={item} style={[styles.alert, styles.alertUrgent]}>
              <Text style={styles.alertText}>{item}</Text>
            </View>
          ))}
        </Card>
      </>
    );
  }

  function renderJourney() {
    const current = JOURNEY[plan.month];
    const nextMonth = Math.min(plan.month + 1, 9);
    const next = JOURNEY[nextMonth];

    return (
      <>
        <Card title={`Month ${plan.month} journey`}>
          <View style={styles.journeyBlock}>
            <Text style={styles.journeyLabel}>Baby growth</Text>
            <Text style={styles.helperText}>{current.baby}</Text>
          </View>
          <View style={styles.journeyBlock}>
            <Text style={styles.journeyLabel}>Mother focus</Text>
            <Text style={styles.helperText}>{current.mother}</Text>
          </View>
          <View style={styles.journeyBlock}>
            <Text style={styles.journeyLabel}>Prepare this month</Text>
            <Text style={styles.helperText}>{current.prep}</Text>
          </View>
        </Card>
        <Card title={plan.month === 9 ? "Due-date focus" : `Coming next: month ${nextMonth}`}>
          <Text style={styles.helperText}>{plan.month === 9 ? "Keep meals light, safe, and easy to digest. Confirm hospital bag, doctor contacts, and postpartum food support." : next.mother}</Text>
        </Card>
      </>
    );
  }

  function renderGrocery() {
    const groceries = GROCERY_BASE[profile.diet];
    return (
      <>
        <Card title={`${MEAL_PLANS[profile.diet].label} grocery list`}>
          <Text style={styles.helperText}>
            Built from the current meal plan. Adjust for allergies, doctor instructions, and household preferences.
          </Text>
          {Object.entries(groceries).map(([category, items]) => (
            <View key={category} style={styles.groceryGroup}>
              <Text style={styles.groceryTitle}>{category}</Text>
              <View style={styles.tagWrap}>
                {items.map((item) => (
                  <Text key={item} style={styles.groceryItem}>{item}</Text>
                ))}
              </View>
            </View>
          ))}
        </Card>
        <Card title="Shopping reminders">
          {[
            "Prefer fresh, hygienic, well-cooked foods.",
            "Buy low-mercury fish only if non-vegetarian and doctor-approved.",
            "Keep vitamin C foods available for iron-rich meals.",
            "Avoid unpasteurized dairy, raw eggs, undercooked meat/fish, and stale food."
          ].map((item) => (
            <View key={item} style={styles.alert}>
              <Text style={styles.alertText}>{item}</Text>
            </View>
          ))}
        </Card>
      </>
    );
  }

  function renderTracker() {
    return (
      <>
        <Card title="Daily checklist">
          <Text style={styles.progressText}>{completed}/8 completed today</Text>
          {[
            ["water", "Water / fluids"],
            ["protein", "Protein at meals"],
            ["iron", "Iron-rich food"],
            ["calcium", "Calcium-rich food"],
            ["fruits", "Fruit"],
            ["vegetables", "Vegetables"],
            ["prenatal", "Doctor-prescribed prenatal"],
            ["walk", "Movement / walk if allowed"]
          ].map(([key, label]) => (
            <Toggle
              key={key}
              label={label}
              active={tracker[key]}
              onPress={() => setTracker((current) => ({ ...current, [key]: !current[key] }))}
            />
          ))}
        </Card>
        <Card title="Doctor review reminder">
          <Text style={styles.helperText}>
            This app supports food planning only. Report interpretation, supplement doses, medicines, scans, and high-risk pregnancy decisions must stay with the OB/GYN.
          </Text>
        </Card>
        <TouchableOpacity style={styles.secondaryAction} onPress={resetLocalData}>
          <Text style={styles.secondaryActionText}>Reset saved profile and checklist</Text>
        </TouchableOpacity>
      </>
    );
  }

  function renderPremium() {
    return (
      <>
        <Card title="Free plan">
          <Text style={styles.helperText}>
            These features stay free so the app is useful from day one.
          </Text>
          <View style={styles.featureGrid}>
            {FREE_FEATURES.map((feature) => (
              <View key={feature} style={styles.freeFeature}>
                <Text style={styles.freeFeatureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card title="Premium prototype">
          <Text style={styles.helperText}>
            These are planned paid features. Payments are not enabled in this prototype.
          </Text>
          {PREMIUM_FEATURES.map((feature) => (
            <View key={feature.title} style={styles.premiumFeature}>
              <View style={styles.lockBadge}>
                <Text style={styles.lockBadgeText}>Locked</Text>
              </View>
              <Text style={styles.premiumTitle}>{feature.title}</Text>
              <Text style={styles.helperText}>{feature.description}</Text>
            </View>
          ))}
        </Card>

        <Card title="Pricing prototype">
          {PRICING_PROTOTYPE.map(([name, description, price]) => (
            <View key={name} style={styles.priceRow}>
              <View style={styles.priceCopy}>
                <Text style={styles.priceName}>{name}</Text>
                <Text style={styles.helperText}>{description}</Text>
              </View>
              <Text style={styles.priceValue}>{price}</Text>
            </View>
          ))}
        </Card>
      </>
    );
  }

  const content = {
    Profile: renderProfile,
    Reports: renderReports,
    Plan: renderPlan,
    Journey: renderJourney,
    Grocery: renderGrocery,
    Symptoms: renderSymptoms,
    Tracker: renderTracker,
    Premium: renderPremium
  }[activeTab]();

  if (!hydrated) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.paper} />
        <View style={styles.loadingScreen}>
          <Text style={styles.eyebrow}>Pregnancy Nutrition Coach</Text>
          <Text style={styles.loadingTitle}>Preparing your coach</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!consentAccepted) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.paper} />
        <ScrollView contentContainerStyle={styles.consentScreen}>
          <Text style={styles.eyebrow}>Pregnancy Nutrition Coach</Text>
          <Text style={styles.consentTitle}>Before we personalize your plan</Text>
          <Text style={styles.consentBody}>
            This app provides food planning support for pregnancy. It does not diagnose conditions, prescribe medicines, set supplement doses, replace an OB/GYN, or handle emergencies.
          </Text>
          <View style={styles.consentCard}>
            {[
              "Your profile and report values are saved securely on this device. Checklist progress is saved locally on this device.",
              "Abnormal hemoglobin, ferritin, glucose, blood pressure, thyroid, vitamin, or pregnancy reports must be reviewed with your doctor.",
              "Seek urgent care for heavy bleeding, fainting, chest pain, severe breathlessness, severe headache, vision changes, upper abdominal pain, sudden swelling, or vomiting that prevents fluids."
            ].map((item) => (
              <Text key={item} style={styles.consentItem}>{item}</Text>
            ))}
          </View>
          <TouchableOpacity style={styles.primaryAction} onPress={acceptConsent}>
            <Text style={styles.primaryActionText}>I understand and continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.paper} />
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Pregnancy Nutrition Coach</Text>
        <Text style={styles.title}>Personalized nutrition</Text>
        <Text style={styles.subtitle}>
          {plan.trimester}, month {plan.month} • {MEAL_PLANS[profile.diet].label}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabs}
        contentContainerStyle={styles.tabsContent}
      >
        {["Profile", "Reports", "Plan", "Journey", "Grocery", "Symptoms", "Tracker", "Premium"].map((tabName) => (
          <TouchableOpacity
            key={tabName}
            style={[styles.tab, activeTab === tabName && styles.tabActive]}
            onPress={() => setActiveTab(tabName)}
          >
            <Text style={[styles.tabText, activeTab === tabName && styles.tabTextActive]}>
              {tabName}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {content}
        <Text style={styles.disclaimer}>
          Food guidance only. Abnormal reports, medicines, and supplement doses must be reviewed with the OB/GYN.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.paper
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: COLORS.paper
  },
  eyebrow: {
    color: COLORS.berry,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  title: {
    color: COLORS.ink,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 38,
    marginTop: 4
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 6
  },
  tabs: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: COLORS.paper,
    flexGrow: 0,
    maxHeight: 52
  },
  tabsContent: {
    gap: 6,
    paddingRight: 10,
    alignItems: "center"
  },
  tab: {
    minWidth: 96,
    height: 38,
    minHeight: 38,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 4
  },
  tabActive: {
    backgroundColor: COLORS.leaf,
    borderColor: COLORS.leaf
  },
  tabText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: "800"
  },
  tabTextActive: {
    color: "#ffffff"
  },
  scroll: {
    flex: 1
  },
  content: {
    padding: 14,
    paddingBottom: 36
  },
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    padding: 24
  },
  loadingTitle: {
    color: COLORS.ink,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 8
  },
  consentScreen: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 22
  },
  consentTitle: {
    color: COLORS.ink,
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 38,
    marginTop: 8,
    marginBottom: 12
  },
  consentBody: {
    color: COLORS.muted,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
    marginBottom: 16
  },
  consentCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 14,
    marginBottom: 16
  },
  consentItem: {
    color: COLORS.ink,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21,
    marginBottom: 10
  },
  primaryAction: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.leaf,
    paddingHorizontal: 14
  },
  primaryActionText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900"
  },
  secondaryAction: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.surface,
    marginBottom: 12
  },
  secondaryActionText: {
    color: COLORS.berry,
    fontSize: 14,
    fontWeight: "900"
  },
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 14,
    marginBottom: 12
  },
  cardTitle: {
    color: COLORS.leaf,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 12
  },
  twoCol: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  field: {
    flexGrow: 1,
    flexBasis: "47%",
    marginBottom: 12
  },
  label: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 7
  },
  input: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: "#ffffff",
    color: COLORS.ink,
    fontSize: 16,
    fontWeight: "700",
    paddingHorizontal: 11
  },
  choiceBlock: {
    marginBottom: 12
  },
  choiceWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  choice: {
    minHeight: 40,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: "#ffffff",
    paddingHorizontal: 12
  },
  choiceActive: {
    backgroundColor: COLORS.softLeaf,
    borderColor: COLORS.leaf
  },
  choiceText: {
    color: COLORS.muted,
    fontWeight: "800"
  },
  choiceTextActive: {
    color: COLORS.leaf
  },
  toggle: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 8
  },
  toggleActive: {
    backgroundColor: COLORS.softLeaf,
    borderColor: COLORS.leaf
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: COLORS.muted,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10
  },
  checkboxActive: {
    backgroundColor: COLORS.leaf,
    borderColor: COLORS.leaf
  },
  checkMark: {
    color: "#ffffff",
    fontWeight: "900"
  },
  toggleText: {
    color: COLORS.ink,
    fontSize: 15,
    fontWeight: "800",
    flex: 1
  },
  toggleTextActive: {
    color: COLORS.leaf
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12
  },
  metric: {
    flexGrow: 1,
    flexBasis: "47%",
    minHeight: 82,
    backgroundColor: COLORS.softGold,
    borderWidth: 1,
    borderColor: "#ead8aa",
    padding: 12
  },
  metricLabel: {
    color: "#77500f",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 8
  },
  metricValue: {
    color: COLORS.ink,
    fontSize: 18,
    fontWeight: "900"
  },
  tagWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  tag: {
    backgroundColor: COLORS.softBerry,
    color: COLORS.berry,
    fontSize: 13,
    fontWeight: "900",
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  mealRow: {
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: "#ffffff",
    padding: 11,
    marginBottom: 8
  },
  mealHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 5
  },
  mealLabel: {
    color: COLORS.leaf,
    fontSize: 14,
    fontWeight: "900",
    flex: 1
  },
  swapButton: {
    minHeight: 32,
    borderWidth: 1,
    borderColor: COLORS.leaf,
    backgroundColor: COLORS.softLeaf,
    justifyContent: "center",
    paddingHorizontal: 10
  },
  swapButtonText: {
    color: COLORS.leaf,
    fontSize: 12,
    fontWeight: "900"
  },
  mealText: {
    color: COLORS.ink,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22
  },
  helperText: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 22,
    marginTop: 4
  },
  alert: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.sky,
    backgroundColor: COLORS.softBlue,
    padding: 11,
    marginBottom: 8
  },
  alertUrgent: {
    borderLeftColor: COLORS.danger,
    backgroundColor: "#faeeee"
  },
  alertText: {
    color: COLORS.ink,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21
  },
  tipBox: {
    backgroundColor: COLORS.softGold,
    borderWidth: 1,
    borderColor: "#ead8aa",
    padding: 13
  },
  tipText: {
    color: COLORS.ink,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 23
  },
  journeyBlock: {
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: "#ffffff",
    padding: 11,
    marginBottom: 8
  },
  journeyLabel: {
    color: COLORS.berry,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 4,
    textTransform: "uppercase"
  },
  groceryGroup: {
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
    paddingTop: 12,
    marginTop: 12
  },
  groceryTitle: {
    color: COLORS.leaf,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 8
  },
  groceryItem: {
    backgroundColor: COLORS.softLeaf,
    color: COLORS.leaf,
    fontSize: 13,
    fontWeight: "900",
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12
  },
  freeFeature: {
    backgroundColor: COLORS.softLeaf,
    borderWidth: 1,
    borderColor: "#c8ded2",
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  freeFeatureText: {
    color: COLORS.leaf,
    fontSize: 13,
    fontWeight: "900"
  },
  premiumFeature: {
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: "#ffffff",
    padding: 12,
    marginTop: 10
  },
  lockBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.softBerry,
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginBottom: 8
  },
  lockBadgeText: {
    color: COLORS.berry,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  premiumTitle: {
    color: COLORS.ink,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 4
  },
  priceRow: {
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: "#ffffff",
    padding: 12,
    marginBottom: 8
  },
  priceCopy: {
    marginBottom: 8
  },
  priceName: {
    color: COLORS.leaf,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 2
  },
  priceValue: {
    color: COLORS.berry,
    fontSize: 15,
    fontWeight: "900"
  },
  progressText: {
    color: COLORS.berry,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 12
  },
  disclaimer: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    textAlign: "center",
    paddingHorizontal: 10
  }
});

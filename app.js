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
  View,
  Image,
  ImageBackground
} from "react-native";
import {
  Apple,
  Baby,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  Check,
  ChefHat,
  ClipboardList,
  Droplets,
  FileText,
  HeartPulse,
  Home,
  Leaf,
  Lock,
  Milk,
  NotebookTabs,
  Pill,
  RefreshCw,
  Salad,
  ShoppingBasket,
  Sparkles,
  Stethoscope,
  Target,
  Utensils,
  Wheat,
  Zap
} from "lucide-react-native";

const HERO_IMAGE = require("./assets/pregnancy-nutrition-hero.png");

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
  softBlue: "#eef5fa",
  ivory: "#fffdf8",
  blush: "#f9edf1"
};

const MAIN_TABS = ["Home", "Plan", "Journey", "Grocery", "Tracker"];
const MORE_TABS = ["Profile", "Reports", "Symptoms", "Premium", "Settings"];

const TAB_ICONS = {
  Home,
  Plan: Utensils,
  Journey: Baby,
  Grocery: ShoppingBasket,
  Tracker: ClipboardList,
  Profile: NotebookTabs,
  Reports: FileText,
  Symptoms: HeartPulse,
  Premium: Sparkles,
  Settings: Stethoscope
};

const MEAL_ICONS = {
  Early: Droplets,
  Breakfast: ChefHat,
  "Mid-morning": Apple,
  Lunch: Salad,
  Snack: Wheat,
  Dinner: Utensils,
  Bedtime: Milk
};

const METRIC_ICONS = {
  BMI: Target,
  "Weight trend": ChartNoAxesColumnIncreasing,
  Energy: Zap,
  "Target gain": Target,
  Diet: Leaf,
  Checklist: Check
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
  onboarding: "pnc.onboardingComplete",
  profile: "pnc.secure.profile",
  tracker: "pnc.tracker",
  trackerHistory: "pnc.trackerHistory"
};

const ONBOARDING_STEPS = ["Welcome", "Safety", "Profile", "Diet", "Reports"];

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
    description: "Auto-build a weekly meal calendar with swaps, leftovers, grocery quantities, and cuisine preference.",
    icon: CalendarDays
  },
  {
    title: "Report trend charts",
    description: "Track hemoglobin, ferritin, B12, vitamin D, glucose, BP, and weight changes over time.",
    icon: ChartNoAxesColumnIncreasing
  },
  {
    title: "Condition-focused plans",
    description: "Separate anemia-friendly, GDM-friendly, acidity-friendly, constipation-friendly, and high-BP cautious plans.",
    icon: HeartPulse
  },
  {
    title: "Family sharing",
    description: "A simple partner/family view with grocery tasks, hydration reminders, and doctor-visit prep.",
    icon: ShoppingBasket
  },
  {
    title: "Doctor visit kit",
    description: "Appointment notes, questions to ask, report checklist, and supplement reminder timing.",
    icon: Stethoscope
  },
  {
    title: "Postpartum nutrition mode",
    description: "Breastfeeding, C-section recovery, iron/protein recovery, and first 6-week meal support.",
    icon: Baby
  }
];

const PRICING_PROTOTYPE = [
  ["Free", "Daily pregnancy nutrition basics", "Current app features"],
  ["Premium Monthly", "Advanced planning and tracking", "Suggested: INR 199/month"],
  ["Premium Yearly", "Best value for full pregnancy journey", "Suggested: INR 999/year"]
];

const MEDICAL_NOTE =
  "This app gives general pregnancy nutrition suggestions only. It is not medical advice, diagnosis, treatment, or a substitute for your OB/GYN, dietitian, or emergency care.";

const DOCTOR_NOTE =
  "Always review abnormal reports, medicines, supplement doses, high-risk pregnancy, diabetes, blood pressure concerns, thyroid issues, severe vomiting, pain, bleeding, or reduced fetal movement with your doctor.";

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

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function friendlyDate(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
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
        {active ? <Check size={14} color="#ffffff" strokeWidth={3} /> : null}
      </View>
      <Text style={[styles.toggleText, active && styles.toggleTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function IconBubble({ icon: Icon, tone = "leaf", size = 18 }) {
  return (
    <View style={[styles.iconBubble, styles[`iconBubble${tone}`]]}>
      <Icon size={size} color={tone === "gold" ? COLORS.gold : tone === "berry" ? COLORS.berry : tone === "sky" ? COLORS.sky : COLORS.leaf} strokeWidth={2.4} />
    </View>
  );
}

function Card({ title, children, icon: Icon, tone = "leaf" }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {Icon ? <IconBubble icon={Icon} tone={tone} size={17} /> : null}
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function Metric({ label, value, icon }) {
  const Icon = icon || METRIC_ICONS[label] || Target;
  return (
    <View style={styles.metric}>
      <View style={styles.metricHeader}>
        <Icon size={16} color={COLORS.gold} strokeWidth={2.4} />
        <Text style={styles.metricLabel}>{label}</Text>
      </View>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function QuickCard({ title, body, action, onPress, tone = "leaf", icon }) {
  const Icon = icon || Sparkles;
  return (
    <TouchableOpacity style={[styles.quickCard, styles[`quickCard${tone}`]]} onPress={onPress}>
      <IconBubble icon={Icon} tone={tone} size={21} />
      <Text style={styles.quickTitle}>{title}</Text>
      <Text style={styles.quickBody}>{body}</Text>
      <View style={styles.quickActionRow}>
        <Text style={styles.quickAction}>{action}</Text>
        <RefreshCw size={13} color={COLORS.leaf} strokeWidth={2.5} />
      </View>
    </TouchableOpacity>
  );
}

function MedicalNotice({ compact = false }) {
  return (
    <View style={[styles.medicalNotice, compact && styles.medicalNoticeCompact]}>
      <Stethoscope size={18} color={COLORS.danger} strokeWidth={2.6} />
      <View style={styles.medicalNoticeTextWrap}>
        <Text style={styles.medicalNoticeTitle}>Nutrition guidance only</Text>
        <Text style={styles.medicalNoticeText}>{MEDICAL_NOTE}</Text>
        {!compact ? <Text style={styles.medicalNoticeText}>{DOCTOR_NOTE}</Text> : null}
      </View>
    </View>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("Home");
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [tracker, setTracker] = useState(INITIAL_TRACKER);
  const [trackerHistory, setTrackerHistory] = useState({});
  const [symptom, setSymptom] = useState("nausea");
  const [mealSwapIndexes, setMealSwapIndexes] = useState({});
  const [hydrated, setHydrated] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  const plan = useMemo(() => calculatePlan(profile), [profile]);
  const completed = Object.values(tracker).filter(Boolean).length;

  useEffect(() => {
    let mounted = true;

    async function loadSavedState() {
      try {
        const [savedConsent, savedOnboarding, savedProfile, savedTracker, savedTrackerHistory] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.consent),
          AsyncStorage.getItem(STORAGE_KEYS.onboarding),
          SecureStore.getItemAsync(STORAGE_KEYS.profile),
          AsyncStorage.getItem(STORAGE_KEYS.tracker),
          AsyncStorage.getItem(STORAGE_KEYS.trackerHistory)
        ]);

        if (!mounted) return;

        setConsentAccepted(savedConsent === "true");
        setOnboardingComplete(savedOnboarding === "true");
        if (savedProfile) setProfile({ ...INITIAL_PROFILE, ...JSON.parse(savedProfile) });
        if (savedTrackerHistory) {
          const parsedHistory = JSON.parse(savedTrackerHistory);
          setTrackerHistory(parsedHistory);
          setTracker({ ...INITIAL_TRACKER, ...(parsedHistory[todayKey()] || {}) });
        } else if (savedTracker) {
          setTracker({ ...INITIAL_TRACKER, ...JSON.parse(savedTracker) });
        }
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
    const updatedHistory = {
      ...trackerHistory,
      [todayKey()]: tracker
    };
    setTrackerHistory(updatedHistory);
    AsyncStorage.setItem(STORAGE_KEYS.trackerHistory, JSON.stringify(updatedHistory));
  }, [consentAccepted, hydrated, tracker]);

  async function acceptConsent() {
    await AsyncStorage.setItem(STORAGE_KEYS.consent, "true");
    setConsentAccepted(true);
  }

  async function completeOnboarding() {
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.consent, "true"),
      AsyncStorage.setItem(STORAGE_KEYS.onboarding, "true")
    ]);
    setConsentAccepted(true);
    setOnboardingComplete(true);
    setActiveTab("Home");
  }

  async function resetLocalData() {
    await Promise.all([
      SecureStore.deleteItemAsync(STORAGE_KEYS.profile),
      AsyncStorage.removeItem(STORAGE_KEYS.tracker),
      AsyncStorage.removeItem(STORAGE_KEYS.trackerHistory)
    ]);
    setProfile(INITIAL_PROFILE);
    setTracker(INITIAL_TRACKER);
    setTrackerHistory({});
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
        <Card title="Mother profile" icon={NotebookTabs} tone="leaf">
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
        <Card title="Food preference" icon={Salad} tone="gold">
          <ChoiceGroup label="Diet category" options={DIETS} value={profile.diet} onChange={(v) => setProfileValue("diet", v)} />
          <Field label="Cuisine preference" value={profile.cuisine} onChangeText={(v) => setProfileValue("cuisine", v)} />
          <Field label="Allergies / foods to avoid" value={profile.allergies} onChangeText={(v) => setProfileValue("allergies", v)} placeholder="Peanut, milk, gluten..." />
        </Card>
      </>
    );
  }

  function renderOnboardingProfileBasics() {
    return (
      <Card title="Profile basics" icon={NotebookTabs} tone="leaf">
        <View style={styles.twoCol}>
          <Field label="Age" value={profile.age} onChangeText={(v) => setProfileValue("age", v)} keyboardType="numeric" />
          <Field label="Height (cm)" value={profile.height} onChangeText={(v) => setProfileValue("height", v)} keyboardType="numeric" />
          <Field label="Pre-pregnancy weight (kg)" value={profile.preWeight} onChangeText={(v) => setProfileValue("preWeight", v)} keyboardType="decimal-pad" />
          <Field label="Current weight (kg)" value={profile.currentWeight} onChangeText={(v) => setProfileValue("currentWeight", v)} keyboardType="decimal-pad" />
          <Field label="Pregnancy month" value={profile.month} onChangeText={(v) => setProfileValue("month", v)} keyboardType="numeric" />
          <Field label="Due date" value={profile.dueDate} onChangeText={(v) => setProfileValue("dueDate", v)} placeholder="DD/MM/YYYY" />
        </View>
      </Card>
    );
  }

  function renderOnboardingDiet() {
    return (
      <>
        <Card title="Food preference" icon={Salad} tone="gold">
          <ChoiceGroup label="Diet category" options={DIETS} value={profile.diet} onChange={(v) => setProfileValue("diet", v)} />
          <Field label="Cuisine preference" value={profile.cuisine} onChangeText={(v) => setProfileValue("cuisine", v)} />
          <Field label="Allergies / foods to avoid" value={profile.allergies} onChangeText={(v) => setProfileValue("allergies", v)} placeholder="Peanut, milk, gluten..." />
        </Card>
        <Card title="Pregnancy details" icon={Baby} tone="berry">
          <ChoiceGroup label="Pregnancy count" options={PREGNANCY_COUNTS} value={profile.pregnancyCount} onChange={(v) => setProfileValue("pregnancyCount", v)} />
          <ChoiceGroup label="Baby count" options={BABY_COUNTS} value={profile.babyCount} onChange={(v) => setProfileValue("babyCount", v)} />
          <ChoiceGroup label="Activity" options={ACTIVITY} value={profile.activity} onChange={(v) => setProfileValue("activity", v)} />
        </Card>
      </>
    );
  }

  function renderOnboardingReports() {
    return (
      <>
        <Card title="Optional reports" icon={FileText} tone="sky">
          <Text style={styles.helperText}>
            You can skip this now. Adding reports helps the app show food alerts for anemia, B12, vitamin D, glucose, and BP.
          </Text>
          <View style={styles.twoCol}>
            <Field label="Hemoglobin g/dL" value={profile.hemoglobin} onChangeText={(v) => setProfileValue("hemoglobin", v)} keyboardType="decimal-pad" />
            <Field label="Ferritin" value={profile.ferritin} onChangeText={(v) => setProfileValue("ferritin", v)} keyboardType="decimal-pad" />
            <Field label="Vitamin B12" value={profile.b12} onChangeText={(v) => setProfileValue("b12", v)} keyboardType="numeric" />
            <Field label="Vitamin D" value={profile.vitaminD} onChangeText={(v) => setProfileValue("vitaminD", v)} keyboardType="decimal-pad" />
            <Field label="Fasting glucose" value={profile.glucose} onChangeText={(v) => setProfileValue("glucose", v)} keyboardType="numeric" />
          </View>
          <ChoiceGroup label="Blood pressure" options={BP} value={profile.bp} onChange={(v) => setProfileValue("bp", v)} />
        </Card>
        <Card title="Medical flags" icon={HeartPulse} tone="berry">
          <Toggle label="Gestational diabetes" active={profile.gestationalDiabetes} onPress={() => setProfileValue("gestationalDiabetes", !profile.gestationalDiabetes)} />
          <Toggle label="Thyroid disorder" active={profile.thyroid} onPress={() => setProfileValue("thyroid", !profile.thyroid)} />
          <Toggle label="Severe nausea or vomiting" active={profile.severeNausea} onPress={() => setProfileValue("severeNausea", !profile.severeNausea)} />
        </Card>
      </>
    );
  }

  function onboardingCanContinue() {
    if (onboardingStep !== 2) return true;
    return validationMessages(profile).length === 0;
  }

  function renderOnboardingStep() {
    if (onboardingStep === 0) {
      return (
        <>
          <ImageBackground source={HERO_IMAGE} style={styles.onboardingHero} imageStyle={styles.heroImage}>
            <View style={styles.heroOverlay}>
              <Text style={styles.heroKicker}>Pregnancy Nutrition Coach</Text>
              <Text style={styles.heroTitle}>Food support from month 1 to due date</Text>
              <Text style={styles.heroText}>Personalized meal plans, grocery lists, symptom tips, and safe doctor-review reminders.</Text>
            </View>
          </ImageBackground>
          <View style={styles.quickGrid}>
            <QuickCard title="Personalized" body="Age, weight, pregnancy month, diet, and reports." action="Set up" onPress={() => setOnboardingStep(1)} tone="leaf" icon={Sparkles} />
            <QuickCard title="Daily useful" body="Meal plan, grocery, journey, symptoms, tracker." action="Explore" onPress={() => setOnboardingStep(1)} tone="gold" icon={CalendarDays} />
          </View>
        </>
      );
    }

    if (onboardingStep === 1) {
      return (
        <Card title="Safety first" icon={Stethoscope} tone="sky">
          <MedicalNotice />
          {[
            "Use the meal plans and alerts as supportive education, not as a clinical decision.",
            "Do not change medicines, supplements, insulin, thyroid medicine, iron, calcium, aspirin, or any treatment based only on this app.",
            "If symptoms feel urgent, contact your doctor or emergency services immediately.",
            "Your profile and report values are stored securely on this device."
          ].map((item) => (
            <View key={item} style={styles.alert}>
              <Text style={styles.alertText}>{item}</Text>
            </View>
          ))}
        </Card>
      );
    }

    if (onboardingStep === 2) return renderOnboardingProfileBasics();
    if (onboardingStep === 3) return renderOnboardingDiet();
    return renderOnboardingReports();
  }

  function renderHome() {
    const validation = validationMessages(profile);
    const needsProfile = validation.length > 0;

    return (
      <>
        <ImageBackground source={HERO_IMAGE} style={styles.hero} imageStyle={styles.heroImage}>
          <View style={styles.heroOverlay}>
            <Text style={styles.heroKicker}>Month {plan.month} nutrition</Text>
            <Text style={styles.heroTitle}>
              {needsProfile ? "Build a safer pregnancy food rhythm" : `${plan.trimester} meal focus`}
            </Text>
            <Text style={styles.heroText}>
              {needsProfile
                ? "Set your profile once, then get meal plans, grocery lists, symptom tips, and report-aware food alerts."
                : `${MEAL_PLANS[profile.diet].label} guidance with ${plan.focus.slice(0, 3).join(", ")}.`}
            </Text>
          </View>
        </ImageBackground>

        <MedicalNotice compact />

        <View style={styles.homeMetrics}>
          <Metric label="Diet" value={MEAL_PLANS[profile.diet].label} icon={Leaf} />
          <Metric label="Checklist" value={`${completed}/8 done`} icon={ClipboardList} />
        </View>

        {needsProfile ? (
          <Card title="Start here" icon={NotebookTabs} tone="leaf">
            <Text style={styles.helperText}>
              Complete the required profile fields so the app can calculate weight trend and personalize your food plan.
            </Text>
            <TouchableOpacity style={styles.primaryAction} onPress={() => setActiveTab("Profile")}>
              <Text style={styles.primaryActionText}>Complete profile</Text>
            </TouchableOpacity>
            {__DEV__ ? (
              <TouchableOpacity style={styles.secondaryAction} onPress={loadSampleProfile}>
                <Text style={styles.secondaryActionText}>Load sample profile</Text>
              </TouchableOpacity>
            ) : null}
          </Card>
        ) : (
          <Card title="Today at a glance" icon={Sparkles} tone="berry">
            <View style={styles.tagWrap}>
              {plan.focus.map((item) => (
                <Text key={item} style={styles.tag}>{item}</Text>
              ))}
            </View>
          </Card>
        )}

        <View style={styles.quickGrid}>
          <QuickCard
            title="Meal Plan"
            body="Breakfast, lunch, snacks, dinner, and swaps."
            action="Open plan"
            onPress={() => setActiveTab("Plan")}
            tone="leaf"
            icon={Utensils}
          />
          <QuickCard
            title="Grocery"
            body="Shopping list matched to diet type."
            action="Build list"
            onPress={() => setActiveTab("Grocery")}
            tone="gold"
            icon={ShoppingBasket}
          />
          <QuickCard
            title="Journey"
            body="Baby growth, mother focus, and prep."
            action="View month"
            onPress={() => setActiveTab("Journey")}
            tone="berry"
            icon={Baby}
          />
          <QuickCard
            title="Symptoms"
            body="Nausea, acidity, constipation, swelling."
            action="Get tips"
            onPress={() => setActiveTab("Symptoms")}
            tone="sky"
            icon={HeartPulse}
          />
          <QuickCard
            title="Settings"
            body="Profile, reports, premium, and local data."
            action="Manage"
            onPress={() => setActiveTab("Settings")}
            tone="leaf"
            icon={Stethoscope}
          />
        </View>

        <Card title="Production safety" icon={Stethoscope} tone="sky">
          <MedicalNotice />
        </Card>
      </>
    );
  }

  function renderReports() {
    return (
      <>
        <MedicalNotice compact />
        <Card title="Lab reports" icon={FileText} tone="sky">
          <View style={styles.twoCol}>
            <Field label="Hemoglobin g/dL" value={profile.hemoglobin} onChangeText={(v) => setProfileValue("hemoglobin", v)} keyboardType="decimal-pad" />
            <Field label="Ferritin" value={profile.ferritin} onChangeText={(v) => setProfileValue("ferritin", v)} keyboardType="decimal-pad" />
            <Field label="Vitamin B12" value={profile.b12} onChangeText={(v) => setProfileValue("b12", v)} keyboardType="numeric" />
            <Field label="Vitamin D" value={profile.vitaminD} onChangeText={(v) => setProfileValue("vitaminD", v)} keyboardType="decimal-pad" />
            <Field label="Fasting glucose" value={profile.glucose} onChangeText={(v) => setProfileValue("glucose", v)} keyboardType="numeric" />
          </View>
          <ChoiceGroup label="Blood pressure" options={BP} value={profile.bp} onChange={(v) => setProfileValue("bp", v)} />
        </Card>
        <Card title="Medical flags" icon={HeartPulse} tone="berry">
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
          <Card title="Complete profile first" icon={NotebookTabs} tone="leaf">
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
        <MedicalNotice compact />
        <View style={styles.metricGrid}>
          <Metric label="BMI" value={`${plan.bmi.toFixed(1)} ${plan.category}`} />
          <Metric label="Weight trend" value={plan.trend} />
          <Metric label="Energy" value={plan.calorie} />
          <Metric label="Target gain" value={rangeText} />
        </View>
        <Card title={`${plan.trimester} | Month ${plan.month}`} icon={CalendarDays} tone="berry">
          <View style={styles.tagWrap}>
            {plan.focus.map((item) => (
              <Text key={item} style={styles.tag}>{item}</Text>
            ))}
          </View>
        </Card>
        <Card title={`${plan.mealPlan.label} day plan`} icon={Utensils} tone="leaf">
          {plan.mealPlan.meals.map(([label, text]) => (
            <View key={label} style={styles.mealRow}>
              <View style={styles.mealHeader}>
                <View style={styles.mealLabelWrap}>
                  <IconBubble icon={MEAL_ICONS[label] || Utensils} tone="leaf" size={15} />
                  <Text style={styles.mealLabel}>{label}</Text>
                </View>
                <TouchableOpacity style={styles.swapButton} onPress={() => swapMeal(label)}>
                  <RefreshCw size={13} color={COLORS.leaf} strokeWidth={2.5} />
                  <Text style={styles.swapButtonText}>Swap</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.mealText}>{mealText(label, text)}</Text>
            </View>
          ))}
          <Text style={styles.helperText}>{plan.mealPlan.substitutions}</Text>
        </Card>
        <Card title="Alerts and safety" icon={Stethoscope} tone="sky">
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
        <MedicalNotice compact />
        <Card title="Symptom manager" icon={HeartPulse} tone="berry">
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
        <Card title="Urgent signs" icon={Stethoscope} tone="sky">
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
        <Card title={`Month ${plan.month} journey`} icon={Baby} tone="berry">
          <View style={styles.journeyBlock}>
            <View style={styles.journeyLabelRow}>
              <Baby size={15} color={COLORS.berry} strokeWidth={2.4} />
              <Text style={styles.journeyLabel}>Baby growth</Text>
            </View>
            <Text style={styles.helperText}>{current.baby}</Text>
          </View>
          <View style={styles.journeyBlock}>
            <View style={styles.journeyLabelRow}>
              <HeartPulse size={15} color={COLORS.berry} strokeWidth={2.4} />
              <Text style={styles.journeyLabel}>Mother focus</Text>
            </View>
            <Text style={styles.helperText}>{current.mother}</Text>
          </View>
          <View style={styles.journeyBlock}>
            <View style={styles.journeyLabelRow}>
              <ClipboardList size={15} color={COLORS.berry} strokeWidth={2.4} />
              <Text style={styles.journeyLabel}>Prepare this month</Text>
            </View>
            <Text style={styles.helperText}>{current.prep}</Text>
          </View>
        </Card>
        <Card title={plan.month === 9 ? "Due-date focus" : `Coming next: month ${nextMonth}`} icon={CalendarDays} tone="gold">
          <Text style={styles.helperText}>{plan.month === 9 ? "Keep meals light, safe, and easy to digest. Confirm hospital bag, doctor contacts, and postpartum food support." : next.mother}</Text>
        </Card>
      </>
    );
  }

  function renderGrocery() {
    const groceries = GROCERY_BASE[profile.diet];
    return (
      <>
        <MedicalNotice compact />
        <Card title={`${MEAL_PLANS[profile.diet].label} grocery list`} icon={ShoppingBasket} tone="gold">
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
        <Card title="Shopping reminders" icon={Stethoscope} tone="sky">
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
    const historyRows = Object.entries({
      ...trackerHistory,
      [todayKey()]: tracker
    })
      .sort(([a], [b]) => (a < b ? 1 : -1))
      .slice(0, 7);

    return (
      <>
        <MedicalNotice compact />
        <Card title="Daily checklist" icon={ClipboardList} tone="leaf">
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
        <Card title="7-day progress" icon={ChartNoAxesColumnIncreasing} tone="gold">
          {historyRows.map(([dateKey, dayTracker]) => {
            const count = Object.values(dayTracker || {}).filter(Boolean).length;
            return (
              <View key={dateKey} style={styles.historyRow}>
                <View style={styles.historyDate}>
                  <CalendarDays size={15} color={COLORS.gold} strokeWidth={2.5} />
                  <Text style={styles.historyDateText}>{dateKey === todayKey() ? "Today" : friendlyDate(dateKey)}</Text>
                </View>
                <View style={styles.historyTrack}>
                  <View style={[styles.historyFill, { width: `${(count / 8) * 100}%` }]} />
                </View>
                <Text style={styles.historyCount}>{count}/8</Text>
              </View>
            );
          })}
        </Card>
        <Card title="Doctor review reminder" icon={Stethoscope} tone="sky">
          <MedicalNotice />
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
        <ImageBackground source={HERO_IMAGE} style={styles.comingSoonHero} imageStyle={styles.heroImage}>
          <View style={styles.comingSoonOverlay}>
            <View style={styles.comingSoonBadge}>
              <Sparkles size={14} color={COLORS.gold} strokeWidth={2.8} />
              <Text style={styles.comingSoonBadgeText}>Premium coming soon</Text>
            </View>
            <Text style={styles.comingSoonTitle}>Deeper pregnancy nutrition support</Text>
            <Text style={styles.comingSoonText}>
              The free app stays useful. Premium will add advanced planning, trend tracking, family support, and postpartum nutrition tools.
            </Text>
            <View style={styles.comingSoonMetaRow}>
              <View style={styles.comingSoonMeta}>
                <Text style={styles.comingSoonMetaValue}>6</Text>
                <Text style={styles.comingSoonMetaLabel}>planned tools</Text>
              </View>
              <View style={styles.comingSoonMeta}>
                <Text style={styles.comingSoonMetaValue}>0</Text>
                <Text style={styles.comingSoonMetaLabel}>payments now</Text>
              </View>
            </View>
          </View>
        </ImageBackground>

        <MedicalNotice compact />

        <Card title="What stays free" icon={Check} tone="leaf">
          <Text style={styles.helperText}>
            Core pregnancy nutrition support remains free in this version.
          </Text>
          <View style={styles.featureGrid}>
            {FREE_FEATURES.slice(0, 8).map((feature) => (
              <View key={feature} style={styles.freeFeature}>
                <Check size={13} color={COLORS.leaf} strokeWidth={2.8} />
                <Text style={styles.freeFeatureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card title="Premium roadmap" icon={Lock} tone="berry">
          {PREMIUM_FEATURES.map((feature) => {
            const FeatureIcon = feature.icon;
            return (
              <View key={feature.title} style={styles.premiumComingCard}>
                <View style={styles.premiumComingIcon}>
                  <FeatureIcon size={20} color={COLORS.berry} strokeWidth={2.5} />
                </View>
                <View style={styles.premiumComingCopy}>
                  <View style={styles.premiumComingTitleRow}>
                    <Text style={styles.premiumTitle}>{feature.title}</Text>
                    <View style={styles.lockBadge}>
                      <Lock size={11} color={COLORS.berry} strokeWidth={2.8} />
                      <Text style={styles.lockBadgeText}>Soon</Text>
                    </View>
                  </View>
                  <Text style={styles.helperText}>{feature.description}</Text>
                </View>
              </View>
            );
          })}
        </Card>

        <Card title="Launch pricing prototype" icon={Lock} tone="gold">
          <Text style={styles.helperText}>
            Pricing is only a planning preview for future release. Store purchases are not connected in this build.
          </Text>
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

        <Card title="Early access note" icon={Sparkles} tone="gold">
          <Text style={styles.helperText}>
            Premium is shown as a roadmap only. No subscription, payment, or purchase is enabled in this build.
          </Text>
          <TouchableOpacity style={styles.waitlistButton} onPress={() => setActiveTab("Home")}>
            <Sparkles size={16} color="#ffffff" strokeWidth={2.8} />
            <Text style={styles.waitlistButtonText}>Continue with free plan</Text>
          </TouchableOpacity>
        </Card>
      </>
    );
  }

  function renderSettings() {
    return (
      <>
        <Card title="Account and setup" icon={Stethoscope} tone="leaf">
          <View style={styles.moreGrid}>
            {["Profile", "Reports", "Symptoms", "Premium"].map((tabName) => (
              <TouchableOpacity
                key={tabName}
                style={styles.moreButton}
                onPress={() => setActiveTab(tabName)}
              >
                {React.createElement(TAB_ICONS[tabName], {
                  size: 16,
                  color: COLORS.muted,
                  strokeWidth: 2.4
                })}
                <Text style={styles.moreButtonText}>{tabName}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card title="Medical boundary" icon={Stethoscope} tone="sky">
          <MedicalNotice />
        </Card>

        <Card title="Local data" icon={Lock} tone="berry">
          <Text style={styles.helperText}>
            Profile and report values are stored on this device. You can reset saved profile and checklist data here.
          </Text>
          <TouchableOpacity style={styles.secondaryAction} onPress={resetLocalData}>
            <Text style={styles.secondaryActionText}>Reset saved profile and checklist</Text>
          </TouchableOpacity>
        </Card>
      </>
    );
  }

  const content = {
    Home: renderHome,
    Profile: renderProfile,
    Reports: renderReports,
    Plan: renderPlan,
    Journey: renderJourney,
    Grocery: renderGrocery,
    Symptoms: renderSymptoms,
    Tracker: renderTracker,
    Premium: renderPremium,
    Settings: renderSettings
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

  if (!onboardingComplete) {
    const canContinue = onboardingCanContinue();
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.paper} />
        <View style={styles.onboardingHeader}>
          <Text style={styles.eyebrow}>Pregnancy Nutrition Coach</Text>
          <Text style={styles.onboardingTitle}>{ONBOARDING_STEPS[onboardingStep]}</Text>
          <Text style={styles.subtitle}>Step {onboardingStep + 1} of {ONBOARDING_STEPS.length}</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${((onboardingStep + 1) / ONBOARDING_STEPS.length) * 100}%` }]} />
          </View>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.onboardingContent}>
          {renderOnboardingStep()}
          {onboardingStep === 2 && !canContinue ? (
            <Card title="Required before continuing" icon={NotebookTabs} tone="berry">
              {validationMessages(profile).map((item) => (
                <View key={item} style={styles.alert}>
                  <Text style={styles.alertText}>{item}</Text>
                </View>
              ))}
            </Card>
          ) : null}
        </ScrollView>

        <View style={styles.onboardingFooter}>
          {onboardingStep > 0 ? (
            <TouchableOpacity style={styles.footerSecondary} onPress={() => setOnboardingStep((step) => Math.max(step - 1, 0))}>
              <Text style={styles.secondaryActionText}>Back</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={[styles.footerPrimary, !canContinue && styles.actionDisabled]}
            disabled={!canContinue}
            onPress={() => {
              if (onboardingStep < ONBOARDING_STEPS.length - 1) {
                setOnboardingStep((step) => step + 1);
              } else {
                completeOnboarding();
              }
            }}
          >
            <Text style={styles.primaryActionText}>
              {onboardingStep === ONBOARDING_STEPS.length - 1 ? "Finish setup" : "Continue"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.paper} />
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>Pregnancy Nutrition Coach</Text>
          <Text style={styles.title}>{activeTab === "Home" ? "Your pregnancy food day" : activeTab}</Text>
          <Text style={styles.subtitle}>
            {plan.trimester}, month {plan.month} • {MEAL_PLANS[profile.diet].label}
          </Text>
        </View>
        <Image source={HERO_IMAGE} style={styles.headerThumb} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {content}
        <Text style={styles.disclaimer}>
          {MEDICAL_NOTE}
        </Text>
      </ScrollView>

      <View style={styles.bottomNav}>
        {MAIN_TABS.map((tabName) => (
          <TouchableOpacity
            key={tabName}
            style={styles.bottomItem}
            onPress={() => setActiveTab(tabName)}
          >
            <View style={[styles.bottomIcon, activeTab === tabName && styles.bottomIconActive]}>
              {React.createElement(TAB_ICONS[tabName], {
                size: 16,
                color: activeTab === tabName ? "#ffffff" : COLORS.gold,
                strokeWidth: 2.5
              })}
            </View>
            <Text style={[styles.bottomLabel, activeTab === tabName && styles.bottomLabelActive]}>
              {tabName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.paper
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: COLORS.paper
  },
  headerCopy: {
    flex: 1,
    minWidth: 0
  },
  eyebrow: {
    color: COLORS.berry,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  title: {
    color: COLORS.ink,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 28,
    marginTop: 4
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 6
  },
  headerThumb: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.line
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
    paddingBottom: 104
  },
  hero: {
    minHeight: 300,
    overflow: "hidden",
    justifyContent: "flex-end",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.softLeaf
  },
  heroImage: {
    resizeMode: "cover"
  },
  heroOverlay: {
    minHeight: 170,
    justifyContent: "flex-end",
    padding: 18,
    backgroundColor: "rgba(31, 41, 51, 0.42)"
  },
  heroKicker: {
    color: "#fff2d7",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 5
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 34,
    marginBottom: 8
  },
  heroText: {
    color: "#fffdf8",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22
  },
  homeMetrics: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12
  },
  quickCard: {
    flexGrow: 1,
    flexBasis: "47%",
    minHeight: 154,
    padding: 14,
    borderWidth: 1,
    justifyContent: "space-between"
  },
  quickCardleaf: {
    backgroundColor: COLORS.softLeaf,
    borderColor: "#c8ded2"
  },
  quickCardgold: {
    backgroundColor: COLORS.softGold,
    borderColor: "#ead8aa"
  },
  quickCardberry: {
    backgroundColor: COLORS.softBerry,
    borderColor: "#ead0db"
  },
  quickCardsky: {
    backgroundColor: COLORS.softBlue,
    borderColor: "#c8dce9"
  },
  quickTitle: {
    color: COLORS.ink,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 6
  },
  quickBody: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19
  },
  quickAction: {
    color: COLORS.leaf,
    fontSize: 13,
    fontWeight: "900",
    marginRight: 6
  },
  quickActionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12
  },
  medicalNotice: {
    flexDirection: "row",
    gap: 10,
    borderWidth: 1,
    borderColor: "#efcaca",
    backgroundColor: "#fff6f6",
    padding: 12,
    marginBottom: 12
  },
  medicalNoticeCompact: {
    padding: 10
  },
  medicalNoticeTextWrap: {
    flex: 1,
    minWidth: 0
  },
  medicalNoticeTitle: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 4
  },
  medicalNoticeText: {
    color: COLORS.ink,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
    marginBottom: 4
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
  onboardingHeader: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: COLORS.paper
  },
  onboardingTitle: {
    color: COLORS.ink,
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 36,
    marginTop: 4
  },
  progressTrack: {
    height: 8,
    backgroundColor: COLORS.line,
    marginTop: 14,
    overflow: "hidden"
  },
  progressFill: {
    height: 8,
    backgroundColor: COLORS.leaf
  },
  onboardingContent: {
    padding: 14,
    paddingBottom: 110
  },
  onboardingHero: {
    minHeight: 380,
    overflow: "hidden",
    justifyContent: "flex-end",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.softLeaf
  },
  onboardingFooter: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    flexDirection: "row",
    gap: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.surface,
    shadowColor: "#1f2933",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8
  },
  footerSecondary: {
    flex: 0.45,
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.ivory
  },
  footerPrimary: {
    flex: 1,
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.leaf,
    paddingHorizontal: 14
  },
  actionDisabled: {
    opacity: 0.45
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12
  },
  iconBubble: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1
  },
  iconBubbleleaf: {
    backgroundColor: COLORS.softLeaf,
    borderColor: "#c8ded2"
  },
  iconBubblegold: {
    backgroundColor: COLORS.softGold,
    borderColor: "#ead8aa"
  },
  iconBubbleberry: {
    backgroundColor: COLORS.softBerry,
    borderColor: "#ead0db"
  },
  iconBubblesky: {
    backgroundColor: COLORS.softBlue,
    borderColor: "#c8dce9"
  },
  moreGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  moreButton: {
    flexGrow: 1,
    flexBasis: "45%",
    minHeight: 44,
    flexDirection: "row",
    gap: 7,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.ivory
  },
  moreButtonActive: {
    borderColor: COLORS.leaf,
    backgroundColor: COLORS.softLeaf
  },
  moreButtonText: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "900"
  },
  moreButtonTextActive: {
    color: COLORS.leaf
  },
  cardTitle: {
    color: COLORS.leaf,
    fontSize: 17,
    fontWeight: "900",
    flex: 1
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
    textTransform: "uppercase"
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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
  mealLabelWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  swapButton: {
    minHeight: 32,
    borderWidth: 1,
    borderColor: COLORS.leaf,
    backgroundColor: COLORS.softLeaf,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
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
    textTransform: "uppercase"
  },
  journeyLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4
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
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  freeFeatureText: {
    color: COLORS.leaf,
    fontSize: 13,
    fontWeight: "900"
  },
  comingSoonHero: {
    minHeight: 310,
    overflow: "hidden",
    justifyContent: "flex-end",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.softBerry
  },
  comingSoonOverlay: {
    minHeight: 310,
    justifyContent: "flex-end",
    padding: 18,
    backgroundColor: "rgba(31, 41, 51, 0.48)"
  },
  comingSoonBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "rgba(255, 242, 215, 0.62)",
    backgroundColor: "rgba(31, 41, 51, 0.38)",
    marginBottom: 12
  },
  comingSoonBadgeText: {
    color: "#fff2d7",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  comingSoonTitle: {
    color: "#ffffff",
    fontSize: 29,
    fontWeight: "900",
    lineHeight: 34,
    marginBottom: 8
  },
  comingSoonText: {
    color: "#fffdf8",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22
  },
  comingSoonMetaRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16
  },
  comingSoonMeta: {
    flex: 1,
    minHeight: 68,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 253, 248, 0.16)",
    padding: 10,
    justifyContent: "center"
  },
  comingSoonMetaValue: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "900"
  },
  comingSoonMetaLabel: {
    color: "#fff2d7",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    marginTop: 2
  },
  premiumFeature: {
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: "#ffffff",
    padding: 12,
    marginTop: 10
  },
  premiumComingCard: {
    flexDirection: "row",
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.ivory,
    padding: 12,
    marginBottom: 10
  },
  premiumComingIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ead0db",
    backgroundColor: COLORS.softBerry
  },
  premiumComingCopy: {
    flex: 1,
    minWidth: 0
  },
  premiumComingTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8
  },
  lockBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.softBerry,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
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
    lineHeight: 20,
    marginBottom: 4,
    flex: 1
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
  waitlistButton: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.berry,
    marginTop: 14,
    paddingHorizontal: 14
  },
  waitlistButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900"
  },
  progressText: {
    color: COLORS.berry,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 12
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 42,
    marginBottom: 8
  },
  historyDate: {
    width: 78,
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },
  historyDateText: {
    color: COLORS.ink,
    fontSize: 13,
    fontWeight: "900"
  },
  historyTrack: {
    flex: 1,
    height: 10,
    backgroundColor: COLORS.line,
    overflow: "hidden"
  },
  historyFill: {
    height: 10,
    backgroundColor: COLORS.gold
  },
  historyCount: {
    width: 34,
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "900",
    textAlign: "right"
  },
  disclaimer: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    textAlign: "center",
    paddingHorizontal: 10
  },
  bottomNav: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.surface,
    shadowColor: "#1f2933",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8
  },
  bottomItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 62
  },
  bottomIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.softGold,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3
  },
  bottomIconActive: {
    backgroundColor: COLORS.leaf
  },
  bottomLabel: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: "900"
  },
  bottomLabelActive: {
    color: COLORS.leaf
  }
});

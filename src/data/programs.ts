import { BreathingProgram } from '../types';

export const BREATHING_PROGRAMS: BreathingProgram[] = [
  {
    id: 'classic-rebirthing',
    nameEn: 'Classic Rebirthing',
    nameHe: 'נשימה מחודשת קלאסית',
    taglineEn: 'The original connected breath',
    taglineHe: 'הנשימה המחוברת המקורית',
    descriptionEn:
      'Developed by Leonard Orr in the 1960s, this technique uses gentle nasal circular breathing — the inhale flows directly into the exhale with no pause. The continuous rhythm releases held tension and allows suppressed emotions to surface and integrate naturally. A foundational rebirthing practice.',
    descriptionHe:
      'פותחה על ידי לאונרד אור בשנות ה-60, טכניקה זו משתמשת בנשימת אף עגולה עדינה — השאיפה זורמת ישירות לנשיפה ללא הפסקה. הקצב הרציף משחרר מתח ומאפשר לרגשות מודחקים לעלות ולהשתלב. שיטת הבסיס של הנשימה המחודשת.',
    origin: 'Leonard Orr, שנות ה-60',
    style: 'classic',
    intensity: 'gentle',
    defaultDurationMinutes: 20,
    phases: [
      { label: 'inhale', labelHe: 'שאיפה', labelEn: 'INHALE', durationMs: 4000 },
      { label: 'exhale', labelHe: 'נשיפה', labelEn: 'EXHALE', durationMs: 4000 },
    ],
    gradient: ['#0D1B2A', '#1A3A5C', '#0D2137'],
    accentColor: '#4FC3F7',
    particleColor: '#4FC3F7',
  },
  {
    id: 'holotropic',
    nameEn: 'Holotropic Breathwork',
    nameHe: 'נשימה הולוטרופית',
    taglineEn: 'Deep journey into wholeness',
    taglineHe: 'מסע עמוק אל השלמות',
    descriptionEn:
      'Developed by Stanislav Grof, holotropic breathwork uses deeper and faster mouth breathing to access non-ordinary states of consciousness. More intense than classic rebirthing, it can unlock profound psychological insights and emotional catharsis. Traditionally practiced in group settings.',
    descriptionHe:
      'פותחה על ידי סטניסלב גרוף, משתמשת בנשימת פה עמוקה ומהירה יותר לגישה למצבי תודעה יוצאי דופן. אינטנסיבי יותר מהנשימה הקלאסית, יכולה לשחרר תובנות פסיכולוגיות עמוקות. בדרך כלל מתבצעת בהגדרות קבוצתיות.',
    origin: 'Stanislav Grof, שנות ה-70',
    style: 'holotropic',
    intensity: 'intense',
    defaultDurationMinutes: 30,
    phases: [
      { label: 'inhale', labelHe: 'שאיפה', labelEn: 'INHALE', durationMs: 2000 },
      { label: 'exhale', labelHe: 'נשיפה', labelEn: 'EXHALE', durationMs: 2000 },
    ],
    gradient: ['#1A0533', '#3D1165', '#1A0533'],
    accentColor: '#CE93D8',
    particleColor: '#9C27B0',
  },
  {
    id: 'clarity-breathwork',
    nameEn: 'Clarity Breathwork',
    nameHe: 'נשימת בהירות',
    taglineEn: 'Clear emotions, find your center',
    taglineHe: 'נקה רגשות, מצא את מרכזך',
    descriptionEn:
      'Developed by Ashanna Solaris and Dana DeLong, Clarity Breathwork combines medium-paced connected breathing with conscious intention-setting. It emphasizes emotional clearing and accessing inner wisdom rather than cathartic release. Gentle yet deeply effective.',
    descriptionHe:
      'פותחה על ידי אשנה סולריס ודנה דלונג, משלבת נשימה מחוברת בקצב בינוני עם כוונה מודעת. מדגישה ניקוי רגשי וגישה לחכמה פנימית. עדינה אך יעילה עמוקה.',
    origin: 'Ashanna Solaris & Dana DeLong, שנות ה-90',
    style: 'clarity',
    intensity: 'medium',
    defaultDurationMinutes: 25,
    phases: [
      { label: 'inhale', labelHe: 'שאיפה', labelEn: 'INHALE', durationMs: 3500 },
      { label: 'exhale', labelHe: 'נשיפה', labelEn: 'EXHALE', durationMs: 3500 },
    ],
    gradient: ['#0A2818', '#1B5E35', '#0A2818'],
    accentColor: '#81C784',
    particleColor: '#4CAF50',
  },
  {
    id: 'fire-breath',
    nameEn: 'Fire Breath',
    nameHe: 'נשימת אש (אגני פראנאיאמה)',
    taglineEn: 'Ignite your vital energy',
    taglineHe: 'הצת את האנרגיה החיונית שלך',
    descriptionEn:
      'Agni Pranayama — rapid, energizing connected breathing that activates the sympathetic nervous system and builds internal heat. Each breath is sharp and intentional. Use this for energy activation, focus, and clearing stagnation. Not recommended for beginners.',
    descriptionHe:
      'אגני פראנאיאמה — נשימה מחוברת מהירה ומעצימה המפעילה את מערכת העצבים הסימפטטית ובונה חום פנימי. כל נשימה חדה ומכוונת. מיועד להפעלת אנרגיה וריכוז. לא מומלץ למתחילים.',
    origin: 'מסורת הפראנאיאמה הוודית',
    style: 'fire',
    intensity: 'intense',
    defaultDurationMinutes: 15,
    phases: [
      { label: 'inhale', labelHe: 'שאיפה', labelEn: 'INHALE', durationMs: 1000 },
      { label: 'exhale', labelHe: 'נשיפה', labelEn: 'EXHALE', durationMs: 1000 },
    ],
    gradient: ['#2D0A00', '#7B2D00', '#2D0A00'],
    accentColor: '#FF8A65',
    particleColor: '#FF5722',
  },
  {
    id: 'earth-breath',
    nameEn: 'Earth Breath',
    nameHe: 'נשימת אדמה',
    taglineEn: 'Root deep, breathe slow',
    taglineHe: 'שרשות עמוקה, נשימה איטית',
    descriptionEn:
      'Very slow, grounding circular breathing that activates the parasympathetic nervous system. Extended exhale promotes deep relaxation and a sense of physical rootedness. Ideal for anxiety, stress relief, and preparation for sleep. The slowest and most grounding of the six programs.',
    descriptionHe:
      'נשימה עגולה איטית מאוד ומייצבת המפעילה את מערכת העצבים הפאראסימפטטית. נשיפה מורחבת מקדמת הרפיה עמוקה ותחושת שורשיות. אידיאלי לחרדה, הפגת מתח והכנה לשינה.',
    origin: 'עבודת הגוף הסומטית',
    style: 'earth',
    intensity: 'gentle',
    defaultDurationMinutes: 20,
    phases: [
      { label: 'inhale', labelHe: 'שאיפה', labelEn: 'INHALE', durationMs: 6000 },
      { label: 'exhale', labelHe: 'נשיפה', labelEn: 'EXHALE', durationMs: 8000 },
    ],
    gradient: ['#1A1205', '#3D2B0A', '#1A1205'],
    accentColor: '#BCAAA4',
    particleColor: '#795548',
  },
  {
    id: 'water-breath',
    nameEn: 'Water Breath',
    nameHe: 'נשימת מים',
    taglineEn: 'Flow like water, release like rain',
    taglineHe: 'זרום כמו מים, שחרר כמו גשם',
    descriptionEn:
      'A fluid, wave-like connected breathing rhythm that mirrors the undulation of ocean waves. Medium-slow pace with emphasis on smooth transitions between phases. Deeply relaxing and effective for gentle emotional release, creative flow states, and meditation.',
    descriptionHe:
      'קצב נשימה מחוברת, גלי ונוזלי המשקף את גלי האוקיינוס. קצב בינוני-איטי עם דגש על מעברים חלקים בין שלבים. מרגיע עמוקות ויעיל לשחרור רגשי עדין ומדיטציה.',
    origin: 'סינתזת הנשימה המחודשת העכשווית',
    style: 'water',
    intensity: 'gentle',
    defaultDurationMinutes: 20,
    phases: [
      { label: 'inhale', labelHe: 'שאיפה', labelEn: 'INHALE', durationMs: 4500 },
      { label: 'exhale', labelHe: 'נשיפה', labelEn: 'EXHALE', durationMs: 5500 },
    ],
    gradient: ['#002233', '#004466', '#002233'],
    accentColor: '#80DEEA',
    particleColor: '#00BCD4',
  },
];

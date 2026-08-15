import type { IconName } from "@/components/Icons";

export type Category =
  | "clothing-women"
  | "clothing-men"
  | "bags"
  | "shoes"
  | "makeup"
  | "skincare"
  | "haircare"
  | "fragrance"
  | "accessories";

export type Section = "bestsellers" | "new-arrivals" | "clothing-spotlight";

export type Product = {
  id: string;
  slug: string;
  brand: string;
  name: string;
  price: number;
  oldPrice?: number;
  category: Category;
  section: Section;
  icon: IconName;
  description: string;
  /** المقاسات — للملابس والأحذية فقط */
  sizes?: string[];
  /** الألوان المتاحة */
  colors?: string[];
};

export const CATEGORIES: { slug: Category; name: string; icon: IconName }[] = [
  { slug: "clothing-women", name: "ملابس حريمي", icon: "dress" },
  { slug: "clothing-men", name: "ملابس رجالي", icon: "tee" },
  { slug: "bags", name: "شنط", icon: "bag-product" },
  { slug: "shoes", name: "أحذية", icon: "heels" },
  { slug: "makeup", name: "مكياج", icon: "lipstick" },
  { slug: "skincare", name: "عناية بالبشرة", icon: "jar" },
  { slug: "haircare", name: "عناية بالشعر", icon: "bottle" },
  { slug: "fragrance", name: "عطور", icon: "perfume" },
  { slug: "accessories", name: "إكسسوارات", icon: "jewelry" },
];

export const PRODUCTS: Product[] = [
  /* ===== Bestsellers (من المرجع) ===== */
  {
    id: "p01",
    slug: "sheen-lab-matte-lipstick",
    brand: "Sheen Lab",
    name: "أحمر شفايف مطفي طويل الثبات",
    price: 249,
    oldPrice: 320,
    category: "makeup",
    section: "bestsellers",
    icon: "lipstick",
    description:
      "أحمر شفايف بلمسة مطفية وثبات يدوم حتى 12 ساعة، بتركيبة غنية بالمرطبات لا تجفف الشفايف.",
    colors: ["وردي مطفى", "أحمر كلاسيك", "موكا"],
  },
  {
    id: "p02",
    slug: "brow-studio-brow-pencil",
    brand: "Brow Studio",
    name: "قلم حواجب دقيق بفرشاة زاوية",
    price: 199,
    category: "makeup",
    section: "bestsellers",
    icon: "brow",
    description:
      "قلم حواجب برأس دقيق لرسم شعرات طبيعية، مع فرشاة زاوية لتوزيع اللون وتثبيت الحواجب طوال اليوم.",
    colors: ["بني داكن", "أسود", "رمادي"],
  },
  {
    id: "p03",
    slug: "glow-rituals-vitamin-c-serum",
    brand: "Glow Rituals",
    name: "سيروم فيتامين سي للإشراقة",
    price: 389,
    oldPrice: 520,
    category: "skincare",
    section: "bestsellers",
    icon: "serum",
    description:
      "سيروم مركّز بفيتامين سي 15% لتفتيح البشرة وتوحيد لونها ومحاربة علامات التعب والإجهاد.",
  },
  {
    id: "p04",
    slug: "petal-co-oil-free-moisturizer",
    brand: "Petal & Co",
    name: "كريم مرطب خفيف للبشرة الدهنية",
    price: 299,
    category: "skincare",
    section: "bestsellers",
    icon: "jar",
    description:
      "كريم ترطيب خفيف غير دهني، سريع الامتصاص، مثالي للبشرة الدهنية والمختلطة في المناخ الحار.",
  },
  {
    id: "p05",
    slug: "sheen-lab-waterproof-mascara",
    brand: "Sheen Lab",
    name: "ماسكارا تكثيف وإطالة مقاومة للماء",
    price: 229,
    oldPrice: 310,
    category: "makeup",
    section: "bestsellers",
    icon: "mascara",
    description:
      "ماسكارا بفرشاة منحنية تعطي تكثيفًا وإطالة فورية مع ثبات مقاوم للماء طوال اليوم.",
  },
  {
    id: "p06",
    slug: "glow-rituals-liquid-highlighter",
    brand: "Glow Rituals",
    name: "هايلايتر سائل بلمعان طبيعي",
    price: 259,
    category: "makeup",
    section: "bestsellers",
    icon: "wand",
    description:
      "هايلايتر سائل بجزيئات دقيقة تمنح إشراقة طبيعية قابلة للبناء من لمسة خفيفة إلى توهج كامل.",
  },

  /* ===== New arrivals (من المرجع) ===== */
  {
    id: "p07",
    slug: "petal-co-green-tea-sheet-mask",
    brand: "Petal & Co",
    name: "ماسك ورقي مهدئ بخلاصة الشاي الأخضر",
    price: 89,
    category: "skincare",
    section: "new-arrivals",
    icon: "sheetmask",
    description:
      "ماسك ورقي منعش بخلاصة الشاي الأخضر يهدئ البشرة ويمنحها ترطيبًا فوريًا في 15 دقيقة.",
  },
  {
    id: "p08",
    slug: "studio-noir-gold-jewelry-set",
    brand: "Studio Noir",
    name: "طقم إكسسوارات مطلي ذهبي",
    price: 249,
    category: "accessories",
    section: "new-arrivals",
    icon: "jewelry",
    description:
      "طقم إكسسوارات أنيق مطلي بذهب مقاوم للبهتان — عقد وأقراط وأسورة بتصميم عصري بسيط.",
  },
  {
    id: "p09",
    slug: "amora-jasmine-body-mist",
    brand: "Amora",
    name: "عطر بودي ميست بلمسة الياسمين",
    price: 179,
    category: "fragrance",
    section: "new-arrivals",
    icon: "bottle",
    description:
      "بودي ميست خفيف ومنعش برائحة الياسمين الرقيقة، مثالي للاستخدام اليومي بعد الاستحمام.",
  },
  {
    id: "p10",
    slug: "hair-ritual-argan-oil",
    brand: "Hair Ritual",
    name: "زيت أرجان مغذي لأطراف الشعر",
    price: 219,
    oldPrice: 280,
    category: "haircare",
    section: "new-arrivals",
    icon: "bottle",
    description:
      "زيت أرجان نقي يغذي الأطراف المتقصفة ويمنح الشعر لمعانًا ونعومة دون أي ثقل أو دهون.",
  },
  {
    id: "p11",
    slug: "petal-co-gentle-cleanser",
    brand: "Petal & Co",
    name: "غسول وجه لطيف لجميع أنواع البشرة",
    price: 159,
    category: "skincare",
    section: "new-arrivals",
    icon: "bottle",
    description:
      "غسول يومي لطيف خالٍ من الصابون ينظف البشرة بعمق دون تجريدها من زيوتها الطبيعية.",
  },
  {
    id: "p12",
    slug: "sheen-lab-glass-lip-gloss",
    brand: "Sheen Lab",
    name: "ملمع شفايف بلمسة زجاجية",
    price: 189,
    category: "makeup",
    section: "new-arrivals",
    icon: "gloss",
    description:
      "ملمع شفايف بلمعة زجاجية مذهلة وتركيبة مريحة غير لاصقة، بفيتامين E لترطيب الشفايف.",
    colors: ["شفاف", "وردي", "نود"],
  },

  /* ===== Clothing & Accessories (من المرجع) ===== */
  {
    id: "p13",
    slug: "noir-line-black-midi-dress",
    brand: "Noir Line",
    name: "فستان ميدي كلوش أسود كلاسيك",
    price: 899,
    oldPrice: 1200,
    category: "clothing-women",
    section: "clothing-spotlight",
    icon: "dress",
    description:
      "فستان ميدي بقصّة كلوش تنسدل بأناقة، خامة قطنية مريحة تصلح للإطلالات النهارية والمسائية.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["أسود"],
  },
  {
    id: "p14",
    slug: "urban-fit-mom-fit-jeans",
    brand: "Urban Fit",
    name: "بنطلون جينز مام فيت مقاس واسع",
    price: 649,
    category: "clothing-women",
    section: "clothing-spotlight",
    icon: "jeans",
    description:
      "بنطلون جينز مام فيت بخصر مرتفع وقصّة واسعة مريحة، خامة دنيم متوسطة الثقل تدوم طويلًا.",
    sizes: ["28", "30", "32", "34"],
    colors: ["أزرق داكن", "أسود"],
  },
  {
    id: "p15",
    slug: "studio-basics-oversize-tee",
    brand: "Studio Basics",
    name: "تيشيرت قطن أوفرسايز أبيض",
    price: 329,
    category: "clothing-men",
    section: "clothing-spotlight",
    icon: "tee",
    description:
      "تيشيرت أوفرسايز من قطن 100% عالي الجودة، قصّة مريحة وأساسية تناسب كل الإطلالات.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["أبيض", "أسود", "رمادي"],
  },
  {
    id: "p16",
    slug: "noir-line-classic-blazer",
    brand: "Noir Line",
    name: "جاكيت بليزر أسود كلاسيك",
    price: 1150,
    oldPrice: 1450,
    category: "clothing-women",
    section: "clothing-spotlight",
    icon: "blazer",
    description:
      "بليزر كلاسيك بقصّة مبطنة أنيقة، تفصيل دقيق وخامة فاخرة — قطعة أساسية لأي دولاب ملابس.",
    sizes: ["S", "M", "L"],
    colors: ["أسود"],
  },
  {
    id: "p17",
    slug: "heel-house-classic-black-heels",
    brand: "Heel House",
    name: "حذاء كعب كلاسيك أسود لامع",
    price: 749,
    category: "shoes",
    section: "clothing-spotlight",
    icon: "heels",
    description:
      "حذاء كعب متوسط بارتفاع مريح، بلمعة جلدية أنيقة يناسب المناسبات والعمل على حد سواء.",
    sizes: ["36", "37", "38", "39", "40"],
    colors: ["أسود"],
  },
  {
    id: "p18",
    slug: "studio-basics-white-handbag",
    brand: "Studio Basics",
    name: "شنطة يد جلد صناعي أبيض",
    price: 599,
    oldPrice: 780,
    category: "bags",
    section: "clothing-spotlight",
    icon: "bag-product",
    description:
      "شنطة يد عصرية من جلد صناعي فاخر، واسعة من الداخل بحزام كتف قابل للتعديل.",
    colors: ["أبيض", "أسود", "بيج"],
  },

  /* ===== منتجات إضافية تجريبية لاستكمال التصنيفات ===== */
  {
    id: "p19",
    slug: "urban-fit-cotton-oxford-shirt",
    brand: "Urban Fit",
    name: "قميص أوكسفورد قطني أبيض",
    price: 549,
    category: "clothing-men",
    section: "clothing-spotlight",
    icon: "shirt",
    description:
      "قميص أوكسفورد بقماش قطني محبوك مريح، قصّة كلاسيكية تصلح للعمل والخروجات.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["أبيض", "أزرق فاتح"],
  },
  {
    id: "p20",
    slug: "heel-house-black-sneakers",
    brand: "Heel House",
    name: "سنيكرز جلد أسود رياضي",
    price: 899,
    category: "shoes",
    section: "clothing-spotlight",
    icon: "sneaker",
    description:
      "سنيكرز من الجلد بنعل مريح مرن، تصميم رياضي أنيق يناسب الاستخدام اليومي.",
    sizes: ["40", "41", "42", "43", "44"],
    colors: ["أسود", "أبيض"],
  },
  {
    id: "p21",
    slug: "amora-oriental-perfume",
    brand: "Amora",
    name: "عطر مسائي بلمسة شرقية",
    price: 1299,
    oldPrice: 1500,
    category: "fragrance",
    section: "new-arrivals",
    icon: "perfume",
    description:
      "عطر شرقي فخم بمزيج من العود والمسك والعنبر، ثبات طويل وفوحان يدوم حتى الصباح.",
  },
  {
    id: "p22",
    slug: "studio-noir-leather-watch",
    brand: "Studio Noir",
    name: "ساعة جلدية كلاسيكية سوداء",
    price: 549,
    category: "accessories",
    section: "new-arrivals",
    icon: "watch",
    description:
      "ساعة بميناء أسود وحزام جلد فاخر، تصميم كلاسيكي بسيط يليق بكل الإطلالات.",
  },
  {
    id: "p23",
    slug: "studio-basics-black-cap",
    brand: "Studio Basics",
    name: "كاب قطني أسود مطرز",
    price: 249,
    category: "accessories",
    section: "new-arrivals",
    icon: "cap",
    description:
      "كاب قطن مطرز بتصميم بسيط، مريح وقابل للتعديل من الخلف — إضافة يومية عملية.",
    sizes: ["مقاس واحد"],
    colors: ["أسود", "بيج"],
  },
  {
    id: "p24",
    slug: "noir-line-wool-coat",
    brand: "Noir Line",
    name: "كوت صوفي طويل أنيق",
    price: 1899,
    oldPrice: 2300,
    category: "clothing-women",
    section: "clothing-spotlight",
    icon: "coat",
    description:
      "كوت صوفي طويل بتصميم أنيق دافئ، قصّة مريحة تناسب أجواء الشتاء بإطلالة راقية.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["أسود", "بيج"],
  },
  {
    id: "p25",
    slug: "hair-ritual-gloss-shampoo",
    brand: "Hair Ritual",
    name: "شامبو اللمعان للشعر الجاف",
    price: 189,
    category: "haircare",
    section: "new-arrivals",
    icon: "bottle",
    description:
      "شامبو مرطّب بزيوت طبيعية ينظف الشعر الجاف ويمنحه لمعانًا صحيًا من أول استعمال.",
  },
  {
    id: "p26",
    slug: "studio-basics-black-tote",
    brand: "Studio Basics",
    name: "شنطة توت سوداء عملية",
    price: 449,
    category: "bags",
    section: "new-arrivals",
    icon: "bag-product",
    description:
      "شنطة توت واسعة وعملية تكفي أغراضك اليومية، بجيب داخلي وسحاب آمن.",
    colors: ["أسود", "بيج"],
  },
];

export const formatPrice = (price: number) => `${price} ج.م`;

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getSectionProducts(section: Section): Product[] {
  return PRODUCTS.filter((p) => p.section === section);
}

export function getSaleProducts(): Product[] {
  return PRODUCTS.filter((p) => p.oldPrice !== undefined);
}

export function getCategoryMeta(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

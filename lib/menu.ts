export type LocalizedText = {
  ru: string;
  kk: string;
};

export type MenuGroup = "kitchen" | "bar";

export type MenuCategoryId =
  | "cold-appetizers"
  | "hot-appetizers"
  | "salads"
  | "soups"
  | "pasta"
  | "beef"
  | "chicken"
  | "pizza"
  | "snacks"
  | "fast-food"
  | "tea"
  | "tea-extras"
  | "lemonades"
  | "drinks"
  | "beer"
  | "wine"
  | "vodka"
  | "whiskey"
  | "rum"
  | "tequila"
  | "gin"
  | "cognac"
  | "bar-snacks"
  | "hookah";

export type MenuCategory = {
  id: MenuCategoryId;
  group: MenuGroup;
  title: LocalizedText;
};

export type MenuItem = {
  id: string;
  categoryId: MenuCategoryId;
  name: LocalizedText;
  /**
   * Ingredient list or short descriptor as printed on the physical menu.
   * `null` means the real menu has no description for this item — never invent one.
   */
  description: LocalizedText | null;
  /** Price in KZT. `null` = confirm with the venue (missing-data state). */
  price: number | null;
  /** Serving size exactly as printed (e.g. "0.5 л", "50 мл"). `null` when not listed. */
  volume: string | null;
  /** Renders the price as "from X" (used for open-priced items like ART hookah). */
  priceFrom?: boolean;
  /** Verified popular dish — do not set unless confirmed by the venue. */
  popular?: boolean;
};

/**
 * Categories in menu order: kitchen first, then bar.
 * Category titles are the only strings translated to Kazakh here — dish names below
 * are kept exactly as printed on the (Russian) physical menu, except the four verified
 * popular dishes, which carry venue-confirmed Kazakh names. See README / commit notes.
 */
export const menuCategories: MenuCategory[] = [
  { id: "cold-appetizers", group: "kitchen", title: { ru: "Холодные закуски", kk: "Салқын тіскебасарлар" } },
  { id: "hot-appetizers", group: "kitchen", title: { ru: "Горячие закуски", kk: "Ыстық тіскебасарлар" } },
  { id: "salads", group: "kitchen", title: { ru: "Салаты", kk: "Салаттар" } },
  { id: "soups", group: "kitchen", title: { ru: "Супы", kk: "Сорпалар" } },
  { id: "pasta", group: "kitchen", title: { ru: "Паста", kk: "Паста" } },
  { id: "beef", group: "kitchen", title: { ru: "Блюда из говядины", kk: "Сиыр етінен жасалған тағамдар" } },
  { id: "chicken", group: "kitchen", title: { ru: "Блюда из курицы", kk: "Тауық етінен жасалған тағамдар" } },
  { id: "pizza", group: "kitchen", title: { ru: "Пицца", kk: "Пицца" } },
  { id: "snacks", group: "kitchen", title: { ru: "Снэки", kk: "Снектер" } },
  { id: "fast-food", group: "kitchen", title: { ru: "Фаст-фуд", kk: "Фаст-фуд" } },
  { id: "tea", group: "bar", title: { ru: "Чайная карта", kk: "Шай картасы" } },
  { id: "tea-extras", group: "bar", title: { ru: "К чаю", kk: "Шайға қосымша" } },
  { id: "lemonades", group: "bar", title: { ru: "Лимонады", kk: "Лимонадтар" } },
  { id: "drinks", group: "bar", title: { ru: "Напитки", kk: "Сусындар" } },
  { id: "beer", group: "bar", title: { ru: "Пиво", kk: "Сыра" } },
  { id: "wine", group: "bar", title: { ru: "Вино", kk: "Шарап" } },
  { id: "vodka", group: "bar", title: { ru: "Водка · 50 мл", kk: "Арақ · 50 мл" } },
  { id: "whiskey", group: "bar", title: { ru: "Виски · 50 мл", kk: "Виски · 50 мл" } },
  { id: "rum", group: "bar", title: { ru: "Ром · 50 мл", kk: "Ром · 50 мл" } },
  { id: "tequila", group: "bar", title: { ru: "Текила · 50 мл", kk: "Текила · 50 мл" } },
  { id: "gin", group: "bar", title: { ru: "Джин · 50 мл", kk: "Джин · 50 мл" } },
  { id: "cognac", group: "bar", title: { ru: "Коньяк · 50 мл", kk: "Коньяк · 50 мл" } },
  { id: "bar-snacks", group: "bar", title: { ru: "Закуски", kk: "Тіскебасарлар" } },
  { id: "hookah", group: "bar", title: { ru: "Кальян", kk: "Кальян" } },
];

// Helper: dish names printed only in Russian get the same string for both languages.
const same = (value: string): LocalizedText => ({ ru: value, kk: value });

export const menuItems: MenuItem[] = [
  // ── Холодные закуски ─────────────────────────────────────────────
  { id: "veg-plato", categoryId: "cold-appetizers", name: same("Овощное плато"), description: null, price: 2250, volume: null },
  { id: "fruit-plate", categoryId: "cold-appetizers", name: same("Фруктовая тарелка"), description: null, price: 3500, volume: null },
  { id: "marinade-assorted", categoryId: "cold-appetizers", name: same("Ассорти из маринадов"), description: null, price: 3300, volume: null },
  { id: "russian-plate", categoryId: "cold-appetizers", name: same("Русская тарелка"), description: null, price: 3555, volume: null },

  // ── Горячие закуски ──────────────────────────────────────────────
  { id: "fried-rice-chicken", categoryId: "hot-appetizers", name: same("Жареный рис с курицей"), description: null, price: 2990, volume: null },
  { id: "fried-rice-shrimp", categoryId: "hot-appetizers", name: same("Жареный рис с креветками"), description: null, price: 3480, volume: null },
  { id: "wings-sweet-sour", categoryId: "hot-appetizers", name: same("Крылья в кисло-сладком соусе"), description: null, price: 2500, volume: null },
  { id: "wings-bbq", categoryId: "hot-appetizers", name: same("Куриные крылышки BBQ"), description: null, price: 2990, volume: null },
  { id: "beer-shrimp", categoryId: "hot-appetizers", name: same("Пивные креветки"), description: null, price: 3500, volume: null },

  // ── Салаты ───────────────────────────────────────────────────────
  { id: "salad-eggplant-shrimp", categoryId: "salads", name: same("Салат из баклажана и креветок"), description: null, price: 3450, volume: null },
  { id: "crispy-eggplant", categoryId: "salads", name: same("Хрустящий баклажан"), description: null, price: 3190, volume: null },
  { id: "caesar-chicken", categoryId: "salads", name: same("Цезарь с куриной грудкой"), description: null, price: 3390, volume: null },
  { id: "caesar-shrimp", categoryId: "salads", name: same("Цезарь с креветками"), description: null, price: 3790, volume: null },
  { id: "warm-veal-salad", categoryId: "salads", name: same("Тёплый салат с телятиной"), description: null, price: 4190, volume: null },
  { id: "greek-salad", categoryId: "salads", name: same("Греческий салат"), description: null, price: 2300, volume: null },

  // ── Супы ─────────────────────────────────────────────────────────
  { id: "homemade-noodle-soup", categoryId: "soups", name: same("Суп-лапша по-домашнему"), description: null, price: 1300, volume: null },
  {
    id: "lentil-cream-soup",
    categoryId: "soups",
    name: { ru: "Чечевичный крем-суп", kk: "Жасымықтан жасалған крем-сорпа" },
    description: null,
    price: 1300,
    volume: null,
    popular: true,
  },
  { id: "chicken-ramen", categoryId: "soups", name: same("Рамен куриный"), description: null, price: 3300, volume: null },
  { id: "tom-yam-seafood", categoryId: "soups", name: same("Том ям с морепродуктами"), description: null, price: 4200, volume: null },

  // ── Паста ────────────────────────────────────────────────────────
  {
    id: "chicken-fettuccine",
    categoryId: "pasta",
    name: {
      ru: "Фетучини с курицей и грибами",
      kk: "Тауық еті мен саңырауқұлақ қосылған фетучини",
    },
    description: null,
    price: 2990,
    volume: null,
    popular: true,
  },
  { id: "bolognese", categoryId: "pasta", name: same("Болоньезе"), description: null, price: 2990, volume: null },
  { id: "carbonara-beef", categoryId: "pasta", name: same("Карбонара с копчёной говядиной"), description: null, price: 2990, volume: null },
  { id: "udon-chicken", categoryId: "pasta", name: same("Удон с курицей"), description: null, price: 2590, volume: null },
  { id: "udon-beef", categoryId: "pasta", name: same("Удон с говядиной"), description: null, price: 2990, volume: null },
  { id: "udon-shrimp", categoryId: "pasta", name: same("Удон с креветками"), description: null, price: 3200, volume: null },
  { id: "penne-shrimp", categoryId: "pasta", name: same("Пене с креветками"), description: null, price: 3500, volume: null },

  // ── Блюда из говядины ────────────────────────────────────────────
  { id: "veal-medallions", categoryId: "beef", name: same("Медальоны из телятины"), description: null, price: 4320, volume: null },
  { id: "beef-stroganoff", categoryId: "beef", name: same("Бефстроганов"), description: null, price: 3790, volume: null },
  { id: "veal-asian", categoryId: "beef", name: same("Телятина в азиатском стиле"), description: null, price: 3990, volume: null },
  { id: "fries-with-meat", categoryId: "beef", name: same("Фри с мясом"), description: null, price: 3600, volume: null },
  {
    id: "farmers-zharekha",
    categoryId: "beef",
    name: { ru: "Жарёха по-фермерски", kk: "Фермер стиліндегі жарёха" },
    description: null,
    price: 3300,
    volume: null,
    popular: true,
  },

  // ── Блюда из курицы ──────────────────────────────────────────────
  { id: "chicken-mushroom-cream", categoryId: "chicken", name: same("Куриное филе с грибами в сливочном соусе"), description: null, price: 3490, volume: null },
  { id: "chicken-curry", categoryId: "chicken", name: same("Курица в соусе карри"), description: null, price: 3290, volume: null },
  { id: "chicken-teriyaki", categoryId: "chicken", name: same("Курица терияки"), description: null, price: 3690, volume: null },
  { id: "grilled-chicken", categoryId: "chicken", name: same("Цыплёнок на гриле"), description: null, price: 4090, volume: null },

  // ── Пицца ────────────────────────────────────────────────────────
  {
    id: "pizza-pepperoni",
    categoryId: "pizza",
    name: same("Пицца пепперони"),
    description: same("Сыр моцарелла, колбаса пепперони, соус из томатов"),
    price: 2790,
    volume: null,
  },
  {
    id: "pizza-margherita",
    categoryId: "pizza",
    name: same("Пицца маргарита"),
    description: same("Сыр моцарелла, свежие томаты, соус из томатов"),
    price: 1845,
    volume: null,
  },
  {
    id: "pizza-bolognese",
    categoryId: "pizza",
    name: same("Пицца болоньезе"),
    description: same("Сыр моцарелла, свежие томаты, фарш говяжий, соус из томатов"),
    price: 2870,
    volume: null,
  },
  {
    id: "pizza-julienne",
    categoryId: "pizza",
    name: same("Пицца жульен"),
    description: same("Сыр моцарелла, грибы шампиньоны, лук, куриное филе, соус из томатов"),
    price: 2945,
    volume: null,
  },

  // ── Снэки ────────────────────────────────────────────────────────
  { id: "fries", categoryId: "snacks", name: same("Картофель фри"), description: null, price: 900, volume: null },
  { id: "onion-rings", categoryId: "snacks", name: same("Луковые кольца"), description: null, price: 1090, volume: null },
  { id: "potato-wedges", categoryId: "snacks", name: same("Картофельные дольки"), description: null, price: 990, volume: null },
  { id: "chicken-nuggets", categoryId: "snacks", name: same("Наггетсы куриные"), description: null, price: 1300, volume: null },
  { id: "garlic-croutons", categoryId: "snacks", name: same("Гренки чесночные"), description: null, price: 900, volume: null },
  { id: "cheese-sticks", categoryId: "snacks", name: same("Сырные палочки"), description: null, price: 1540, volume: null },

  // ── Фаст-фуд ─────────────────────────────────────────────────────
  { id: "burger-chicken-kentucky", categoryId: "fast-food", name: same("Бургер чикен кентукки"), description: null, price: 2855, volume: null },
  { id: "chicken-quesadilla", categoryId: "fast-food", name: same("Кесадилья с курицей"), description: null, price: 2840, volume: null },
  { id: "club-sandwich", categoryId: "fast-food", name: same("Клаб-сэндвич"), description: null, price: 2970, volume: null },
  {
    id: "al-capone-burger",
    categoryId: "fast-food",
    name: { ru: "Бургер «Аль Капоне»", kk: "«Аль Капоне» бургері" },
    description: null,
    price: 2855,
    volume: null,
    popular: true,
  },

  // ── Чайная карта ─────────────────────────────────────────────────
  { id: "tea-black-green", categoryId: "tea", name: same("Чёрный / зелёный"), description: null, price: 1600, volume: null },
  { id: "tea-tuesday", categoryId: "tea", name: same("Фирменный чай Tuesday"), description: null, price: 1900, volume: null },
  { id: "tea-tashkent", categoryId: "tea", name: same("Ташкентский"), description: null, price: 1700, volume: null },
  { id: "tea-moroccan", categoryId: "tea", name: same("Марокканский"), description: null, price: 1700, volume: null },
  { id: "tea-berry", categoryId: "tea", name: same("Ягодный"), description: null, price: 1700, volume: null },
  { id: "tea-seabuckthorn", categoryId: "tea", name: same("Облепиховый"), description: null, price: 1700, volume: null },
  { id: "tea-citrus", categoryId: "tea", name: same("Цитрусовый"), description: null, price: 1700, volume: null },
  { id: "tea-raspberry", categoryId: "tea", name: same("Малиновый"), description: null, price: 1700, volume: null },
  { id: "tea-pear-cinnamon", categoryId: "tea", name: same("Грушевый с корицей"), description: null, price: 1700, volume: null },
  { id: "tea-ginger", categoryId: "tea", name: same("Имбирный"), description: null, price: 1700, volume: null },
  { id: "tea-passion-pineapple", categoryId: "tea", name: same("Маракуйя-ананас"), description: null, price: 1700, volume: null },
  { id: "tea-turkish", categoryId: "tea", name: same("Турецкий чай"), description: null, price: 1900, volume: null },

  // ── К чаю ─────────────────────────────────────────────────────────
  { id: "eastern-set", categoryId: "tea-extras", name: same("Восточный сет"), description: null, price: 2500, volume: null },
  { id: "honey", categoryId: "tea-extras", name: same("Мёд"), description: null, price: 400, volume: null },
  { id: "lemon", categoryId: "tea-extras", name: same("Лимон"), description: null, price: 400, volume: null },
  { id: "chocolate-bar", categoryId: "tea-extras", name: same("Плитка шоколада"), description: null, price: 1300, volume: null },

  // ── Лимонады ──────────────────────────────────────────────────────
  { id: "lemonade-tuesday", categoryId: "lemonades", name: same("Фирменный лимонад Tuesday"), description: null, price: 1900, volume: null },
  { id: "lemonade-kiwi-apple", categoryId: "lemonades", name: same("Киви-яблоко"), description: null, price: 1900, volume: null },
  { id: "lemonade-mango-passion", categoryId: "lemonades", name: same("Манго-маракуйя"), description: null, price: 1900, volume: null },
  { id: "lemonade-raspberry-passion", categoryId: "lemonades", name: same("Малина-маракуйя"), description: null, price: 1900, volume: null },
  { id: "lemonade-citrus", categoryId: "lemonades", name: same("Цитрусовый"), description: null, price: 1900, volume: null },
  { id: "lemonade-orange-raspberry", categoryId: "lemonades", name: same("Апельсин-малина"), description: null, price: 1900, volume: null },
  { id: "lemonade-mojito", categoryId: "lemonades", name: same("Мохито"), description: null, price: 1900, volume: null },
  { id: "lemonade-strawberry-mojito", categoryId: "lemonades", name: same("Клубничный мохито"), description: null, price: 1900, volume: null },
  { id: "lemonade-pear", categoryId: "lemonades", name: same("Грушевый"), description: null, price: 1900, volume: null },
  { id: "lemonade-passion-pineapple", categoryId: "lemonades", name: same("Маракуйя-ананас"), description: null, price: 1900, volume: null },

  // ── Напитки ──────────────────────────────────────────────────────
  { id: "natural-juice", categoryId: "drinks", name: same("Натуральный сок"), description: null, price: 1600, volume: "1 л" },
  { id: "soft-drinks", categoryId: "drinks", name: same("Coca-Cola / Zero / Fanta / Sprite"), description: null, price: 800, volume: "0.5 л" },
  { id: "borjomi", categoryId: "drinks", name: same("Боржоми"), description: null, price: 1300, volume: "0.5 л" },
  { id: "red-bull", categoryId: "drinks", name: same("Red Bull"), description: null, price: 1500, volume: "0.25 л" },
  { id: "tassay-still", categoryId: "drinks", name: same("Tassay негазированный"), description: null, price: 900, volume: "0.5 л" },

  // ── Пиво ─────────────────────────────────────────────────────────
  { id: "beer-praga", categoryId: "beer", name: same("Прага (разливное)"), description: null, price: 1000, volume: "0.5 л" },
  { id: "beer-carlsberg", categoryId: "beer", name: same("Carlsberg"), description: null, price: 1200, volume: null },
  { id: "beer-corona", categoryId: "beer", name: same("Corona Extra"), description: null, price: 2500, volume: null },
  { id: "beer-holsten", categoryId: "beer", name: same("Holsten Pilsener"), description: null, price: 1200, volume: null },
  { id: "beer-1664-blanc", categoryId: "beer", name: same("1664 Blanc"), description: null, price: 1500, volume: null },
  { id: "beer-kozel-dark", categoryId: "beer", name: same("Тёмный Козел"), description: null, price: 1500, volume: null },

  // ── Вино ─────────────────────────────────────────────────────────
  {
    id: "wine-piccola-nostra-glass",
    categoryId: "wine",
    name: same("Piccola Nostra"),
    description: { ru: "Красное / белое · полусладкое", kk: "Қызыл / ақ · жартылай тәтті" },
    price: 1600,
    volume: null,
  },
  {
    id: "wine-piccola-nostra-bottle",
    categoryId: "wine",
    name: same("Piccola Nostra"),
    description: { ru: "Красное / белое · полусладкое", kk: "Қызыл / ақ · жартылай тәтті" },
    price: 6000,
    volume: null,
  },
  {
    id: "wine-charton-rouge",
    categoryId: "wine",
    name: same("Charton Rouge Moelleux"),
    description: { ru: "Красное · полусладкое", kk: "Қызыл · жартылай тәтті" },
    price: 8500,
    volume: null,
  },
  {
    id: "wine-charton-blanc",
    categoryId: "wine",
    name: same("Charton Blanc Moelleux"),
    description: { ru: "Белое · полусладкое", kk: "Ақ · жартылай тәтті" },
    price: 8500,
    volume: null,
  },
  {
    id: "wine-grill-master-torrontes",
    categoryId: "wine",
    name: same("The Grill Master Torrontes"),
    description: { ru: "Белое · сухое", kk: "Ақ · құрғақ" },
    price: 8500,
    volume: null,
  },
  {
    id: "wine-grill-master-malbec",
    categoryId: "wine",
    name: same("The Grill Master Malbec"),
    description: { ru: "Красное · сухое", kk: "Қызыл · құрғақ" },
    price: 6000,
    volume: null,
  },
  {
    id: "wine-martini-asti",
    categoryId: "wine",
    name: same("Martini Asti"),
    description: { ru: "Игристое", kk: "Газдалған (игристое)" },
    price: 13500,
    volume: null,
  },

  // ── Водка · 50 мл ────────────────────────────────────────────────
  { id: "vodka-nemiroff", categoryId: "vodka", name: same("Nemiroff Delicat"), description: null, price: 1200, volume: null },
  { id: "vodka-absolut", categoryId: "vodka", name: same("Absolut Blue"), description: null, price: 1400, volume: null },
  { id: "vodka-beluga", categoryId: "vodka", name: same("Beluga"), description: null, price: 2490, volume: null },

  // ── Виски · 50 мл ────────────────────────────────────────────────
  { id: "whiskey-ballantines", categoryId: "whiskey", name: same("Ballantine's Finest"), description: null, price: 1800, volume: null },
  { id: "whiskey-jameson", categoryId: "whiskey", name: same("Jameson"), description: null, price: 1900, volume: null },
  { id: "whiskey-william-lawsons", categoryId: "whiskey", name: same("William Lawson's"), description: null, price: 1500, volume: null },

  // ── Ром · 50 мл ──────────────────────────────────────────────────
  { id: "rum-tobacco-silver", categoryId: "rum", name: same("Tobacco Silver"), description: null, price: 1300, volume: null },
  { id: "rum-bacardi-negra", categoryId: "rum", name: same("Bacardi Carta Negra (Black)"), description: null, price: 1300, volume: null },
  { id: "rum-bacardi-blanca", categoryId: "rum", name: same("Bacardi Carta Blanca (Silver)"), description: null, price: 1300, volume: null },
  { id: "rum-bacardi-oro", categoryId: "rum", name: same("Bacardi Carta Oro (Gold)"), description: null, price: 1300, volume: null },

  // ── Текила · 50 мл ───────────────────────────────────────────────
  { id: "tequila-olmeca-blanco", categoryId: "tequila", name: same("Olmeca Blanco"), description: null, price: 1300, volume: null },

  // ── Джин · 50 мл ─────────────────────────────────────────────────
  { id: "gin-beefeater", categoryId: "gin", name: same("Beefeater"), description: null, price: 1300, volume: null },

  // ── Коньяк · 50 мл ───────────────────────────────────────────────
  { id: "cognac-kazakhstan", categoryId: "cognac", name: same("Казахстан 3*"), description: null, price: 800, volume: null },
  { id: "cognac-ararat", categoryId: "cognac", name: same("Арарат"), description: null, price: 1300, volume: null },

  // ── Закуски (к бару) ─────────────────────────────────────────────
  { id: "bar-beer-set", categoryId: "bar-snacks", name: same("Пивной сет"), description: null, price: 3990, volume: null },
  { id: "bar-peanuts", categoryId: "bar-snacks", name: same("Арахис"), description: null, price: 1100, volume: null },
  { id: "bar-pistachios", categoryId: "bar-snacks", name: same("Фисташки"), description: null, price: 1400, volume: null },
  { id: "bar-chechil", categoryId: "bar-snacks", name: same("Чечил"), description: null, price: 1100, volume: null },
  { id: "bar-fried-chechil", categoryId: "bar-snacks", name: same("Жареный чечил"), description: null, price: 1400, volume: null },
  { id: "bar-lays", categoryId: "bar-snacks", name: same("Lay's"), description: null, price: 1100, volume: null },

  // ── Кальян ───────────────────────────────────────────────────────
  { id: "hookah-classic", categoryId: "hookah", name: same("Классический"), description: null, price: 5000, volume: null },
  { id: "hookah-bowl-change", categoryId: "hookah", name: same("Замена чаши"), description: null, price: 3300, volume: null },
  { id: "hookah-grapefruit", categoryId: "hookah", name: same("На грейпфруте"), description: null, price: 6000, volume: null },
  { id: "hookah-art", categoryId: "hookah", name: same("ART кальян"), description: null, price: 8000, volume: null, priceFrom: true },
];

/** The four venue-verified popular dishes, in presentation order. */
export const popularOrder = [
  "al-capone-burger",
  "chicken-fettuccine",
  "lentil-cream-soup",
  "farmers-zharekha",
] as const;

export const popularItems: MenuItem[] = popularOrder
  .map((id) => menuItems.find((item) => item.id === id))
  .filter((item): item is MenuItem => Boolean(item));

export function itemsByCategory(categoryId: MenuCategoryId): MenuItem[] {
  return menuItems.filter((item) => item.categoryId === categoryId);
}

/** Categories that actually contain at least one item, in menu order. */
export const populatedCategories: MenuCategory[] = menuCategories.filter(
  (category) => menuItems.some((item) => item.categoryId === category.id),
);

/** Formats a KZT amount with thin-space thousands separators, e.g. 4500 → "4 500". */
export function formatPrice(price: number): string {
  return price.toLocaleString("ru-RU").replace(/ /g, " ");
}

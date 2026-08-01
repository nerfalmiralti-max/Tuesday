export type LocalizedText = {
  ru: string;
  kk: string;
};

export type MenuItem = {
  id: string;
  category: "popular";
  name: LocalizedText;
  description: { ru: string | null; kk: string | null };
  price: number | null;
  image: string | null;
  popular: boolean;
};

export const menuItems: MenuItem[] = [
  {
    id: "al-capone-burger",
    category: "popular",
    name: { ru: "Бургер «Аль Капоне»", kk: "«Аль Капоне» бургері" },
    description: { ru: null, kk: null },
    price: null,
    image: null,
    popular: true,
  },
  {
    id: "chicken-fettuccine",
    category: "popular",
    name: {
      ru: "Фетучини с курицей",
      kk: "Тауық еті қосылған фетучини",
    },
    description: { ru: null, kk: null },
    price: null,
    image: null,
    popular: true,
  },
  {
    id: "lentil-cream-soup",
    category: "popular",
    name: {
      ru: "Чечевичный крем-суп",
      kk: "Жасымықтан жасалған крем-сорпа",
    },
    description: { ru: null, kk: null },
    price: null,
    image: null,
    popular: true,
  },
  {
    id: "farmers-zharekha",
    category: "popular",
    name: {
      ru: "Жареха по-фермерски",
      kk: "Фермер стиліндегі жареха",
    },
    description: { ru: null, kk: null },
    price: null,
    image: null,
    popular: true,
  },
];


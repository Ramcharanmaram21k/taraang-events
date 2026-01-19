// Event data configuration for the admin dashboard

export const venues = [
  "A1 Convention",
  "Kaveri Grand",
  "Mourya Grand",
  "Mourya Inn",
  "P.A.G Convention Center",
  "Golden venue Function Hall Guntur Road ",
  "V Grand Vedika",
  "M H R Function Hall",
  "Dr. B.R. Ambedkar Function Hall",
  "SVS Functionalhall A/C",
  "Padmavathi Function Hall",
  "Ramanuja kutam",
  "Sai ITA Convention",
  "Mahalakshmi Function Hall",
  "SGVS Convention",
  "Sri Balaji Tirupathirao Function Hall",
  "VISHNUPRIYA CONVENTION CENTRE",
  "S convention",
  "Arya Vysya Kalyana Mandapam"

];

export const eventTypes = [
  "Wedding",
  "Engagement",
  "Birthday Party",
  "Corporate Event",
  "Anniversary",
  "Baby Shower",
  "Reception",
  "Haldi & Mehendi",
  "Other",
];

// Veg Menu Items
export const vegSweets = [
  "Gulab Jamun",
  "Rasgulla",
  "Jalebi",
  "Kaju Katli",
  "Bread Halwa",
  "Motichoor Laddu",
  "Mysore Pak",
  "Badam Burfi",
  "Double Ka Meetha",
  "Kheer",
];

export const vegHotItems = [
  "Samosa",
  "Cutlet",
  "Mirchi Bajji",
  
  "Pakodi",
  "Onion Bhaji",
  "Aloo Tikki",
  "Paneer Pakora",
  "Spring Roll",
  "Bread Pakora",
];

export const vegPappu = [
  "Dosakay Pappu",
  "Akukura Pappu",
  "Tomato Pappu",
  "Palakura Pappu",
  "Mixed Dal",
];

export const vegCurry = [
  "Tomato",
  "Munakay ",
  "Guthu Vankay ",
  "vakay tomato",
  "Paneer Butter Masala",
  "Aloo Gobi",
  "Mixed Veg",
  "Malai Kofta",
  "Palak Paneer",
  "Kadai Paneer",
  "Mushroom Masala",
  "Bhindi Masala",
  "Bagara Baingan",
];

export const vegFry = [
  "Aloo Fry",
  "Cabbage Fry",
  "Beans Fry",
  "Bhindi Fry",
  "Capsicum Fry",
  "Karela Fry",
  "Potato Chips",
  "Brinjal Fry",
];

export const vegStaples = [
  { id: "sambar", label: "Sambar" },
  { id: "rasam", label: "Rasam" },
  { id: "curd", label: "Curd" },
  { id: "biriyani", label: "Biriyani" },
  { id: "killi", label: "Killi" },
  { id: "ghee", label: "Ghee" },
];

export const vegPickles = [
  "Mango Avakaya",
  "Lemon",
  "Tomato",
  "Gongura",
  "Ginger",
  "Mixed Veg",
];

export const iceCreamFlavors = [
  "Vanilla",
  "Chocolate",
  "Strawberry",
  "Butterscotch",
  "Mango",
  "Kesar Pista",
  "Black Currant",
  "Mix Fruit",
];

// Non-Veg Menu Items
export const nonVegStarters = [
  "Chicken 65",
  "Chicken Lollipop",
  "Chicken Manchurian",
  "Fish Fry",
  "Prawns Fry",
  "Mutton Fry",
  "Pepper Chicken",
  "Crispy Chicken",
  "Apollo Fish",
];

export const nonVegGravy = [
  "Chicken Curry",
  "Mutton Curry",
  "Butter Chicken",
  "Chicken Masala",
  "Mutton Roganjosh",
  "Fish Curry",
  "Prawns Curry",
  "Hyderabadi Chicken",
  "Kadai Chicken",
];

export const nonVegFry = [
  "Chicken Fry",
  "Mutton Fry",
  "Fish Fry",
  "Prawns Fry",
  "Liver Fry",
  "Gongura Chicken",
  "Chilli Chicken",
];

export const nonVegBiryani = [
  "Chicken Dum Biryani",
  "Mutton Dum Biryani",
  "Egg Biryani",
  "Prawns Biryani",
  "Special Mixed Biryani",
];

// Form state types
export interface VegMenuState {
  sweet: string[];  // Free-text array (up to 10 items)
  hotItem: string[];  // Free-text array (up to 10 items)
  pappu: string[];  // Free-text array (up to 10 items)
  curry: string[];  // Free-text array (up to 10 items)
  fry: string[];  // Free-text array (up to 10 items)
  pickle: string[];  // Free-text array (up to 10 items)
  staples: Record<string, boolean>;
  iceCream: boolean;
  iceCreamFlavor: string[];
}

export interface NonVegMenuState {
  starter: string[];  // Free-text array (up to 10 items)
  gravy: string[];  // Free-text array (up to 10 items)
  fry: string[];  // Free-text array (up to 10 items)
  biryani: string[];  // Free-text array (up to 10 items)
}

export interface EventFormState {
  venue: string;
  eventType: string;
  decorationCharges: number;
  entryCharges: number;
  foodBill: number;
  functionHallCharges: number;
  tentHouseCharges: number;
  photographyCharges: number;
  lightingCharges: number;
  flexiBannerCharges: number;
  vegMenu: VegMenuState;
  nonVegMenu: NonVegMenuState;
  customerName: string;
  customerPhone: string;
  eventDate: string;
  guestCount: number;
}

export const initialFormState: EventFormState = {
  venue: "",
  eventType: "",
  decorationCharges: 0,
  entryCharges: 0,
  foodBill: 0,
  functionHallCharges: 0,
  tentHouseCharges: 0,
  photographyCharges: 0,
  lightingCharges: 0,
  flexiBannerCharges: 0,
  customerName: "",
  customerPhone: "",
  eventDate: "",
  guestCount: 0,
  vegMenu: {
    sweet: [],  // Free-text array
    hotItem: [],  // Free-text array
    pappu: [],  // Free-text array
    curry: [],  // Free-text array
    fry: [],  // Free-text array
    pickle: [],  // Free-text array
    staples: {
      sambar: false,
      rasam: false,
      curd: false,
      biriyani: false,
      killi: false,
      ghee: false,
    },
    iceCream: false,
    iceCreamFlavor: [],  // Free-text array
  },
  nonVegMenu: {
    starter: [],  // Free-text array
    gravy: [],  // Free-text array
    fry: [],  // Free-text array
    biryani: [],  // Free-text array
  },
};

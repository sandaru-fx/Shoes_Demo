const SKARA_PRODUCTS = [
  {
    name: "Aurum Court Reserve",
    brand: "Golden Goose",
    audience: "men",
    category: "Sneakers",
    price: 1280,
    badge: "Reserve",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Milano Patent Oxford",
    brand: "Santoni",
    audience: "men",
    category: "Dress Shoes",
    price: 1890,
    badge: "Handmade",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Velocity Carbon Runner",
    brand: "NikeLab",
    audience: "men",
    category: "Sport",
    price: 760,
    badge: "Carbon",
    image: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Noir Suede Chelsea",
    brand: "Tom Ford",
    audience: "men",
    category: "Boots",
    price: 2140,
    badge: "Atelier",
    image: "https://images.unsplash.com/photo-1605812860427-4024433a70fd?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Opal Slingback Heel",
    brand: "Jimmy Choo",
    audience: "women",
    category: "High Heels",
    price: 1490,
    badge: "Crystal",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Riviera Silk Pump",
    brand: "Manolo Blahnik",
    audience: "women",
    category: "High Heels",
    price: 1710,
    badge: "Limited",
    image: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Maison Pearl Mule",
    brand: "Gucci",
    audience: "women",
    category: "Sandals",
    price: 1320,
    badge: "Pearl",
    image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Luna Tennis Lux",
    brand: "Prada",
    audience: "women",
    category: "Sneakers",
    price: 980,
    badge: "New",
    image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Prep Crest Loafer",
    brand: "Burberry",
    audience: "kids",
    category: "School",
    price: 390,
    badge: "Junior",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Mini Sprint Trainer",
    brand: "Adidas",
    audience: "kids",
    category: "Sport",
    price: 280,
    badge: "Light",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Campus Velcro Classic",
    brand: "New Balance",
    audience: "kids",
    category: "School",
    price: 240,
    badge: "Soft",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Snowcrest Mini Boot",
    brand: "Moncler",
    audience: "kids",
    category: "Boots",
    price: 620,
    badge: "Alpine",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=88"
  },
  // Men's additional 8 items
  {
    name: "Firenze Tassel Loafer",
    brand: "Gucci",
    audience: "men",
    category: "Loafers",
    price: 1100,
    badge: "Classic",
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Alessandro Leather Boot",
    brand: "Berluti",
    audience: "men",
    category: "Boots",
    price: 2450,
    badge: "Patina",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Qasa High Top",
    brand: "Adidas Y-3",
    audience: "men",
    category: "Sneakers",
    price: 450,
    badge: "Avant-Garde",
    image: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Greggo Formal Oxford",
    brand: "Christian Louboutin",
    audience: "men",
    category: "Dress Shoes",
    price: 1190,
    badge: "Red Sole",
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "ZoomX Vanguard",
    brand: "NikeLab",
    audience: "men",
    category: "Sport",
    price: 320,
    badge: "Performance",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Elkan Suede Loafer",
    brand: "Tom Ford",
    audience: "men",
    category: "Loafers",
    price: 980,
    badge: "Suede",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Super-Star Classic",
    brand: "Golden Goose",
    audience: "men",
    category: "Sneakers",
    price: 545,
    badge: "Vintage",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Carter Leather Boot",
    brand: "Santoni",
    audience: "men",
    category: "Boots",
    price: 1350,
    badge: "Italian",
    image: "https://images.unsplash.com/photo-1605812860427-4024433a70fd?auto=format&fit=crop&w=1200&q=88"
  },
  // Women's additional 8 items
  {
    name: "Kate 100mm Pump",
    brand: "Christian Louboutin",
    audience: "women",
    category: "High Heels",
    price: 895,
    badge: "Icon",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Monolith Leather Boot",
    brand: "Prada",
    audience: "women",
    category: "Boots",
    price: 1450,
    badge: "Chunky",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Ace Embroidered Sneaker",
    brand: "Gucci",
    audience: "women",
    category: "Sneakers",
    price: 790,
    badge: "Signature",
    image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Bing 100 Mule",
    brand: "Jimmy Choo",
    audience: "women",
    category: "High Heels",
    price: 1095,
    badge: "Crystal",
    image: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Tara Suede Loafer",
    brand: "Tom Ford",
    audience: "women",
    category: "Loafers",
    price: 890,
    badge: "Comfort",
    image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Hangisi Satin Pump",
    brand: "Manolo Blahnik",
    audience: "women",
    category: "High Heels",
    price: 1125,
    badge: "Bridal",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Padlock Sandal",
    brand: "Tom Ford",
    audience: "women",
    category: "Sandals",
    price: 1250,
    badge: "Gold",
    image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Air Max Dia",
    brand: "NikeLab",
    audience: "women",
    category: "Sneakers",
    price: 140,
    badge: "Everyday",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=88"
  },
  // Kids' additional 8 items
  {
    name: "Toddler Ace Sneaker",
    brand: "Gucci",
    audience: "kids",
    category: "Sneakers",
    price: 450,
    badge: "Mini",
    image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Check Cotton Sneaker",
    brand: "Burberry",
    audience: "kids",
    category: "Sneakers",
    price: 320,
    badge: "Check",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Air Force 1 Junior",
    brand: "NikeLab",
    audience: "kids",
    category: "Sport",
    price: 90,
    badge: "Classic",
    image: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Patty Snow Boot",
    brand: "Moncler",
    audience: "kids",
    category: "Boots",
    price: 480,
    badge: "Winter",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Nylon Sandal",
    brand: "Prada",
    audience: "kids",
    category: "Sandals",
    price: 390,
    badge: "Summer",
    image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Super-Star Junior",
    brand: "Golden Goose",
    audience: "kids",
    category: "Sneakers",
    price: 350,
    badge: "Play",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Leather School Loafer",
    brand: "Santoni",
    audience: "kids",
    category: "School",
    price: 290,
    badge: "Smart",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=88"
  },
  {
    name: "Ultraboost Kids",
    brand: "Adidas Y-3",
    audience: "kids",
    category: "Sport",
    price: 160,
    badge: "Active",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=88"
  }
];

const SKARA_BRANDS = [
  "Christian Louboutin",
  "Gucci",
  "Prada",
  "Jimmy Choo",
  "Manolo Blahnik",
  "Tom Ford",
  "Santoni",
  "Berluti",
  "Golden Goose",
  "NikeLab",
  "Adidas Y-3",
  "New Balance",
  "Burberry",
  "Moncler"
];

const SKARA_CATEGORIES = [
  "Sneakers",
  "Dress Shoes",
  "High Heels",
  "School",
  "Sport",
  "Boots",
  "Sandals",
  "Loafers"
];

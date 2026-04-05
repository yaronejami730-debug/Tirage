export const CATEGORIES = [
  { val: "smartphone",     label: "Smartphone",        icon: "📱", color: "#6C5CE7" },
  { val: "tech",           label: "Tech & Informatique",icon: "💻", color: "#0984E3" },
  { val: "gaming",         label: "Gaming",            icon: "🎮", color: "#00B894" },
  { val: "audio",          label: "Audio & Son",       icon: "🎧", color: "#6C5CE7" },
  { val: "photo",          label: "Photo & Vidéo",     icon: "📷", color: "#2D3436" },
  { val: "tv",             label: "TV & Écrans",       icon: "📺", color: "#0984E3" },
  { val: "maison",         label: "Maison",            icon: "🏠", color: "#FDCB6E" },
  { val: "electromenager", label: "Électroménager",    icon: "🍳", color: "#E17055" },
  { val: "mode",           label: "Mode",              icon: "👗", color: "#FD79A8" },
  { val: "bijoux",         label: "Bijoux",            icon: "💍", color: "#e0b84e" },
  { val: "montres",        label: "Montres",           icon: "⌚", color: "#636E72" },
  { val: "sacs",           label: "Sacs & Maroquinerie",icon: "👜", color: "#a29060" },
  { val: "chaussures",     label: "Chaussures",        icon: "👟", color: "#00B894" },
  { val: "parfum",         label: "Parfum & Beauté",   icon: "🌸", color: "#FD79A8" },
  { val: "sport",          label: "Sport & Fitness",   icon: "🏋️", color: "#00cec9" },
  { val: "voiture",        label: "Automobile",        icon: "🚗", color: "#E17055" },
  { val: "moto",           label: "Moto",              icon: "🏍️", color: "#d63031" },
  { val: "voyage",         label: "Voyage",            icon: "✈️", color: "#0984E3" },
  { val: "gastronomie",    label: "Gastronomie",       icon: "🍾", color: "#e17055" },
  { val: "art",            label: "Art & Collection",  icon: "🎨", color: "#A29BFE" },
  { val: "luxe",           label: "Luxe",              icon: "💎", color: "#c0964e" },
  { val: "enfants",        label: "Enfants & Jouets",  icon: "🧸", color: "#fd79a8" },
  { val: "culture",        label: "Culture & Livres",  icon: "📚", color: "#6C5CE7" },
  { val: "crypto",         label: "Crypto & Finance",  icon: "🪙", color: "#f9ca24" },
  { val: "autre",          label: "Autre",             icon: "🎁", color: "#A29BFE" },
] as const;

export type CategorieVal = typeof CATEGORIES[number]["val"];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map(c => [c.val, c])
) as Record<CategorieVal, typeof CATEGORIES[number]>;

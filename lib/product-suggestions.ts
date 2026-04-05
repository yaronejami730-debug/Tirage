import { CategorieVal } from './categories';

export interface ProductSuggestion {
  nom: string;
  categorie: CategorieVal;
  valeur?: number;
}

export const PRODUCT_SUGGESTIONS: ProductSuggestion[] = [
  // ── iPhone ──
  { nom: "iPhone 16 Pro Max 256 Go", categorie: "smartphone", valeur: 1479 },
  { nom: "iPhone 16 Pro Max 512 Go", categorie: "smartphone", valeur: 1729 },
  { nom: "iPhone 16 Pro 256 Go", categorie: "smartphone", valeur: 1229 },
  { nom: "iPhone 16 Pro 512 Go", categorie: "smartphone", valeur: 1479 },
  { nom: "iPhone 16 Plus 256 Go", categorie: "smartphone", valeur: 1129 },
  { nom: "iPhone 16 256 Go", categorie: "smartphone", valeur: 979 },
  { nom: "iPhone 15 Pro Max 256 Go", categorie: "smartphone", valeur: 1229 },
  { nom: "iPhone 15 Pro 256 Go", categorie: "smartphone", valeur: 1229 },
  { nom: "iPhone 15 256 Go", categorie: "smartphone", valeur: 879 },
  { nom: "iPhone 14 Pro Max 256 Go", categorie: "smartphone", valeur: 1099 },
  { nom: "iPhone 14 256 Go", categorie: "smartphone", valeur: 799 },
  { nom: "iPhone 13 128 Go", categorie: "smartphone", valeur: 599 },
  { nom: "iPhone SE (3e génération) 128 Go", categorie: "smartphone", valeur: 529 },

  // ── Samsung ──
  { nom: "Samsung Galaxy S25 Ultra 256 Go", categorie: "smartphone", valeur: 1469 },
  { nom: "Samsung Galaxy S25+ 256 Go", categorie: "smartphone", valeur: 1219 },
  { nom: "Samsung Galaxy S25 256 Go", categorie: "smartphone", valeur: 999 },
  { nom: "Samsung Galaxy Z Fold 6 256 Go", categorie: "smartphone", valeur: 1899 },
  { nom: "Samsung Galaxy Z Flip 6 256 Go", categorie: "smartphone", valeur: 1199 },
  { nom: "Samsung Galaxy S24 Ultra 256 Go", categorie: "smartphone", valeur: 1299 },
  { nom: "Samsung Galaxy A55 5G 128 Go", categorie: "smartphone", valeur: 449 },

  // ── iPad / tablettes ──
  { nom: "iPad Pro M4 13 pouces 256 Go Wi-Fi", categorie: "tech", valeur: 1599 },
  { nom: "iPad Pro M4 11 pouces 256 Go Wi-Fi", categorie: "tech", valeur: 1219 },
  { nom: "iPad Air M2 11 pouces 256 Go", categorie: "tech", valeur: 899 },
  { nom: "iPad mini 7 256 Go", categorie: "tech", valeur: 699 },
  { nom: "iPad 10e génération 64 Go", categorie: "tech", valeur: 599 },
  { nom: "Samsung Galaxy Tab S10 Ultra 256 Go", categorie: "tech", valeur: 1299 },
  { nom: "Samsung Galaxy Tab S10+ 256 Go", categorie: "tech", valeur: 999 },

  // ── Mac ──
  { nom: "MacBook Pro M4 Pro 14 pouces 512 Go", categorie: "tech", valeur: 2499 },
  { nom: "MacBook Pro M4 14 pouces 512 Go", categorie: "tech", valeur: 1999 },
  { nom: "MacBook Air M3 13 pouces 256 Go", categorie: "tech", valeur: 1299 },
  { nom: "MacBook Air M3 15 pouces 256 Go", categorie: "tech", valeur: 1599 },
  { nom: "iMac M4 24 pouces 256 Go", categorie: "tech", valeur: 1599 },
  { nom: "Mac Mini M4 512 Go", categorie: "tech", valeur: 899 },

  // ── PC & Gaming PC ──
  { nom: "PC Gamer ASUS ROG RTX 4080", categorie: "gaming", valeur: 2999 },
  { nom: "PC Gamer MSI RTX 4070 Ti", categorie: "gaming", valeur: 2299 },
  { nom: "Laptop ASUS ROG Zephyrus G16", categorie: "gaming", valeur: 2499 },
  { nom: "Laptop Razer Blade 16 RTX 4080", categorie: "gaming", valeur: 3299 },
  { nom: "Microsoft Surface Pro 11 256 Go", categorie: "tech", valeur: 1599 },
  { nom: "Dell XPS 15 OLED Intel Core Ultra", categorie: "tech", valeur: 2499 },

  // ── Consoles & Gaming ──
  { nom: "PlayStation 5 Pro", categorie: "gaming", valeur: 799 },
  { nom: "PlayStation 5 Slim 1 To", categorie: "gaming", valeur: 499 },
  { nom: "Xbox Series X 1 To", categorie: "gaming", valeur: 549 },
  { nom: "Xbox Series S 1 To", categorie: "gaming", valeur: 349 },
  { nom: "Nintendo Switch OLED", categorie: "gaming", valeur: 349 },
  { nom: "Nintendo Switch 2", categorie: "gaming", valeur: 449 },
  { nom: "Steam Deck OLED 1 To", categorie: "gaming", valeur: 679 },

  // ── TV & Écrans ──
  { nom: "TV Samsung OLED 65 pouces 4K", categorie: "tv", valeur: 2499 },
  { nom: "TV LG OLED evo 65 pouces 4K", categorie: "tv", valeur: 2199 },
  { nom: "TV Sony Bravia XR 65 pouces OLED", categorie: "tv", valeur: 2299 },
  { nom: "TV Samsung QLED 55 pouces 4K", categorie: "tv", valeur: 1299 },
  { nom: "TV LG NanoCell 55 pouces 4K", categorie: "tv", valeur: 799 },
  { nom: "Écran Gaming ASUS ROG 27 pouces 240 Hz", categorie: "tv", valeur: 699 },
  { nom: "Écran Samsung Odyssey G9 49 pouces", categorie: "tv", valeur: 1499 },

  // ── Audio ──
  { nom: "AirPods Pro 2e génération", categorie: "audio", valeur: 279 },
  { nom: "AirPods Max USB-C", categorie: "audio", valeur: 629 },
  { nom: "Sony WH-1000XM5", categorie: "audio", valeur: 379 },
  { nom: "Sony WH-1000XM4", categorie: "audio", valeur: 279 },
  { nom: "Bose QuietComfort Ultra", categorie: "audio", valeur: 449 },
  { nom: "Bose QuietComfort 45", categorie: "audio", valeur: 329 },
  { nom: "Samsung Galaxy Buds3 Pro", categorie: "audio", valeur: 259 },
  { nom: "Sonos Arc (barre de son)", categorie: "audio", valeur: 999 },
  { nom: "Sonos Era 300", categorie: "audio", valeur: 449 },
  { nom: "Marshall Woburn III", categorie: "audio", valeur: 499 },
  { nom: "Bang & Olufsen Beoplay H95", categorie: "audio", valeur: 799 },

  // ── Photo & Vidéo ──
  { nom: "Sony Alpha A7 IV + objectif 28-70mm", categorie: "photo", valeur: 2799 },
  { nom: "Sony Alpha A7C II", categorie: "photo", valeur: 2199 },
  { nom: "Canon EOS R6 Mark II + 24-105mm", categorie: "photo", valeur: 3299 },
  { nom: "Canon EOS R50 + 18-45mm", categorie: "photo", valeur: 849 },
  { nom: "Nikon Z8 boîtier nu", categorie: "photo", valeur: 3999 },
  { nom: "DJI Mini 4 Pro (drone)", categorie: "photo", valeur: 759 },
  { nom: "DJI Osmo Pocket 3", categorie: "photo", valeur: 499 },
  { nom: "GoPro Hero 13 Black", categorie: "photo", valeur: 449 },

  // ── Montres ──
  { nom: "Apple Watch Ultra 2", categorie: "montres", valeur: 999 },
  { nom: "Apple Watch Series 10 45mm", categorie: "montres", valeur: 499 },
  { nom: "Samsung Galaxy Watch Ultra", categorie: "montres", valeur: 699 },
  { nom: "Garmin Fenix 8 Sapphire Solar", categorie: "montres", valeur: 1099 },
  { nom: "Rolex Submariner Date", categorie: "montres", valeur: 10500 },
  { nom: "Rolex Daytona Acier", categorie: "montres", valeur: 15000 },
  { nom: "Omega Seamaster Planet Ocean", categorie: "montres", valeur: 5900 },
  { nom: "TAG Heuer Carrera Chronographe", categorie: "montres", valeur: 4500 },
  { nom: "Cartier Santos Acier", categorie: "montres", valeur: 7200 },
  { nom: "Breitling Navitimer B01", categorie: "montres", valeur: 8500 },

  // ── Bijoux ──
  { nom: "Collier diamant or blanc 18 carats", categorie: "bijoux", valeur: 2500 },
  { nom: "Bague solitaire diamant 0.5 ct", categorie: "bijoux", valeur: 3500 },
  { nom: "Bracelet Van Cleef & Arpels Alhambra", categorie: "bijoux", valeur: 4500 },
  { nom: "Boucles d'oreilles diamant or jaune", categorie: "bijoux", valeur: 1800 },
  { nom: "Chevalière or blanc 18 carats", categorie: "bijoux", valeur: 1200 },

  // ── Sacs ──
  { nom: "Chanel 2.55 Classique Medium", categorie: "sacs", valeur: 9200 },
  { nom: "Louis Vuitton Neverfull MM Monogram", categorie: "sacs", valeur: 1800 },
  { nom: "Hermès Kelly 28 cuir Togo", categorie: "sacs", valeur: 9500 },
  { nom: "Gucci GG Marmont Matelassé Medium", categorie: "sacs", valeur: 2200 },
  { nom: "Dior Lady Dior Medium", categorie: "sacs", valeur: 5500 },
  { nom: "Balenciaga City Bag", categorie: "sacs", valeur: 1650 },
  { nom: "Saint Laurent Loulou Puffer", categorie: "sacs", valeur: 1750 },

  // ── Chaussures ──
  { nom: "Nike Air Jordan 1 Retro High OG", categorie: "chaussures", valeur: 180 },
  { nom: "Nike Air Force 1 '07", categorie: "chaussures", valeur: 120 },
  { nom: "Adidas Yeezy Boost 350 V2", categorie: "chaussures", valeur: 350 },
  { nom: "New Balance 990v6 Made in USA", categorie: "chaussures", valeur: 230 },
  { nom: "Golden Goose Superstar", categorie: "chaussures", valeur: 550 },
  { nom: "Balenciaga Triple S", categorie: "chaussures", valeur: 895 },

  // ── Mode ──
  { nom: "Blouson en cuir agneau Acne Studios", categorie: "mode", valeur: 1200 },
  { nom: "Manteau Moncler Himalaya doudoune", categorie: "mode", valeur: 2500 },
  { nom: "Veste Canada Goose Expedition Parka", categorie: "mode", valeur: 1195 },
  { nom: "Costume sur mesure Hugo Boss", categorie: "mode", valeur: 1200 },
  { nom: "Montre + Portefeuille Longchamp coffret", categorie: "mode", valeur: 350 },

  // ── Parfum ──
  { nom: "Coffret parfum Chanel N°5 L'Eau", categorie: "parfum", valeur: 350 },
  { nom: "Dior Sauvage Elixir 60ml", categorie: "parfum", valeur: 180 },
  { nom: "Tom Ford Black Orchid 100ml", categorie: "parfum", valeur: 290 },
  { nom: "Creed Aventus 100ml", categorie: "parfum", valeur: 520 },
  { nom: "Yves Saint Laurent Libre 90ml", categorie: "parfum", valeur: 145 },

  // ── Sport & Fitness ──
  { nom: "Vélo de route Specialized Tarmac SL8", categorie: "sport", valeur: 4500 },
  { nom: "Vélo électrique Trek Rail 9.8 XT", categorie: "sport", valeur: 6500 },
  { nom: "Tapis de course NordicTrack Commercial 1750", categorie: "sport", valeur: 1999 },
  { nom: "Rameur Concept2 RowErg", categorie: "sport", valeur: 1099 },
  { nom: "Ski Rossignol Hero Athlete + fixations", categorie: "sport", valeur: 999 },
  { nom: "Planche de surf Surftech 7'2", categorie: "sport", valeur: 799 },
  { nom: "Coffret golf Callaway Strata 12 pièces", categorie: "sport", valeur: 499 },

  // ── Voitures ──
  { nom: "Porsche 911 Carrera 4S Coupé", categorie: "voiture", valeur: 145000 },
  { nom: "Porsche Cayenne GTS", categorie: "voiture", valeur: 135000 },
  { nom: "BMW M3 Compétition", categorie: "voiture", valeur: 98000 },
  { nom: "BMW X5 xDrive45e hybride", categorie: "voiture", valeur: 89000 },
  { nom: "Mercedes-Benz Classe G 450 d", categorie: "voiture", valeur: 165000 },
  { nom: "Mercedes-Benz AMG GT 63 S E Performance", categorie: "voiture", valeur: 220000 },
  { nom: "Tesla Model S Plaid", categorie: "voiture", valeur: 119990 },
  { nom: "Tesla Model 3 Performance", categorie: "voiture", valeur: 58990 },
  { nom: "Audi RS6 Avant", categorie: "voiture", valeur: 155000 },
  { nom: "Ferrari Roma Spider", categorie: "voiture", valeur: 285000 },
  { nom: "Lamborghini Urus Performante", categorie: "voiture", valeur: 290000 },
  { nom: "Range Rover Autobiography LWB P530", categorie: "voiture", valeur: 230000 },

  // ── Moto ──
  { nom: "Harley-Davidson Sportster S 2024", categorie: "moto", valeur: 17990 },
  { nom: "Ducati Panigale V4 S", categorie: "moto", valeur: 36000 },
  { nom: "BMW R 1300 GS Adventure", categorie: "moto", valeur: 24000 },
  { nom: "Honda CB1000R Black Edition", categorie: "moto", valeur: 14500 },
  { nom: "Kawasaki Ninja ZX-10R", categorie: "moto", valeur: 18500 },

  // ── Voyage ──
  { nom: "Séjour 2 semaines Maldives (2 personnes)", categorie: "voyage", valeur: 8000 },
  { nom: "Week-end à Dubaï tout compris (2 pers.)", categorie: "voyage", valeur: 3500 },
  { nom: "Croisière Méditerranée 7 jours (2 pers.)", categorie: "voyage", valeur: 4500 },
  { nom: "Séjour ski Courchevel 5 jours (2 pers.)", categorie: "voyage", valeur: 5000 },
  { nom: "Road trip USA 3 semaines (2 pers.)", categorie: "voyage", valeur: 6000 },
  { nom: "Séjour Bali 10 jours luxe (2 pers.)", categorie: "voyage", valeur: 5500 },

  // ── Gastronomie ──
  { nom: "Coffret Cave à vins Eurocave + 50 bouteilles", categorie: "gastronomie", valeur: 2500 },
  { nom: "Dîner gastronomique étoilé (2 pers.)", categorie: "gastronomie", valeur: 500 },
  { nom: "Coffret champagnes Dom Pérignon × 6", categorie: "gastronomie", valeur: 900 },
  { nom: "Machine à café De'Longhi La Specialista", categorie: "gastronomie", valeur: 999 },
  { nom: "Robot cuiseur Thermomix TM7", categorie: "gastronomie", valeur: 1499 },

  // ── Maison ──
  { nom: "Robot aspirateur iRobot Roomba j9+", categorie: "maison", valeur: 1199 },
  { nom: "Aspirateur Dyson V15 Detect Absolute", categorie: "maison", valeur: 749 },
  { nom: "Purificateur d'air Dyson Purifier Hot+Cool", categorie: "maison", valeur: 699 },
  { nom: "Machine à laver Samsung EcoBubble 10kg", categorie: "maison", valeur: 899 },
  { nom: "Réfrigérateur américain Samsung Family Hub", categorie: "maison", valeur: 2499 },

  // ── Électroménager ──
  { nom: "KitchenAid Artisan robot pâtissier 4.8L", categorie: "electromenager", valeur: 699 },
  { nom: "Grille-pain Dualit 2 fentes Luxe", categorie: "electromenager", valeur: 299 },
  { nom: "Air fryer Philips Airfryer XXL 7.2L", categorie: "electromenager", valeur: 249 },
  { nom: "Blender Vitamix 5200", categorie: "electromenager", valeur: 649 },

  // ── Art & Collection ──
  { nom: "Œuvre d'art originale (peinture 80×100cm)", categorie: "art", valeur: 2000 },
  { nom: "Sculpture contemporaine signée", categorie: "art", valeur: 3500 },
  { nom: "Carte Pokémon Charizard PSA 10", categorie: "art", valeur: 5000 },
  { nom: "Maillot football signé (édition limitée)", categorie: "art", valeur: 800 },

  // ── Luxe ──
  { nom: "Coffret Moët & Chandon Impérial × 3", categorie: "luxe", valeur: 450 },
  { nom: "Stylo Montblanc Meisterstück Platine", categorie: "luxe", valeur: 850 },
  { nom: "Valise Rimowa Original Cabin 36L", categorie: "luxe", valeur: 800 },
  { nom: "Coffret Louis Vuitton voyage", categorie: "luxe", valeur: 1500 },

  // ── Crypto & Finance ──
  { nom: "Bitcoin 0.1 BTC", categorie: "crypto", valeur: 9000 },
  { nom: "Ethereum 1 ETH", categorie: "crypto", valeur: 3200 },
  { nom: "Ledger Nano X coffret crypto", categorie: "crypto", valeur: 149 },
  { nom: "Carte cadeau Amazon 500€", categorie: "crypto", valeur: 500 },

  // ── Enfants ──
  { nom: "LEGO Technic Bugatti Bolide 42151", categorie: "enfants", valeur: 449 },
  { nom: "LEGO Star Wars Millennium Falcon UCS", categorie: "enfants", valeur: 849 },
  { nom: "Vélo électrique enfant Woom 5e", categorie: "enfants", valeur: 699 },
  { nom: "Trottinette électrique Xiaomi Mi Pro 2", categorie: "enfants", valeur: 449 },
];

export function searchProducts(query: string, limit = 8): ProductSuggestion[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return PRODUCT_SUGGESTIONS
    .filter(p => p.nom.toLowerCase().includes(q))
    .slice(0, limit);
}

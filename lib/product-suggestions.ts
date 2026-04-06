import { CategorieVal } from './categories';

export interface ProductSuggestion {
  nom: string;
  categorie: CategorieVal;
  valeur?: number;
  description?: string;
}

export const PRODUCT_SUGGESTIONS: ProductSuggestion[] = [
  // ── iPhone ──
  { nom: "iPhone 16 Pro Max 256 Go", categorie: "smartphone", valeur: 1479, description: "Apple iPhone 16 Pro Max — 256 Go. Puce A18 Pro, écran Super Retina XDR 6,9\", triple capteur 48 Mpx, charge USB-C. Neuf sous blister, toutes couleurs disponibles." },
  { nom: "iPhone 16 Pro Max 512 Go", categorie: "smartphone", valeur: 1729, description: "Apple iPhone 16 Pro Max — 512 Go. Puce A18 Pro, écran Super Retina XDR 6,9\", triple capteur 48 Mpx, charge USB-C. Neuf sous blister, toutes couleurs disponibles." },
  { nom: "iPhone 16 Pro 256 Go", categorie: "smartphone", valeur: 1229, description: "Apple iPhone 16 Pro — 256 Go. Puce A18 Pro, écran Super Retina XDR 6,3\", triple capteur 48 Mpx, titane de qualité aérospatiale. Neuf sous blister." },
  { nom: "iPhone 16 Pro 512 Go", categorie: "smartphone", valeur: 1479, description: "Apple iPhone 16 Pro — 512 Go. Puce A18 Pro, écran Super Retina XDR 6,3\", triple capteur 48 Mpx, titane de qualité aérospatiale. Neuf sous blister." },
  { nom: "iPhone 16 Plus 256 Go", categorie: "smartphone", valeur: 1129, description: "Apple iPhone 16 Plus — 256 Go. Puce A18, grand écran 6,7\", double capteur 48 Mpx, autonomie renforcée. Neuf sous blister, accessoires inclus." },
  { nom: "iPhone 16 256 Go", categorie: "smartphone", valeur: 979, description: "Apple iPhone 16 — 256 Go. Puce A18, écran 6,1\", double capteur 48 Mpx, Dynamic Island, charge USB-C. Neuf sous blister, accessoires inclus." },
  { nom: "iPhone 15 Pro Max 256 Go", categorie: "smartphone", valeur: 1229, description: "Apple iPhone 15 Pro Max — 256 Go. Puce A17 Pro, titane, triple capteur 48 Mpx, USB-C 3.0. Neuf sous blister." },
  { nom: "iPhone 15 Pro 256 Go", categorie: "smartphone", valeur: 1229, description: "Apple iPhone 15 Pro — 256 Go. Puce A17 Pro, titane, triple capteur 48 Mpx, bouton Action, USB-C. Neuf sous blister." },
  { nom: "iPhone 15 256 Go", categorie: "smartphone", valeur: 879, description: "Apple iPhone 15 — 256 Go. Puce A16, Dynamic Island, double capteur 48 Mpx, USB-C. Neuf sous blister." },
  { nom: "iPhone 14 Pro Max 256 Go", categorie: "smartphone", valeur: 1099, description: "Apple iPhone 14 Pro Max — 256 Go. Puce A16, Dynamic Island, triple capteur 48 Mpx. Neuf sous blister." },
  { nom: "iPhone 14 256 Go", categorie: "smartphone", valeur: 799, description: "Apple iPhone 14 — 256 Go. Puce A15, double capteur 12 Mpx, mode Action. Neuf sous blister." },
  { nom: "iPhone 13 128 Go", categorie: "smartphone", valeur: 599, description: "Apple iPhone 13 — 128 Go. Puce A15, double capteur 12 Mpx, écran Super Retina XDR 6,1\". Neuf sous blister." },
  { nom: "iPhone SE (3e génération) 128 Go", categorie: "smartphone", valeur: 529, description: "Apple iPhone SE 3e génération — 128 Go. Puce A15, écran 4,7\", Touch ID. Compact et puissant. Neuf sous blister." },

  // ── Samsung ──
  { nom: "Samsung Galaxy S25 Ultra 256 Go", categorie: "smartphone", valeur: 1469, description: "Samsung Galaxy S25 Ultra — 256 Go. Snapdragon 8 Elite, stylet S Pen intégré, quadruple capteur 200 Mpx, écran Dynamic AMOLED 6,9\". Neuf sous blister." },
  { nom: "Samsung Galaxy S25+ 256 Go", categorie: "smartphone", valeur: 1219, description: "Samsung Galaxy S25+ — 256 Go. Snapdragon 8 Elite, écran Dynamic AMOLED 6,7\", triple capteur 50 Mpx, charge 45W. Neuf sous blister." },
  { nom: "Samsung Galaxy S25 256 Go", categorie: "smartphone", valeur: 999, description: "Samsung Galaxy S25 — 256 Go. Snapdragon 8 Elite, écran Dynamic AMOLED 6,2\", triple capteur 50 Mpx. Neuf sous blister." },
  { nom: "Samsung Galaxy Z Fold 6 256 Go", categorie: "smartphone", valeur: 1899, description: "Samsung Galaxy Z Fold 6 — 256 Go. Smartphone pliable, grand écran intérieur 7,6\" AMOLED, Snapdragon 8 Gen 3. Neuf sous blister." },
  { nom: "Samsung Galaxy Z Flip 6 256 Go", categorie: "smartphone", valeur: 1199, description: "Samsung Galaxy Z Flip 6 — 256 Go. Design clapet pliable, écran externe FlexWindow, Snapdragon 8 Gen 3. Neuf sous blister." },
  { nom: "Samsung Galaxy S24 Ultra 256 Go", categorie: "smartphone", valeur: 1299, description: "Samsung Galaxy S24 Ultra — 256 Go. Snapdragon 8 Gen 3, stylet S Pen, capteur 200 Mpx, écran AMOLED 6,8\". Neuf sous blister." },
  { nom: "Samsung Galaxy A55 5G 128 Go", categorie: "smartphone", valeur: 449, description: "Samsung Galaxy A55 5G — 128 Go. Écran Super AMOLED 6,6\", triple capteur 50 Mpx, batterie 5000 mAh. Neuf sous blister." },

  // ── iPad / tablettes ──
  { nom: "iPad Pro M4 13 pouces 256 Go Wi-Fi", categorie: "tech", valeur: 1599, description: "Apple iPad Pro M4 — 13 pouces, 256 Go Wi-Fi. Puce M4, écran Ultra Retina XDR OLED, compatible Apple Pencil Pro. Neuf sous blister." },
  { nom: "iPad Pro M4 11 pouces 256 Go Wi-Fi", categorie: "tech", valeur: 1219, description: "Apple iPad Pro M4 — 11 pouces, 256 Go Wi-Fi. Puce M4, écran Ultra Retina XDR OLED, compatible Apple Pencil Pro. Neuf sous blister." },
  { nom: "iPad Air M2 11 pouces 256 Go", categorie: "tech", valeur: 899, description: "Apple iPad Air M2 — 11 pouces, 256 Go Wi-Fi. Puce M2, écran Liquid Retina, compatible Apple Pencil Pro. Neuf sous blister." },
  { nom: "iPad mini 7 256 Go", categorie: "tech", valeur: 699, description: "Apple iPad mini 7 — 256 Go Wi-Fi. Puce A17 Pro, écran Liquid Retina 8,3\", compact et puissant. Neuf sous blister." },
  { nom: "iPad 10e génération 64 Go", categorie: "tech", valeur: 599, description: "Apple iPad 10e génération — 64 Go Wi-Fi. Puce A14, écran 10,9\", USB-C, compatible Apple Pencil 1. Neuf sous blister." },
  { nom: "Samsung Galaxy Tab S10 Ultra 256 Go", categorie: "tech", valeur: 1299, description: "Samsung Galaxy Tab S10 Ultra — 256 Go. Grand écran AMOLED 14,6\", Snapdragon 8 Gen 3, stylet S Pen inclus. Neuf sous blister." },
  { nom: "Samsung Galaxy Tab S10+ 256 Go", categorie: "tech", valeur: 999, description: "Samsung Galaxy Tab S10+ — 256 Go. Écran AMOLED 12,4\", Snapdragon 8 Gen 3, stylet S Pen inclus. Neuf sous blister." },

  // ── Mac ──
  { nom: "MacBook Pro M4 Pro 14 pouces 512 Go", categorie: "tech", valeur: 2499, description: "Apple MacBook Pro M4 Pro — 14 pouces, 512 Go SSD. Puce M4 Pro, écran Liquid Retina XDR, jusqu'à 24h d'autonomie. Neuf sous blister." },
  { nom: "MacBook Pro M4 14 pouces 512 Go", categorie: "tech", valeur: 1999, description: "Apple MacBook Pro M4 — 14 pouces, 512 Go SSD. Puce M4, écran Liquid Retina XDR, jusqu'à 24h d'autonomie. Neuf sous blister." },
  { nom: "MacBook Air M3 13 pouces 256 Go", categorie: "tech", valeur: 1299, description: "Apple MacBook Air M3 — 13 pouces, 256 Go SSD. Puce M3, design ultra-fin, écran Liquid Retina, jusqu'à 18h d'autonomie. Neuf sous blister." },
  { nom: "MacBook Air M3 15 pouces 256 Go", categorie: "tech", valeur: 1599, description: "Apple MacBook Air M3 — 15 pouces, 256 Go SSD. Grand écran Liquid Retina 15,3\", puce M3, jusqu'à 18h d'autonomie. Neuf sous blister." },
  { nom: "iMac M4 24 pouces 256 Go", categorie: "tech", valeur: 1599, description: "Apple iMac M4 — 24 pouces, 256 Go SSD. Puce M4, magnifique écran Retina 4.5K, design ultra-fin coloré. Neuf sous blister." },
  { nom: "Mac Mini M4 512 Go", categorie: "tech", valeur: 899, description: "Apple Mac Mini M4 — 512 Go SSD. Puce M4, design ultra-compact, connectivité Thunderbolt 5. Neuf sous blister, sans écran." },

  // ── PC & Gaming PC ──
  { nom: "PC Gamer ASUS ROG RTX 4080", categorie: "gaming", valeur: 2999, description: "PC Gamer ASUS ROG — RTX 4080 16 Go, Intel Core i9, 32 Go RAM DDR5, SSD 2 To. Performances ultra-high pour le gaming en 4K. Neuf sous blister." },
  { nom: "PC Gamer MSI RTX 4070 Ti", categorie: "gaming", valeur: 2299, description: "PC Gamer MSI — RTX 4070 Ti 12 Go, Intel Core i7, 32 Go RAM DDR5, SSD 1 To. Idéal pour le gaming 1440p. Neuf sous blister." },
  { nom: "Laptop ASUS ROG Zephyrus G16", categorie: "gaming", valeur: 2499, description: "Laptop Gaming ASUS ROG Zephyrus G16 — RTX 4080, Intel Core Ultra 9, 32 Go RAM, écran OLED 240 Hz 16\". Neuf sous blister." },
  { nom: "Laptop Razer Blade 16 RTX 4080", categorie: "gaming", valeur: 3299, description: "Laptop Gaming Razer Blade 16 — RTX 4080, Intel Core i9, 32 Go RAM, écran 4K OLED 240 Hz. Le laptop gaming ultime. Neuf sous blister." },
  { nom: "Microsoft Surface Pro 11 256 Go", categorie: "tech", valeur: 1599, description: "Microsoft Surface Pro 11 — 256 Go SSD, Snapdragon X Elite. Tablette et PC en un, écran 13\" PixelSense. Neuf sous blister (clavier non inclus)." },
  { nom: "Dell XPS 15 OLED Intel Core Ultra", categorie: "tech", valeur: 2499, description: "Dell XPS 15 — Intel Core Ultra 7, 32 Go RAM, SSD 1 To, écran OLED 3.5K 60 Hz 15,6\". Ultrabook premium pour les créatifs. Neuf sous blister." },

  // ── Consoles & Gaming ──
  { nom: "PlayStation 5 Pro", categorie: "gaming", valeur: 799, description: "Sony PlayStation 5 Pro — 2 To SSD. Performances améliorées, ray tracing avancé, 8K, rétrocompatibilité totale PS4/PS5. Neuf sous blister, avec manette DualSense." },
  { nom: "PlayStation 5 Slim 1 To", categorie: "gaming", valeur: 499, description: "Sony PlayStation 5 Slim — 1 To SSD. Design compact, 4K 120 FPS, lecteur Blu-ray Ultra HD, manette DualSense incluse. Neuf sous blister." },
  { nom: "Xbox Series X 1 To", categorie: "gaming", valeur: 549, description: "Microsoft Xbox Series X — 1 To SSD. La console la plus puissante de Microsoft, 4K 120 FPS, Xbox Game Pass compatible. Neuf sous blister." },
  { nom: "Xbox Series S 1 To", categorie: "gaming", valeur: 349, description: "Microsoft Xbox Series S — 1 To SSD. Console compacte tout numérique, 1440p 120 FPS, Xbox Game Pass compatible. Neuf sous blister." },
  { nom: "Nintendo Switch OLED", categorie: "gaming", valeur: 349, description: "Nintendo Switch OLED — écran OLED 7\", dock inclus, Joy-Con détachables. Jouez à la maison ou en déplacement. Neuf sous blister." },
  { nom: "Nintendo Switch 2", categorie: "gaming", valeur: 449, description: "Nintendo Switch 2 — nouvelle génération, écran amélioré, Joy-Con magnétiques, rétrocompatibilité Switch 1. Neuf sous blister." },
  { nom: "Steam Deck OLED 1 To", categorie: "gaming", valeur: 679, description: "Valve Steam Deck OLED — 1 To SSD, écran OLED HDR 7,4\", bibliothèque Steam complète portable. Neuf sous blister." },

  // ── TV & Écrans ──
  { nom: "TV Samsung OLED 65 pouces 4K", categorie: "tv", valeur: 2499, description: "TV Samsung OLED 65\" — 4K 144 Hz, HDR, Smart TV Tizen, télécommande solaire incluse. Image OLED époustouflante pour le home cinéma. Neuve sous emballage." },
  { nom: "TV LG OLED evo 65 pouces 4K", categorie: "tv", valeur: 2199, description: "TV LG OLED evo 65\" — 4K 120 Hz, Dolby Vision IQ, webOS, télécommande Magic Remote. Qualité d'image de référence. Neuve sous emballage." },
  { nom: "TV Sony Bravia XR 65 pouces OLED", categorie: "tv", valeur: 2299, description: "TV Sony Bravia XR OLED 65\" — processeur Cognitive XR, 4K 120 Hz, Dolby Atmos, Google TV. Expérience cinéma à domicile. Neuve sous emballage." },
  { nom: "TV Samsung QLED 55 pouces 4K", categorie: "tv", valeur: 1299, description: "TV Samsung QLED 55\" — 4K 120 Hz, HDR10+, Smart TV Tizen, Gaming Hub intégré. Parfaite pour le salon. Neuve sous emballage." },
  { nom: "TV LG NanoCell 55 pouces 4K", categorie: "tv", valeur: 799, description: "TV LG NanoCell 55\" — 4K 60 Hz, HDR, webOS, télécommande Magic Remote. Rapport qualité-prix exceptionnel. Neuve sous emballage." },
  { nom: "Écran Gaming ASUS ROG 27 pouces 240 Hz", categorie: "tv", valeur: 699, description: "Écran Gaming ASUS ROG 27\" — 2K QHD 240 Hz, dalle IPS 1ms, HDR, G-Sync/FreeSync. Pour les gamers exigeants. Neuf sous emballage." },
  { nom: "Écran Samsung Odyssey G9 49 pouces", categorie: "tv", valeur: 1499, description: "Écran ultrawide Samsung Odyssey G9 49\" — DQHD 240 Hz, dalle VA incurvée, HDR1000, G-Sync. Immersion totale pour le gaming. Neuf sous emballage." },

  // ── Audio ──
  { nom: "AirPods Pro 2e génération", categorie: "audio", valeur: 279, description: "Apple AirPods Pro 2e génération — USB-C. Réduction active du bruit H2, Transparency Mode, son Spatial Audio. Neuf sous blister." },
  { nom: "AirPods Max USB-C", categorie: "audio", valeur: 629, description: "Apple AirPods Max USB-C — casque circum-auriculaire premium, ANC H1, son Spatial Audio, autonomie 20h. Neuf sous blister." },
  { nom: "Sony WH-1000XM5", categorie: "audio", valeur: 379, description: "Sony WH-1000XM5 — casque Bluetooth ANC leader du marché, autonomie 30h, multipoint, son Hi-Res certifié. Neuf sous blister." },
  { nom: "Sony WH-1000XM4", categorie: "audio", valeur: 279, description: "Sony WH-1000XM4 — casque Bluetooth ANC, autonomie 30h, LDAC Hi-Res, multipoint. Référence qualité-prix. Neuf sous blister." },
  { nom: "Bose QuietComfort Ultra", categorie: "audio", valeur: 449, description: "Bose QuietComfort Ultra — casque Bluetooth ANC le plus efficace du marché, son Immersive Audio, autonomie 24h. Neuf sous blister." },
  { nom: "Bose QuietComfort 45", categorie: "audio", valeur: 329, description: "Bose QuietComfort 45 — casque Bluetooth ANC, confort légendaire, autonomie 24h, mode Aware. Neuf sous blister." },
  { nom: "Samsung Galaxy Buds3 Pro", categorie: "audio", valeur: 259, description: "Samsung Galaxy Buds3 Pro — écouteurs ANC intelligents, son Hi-Fi 24 bits, autonomie 30h avec boîtier. Neufs sous blister." },
  { nom: "Sonos Arc (barre de son)", categorie: "audio", valeur: 999, description: "Sonos Arc — barre de son premium avec Dolby Atmos, 11 haut-parleurs intégrés, compatible AirPlay 2 et Alexa. Neuve sous emballage." },
  { nom: "Sonos Era 300", categorie: "audio", valeur: 449, description: "Sonos Era 300 — enceinte connectée Spatial Audio, Dolby Atmos, AirPlay 2, Wi-Fi. Son à 360° d'exception. Neuve sous emballage." },
  { nom: "Marshall Woburn III", categorie: "audio", valeur: 499, description: "Marshall Woburn III — enceinte Bluetooth iconique, 110 W, multi-host Bluetooth, entrée analogique. Design vintage premium. Neuve sous emballage." },
  { nom: "Bang & Olufsen Beoplay H95", categorie: "audio", valeur: 799, description: "Bang & Olufsen Beoplay H95 — casque Bluetooth ANC ultra-premium, aluminium et cuir véritable, autonomie 38h. Édition limitée 50 ans. Neuf sous blister." },

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

export interface OpeningHours {
  day: string;
  opens: string;
  closes: string;
}

export interface SocialLinks {
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  linkedin?: string;
  website?: string;
}

export interface RestaurantInfo {
  name: string;
  tagline: string;
  description: string;
  address: string;
  neighborhood: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  phone?: string;
  whatsapp?: string;
  email: string;
  openingHours: OpeningHours[];
  socialLinks: SocialLinks;
  reservationsEmail?: string;
  reservationsPhone?: string;
  googleMapsUrl: string;
}

import type { RestaurantInfo } from '@/types/restaurant';

export const restaurantInfo: RestaurantInfo = {
  name: 'Hey Tiger',
  tagline: 'A SOCIAL HOUSE FOR THE UNCOMMON',
  description: 'Hey Tiger is a social house in Motor City Dubai where good food, music and culture meet. Asian soul food made to share, highballs and sake, late-night plates and DJ sets until 2AM. A Brass Monkey Hospitality venue.',
  address: 'Motor City Club House',
  neighborhood: 'Motor City',
  city: 'Dubai',
  country: 'United Arab Emirates',
  latitude: 25.0417,
  longitude: 55.2450,
  phone: '+971-4-000-0000',
  whatsapp: '+971-50-000-0000',
  email: 'hello@heytiger.ae',
  reservationsEmail: 'reservations@heytiger.ae',
  reservationsPhone: '+971-4-000-0000',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Hey+Tiger+Motor+City+Dubai',
  openingHours: [
    { day: 'MON', opens: 'CLOSED', closes: '' },
    { day: 'TUE', opens: '18:00', closes: '02:00' },
    { day: 'WED', opens: '18:00', closes: '02:00' },
    { day: 'THU', opens: '18:00', closes: '02:00' },
    { day: 'FRI', opens: '18:00', closes: '02:00' },
    { day: 'SAT', opens: '11:00', closes: '02:00' },
    { day: 'SUN', opens: '11:00', closes: '00:00' },
  ],
  socialLinks: {
    instagram: 'https://instagram.com/heytigerdubai',
    tiktok: 'https://tiktok.com/@heytigerdubai',
  },
};

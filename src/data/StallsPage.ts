export const STALLS = [
  {
    id: '1',
    name: "Kake Ji Ki Chaat",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop",
    rating: 4.8,
    location: "Shaheeper Gate, Meerut",
    specialty: "Aloo Tikki, Pani Puri",
    category: "Chaat & Starters",
    priceRange: "₹10 - ₹100",
    hours: "10:00 AM - 11:00 PM",
    isOpen: true,
    menu: [
      { id: '1-1', dishName: 'Aloo Tikki Chaat', price: 40, category: 'Chaat & Starters', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=400&auto=format&fit=crop', description: 'Crispy potato patty with tangy chutneys' },
      { id: '1-2', dishName: 'Pani Puri (6 pcs)', price: 30, category: 'Chaat & Starters', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=400&auto=format&fit=crop', description: 'Spicy mint water with crispy semolina spheres' }
    ]
  },
  {
    id: '2',
    name: "Delhi Chole Bhature",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=800&auto=format&fit=crop",
    rating: 4.7,
    location: "Abu Lane, Meerut",
    specialty: "Chole Bhature, Lassi",
    category: "Main Course",
    priceRange: "₹100 - ₹500",
    hours: "10:00 AM - 11:00 PM",
    isOpen: true,
    menu: [
      { id: '2-1', dishName: 'Special Chole Bhature (2 pcs)', price: 120, category: 'Main Course', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=400&auto=format&fit=crop', description: 'Fluffy bhature served with spicy chickpea curry' }
    ]
  }
];

export const FAMOUS_FOODS = STALLS;
export const ZONES = [
  { id: 'zone-1', name: 'Shaheeper Gate', activeStalls: 1 },
  { id: 'zone-2', name: 'Abu Lane', activeStalls: 1 }
];
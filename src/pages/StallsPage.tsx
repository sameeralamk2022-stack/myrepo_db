import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, Star, Search, MapPin, Utensils, ArrowRight } from 'lucide-react';
import { CustomOrderPage } from '@/components/CustomOrderPage';

function SafeImage({ src, alt, className, title, category }: { src: string; alt: string; className: string; title?: string; category?: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/40 flex flex-col items-center justify-center p-4 text-center border border-amber-500/20">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-2 text-amber-400 shadow-lg">
          <Utensils className="w-5 h-5 animate-pulse" />
        </div>
        <span className="text-xs font-black text-white line-clamp-1">{title || alt}</span>
        <span className="text-[10px] text-amber-400/80 font-bold uppercase tracking-wider mt-0.5">{category || 'Meerut Bites Special'}</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt}
      onError={() => setHasError(true)}
      className={className}
    />
  );
}

export function StallsPage() {
  const [selectedStall, setSelectedStall] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const stallsData = [
    {
      id: 'stall-1',
      name: 'Shri Gopal Chaat',
      category: 'Chaat & Street Snacks',
      location: 'Abu Lane, Meerut',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80',
      items: [
        { id: 'mb-201', name: 'Special Royal Aloo Tikki', price: 90, rating: 4.9, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', description: 'Crispy golden potato patty stuffed with lentils.' },
        { id: 'mb-202', name: 'Delhi 6 Chole Bhature', price: 140, rating: 4.8, image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80', description: 'Fluffy bhature with spicy chickpea masala.' }
      ]
    },
    {
      id: 'stall-2',
      name: 'Bholenath Chai Stall',
      category: 'Beverages & Snacks',
      location: 'Begum Bridge, Meerut',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
      items: [
        { id: 'mb-204', name: 'Special Kulhad Chai', price: 30, rating: 4.9, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80', description: 'Strong Indian milk tea brewed with ginger in clay kulhad.' },
        { id: 'mb-205', name: 'Malandar Special Malai Lassi', price: 70, rating: 5.0, image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=800&q=80', description: 'Thick sweet churned yogurt topped with malai.' }
      ]
    },
    {
      id: 'stall-3',
      name: 'Meerut Momo Hub',
      category: 'Fast Food & Momos',
      location: 'Garh Road, Meerut',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
      items: [
        { id: 'mb-207', name: 'Butter Tandoori Momos', price: 160, rating: 4.9, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80', description: 'Charcoal-grilled veg momos in buttery makhani gravy.' }
      ]
    }
  ];

  // If user selected a stall, redirect / display CustomOrderPage
  if (selectedStall) {
    return <CustomOrderPage stall={selectedStall} onBack={() => setSelectedStall(null)} />;
  }

  const filteredStalls = stallsData.filter(stall => 
    stall.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stall.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 bg-slate-950 min-h-screen text-white">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-wider mb-2">
            <Store className="w-3.5 h-3.5 animate-pulse" />
            <span>Verified Local Vendor Stalls</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Explore Meerut Food Stalls</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Click any stall to open Custom Orders and fill your preferences.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search stalls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-400 focus:border-amber-500 outline-none shadow-xl"
          />
        </div>
      </div>

      {/* Stalls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStalls.map((stall) => (
          <motion.div
            key={stall.id}
            whileHover={{ y: -4, scale: 1.01 }}
            className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-amber-500/50 transition-all cursor-pointer"
            onClick={() => setSelectedStall(stall)}
          >
            <div className="relative h-48 w-full overflow-hidden bg-slate-950">
              <SafeImage src={stall.image} alt={stall.name} title={stall.name} category={stall.category} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
              <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-800 flex items-center space-x-1 text-amber-400 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{stall.rating}</span>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {stall.category}
                </span>
                <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors">{stall.name}</h3>
                <p className="text-xs text-slate-400 flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 mr-1" />
                  {stall.location}
                </p>
              </div>

              <button className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer">
                <span>Open Custom Order Form</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default StallsPage;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, Star, Search, MapPin, Utensils, ArrowRight, 
  Clock, ShieldCheck, Flame, ChevronRight, Filter, Sparkles 
} from 'lucide-react';
import { CustomOrderPage } from '@/components/CustomOrderPage';
import { SimpleOrderPage } from '@/components/SimpleOrderPage';

function SafeImage({ src, alt, className, title, category }: { src: string; alt: string; className: string; title?: string; category?: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/40 flex flex-col items-center justify-center p-4 text-center border border-amber-500/20">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-2 text-amber-400 shadow-xl">
          <Utensils className="w-6 h-6 animate-pulse" />
        </div>
        <span className="text-xs font-black text-white line-clamp-1">{title || alt}</span>
        <span className="text-[10px] text-amber-400/80 font-bold uppercase tracking-wider mt-1">{category || 'Meerut Bites Special'}</span>
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
  const [simpleOrderStall, setSimpleOrderStall] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const stallsData = [
    {
      id: 'stall-1',
      name: 'Shri Gopal Chaat',
      category: 'Chaat & Street Snacks',
      location: 'Abu Lane, Meerut',
      rating: 4.9,
      timing: '10:00 AM - 11:30 PM',
      image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80',
      description: 'Legendary street food destination famous for crispy aloo tikkis and tangy golgappas.',
      items: [
        { id: 'mb-201', name: 'Special Royal Aloo Tikki', price: 90, rating: 4.9, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', description: 'Crispy golden potato patty stuffed with lentils and spices.' },
        { id: 'mb-202', name: 'Delhi 6 Chole Bhature', price: 140, rating: 4.8, image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80', description: 'Fluffy bhature served with rich and spicy chickpea masala.' },
        { id: 'mb-203', name: 'Stuffed Suji Golgappe (6 pcs)', price: 60, rating: 4.9, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80', description: 'Crispy semolina spheres with flavored mint water.' }
      ]
    },
    {
      id: 'stall-2',
      name: 'Bholenath Chai Stall',
      category: 'Beverages & Snacks',
      location: 'Begum Bridge, Meerut',
      rating: 4.8,
      timing: '10:00 AM - 11:30 PM',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
      description: 'Traditional clay-pot tea and refreshing thick malai lassi to energize your evening.',
      items: [
        { id: 'mb-204', name: 'Special Kulhad Chai', price: 30, rating: 4.9, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80', description: 'Strong Indian milk tea brewed with fresh ginger and cardamom in clay kulhad.' },
        { id: 'mb-205', name: 'Malandar Special Malai Lassi', price: 70, rating: 5.0, image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=800&q=80', description: 'Thick sweet churned yogurt topped with heavy malai and dry fruits.' },
        { id: 'mb-206', name: 'Bun Maska & Jam', price: 50, rating: 4.7, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80', description: 'Soft buttery bun loaded with fresh white butter.' }
      ]
    },
    {
      id: 'stall-3',
      name: 'Meerut Momo Hub',
      category: 'Fast Food & Momos',
      location: 'Garh Road, Meerut',
      rating: 4.9,
      timing: '10:00 AM - 11:30 PM',
      image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
      description: 'Juicy steam and tandoori momos served with fiery red chilli garlic chutney.',
      items: [
        { id: 'mb-207', name: 'Butter Tandoori Momos (8 pcs)', price: 160, rating: 4.9, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80', description: 'Charcoal-grilled veg momos soaked in rich buttery makhani gravy.' },
        { id: 'mb-208', name: 'Kurkure Afghani Momos', price: 150, rating: 4.8, image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80', description: 'Crunchy cornflake-crusted momos tossed in creamy white sauce.' }
      ]
    },
    {
      id: 'stall-4',
      name: 'Royal Biryani & Rolls',
      category: 'Mughlai & Rolls',
      location: 'Shastri Nagar, Meerut',
      rating: 4.7,
      timing: '10:00 AM - 11:30 PM',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      description: 'Aromatic dum biryanis and jumbo Kathi rolls packed with secret spices.',
      items: [
        { id: 'mb-209', name: 'Awadhi Paneer Dum Biryani', price: 180, rating: 4.8, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', description: 'Long grain basmati rice slow-cooked with marinated paneer and saffron.' },
        { id: 'mb-210', name: 'Double Egg Chicken Kathi Roll', price: 130, rating: 4.9, image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80', description: 'Crispy paratha wrapped around juicy chicken tikka and egg layer.' }
      ]
    }
  ];

  // Redirection handling based on user flow requirements:
  // User enters from stall -> Custom Order page (with Add to Cart)
  if (selectedStall) {
    return <CustomOrderPage stall={selectedStall} onBack={() => setSelectedStall(null)} />;
  }

  // Simple Order page handler (bypasses cart, direct ordering with QR code and COD timing rules)
  if (simpleOrderStall) {
    return <SimpleOrderPage stall={simpleOrderStall} onBack={() => setSimpleOrderStall(null)} />;
  }

  const categories = ['All', 'Chaat & Street Snacks', 'Beverages & Snacks', 'Fast Food & Momos', 'Mughlai & Rolls'];

  const filteredStalls = stallsData.filter(stall => {
    const matchesSearch = stall.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          stall.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          stall.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || stall.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-slate-950 min-h-screen text-white">
      {/* Hero Banner / Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/20 p-8 sm:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-wider">
            <Store className="w-3.5 h-3.5 animate-pulse" />
            <span>Meerut Bites Verified Stalls</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Discover Authentic Street Food Stalls
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Select any local stall below to open <span className="text-amber-400 font-bold">Custom Orders</span> (with detailed spice levels and Add to Cart) or use <span className="text-amber-400 font-bold">Simple Orders</span> for direct quick checkout. Open strictly between 10:00 AM and 11:30 PM.
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by stall name, speciality, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white placeholder-slate-400 focus:border-amber-500 outline-none shadow-xl transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-black'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stalls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {filteredStalls.map((stall) => (
          <motion.div
            key={stall.id}
            whileHover={{ y: -4 }}
            className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-amber-500/50 transition-all"
          >
            <div className="relative h-60 w-full overflow-hidden bg-slate-950">
              <SafeImage src={stall.image} alt={stall.name} title={stall.name} category={stall.category} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-90" />
              
              <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-800 flex items-center space-x-1.5 text-amber-400 text-xs font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>{stall.timing}</span>
              </div>

              <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-800 flex items-center space-x-1 text-amber-400 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{stall.rating}</span>
              </div>
            </div>

            <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {stall.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 mr-1" />
                    {stall.location}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors">{stall.name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{stall.description}</p>
              </div>

              {/* Action Buttons for Custom Order vs Simple Order */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => setSelectedStall(stall)}
                  className="py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <span>Custom Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setSimpleOrderStall(stall)}
                  className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <span>Simple Order</span>
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default StallsPage;
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, ExternalLink, Phone, QrCode, CheckCheck, Sparkles, ShieldCheck, ChevronRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function WhatsAppChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useApp() as any;

  const [userName] = useState(user?.name || 'Nauman Alam Khan');
  const [userPhone, setUserPhone] = useState(user?.phone || '');
  const [userZone] = useState(user?.zone || 'Meerut Cantt / Civil Lines');
  
  const [isAskingForDetails, setIsAskingForDetails] = useState(!user?.phone);
  const [activeItem, setActiveItem] = useState('Chole Bhature (₹140)');
  const [showQrDropdown, setShowQrDropdown] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const captainNumber = '9568358120';
  const captainUPI = 'meerutbites@okaxis';

  const [messages, setMessages] = useState<Array<{ 
    sender: 'bot' | 'user'; 
    text: string; 
    options?: Array<{ label: string; action: () => void }> 
  }>>([
    {
      sender: 'bot',
      text: `Hi! 👋 Welcome to **Meerut Bites AI Assistant**.\n\n⚡ *Quick Info:*\n• **Stalls:** Commissioner Chowk, Begum Bridge, Shastri Nagar, Delhi Gate.\n• **Delivery:** ₹10/km (10AM-6PM) | ₹12/km (6PM-11:30PM).\n• ⚠️ *Policy:* No illegal items delivered.\n\nWhat would you like to order today?`,
      options: [
        { label: '🍔 Order Chole Bhature', action: () => handleUserQuery('I want to order Chole Bhature') },
        { label: '🔥 Order Tandoori Chaap', action: () => handleUserQuery('I want to order Tandoori Chaap') },
        { label: '📞 Talk to Captain', action: () => promptCaptainContact() }
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const promptCaptainContact = () => {
    setMessages(prev => [
      ...prev,
      { sender: 'bot', text: `Connect with Captain (+91 ${captainNumber}):`,
        options: [
          { label: `📞 Call Captain Directly`, action: () => window.location.href = `tel:${captainNumber}` },
          { label: `💬 Message on WhatsApp`, action: () => window.open(`https://wa.me/91${captainNumber}?text=Hello%20Captain,%20I%20need%20assistance.`, '_blank') }
        ]
      }
    ]);
  };

  const handleUserQuery = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    if (isAskingForDetails && !userPhone) {
      setUserPhone(query.trim());
      setIsAskingForDetails(false);
      setMessages(prev => [
        ...prev,
        { sender: 'user', text: query },
        { sender: 'bot', text: `Saved phone: ${query}. Select payment method:`,
          options: [
            { label: '💳 Pay via UPI (QR Code)', action: () => handlePaymentSelection('UPI') },
            { label: '💵 Cash on Delivery (COD)', action: () => handlePaymentSelection('COD') }
          ]
        }
      ]);
      setInputText('');
      return;
    }

    if (query.toLowerCase().includes('order') || query.toLowerCase().includes('plate') || query.toLowerCase().includes('chole') || query.toLowerCase().includes('chaap')) {
      setActiveItem(query);
    }

    const updated = [...messages, { sender: 'user' as const, text: query }];
    setMessages(updated);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: `Selected: "${query}". Choose payment method:`,
          options: [
            { label: '💳 Pay via UPI (QR Code)', action: () => handlePaymentSelection('UPI') },
            { label: '💵 Cash on Delivery (COD)', action: () => handlePaymentSelection('COD') },
            { label: '📞 Captain Support', action: () => promptCaptainContact() }
          ]
        }
      ]);
    }, 600);
  };

  const handlePaymentSelection = (method: 'UPI' | 'COD') => {
    if (!userPhone) {
      setIsAskingForDetails(true);
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: 'Please enter your mobile number for delivery updates:' }
      ]);
      return;
    }

    if (method === 'UPI') {
      setShowQrDropdown(true);
    }

    const orderText = 
      `*NEW MEERUT BITES ORDER*\n` +
      `----------------------------------\n` +
      `👤 Customer: ${userName}\n` +
      `📞 Phone: ${userPhone}\n` +
      `📍 Zone: ${userZone}\n` +
      `----------------------------------\n` +
      `🛒 *Items:* ${activeItem}\n` +
      `💳 *Payment:* ${method === 'UPI' ? `UPI (${captainUPI})` : 'COD'}\n` +
      `----------------------------------\n` +
      `📦 *Rates:* ₹10/km (10AM-6PM) | ₹12/km (6PM-11:30PM)\n` +
      `⚠️ *Policy:* No illegal items.\n` +
      `----------------------------------\n` +
      `Please confirm & dispatch!`;

    const encoded = encodeURIComponent(orderText);

    setMessages(prev => [
      ...prev,
      {
        sender: 'bot',
        text: method === 'UPI' 
          ? `Scan UPI QR below to pay ${captainUPI}, then click below to dispatch order to Captain!`
          : `COD order prepared. Click below to send order to Captain!`,
        options: [
          { label: `💬 Send Order on WhatsApp`, action: () => window.open(`https://wa.me/91${captainNumber}?text=${encoded}`, '_blank') },
          { label: `📞 Call Captain`, action: () => window.location.href = `tel:${captainNumber}` }
        ]
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Animated Trigger Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.5)] cursor-pointer group border border-emerald-300/30"
        >
          <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-40 animate-ping pointer-events-none" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-slate-950 flex items-center justify-center shadow">
            <span className="w-1.5 h-1.5 bg-slate-950 rounded-full animate-pulse" />
          </div>
          <MessageCircle className="w-8 h-8 fill-current drop-shadow" />
        </motion.button>
      )}

      {/* Premium Glassmorphic Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(8px)' }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="w-[94vw] sm:w-[410px] h-[600px] rounded-[28px] bg-[#070b14]/95 border border-emerald-500/20 shadow-[0_25px_70px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden font-sans backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border-b border-emerald-500/20 text-white flex items-center justify-between shadow-lg">
              <div className="flex items-center space-x-3.5">
                <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400 font-black text-xs">
                    <Bot className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="text-xs font-black tracking-wider uppercase text-white">Meerut Bites Assistant</h3>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  </div>
                  <p className="text-[10px] text-emerald-400 font-medium">Captain: +91 {captainNumber} • Active</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer border border-slate-700/50 shadow"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-[#090e17] via-[#05080e] to-[#090e17] scrollbar-thin scrollbar-thumb-emerald-900/40">
              {messages.map((msg, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  key={index}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow-lg ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-tr-none shadow-amber-500/10'
                        : 'bg-slate-900/90 border border-slate-800/80 text-slate-200 rounded-tl-none shadow-black/40 backdrop-blur-md'
                    }`}
                  >
                    {msg.text}
                    <div className="flex items-center justify-end space-x-1 mt-1.5 opacity-60 text-[9px] font-mono">
                      <span>Just now</span>
                      {msg.sender === 'user' && <CheckCheck className="w-3.5 h-3.5 text-slate-950" />}
                    </div>
                  </div>

                  {/* Option Pills */}
                  {msg.options && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-wrap gap-2 mt-3"
                    >
                      {msg.options.map((opt, optIdx) => (
                        <motion.button
                          key={optIdx}
                          whileHover={{ scale: 1.04, y: -2 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={opt.action}
                          className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-sm group"
                        >
                          <span>{opt.label}</span>
                          <ChevronRight className="w-3 h-3 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center space-x-2 p-3 bg-slate-900 border border-slate-800 rounded-2xl w-16 shadow">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                </motion.div>
              )}

              {/* UPI QR Code Container */}
              {showQrDropdown && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, height: 0 }}
                  animate={{ opacity: 1, scale: 1, height: 'auto' }}
                  className="p-4 bg-slate-900/95 border border-amber-500/40 rounded-2xl text-center space-y-3 my-2 shadow-2xl backdrop-blur-xl"
                >
                  <div className="flex items-center justify-center space-x-1.5 text-amber-400 text-xs font-black uppercase tracking-wider">
                    <QrCode className="w-4 h-4" />
                    <span>Scan UPI QR Code to Pay</span>
                  </div>
                  <div className="w-36 h-36 mx-auto bg-white p-2.5 rounded-2xl flex items-center justify-center shadow-inner">
                    <div className="w-full h-full border-2 border-slate-950 flex flex-col items-center justify-center font-mono text-[9px] text-slate-950 font-bold p-1 text-center bg-amber-50 rounded-xl">
                      <ShieldCheck className="w-6 h-6 text-emerald-600 mb-1" />
                      <span>MEERUT BITES</span>
                      <span className="text-[8px] mt-1 text-emerald-700 font-bold">{captainUPI}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Pay securely via any UPI app & send receipt to Captain.</p>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-3.5 bg-slate-900 border-t border-slate-800 flex items-center space-x-2.5 shadow-2xl">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUserQuery()}
                placeholder={isAskingForDetails ? "Enter your phone number..." : "Type food item or query..."}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium transition-all shadow-inner"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleUserQuery()}
                className="p-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
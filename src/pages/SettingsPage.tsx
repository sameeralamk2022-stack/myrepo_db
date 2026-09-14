import React, { useState } from 'react';
import { Settings, Star, AlertTriangle, Send, Code, Phone, MessageCircle, User, Save, CheckCircle, LogOut } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function SettingsPage(): JSX.Element {
  const { profile, setProfile, logout } = useApp();
  const [name, setName] = useState(profile.name || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [saved, setSaved] = useState(false);
  const [generalRating, setGeneralRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({ ...profile, name: name.trim(), phone: phone.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    if (typeof logout === 'function') {
      logout();
    } else {
      setProfile({ name: '', phone: '' });
      localStorage.clear();
      window.location.reload();
    }
  };

  const getISTStatus = () => {
    try {
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const istDate = new Date(utc + (3600000 * 5.5));
      const totalMinutes = istDate.getHours() * 60 + istDate.getMinutes();
      const isClosed = totalMinutes >= 1410 || totalMinutes < 360;
      return { isClosed };
    } catch {
      return { isClosed: false };
    }
  };

  const { isClosed } = getISTStatus();

  const handleSendRatingToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const captainNumber = '919568358120';
    const message = encodeURIComponent(
      `⭐ *APP RATING & FEEDBACK - MEERUT BITES* ⭐\n\n` +
      `🌟 *Rating:* ${generalRating} / 5 Stars\n` +
      `💬 *Feedback:* ${feedbackText || 'No additional comments'}\n\n` +
      `_Sent from Meerut Bites Settings Panel_`
    );
    window.open(`https://wa.me/\({captainNumber}?text=\){message}`, '_blank');
  };

  return (
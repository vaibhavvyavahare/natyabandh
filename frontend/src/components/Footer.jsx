"use client";
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export default function Footer() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const statusRef = useRef(null);

  // Auto-scroll to status message when it appears
  useEffect(() => {
    if (status.message && statusRef.current) {
      statusRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [status]);

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log("Submit clicked...");
    if (isSending) return;
    
    if (!supabase) {
      console.error("Supabase client is NULL");
      setStatus({ type: 'error', message: 'Database connection error. (डेटाबेस त्रुटी)' });
      return;
    }

    setIsSending(true);
    setStatus({ type: '', message: '' });

    try {
      console.log("Sending data to Supabase...");
      const { error } = await supabase
        .from('UserTable')
        .insert([
          { 
            Name: formData.name, 
            Email: formData.email, 
            Msg: formData.message 
          }
        ]);

      if (error) {
        console.error('Supabase Error:', error);
        setStatus({ type: 'error', message: `त्रुटी (Error): ${error.message}` });
      } else {
        // Call the Edge Function manually to ensure the email gets sent 
        // even if the Database Webhook trigger is not configured.
        try {
          console.log("Invoking edge function to send email...");
          await supabase.functions.invoke('forward-message', {
            body: { 
              record: { 
                Name: formData.name, 
                Email: formData.email, 
                Msg: formData.message 
              } 
            }
          });
        } catch (fnErr) {
          console.error("Edge function error:", fnErr);
        }

        console.log("Success! Message sent.");
        setStatus({ type: 'success', message: 'तुमचा संदेश यशस्वीरीत्या पाठवला आहे! (Message sent!)' });
        setFormData({ name: '', email: '', message: '' });
        
        setTimeout(() => setStatus({ type: '', message: '' }), 5000);
      }
    } catch (error) {
      console.error('Connection Error:', error);
      setStatus({ type: 'error', message: 'काहीतरी चूक झाली. (Connection error)' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <footer className="bg-black border-t border-white/5 pt-16 pb-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
        
        {/* 1. Contact Info */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-yatra-one)]">
            संपर्क साधा <span className="text-lg text-stone-500 font-sans ml-2">(Get in Touch)</span>
          </h3>
          <div className="space-y-4 text-stone-400">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              <a href="mailto:natyabandh.rangbhumi@gmail.com" className="hover:text-red-600 transition-colors">
                natyabandh.rangbhumi@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <a href="tel:+919359021540" className="hover:text-red-600 transition-colors">
                +91 9359021540 (Shrushti)
              </a>
            </div>
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>
                पुणे, महाराष्ट्र <br/>
                <span className="text-sm text-stone-500">(Pune, Maharashtra)</span>
              </span>
            </div>
          </div>
        </div>

        {/* 2. Contact Form */}
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-yatra-one)] mb-6">
            आम्हाला संदेश पाठवा <span className="text-lg text-stone-500 font-sans ml-2">(Send us a Message)</span>
          </h3>
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                handleSubmit();
              }
            }}
          >
            <input 
              type="text" 
              name="name"
              placeholder="तुमचे नाव (Your Name)" 
              className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all placeholder:text-stone-600"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input 
              type="email" 
              name="email"
              placeholder="तुमचा ईमेल (Your Email)" 
              className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all placeholder:text-stone-600"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <textarea 
              name="message"
              placeholder="तुमचा संदेश (Your Message)" 
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all sm:col-span-2 resize-none placeholder:text-stone-600"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            ></textarea>
            
            {/* Status Message */}
            {status.message && (
              <div 
                ref={statusRef}
                className={`sm:col-span-2 p-4 rounded-xl text-sm font-bold border ${
                status.type === 'success' 
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-lg' 
                  : 'bg-red-500/20 text-red-500 border-red-500/30'
              }`}>
                <div className="flex items-center gap-2">
                  {status.type === 'success' ? '✅' : '❌'}
                  {status.message}
                </div>
              </div>
            )}

            <button 
              type="button"
              disabled={isSending || status.type === 'success'}
              onClick={handleSubmit}
              className={`flex items-center justify-center gap-2 font-bold py-3 px-8 rounded-xl transition-all w-fit cursor-pointer ${
                status.type === 'success' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:shadow-lg active:scale-95'
              } ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {status.type === 'success' ? 'SUCCESS!' : (isSending ? 'Sending...' : 'Send')}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Bottom Bar */}
      <div className="border-t border-white/5 pt-8 text-center text-stone-500 text-sm">
        <p className="font-medium text-stone-300">
          &copy; {new Date().getFullYear()} नाट्यबंध. All rights reserved.
        </p>
        <p className="mt-1 opacity-40">
          नाट्यबंध २०२६: रंगभूमी २०२६ (Rangbhumi 2026)
        </p>
      </div>
    </footer>
  );
}

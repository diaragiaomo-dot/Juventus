/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Users, 
  Calendar, 
  MessageSquare, 
  ChevronRight, 
  TrendingUp, 
  Shield, 
  Menu, 
  X,
  Send,
  Loader2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';
import { askJAssistant } from './services/gemini';

// --- Types ---
interface Player {
  id: number;
  name: string;
  position: string;
  number: number;
  image: string;
}

interface Match {
  id: number;
  opponent: string;
  date: string;
  competition: string;
  isHome: boolean;
  score?: string;
}

// --- Mock Data ---
const SQUAD: Player[] = [
  { id: 1, name: "Dušan Vlahović", position: "Attaccante", number: 9, image: "https://picsum.photos/seed/vlahovic/400/500" },
  { id: 2, name: "Kenan Yıldız", position: "Attaccante", number: 10, image: "https://picsum.photos/seed/yildiz/400/500" },
  { id: 3, name: "Teun Koopmeiners", position: "Centrocampista", number: 8, image: "https://picsum.photos/seed/koop/400/500" },
  { id: 4, name: "Douglas Luiz", position: "Centrocampista", number: 26, image: "https://picsum.photos/seed/dluiz/400/500" },
  { id: 5, name: "Michele Di Gregorio", position: "Portiere", number: 29, image: "https://picsum.photos/seed/digre/400/500" },
  { id: 6, name: "Andrea Cambiaso", position: "Difensore", number: 27, image: "https://picsum.photos/seed/cambiaso/400/500" },
];

const MATCHES: Match[] = [
  { id: 1, opponent: "Napoli", date: "22 Feb 2026", competition: "Serie A", isHome: true },
  { id: 2, opponent: "Manchester City", date: "03 Mar 2026", competition: "Champions League", isHome: false },
  { id: 3, opponent: "Lazio", date: "15 Mar 2026", competition: "Serie A", isHome: true },
];

const PALMARES = [
  { name: "Scudetti", count: 36, icon: Trophy },
  { name: "Coppe Italia", count: 15, icon: Shield },
  { name: "Supercoppe ITA", count: 9, icon: TrendingUp },
  { name: "Champions League", count: 2, icon: Trophy },
  { name: "Coppe UEFA", count: 3, icon: Trophy },
  { name: "Intercontinentali", count: 2, icon: Trophy },
];

const LEGENDARY_10S = [
  { name: "Omar Sivori", years: "1957-1965", desc: "Il primo Pallone d'Oro bianconero." },
  { name: "Michel Platini", years: "1982-1987", desc: "Le Roi. Tre Palloni d'Oro consecutivi." },
  { name: "Roberto Baggio", years: "1990-1995", desc: "Il Divin Codino. Genio e fantasia." },
  { name: "Alessandro Del Piero", years: "1993-2012", desc: "Pinturicchio. Il capitano dei record." },
  { name: "Kenan Yıldız", years: "2024-Oggi", desc: "Il futuro. Talento puro e personalità." },
];

const MOCK_FAN_MESSAGES = [
  { id: 1, user: "Marco89", message: "Sempre al tuo fianco, in ogni stadio. Forza Juve!", date: "Oggi" },
  { id: 2, user: "Giulia_Bianconera", message: "Thiago Motta ci porterà lontano. Bel gioco e grinta!", date: "Ieri" },
  { id: 3, user: "JuveFanatic", message: "Il mito di Del Piero non morirà mai. Fino alla fine.", date: "2 giorni fa" },
];

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-panel border-b-0">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-14 bg-white flex flex-col gap-1 p-1">
             <div className="flex-1 bg-black"></div>
             <div className="flex-1 bg-black"></div>
          </div>
          <span className="font-display text-2xl font-bold tracking-tighter">JUVENTUS</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest">
          <a href="#news" className="hover:text-juve-gold transition-colors">News</a>
          <a href="#history" className="hover:text-juve-gold transition-colors">Storia</a>
          <a href="#squad" className="hover:text-juve-gold transition-colors">Squadra</a>
          <a href="#fans" className="hover:text-juve-gold transition-colors">Tifosi</a>
          <a href="#matches" className="hover:text-juve-gold transition-colors">Partite</a>
          <a href="#assistant" className="px-4 py-2 bg-white text-black rounded-full hover:bg-juve-gold transition-colors">J-Assistant</a>
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 w-full bg-black border-b border-white/10 p-6 flex flex-col gap-4 md:hidden"
          >
            <a href="#news" onClick={() => setIsOpen(false)}>News</a>
            <a href="#history" onClick={() => setIsOpen(false)}>Storia</a>
            <a href="#squad" onClick={() => setIsOpen(false)}>Squadra</a>
            <a href="#fans" onClick={() => setIsOpen(false)}>Tifosi</a>
            <a href="#matches" onClick={() => setIsOpen(false)}>Partite</a>
            <a href="#assistant" onClick={() => setIsOpen(false)}>J-Assistant</a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => (
  <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
    <div className="absolute inset-0 z-0">
      <img 
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7t-xLnWgbcLCO3vsPFbigrInOAxuIru_lsw&s" 
        className="w-full h-full object-cover opacity-50 scale-105 animate-pulse-slow"
        alt="Allianz Stadium"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-juve-black via-juve-black/20 to-juve-black/60"></div>
    </div>
    
    <div className="relative z-10 text-center px-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="text-juve-gold font-mono text-sm tracking-[0.3em] uppercase mb-4 block">Stagione 2025 / 2026</span>
        <h1 className="font-display text-7xl md:text-9xl font-bold mb-6 tracking-tighter leading-none">
          FINO ALLA <br /> <span className="italic">FINE.</span>
        </h1>
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
          L'eccellenza, la storia, il futuro. Benvenuti nella nuova era bianconera sotto la guida di Thiago Motta.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest rounded-full hover:bg-juve-gold transition-all transform hover:scale-105">
            Scopri la Squadra
          </button>
          <button className="px-8 py-4 border border-white/20 rounded-full font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
            Ultimi Risultati
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);

const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mb-12">
    <span className="text-juve-gold font-mono text-xs tracking-widest uppercase mb-2 block">{subtitle}</span>
    <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">{title}</h2>
  </div>
);

const HistorySection = () => (
  <section id="history" className="py-24 px-6 max-w-7xl mx-auto border-b border-white/5">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div>
        <SectionHeader title="Oltre un Secolo di Gloria" subtitle="La Nostra Storia" />
        <div className="space-y-6 text-white/60 leading-relaxed font-light">
          <p>
            Fondata il 1° novembre 1897 da un gruppo di studenti del liceo classico Massimo d'Azeglio, 
            la Juventus è diventata il club più titolato e iconico d'Italia. 
          </p>
          <p>
            Dalla prima maglia rosa all'adozione delle iconiche strisce bianconere nel 1903, 
            la storia della "Vecchia Signora" è un intreccio di successi leggendari, 
            campioni indimenticabili e un legame indissolubile con la famiglia Agnelli che dura dal 1923.
          </p>
          <div className="grid grid-cols-2 gap-8 pt-8">
            {PALMARES.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-juve-gold">
                  <item.icon size={20} />
                </div>
                <div>
                  <div className="text-2xl font-display font-bold">{item.count}</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40">{item.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="relative aspect-square">
        <img 
          src="https://picsum.photos/seed/history/800/800?grayscale" 
          alt="Juventus History" 
          className="w-full h-full object-cover rounded-3xl opacity-50"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 border-2 border-juve-gold/20 rounded-3xl translate-x-4 translate-y-4 -z-10"></div>
      </div>
    </div>
  </section>
);

const Number10Section = () => (
  <section className="py-24 px-6 max-w-7xl mx-auto">
    <SectionHeader title="Il Mito della Dieci" subtitle="I Grandi Numeri 10" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {LEGENDARY_10S.map((legend, idx) => (
        <motion.div 
          key={idx}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="glass-panel p-6 rounded-2xl hover:bg-white/10 transition-all group"
        >
          <div className="text-4xl font-display font-bold text-juve-gold mb-4 opacity-20 group-hover:opacity-100 transition-opacity">10</div>
          <h4 className="font-bold text-lg mb-1">{legend.name}</h4>
          <p className="text-[10px] text-juve-gold font-mono uppercase tracking-widest mb-4">{legend.years}</p>
          <p className="text-xs text-white/40 leading-relaxed">{legend.desc}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

const FansSection = () => {
  const [messages, setMessages] = useState(MOCK_FAN_MESSAGES);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newMessage.trim()) return;
    
    const msg = {
      id: Date.now(),
      user: newName,
      message: newMessage,
      date: "Adesso"
    };
    
    setMessages([msg, ...messages]);
    setNewName('');
    setNewMessage('');
  };

  return (
    <section id="fans" className="py-24 bg-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1">
            <SectionHeader title="Il Muro dei Tifosi" subtitle="Community" />
            <p className="text-white/60 mb-8 font-light">
              Lascia il tuo messaggio per la squadra. La voce dei tifosi è il nostro dodicesimo uomo in campo.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" 
                placeholder="Il tuo nome"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-juve-gold outline-none transition-colors"
              />
              <textarea 
                placeholder="Scrivi il tuo messaggio..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={4}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-juve-gold outline-none transition-colors resize-none"
              ></textarea>
              <button 
                type="submit"
                className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-juve-gold transition-colors"
              >
                Invia Messaggio
              </button>
            </form>
          </div>
          
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-panel p-6 rounded-2xl border-l-4 border-l-juve-gold"
                  >
                    <p className="text-sm italic mb-4 text-white/80">"{msg.message}"</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-widest">{msg.user}</span>
                      <span className="text-[10px] text-white/20 font-mono">{msg.date}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SquadSection = () => (
  <section id="squad" className="py-24 px-6 max-w-7xl mx-auto">
    <SectionHeader title="I Protagonisti" subtitle="La Rosa 2025/26" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {SQUAD.map((player, idx) => (
        <motion.div 
          key={player.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          viewport={{ once: true }}
          className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/5"
        >
          <img 
            src={player.image} 
            alt={player.name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
          <div className="absolute bottom-0 left-0 p-8 w-full">
            <span className="text-5xl font-display font-bold text-white/20 absolute top-4 right-8">{player.number}</span>
            <p className="text-juve-gold text-xs font-mono uppercase tracking-widest mb-1">{player.position}</p>
            <h3 className="text-2xl font-bold tracking-tight">{player.name}</h3>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

const MatchSection = () => (
  <section id="matches" className="py-24 bg-white/5">
    <div className="max-w-7xl mx-auto px-6">
      <SectionHeader title="Calendario & Risultati" subtitle="Prossimi Impegni" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MATCHES.map((match) => (
          <div key={match.id} className="glass-panel p-8 rounded-3xl flex flex-col justify-between h-64 hover:border-white/30 transition-colors cursor-pointer group">
            <div>
              <div className="flex justify-between items-start mb-6">
                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest">{match.competition}</span>
                <span className="text-white/40 text-xs font-mono">{match.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black font-bold">J</div>
                  <span className="text-xs font-bold uppercase">Juventus</span>
                </div>
                <div className="text-2xl font-display font-bold italic text-white/20">VS</div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-bold">{match.opponent[0]}</div>
                  <span className="text-xs font-bold uppercase">{match.opponent}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
              <span className="text-xs text-white/40">{match.isHome ? 'Allianz Stadium' : 'Trasferta'}</span>
              {match.score ? (
                <span className="font-bold text-juve-gold">{match.score}</span>
              ) : (
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const AIChat = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: "Ciao! Sono J-Assistant. Chiedimi qualsiasi cosa sulla Juventus 2025/26!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const response = await askJAssistant(userMsg);
    setMessages(prev => [...prev, { role: 'assistant', content: response || "Errore di connessione." }]);
    setIsLoading(false);
  };

  return (
    <section id="assistant" className="py-24 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-juve-gold/10 text-juve-gold rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          <MessageSquare size={14} />
          AI Powered
        </div>
        <h2 className="font-display text-5xl font-bold mb-4">J-Assistant</h2>
        <p className="text-white/60">Il tuo filo diretto con il mondo bianconero.</p>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden flex flex-col h-[500px]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.map((msg, i) => (
            <div key={i} className={cn(
              "flex flex-col max-w-[80%]",
              msg.role === 'user' ? "ml-auto items-end" : "items-start"
            )}>
              <div className={cn(
                "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user' ? "bg-white text-black" : "bg-white/10 text-white"
              )}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest mt-1 opacity-30">
                {msg.role === 'user' ? 'Tu' : 'J-Assistant'}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-white/30 text-xs font-mono animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" />
              J-Assistant sta scrivendo...
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-white/10 flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Chiedi di Vlahovic, Motta o della storia..."
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 text-sm focus:outline-none focus:border-juve-gold transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-juve-gold transition-colors disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="py-20 border-t border-white/10">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-8 h-12 bg-white flex flex-col gap-1 p-1">
             <div className="flex-1 bg-black"></div>
             <div className="flex-1 bg-black"></div>
          </div>
          <span className="font-display text-xl font-bold tracking-tighter">JUVENTUS</span>
        </div>
        <p className="text-white/40 text-sm max-w-sm leading-relaxed">
          Sito fan non ufficiale dedicato alla Juventus Football Club. 
          Tutti i marchi appartengono ai rispettivi proprietari. 
          Fino alla fine, forza Juventus.
        </p>
      </div>
      
      <div>
        <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-6">Link Rapidi</h4>
        <ul className="space-y-4 text-sm text-white/60">
          <li><a href="#" className="hover:text-white transition-colors">Biglietteria</a></li>
          <li><a href="#" className="hover:text-white transition-colors">J-Store</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Membership</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Juventus TV</a></li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-6">Social</h4>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer">IG</div>
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer">X</div>
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer">FB</div>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 text-[10px] text-white/20 uppercase tracking-widest flex justify-between">
      <span>© 2026 Juventus Fan Portal</span>
      <span>Made with passion for the Bianconeri</span>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="min-h-screen selection:bg-juve-gold selection:text-black">
      <Navbar />
      <Hero />
      <HistorySection />
      <Number10Section />
      <FansSection />
      <SquadSection />
      <MatchSection />
      <AIChat />
      <Footer />
    </div>
  );
}

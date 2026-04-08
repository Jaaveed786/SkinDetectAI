import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

const ChatbotModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [locationStep, setLocationStep] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Initial welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome', sender: 'ai', timestamp: new Date(),
        text: `Hello ${user?.name || 'there'}! I am the SkinDetect advanced triage AI. Please describe your symptoms or ask me any dermatological questions. (e.g. "I have red itchy spots on my arm")`
      }]);
    }
  }, [isOpen, messages.length, user]);

  const [isLoading, setIsLoading] = useState(false);

  const getLocalFallback = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes('diet') || t.includes('eat') || t.includes('nutrition')) {
      return "A skin-friendly diet is crucial. Focus on antioxidants found in berries, leafy greens, and fatty fish (Omega-3). Avoid excessive sugar and processed dairy, which can trigger inflammation.";
    }
    if (t.includes('bath') || t.includes('wash') || t.includes('water') || t.includes('drink')) {
      return "For sensitive skin, use lukewarm (not hot) water. Keep showers under 10 minutes. Drinking at least 2-3 liters of water daily helps maintain skin elasticity and moisture levels.";
    }
    if (t.includes('care') || t.includes('routine') || t.includes('product') || t.includes('cream')) {
      return "A basic routine: Gentle cleanser, hydrating moisturizer (ceramides are great), and SPF 30+ sunscreen daily—even indoors. Avoid products with heavy fragrances or drying alcohols.";
    }
    if (t.includes('groom') || t.includes('shave') || t.includes('razor')) {
      return "Grooming tips: Sanitize tools weekly, use fresh towels, and keep nails short to avoid scratching. If shaving near an affected area, use a single-blade razor and plenty of lubricant.";
    }
    return null;
  };

  const generateAIResponse = async (userText: string) => {
    const text = userText.toLowerCase();
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    // Keyword based simulation to mimic live LLM for quick responses
    if (text.includes('itchy') || text.includes('red') || text.includes('rash')) {
      setLocationStep(true);
      return "It sounds like you may be experiencing dermatitis, an allergic reaction, or a localized infection. Exactly which part of your body is this located on?";
    }
    
    if (locationStep) {
      setLocationStep(false);
      return `Thank you for specifying. Based on this location and your symptoms, I highly recommend using the '3D Scan' tool on your dashboard to capture an image for EfficientNet analysis. In the meantime, do not scratch the area and apply a mild cold compress.`;
    }

    if (text.includes('melanoma') || text.includes('cancer')) {
      return "Melanoma is a serious form of skin cancer. Look out for the ABCDEs: Asymmetry, Border irregularity, Color changes, Diameter over 6mm, and Evolving shape. If you suspect a mole has changed, please upload a picture to the scanner immediately or consult a dermatologist.";
    }

    if (text.includes('acne') || text.includes('pimple')) {
      return "For acne, ensure you are using non-comedogenic products. Try washing your face twice daily with a salicylic acid or benzoyl peroxide cleanser. If it's cystic, a dermatologist might prescribe topical retinoids.";
    }

    // OpenAI Integration Implementation
    if (!apiKey) {
      const fallback = getLocalFallback(text);
      if (fallback) return fallback;
      return "I have noted your concern. For the most accurate assessment, please navigate to the Patient Dashboard and upload a clear, well-lit image of the affected area for AI analysis. (OpenAI integration is currently inactive)";
    }

    try {
      const history = messages.map(m => ({
        role: m.sender === 'ai' ? 'assistant' : 'user',
        content: m.text
      }));
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are the SkinDetect triage AI. Help users with dermatological symptoms. Be concise, professional, and always recommend seeing a doctor or using the 3D Scan tool for serious issues.' },
            ...history,
            { role: 'user', content: userText }
          ],
          max_tokens: 150
        })
      });

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (err) {
      // Robust Fallback Logic for Education & Assistance
      const fallback = getLocalFallback(text);
      if (fallback) return fallback;
      return "I'm currently operating in offline mode. While I can't access live data, I recommend checking the 'Dermatological Guide' on your dashboard for detailed skin health advice, or uploading a photo for AI analysis.";
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const newUserMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await generateAIResponse(newUserMsg.text);
    const newAiMsg: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: responseText, timestamp: new Date() };
    setMessages(prev => [...prev, newAiMsg]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      <button 
        title="Open Chatbot"
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-[0_10px_25px_rgba(45,212,191,0.5)] hover:scale-110 hover:bg-teal-400 transition-all z-40 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <MessageSquare size={28} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh] bg-white dark:bg-slate-900 border border-teal-500/30 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-4 flex justify-between items-center shadow-md z-10">
              <div className="flex items-center gap-3 text-white">
                <div className="bg-white/20 p-2 rounded-full"><Bot size={20} /></div>
                <div>
                  <h4 className="font-black uppercase text-sm tracking-widest">Medical AI Assist</h4>
                  <p className="text-[10px] font-medium opacity-80 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span> Online Engine</p>
                </div>
              </div>
              <button title="Close" onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors"><X size={24} /></button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/50 custom-scrollbar relative">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 text-sm font-medium shadow-sm leading-relaxed
                    ${msg.sender === 'user' 
                      ? 'bg-teal-500 text-white rounded-br-sm' 
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-sm'}`}
                  >
                    {msg.sender === 'ai' && locationStep && msg.id === messages[messages.length-1].id ? (
                       <span className="flex items-center gap-2 mb-2 text-brand-coral uppercase font-black text-[10px] tracking-widest border-b border-slate-100 dark:border-slate-700 pb-1"><MapPin size={12}/> AI Parameter Query</span>
                    ) : null}
                    {msg.text}
                    <div className={`text-[9px] mt-2 opacity-60 flex items-center gap-1 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                       {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                title="Chat Input"
                placeholder="Type symptoms or ask a question..." 
                className="flex-1 bg-slate-100 dark:bg-slate-800 border-none p-3 px-4 rounded-xl text-sm outline-none text-slate-800 dark:text-white focus:ring-2 focus:ring-teal-500 transition-all font-medium"
              />
              <button 
                title="Send Message"
                onClick={handleSend}
                className="bg-teal-500 text-white p-3 rounded-xl hover:bg-teal-400 transition-colors shadow-md disabled:bg-slate-300 dark:disabled:bg-slate-700"
                disabled={!input.trim() || isLoading}
              >
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotModal;

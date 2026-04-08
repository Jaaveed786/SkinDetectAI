import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, X, ChevronRight } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  type: 'boolean' | 'multiple';
  options?: string[];
}

const QUESTIONS: Question[] = [
  { id: 1, text: "Is the lesion currently bleeding?", type: "boolean" },
  { id: 2, text: "Is the infected area itching?", type: "boolean" },
  { id: 3, text: "Has the lesion changed size or shape recently?", type: "boolean" },
  { id: 4, text: "Is it painful or tender to the touch?", type: "boolean" },
  { id: 5, text: "What is the approximate duration of this symptom?", type: "multiple", options: ["Days", "Weeks", "Months", "Years"] },
  { id: 6, text: "Do you have a family history of skin cancer?", type: "boolean" },
  { id: 7, text: "Have you been exposed to prolonged UV sunlight recently?", type: "boolean" },
  { id: 8, text: "Are there uneven borders visible on the spot?", type: "boolean" }
];

// VIVA NOTE: React & State Management
// Why React? It allows building reusable components with efficient reconciliation.
// 'useState' is a Hook that lets us add 'state' (like currentStep) to functional components.
// 'framer-motion' is used for declarative, hardware-accelerated animations (fade/slide).
export default function DiagnosticMCQForm({ onComplete, onCancel }: { onComplete: (symptoms: string[]) => void, onCancel: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | boolean>>({});

  const handleAnswer = (answer: string | boolean) => {
    const newAnswers = { ...answers, [QUESTIONS[currentStep].id]: answer };
    setAnswers(newAnswers);
    
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Completed all 8 questions
      const collectedSymptoms = Object.entries(newAnswers).map(([id, val]) => {
        const q = QUESTIONS.find(q => q.id === parseInt(id));
        return `${q?.text}: ${val}`;
      });
      onComplete(collectedSymptoms);
    }
  };

  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-2xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-teal-500/30 rounded-[40px] shadow-2xl relative flex flex-col max-h-[90vh]"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 shrink-0">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-teal-500"
          />
        </div>

        <div className="p-6 md:p-10 flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-6 md:mb-10 shrink-0">
            <h3 className="text-xl font-black text-teal-600 dark:text-teal-400 uppercase flex items-center gap-2">
              <Activity size={24} /> Pre-Scan
            </h3>
            <button onClick={onCancel} title="Cancel Scan" className="text-slate-400 hover:text-brand-coral transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <div className="min-h-[200px] flex flex-col justify-center text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 md:space-y-8"
                >
                  <div className="text-[10px] font-black text-teal-500/50 uppercase tracking-[0.2em]">
                    Question {currentStep + 1} of {QUESTIONS.length}
                  </div>
                  <h4 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white leading-tight uppercase tracking-tighter">
                    {QUESTIONS[currentStep].text}
                  </h4>

                  <div className="flex flex-col gap-4 mt-6 md:mt-8">
                    {QUESTIONS[currentStep].type === 'boolean' ? (
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          title="Yes"
                          onClick={() => handleAnswer(true)}
                          className="py-4 md:py-5 rounded-3xl border-2 border-teal-500/20 bg-teal-500/5 hover:bg-teal-500 text-teal-600 dark:text-teal-400 hover:text-white font-black uppercase transition-all duration-300 shadow-lg text-sm tracking-widest"
                        >
                          Yes
                        </button>
                        <button 
                          title="No"
                          onClick={() => handleAnswer(false)}
                          className="py-4 md:py-5 rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-white font-black uppercase transition-all duration-300 shadow-lg text-sm tracking-widest"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {QUESTIONS[currentStep].options?.map(opt => (
                          <button 
                            key={opt}
                            title={opt}
                            onClick={() => handleAnswer(opt)}
                            className="py-4 px-6 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-teal-500 text-slate-700 dark:text-slate-200 font-black text-xs uppercase transition-all shadow-md flex justify-between items-center group tracking-widest"
                          >
                            {opt} <ChevronRight size={18} className="text-slate-400 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

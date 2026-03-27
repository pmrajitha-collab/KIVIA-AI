import React, { useState } from 'react';
import { Type } from "@google/genai";
import { Flashcard } from '../types';
import Logo from './Logo';
import { getAI } from '../services/gemini';

interface FlashcardGeneratorViewProps {
  groupId: string;
  onBack: () => void;
  onCardsGenerated: (cards: Flashcard[]) => void;
}

const FlashcardGeneratorView: React.FC<FlashcardGeneratorViewProps> = ({ groupId, onBack, onCardsGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deckSize, setDeckSize] = useState('10');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    
    try {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Specific Instruction: ${prompt}\nTarget Deck Size: ${deckSize}`,
        config: {
          systemInstruction: "You are an expert academic tutor. Create a series of active-recall flashcards based on the user's specific prompt. Each card must have a 'term' and a 'definition'. Ensure high academic quality and clear definitions.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING },
                definition: { type: Type.STRING },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["term", "definition", "tags"]
            }
          }
        }
      });

      const parsed = JSON.parse(response.text || "[]");
      const formatted: Flashcard[] = parsed.map((c: any) => ({
        ...c,
        id: Date.now().toString() + Math.random(),
        groupId: groupId
      }));

      onCardsGenerated(formatted);
      alert(`Successfully generated ${formatted.length} new flashcards!`);
      onBack();
    } catch (err) {
      console.error(err);
      alert("Flashcard generation failed. Try rephrasing your instructions.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50/50">
      <div className="p-8 border-b border-slate-100 bg-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-white hover:bg-slate-50 rounded-2xl shadow-sm border border-slate-200 transition-all text-slate-400 hover:text-slate-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Generator</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Flashcard Generator</h2>
          </div>
        </div>
        <Logo className="w-12 h-12 text-slate-900" />
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-12 border border-slate-200 shadow-sm space-y-10 animate-in zoom-in-95 duration-500">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">Generate study cards with AI</h3>
            <p className="text-slate-500 font-medium">Describe the subject, difficulty, and focus area. The AI will create high-quality active recall cards based on your instructions.</p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-8">
            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Instructions</label>
              <textarea 
                required
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="E.g. Create 15 cards about Cellular Respiration focusing on the Krebs Cycle and Electron Transport Chain. Assume an undergraduate level."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-8 py-6 text-sm focus:bg-white focus:border-slate-400 outline-none transition-all font-medium min-h-[200px] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Deck Size</label>
                <select 
                  value={deckSize}
                  onChange={e => setDeckSize(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:bg-white outline-none font-medium transition-all"
                >
                  <option value="5">5 Cards (Quick Review)</option>
                  <option value="10">10 Cards (Balanced)</option>
                  <option value="20">20 Cards (Deep Dive)</option>
                  <option value="30">30 Cards (Exam Prep)</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              )}
              {isLoading ? 'Generating Cards...' : 'Generate Deck'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FlashcardGeneratorView;
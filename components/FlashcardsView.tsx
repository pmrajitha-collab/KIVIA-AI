
import React, { useState } from 'react';
import { Flashcard } from '../types';
import Logo from './Logo';

interface FlashcardsViewProps {
  flashcards: Flashcard[];
  onGenerate: () => void;
  isGenerating: boolean;
  onBack: () => void;
}

const FlashcardsView: React.FC<FlashcardsViewProps> = ({ flashcards, onGenerate, isGenerating, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const activeCard = flashcards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50/20">
      <div className="p-8 border-b border-gray-100 bg-white/50 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-6 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-white hover:bg-gray-100 rounded-2xl shadow-sm border border-gray-100 transition-all text-gray-400 hover:text-indigo-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">Active Recall</span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Study Flashcards</h2>
            <p className="text-sm text-gray-500 font-medium mt-1">AI-powered cards generated from your group's notes.</p>
          </div>
        </div>
        <button 
          onClick={onGenerate}
          disabled={isGenerating}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {isGenerating ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          )}
          {isGenerating ? 'Syncing with Notes...' : 'Regenerate Deck'}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {flashcards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white/50 border-2 border-dashed border-gray-100 rounded-[3rem] max-w-2xl w-full">
            <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-yellow-100 flex items-center justify-center mb-10 text-yellow-200">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Deck is Empty</h3>
            <p className="text-gray-500 max-w-sm mt-3 font-medium mx-auto">Click "Regenerate Deck" and SARA will turn your group's notes into flashcards.</p>
          </div>
        ) : (
          <div className="w-full max-w-2xl space-y-12">
            <div className="perspective-1000 h-96 relative group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
              <div className={`w-full h-full duration-500 preserve-3d transition-transform relative ${isFlipped ? 'rotate-y-180' : ''}`}>
                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-white rounded-[3rem] border border-gray-100 shadow-2xl p-12 flex flex-col items-center justify-center text-center">
                   <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6">Question / Term</span>
                   <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">{activeCard.term}</h3>
                   <p className="mt-auto text-[10px] font-black text-gray-300 uppercase tracking-widest">Tap to flip</p>
                </div>
                
                {/* Back */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-600 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center text-white">
                   <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-6">Answer / Definition</span>
                   <p className="text-xl font-medium leading-relaxed">{activeCard.definition}</p>
                   <p className="mt-auto text-[10px] font-black text-indigo-300 uppercase tracking-widest">Tap to reveal term</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-8">
              <div className="flex items-center gap-6">
                <button onClick={handlePrev} className="p-4 bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl shadow-sm text-gray-400 hover:text-indigo-600 transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
                   <span className="text-sm font-black text-gray-900">Card {currentIndex + 1} of {flashcards.length}</span>
                </div>
                <button onClick={handleNext} className="p-4 bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl shadow-sm text-gray-400 hover:text-indigo-600 transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {activeCard.tags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-xl">#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default FlashcardsView;

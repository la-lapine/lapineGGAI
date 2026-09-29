import React from 'react';
import { CharacterBot } from '../types';
import { RandomBotSlotMachine } from './RandomBotSlotMachine';

interface RandomBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  bots: CharacterBot[];
  onSelectBot: (bot: CharacterBot) => void;
}

export const RandomBotModal: React.FC<RandomBotModalProps> = ({
  isOpen,
  onClose,
  bots,
  onSelectBot,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in"
    >
      <div className="relative w-full max-w-2xl animate-in zoom-in-95 duration-200">
        <RandomBotSlotMachine
          bots={bots}
          onSelectBot={(bot) => {
            onClose();
            onSelectBot(bot);
          }}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

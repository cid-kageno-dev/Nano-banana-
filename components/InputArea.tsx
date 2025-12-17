import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X, Loader2, Wand2 } from 'lucide-react';
import { ImageAttachment } from '../types';

interface InputAreaProps {
  onSendMessage: (text: string, attachment: ImageAttachment | null) => void;
  isLoading: boolean;
  selectedImage: ImageAttachment | null;
  onClearSelectedImage: () => void;
  onSetSelectedImage: (img: ImageAttachment) => void;
}

const InputArea: React.FC<InputAreaProps> = ({ 
  onSendMessage, 
  isLoading, 
  selectedImage, 
  onClearSelectedImage,
  onSetSelectedImage
}) => {
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [inputText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if ((!inputText.trim() && !selectedImage) || isLoading) return;
    onSendMessage(inputText, selectedImage);
    setInputText('');
    onClearSelectedImage();
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      const mimeType = file.type;

      onSetSelectedImage({
        data: base64Data,
        mimeType: mimeType
      });
    };
    reader.readAsDataURL(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto flex flex-col gap-3">
        
        {/* Selected Image Floating Pill */}
        {selectedImage && (
          <div className="flex items-center gap-4 bg-black/60 backdrop-blur-xl p-2 pr-4 rounded-[1.5rem] border border-white/10 w-fit animate-fade-in-up shadow-2xl mx-2">
            <div className="relative h-14 w-14 rounded-2xl overflow-hidden border border-white/20">
               <img 
                 src={`data:${selectedImage.mimeType};base64,${selectedImage.data}`} 
                 alt="Preview" 
                 className="h-full w-full object-cover"
               />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-white/50 font-medium uppercase tracking-wider">Reference</span>
              <span className="text-sm text-indigo-300 font-medium">Ready to edit</span>
            </div>
            <button 
              onClick={onClearSelectedImage}
              className="ml-2 p-1.5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Floating Glass Dock Input */}
        <div className="relative group mx-2">
          {/* Glowing backlight effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-[2rem] opacity-20 blur group-focus-within:opacity-40 transition duration-500"></div>
          
          <div className="relative flex items-end gap-3 bg-black/40 backdrop-blur-2xl p-2 rounded-[2rem] border border-white/10 shadow-2xl transition-all">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            
            <button
              onClick={triggerFileInput}
              className="p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 active:scale-95"
              title="Upload image"
            >
              <Paperclip size={22} strokeWidth={1.5} />
            </button>

            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={selectedImage ? "How should I change this?" : "Imagine something..."}
              className="flex-1 bg-transparent text-white placeholder-white/40 text-[16px] py-3 focus:outline-none resize-none max-h-[150px] min-h-[24px]"
              rows={1}
            />

            <button
              onClick={handleSend}
              disabled={isLoading || (!inputText.trim() && !selectedImage)}
              className={`p-3 rounded-full mb-0.5 transition-all duration-300 shadow-lg ${
                isLoading || (!inputText.trim() && !selectedImage)
                  ? 'bg-white/5 text-white/20 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95'
              }`}
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className={inputText.trim() ? "ml-0.5" : ""} />}
            </button>
          </div>
        </div>
        
        <div className="text-center pb-2">
            <p className="text-[10px] text-white/20 font-light tracking-widest uppercase">
                Gemini 2.5 Flash Image
            </p>
        </div>
      </div>
    </div>
  );
};

export default InputArea;

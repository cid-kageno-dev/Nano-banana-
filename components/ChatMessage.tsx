import React from 'react';
import { Message, Role, ImageAttachment } from '../types';
import { Download, Edit2, Sparkles } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  onSelectImageForEdit: (image: ImageAttachment) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSelectImageForEdit }) => {
  const isUser = message.role === Role.USER;

  const handleDownload = (img: ImageAttachment) => {
    const link = document.createElement('a');
    link.href = `data:${img.mimeType};base64,${img.data}`;
    link.download = `nano-banana-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`flex w-full mb-8 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`relative max-w-[85%] sm:max-w-[70%] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border backdrop-blur-2xl ${
          isUser
            ? 'rounded-[2rem] rounded-br-sm bg-gradient-to-br from-blue-600/80 to-indigo-600/80 border-white/10 text-white'
            : 'rounded-[2rem] rounded-bl-sm bg-white/5 border-white/10 text-slate-100'
        }`}
      >
        {/* Render Text Content */}
        {message.text && (
          <p className={`whitespace-pre-wrap text-[15px] sm:text-base leading-relaxed font-light ${isUser ? 'text-white' : 'text-slate-200'}`}>
            {message.text}
          </p>
        )}

        {/* Render Image Content */}
        {message.images && message.images.length > 0 && (
          <div className={`flex flex-wrap gap-4 ${message.text ? 'mt-4' : ''}`}>
            {message.images.map((img, idx) => (
              <div key={idx} className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src={`data:${img.mimeType};base64,${img.data}`}
                  alt="Content"
                  className="max-w-full h-auto max-h-[500px] object-contain bg-black/20"
                />
                
                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">
                  <button
                    onClick={() => handleDownload(img)}
                    className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-all hover:scale-110 active:scale-95 shadow-lg backdrop-blur-md"
                    title="Download Image"
                  >
                    <Download size={22} />
                  </button>
                  <button
                    onClick={() => onSelectImageForEdit(img)}
                    className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-all hover:scale-110 active:scale-95 shadow-lg backdrop-blur-md"
                    title="Edit this image"
                  >
                    <Edit2 size={22} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Subtle glow for AI messages */}
        {!isUser && (
           <div className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-indigo-500/50 blur-xl"></div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;

import React, { useState, useRef, useEffect } from 'react';
import { generateOrEditImage } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import InputArea from './components/InputArea';
import { Message, Role, ImageAttachment } from './types';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: Role.MODEL,
      text: "Hello! I'm Nano Banana Studio.\n\nI can generate new images from text, or if you upload an image (or select one from our chat), I can edit it based on your instructions.\n\nTry saying \"A cyberpunk city\" or upload a photo and say \"Make it look like a sketch\".",
      timestamp: Date.now(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageAttachment | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string, attachment: ImageAttachment | null) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: text,
      images: attachment ? [attachment] : undefined,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Use the attachment if provided (editing mode), otherwise undefined (generation mode)
      const inputImageBase64 = attachment ? attachment.data : undefined;
      const inputMimeType = attachment ? attachment.mimeType : undefined;

      const result = await generateOrEditImage(text, inputImageBase64, inputMimeType);

      const modelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: result.text || (result.images.length > 0 ? "Here is your image:" : "I couldn't generate an image, please try again."),
        images: result.images,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectImageForEdit = (img: ImageAttachment) => {
    setSelectedImage(img);
  };

  return (
    <div className="flex flex-col h-screen text-slate-100 font-sans z-10 relative">
      {/* Floating Glass Header */}
      <header className="flex-none h-20 flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full py-2 px-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
          <div className="bg-gradient-to-tr from-yellow-400 to-amber-500 text-black p-1.5 rounded-full shadow-lg shadow-yellow-500/20">
             <ImageIcon size={18} />
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-white/90">Nano Banana <span className="text-white/40 font-light">Studio</span></h1>
        </div>
        
        <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold hidden sm:block backdrop-blur-md">
                Gemini 2.5 Flash
            </span>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth z-10">
        <div className="max-w-4xl mx-auto flex flex-col min-h-full pb-4">
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-white/20">
              <div className="p-8 rounded-full bg-white/5 border border-white/5 backdrop-blur-3xl shadow-2xl mb-6">
                 <Sparkles size={48} className="text-white/40" />
              </div>
              <p className="text-lg font-light tracking-wide">Start creating...</p>
            </div>
          )}
          
          {messages.map((msg) => (
            <ChatMessage 
              key={msg.id} 
              message={msg} 
              onSelectImageForEdit={handleSelectImageForEdit}
            />
          ))}

          {isLoading && (
            <div className="flex justify-start w-full mb-6">
               <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] rounded-bl-none px-6 py-4 border border-white/10 flex items-center gap-3 shadow-lg">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-[bounce_1s_infinite]" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-[bounce_1s_infinite]" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-[bounce_1s_infinite]" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm text-indigo-200/60 font-medium tracking-wide">Dreaming...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="flex-none z-20 pb-4 px-4">
        <InputArea 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading} 
          selectedImage={selectedImage}
          onClearSelectedImage={() => setSelectedImage(null)}
          onSetSelectedImage={setSelectedImage}
        />
      </footer>
    </div>
  );
};

export default App;

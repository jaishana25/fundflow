import { useState, useRef, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { Message } from '../types/chat';
import { generateId } from '../utils/chat-helpers';
import axios from 'axios'; // Import axios

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: 'assistant',
      content: 'Welcome to FundFlow! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ]);

  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAnswer = async (content: string) => {
    setGeneratingAnswer(true);
  
    // Check if the user's message relates to blockchain or asset transfer
    const isBlockchainRelated = content.toLowerCase().includes("transfer") && 
                                 (content.toLowerCase().includes("blockchain") || content.toLowerCase().includes("asset"));
  
    let aiAnswer = '';
  
    if (isBlockchainRelated) {
      // Provide a specific answer related to blockchain asset transfer
      aiAnswer = `
        To transfer assets on the blockchain, you typically need:
        1. A cryptocurrency wallet (e.g., MetaMask, Trust Wallet).
        2. The recipient's wallet address.
        3. Sufficient funds (e.g., ETH for Ethereum transactions).
        4. A network fee (gas fee).
  
        The steps to transfer assets are as follows:
        1. Open your wallet app and ensure it's connected to the correct network (e.g., Ethereum, Binance Smart Chain).
        2. Enter the recipient’s wallet address.
        3. Specify the amount to send and confirm the transaction.
        4. Pay the transaction fee (gas fee).
        5. Wait for confirmation of the transaction on the blockchain.
  
        Ensure you double-check the recipient address, as transactions on the blockchain are irreversible.
      `;
    } else {
      try {
        // Make API request to get a general response
        const response = await axios({
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBMT22ZcvsQ_5dm19TPha5uSFaJ7IlasYU`,
          method: 'post',
          data: {
            contents: [{ parts: [{ text: content }] }],
          },
        });
  
        aiAnswer = response.data.candidates[0].content.parts[0].text;
      } catch (error) {
        console.log(error);
        aiAnswer = 'Sorry, something went wrong. Please try again!';
      }
    }
  
    setGeneratingAnswer(false);
    return aiAnswer;
  };
  

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Add the assistant's "Loading your response..." bubble
    const aiLoadingMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: 'Loading your response...',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiLoadingMessage]);

    // Send the user's message to Gemini API for a response
    const aiResponse = await generateAnswer(content);

    // Find the index of the "Loading your response..." message and update it with the actual response
    setMessages(prev => {
      return prev.map(msg =>
        msg.id === aiLoadingMessage.id
          ? { ...msg, content: aiResponse } // Replace loading with the actual response
          : msg
      );
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-blue-600 p-6 flex items-center gap-4">
        <div className="bg-white/20 p-3 rounded-xl">
          <Bot size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-white text-xl font-semibold">FundFlow Assistant</h1>
          <div className="flex items-center gap-2 text-blue-100 text-sm mt-1">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
            Available 24/7 to help with your queries
          </div>
        </div>
      </div>

      <div className="h-[500px] overflow-y-auto p-6 flex flex-col gap-6 bg-gradient-to-br from-white/50 to-white/80">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-100 p-6 bg-white/90 backdrop-blur-sm">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}

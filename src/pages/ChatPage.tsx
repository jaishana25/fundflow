import { useState, useRef, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { Message } from '../types/chat';
import { generateId } from '../utils/chat-helpers';
import { useContract } from '../contexts/walletContext';
import axios from 'axios';
import crossChainTransfer from "../api/api";
import { utils, providers, Contract, Signer } from 'ethers';

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: 'assistant',
      content: 'Welcome to FundFlow! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ]);

  const { connectedAddress, balance, signer, provider } = useContract();

  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // New state variables
  const [jsonData, setJsonData] = useState<Record<string, any> | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [showMissingFieldsModal, setShowMissingFieldsModal] = useState(false);
  const [aiLoadingMessageId, setAiLoadingMessageId] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function getMissingFields(jsonData: Record<string, any>): string[] {
    const missingFields = [];
    for (const key in jsonData) {
      if (jsonData[key] === null || jsonData[key] === undefined) {
        missingFields.push(key);
      }
    }
    return missingFields;
  }

  function validateAddress(address: string): boolean {
    return utils.isAddress(address);
  }

  async function validateToken(tokenAddress: string, provider: providers.Provider): Promise<boolean> {
    try {
      const code = await provider.getCode(tokenAddress);
      return code !== "0x"; // If the contract code exists, it's valid
    } catch (error) {
      console.error("Error validating token:", error);
      return false;
    }
  }

  function validateAmount(amount: number): boolean {
    return typeof amount === "number" && amount > 0;
  }

  const supportedNetworks: string[] = ["Ethereum", "Polygon", "BSC", "Arbitrum", "Avalanche", "Cardano", "Polkadot", "Optimism"];

  function validateNetwork(network: string): boolean {
    return supportedNetworks.includes(network);
  }

  const generateAnswer = async (content: string) => {
    setGeneratingAnswer(true);

    // Check if the user's message relates to blockchain or asset transfer
    const isBlockchainRelated = content.toLowerCase().includes("transfer") &&
      (content.toLowerCase().includes("tokens") || content.toLowerCase().includes("asset"));

    const iswalletBalanceRequest = content.toLowerCase().includes("my wallet balance") || content.toLowerCase().includes("my balance");

    const isCrossChainTransfer = content.toLowerCase().includes("send") && content.toLocaleLowerCase().includes("from eth sepolia to base sepolia") && content.toLocaleLowerCase().includes("to address");

    let aiAnswer = '';

    if (isBlockchainRelated) {
      // Provide a specific answer related to blockchain asset transfer
      aiAnswer = `
      heyy I transfer your crypto across evm chains
      `;
    } else if (iswalletBalanceRequest) {
      if (balance !== undefined) {
        aiAnswer = `Your wallet balance is ${balance} ETH`;
      } else {
        aiAnswer = `Sorry, I couldn't fetch your wallet balance. Please ensure your wallet is connected.`;
      }
    } else if (isCrossChainTransfer) {
      console.log("cross chain transfer starting...");
      // ... existing logic ...
    } else {
      try {
        const prompt = `
        You are a blockchain assistant. Your task is to extract details from a user's input
        to perform a crypto token transfer. Identify the following details from the message: 
        - amount (number)
        - token (e.g., ETH, USDC, MATIC)
        - recipient (wallet address only)
        - network (e.g., Ethereum, Polygon, BSC). 
        - to token address [get the token address of the provided token name from the internet set it to "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" if it is eth]
        - for the fromTokenChainId parameter get the chain id from the internet 
        - for the toTokenChainId parameter get the chain id from the internet 
        
        
        return this data in JSON format the fields for which the user has not provided the values set them as null. 
        User input: "${content}"`;

        const response = await axios({
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBMT22ZcvsQ_5dm19TPha5uSFaJ7IlasYU`,
          method: 'post',
          data: {
            contents: [{ parts: [{ text: prompt }] }],
          },
        });

        aiAnswer = response.data.candidates[0].content.parts[0].text;
      } catch (error) {
        console.log(error);
        aiAnswer = 'Sorry, something went wrong. Please try again!';
      }
    }

    // Parse the JSON data
    const parsedData = parseJSONFromBacktickString(aiAnswer);

    // Get missing fields
    const missing = getMissingFields(parsedData);

    if (missing.length > 0) {
      // Update assistant's message to prompt for missing details
      if (aiLoadingMessageId) {
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === aiLoadingMessageId
              ? { ...msg, content: `Please provide the following details: ${missing.join(', ')}` }
              : msg
          )
        );
      }

      // Set state variables
      setJsonData(parsedData);
      setMissingFields(missing);
      setShowMissingFieldsModal(true);
      setGeneratingAnswer(false); // Stop the loading spinner
      return;
    }

    // No missing fields, proceed with processing
    processJsonData(parsedData);
    setGeneratingAnswer(false);
  };

  function parseJSONFromBacktickString(rawData: string): Record<string, unknown> {
    try {
      // Remove surrounding triple backticks and any whitespace
      const cleanData = rawData.trim().replace(/^```json\s*|```$/g, "");
      // Parse the cleaned string into a JSON object
      return JSON.parse(cleanData);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      throw new Error("Invalid JSON format");
    }
  }

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
    setAiLoadingMessageId(aiLoadingMessage.id);

    // Send the user's message to Gemini API for a response
    await generateAnswer(content);
  };

  // Handle submission of missing fields
  const handleMissingFieldsSubmit = (values: Record<string, string>) => {
    // Update jsonData with the new values
    const updatedJsonData = { ...jsonData, ...values };
    setJsonData(updatedJsonData);
    setShowMissingFieldsModal(false);

    // Proceed to process the updated jsonData
    processJsonData(updatedJsonData);
    console.log(updatedJsonData);
  };

  const processJsonData = (data: Record<string, any>) => {
    // Update the assistant's message with confirmation
    if (aiLoadingMessageId) {
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === aiLoadingMessageId
            ? {
              ...msg,
              content: `Thank you. Proceeding with the transfer of ${data.amount} ${data.token} to ${data.recipient} on ${data.network}.`,
            }
            : msg
        )
      );
    }
    console.log();
    // Further processing, e.g., initiate the transfer
    // crossChainTransfer(...);
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

      {/* Render the modal when there are missing fields */}
      {showMissingFieldsModal && (
        <MissingFieldsModal
          missingFields={missingFields}
          onSubmit={handleMissingFieldsSubmit}
        />
      )}
    </div>
  );
}

// Modal Component
function MissingFieldsModal({
  missingFields,
  onSubmit,
}: {
  missingFields: string[];
  onSubmit: (values: Record<string, string>) => void;
}) {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setValues((prevValues) => ({ ...prevValues, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(values);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Please provide the missing details:</h2>
        {missingFields.map((field) => (
          <div key={field} className="modal-field">
            <label>{field}</label>
            <input
              type="text"
              value={values[field] || ''}
              onChange={(e) => handleChange(field, e.target.value)}
            />
          </div>
        ))}
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

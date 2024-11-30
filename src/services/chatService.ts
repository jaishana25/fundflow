import { Message, TransferDetails } from '../types/chat';
import { generateId, validateTransferAmount, validateAccountNumber } from '../utils/chat-helpers';

export function generateAIResponse(userMessage: string): Message {
  const lowerMessage = userMessage.toLowerCase();
  let content = '';
  
  if (lowerMessage.includes('transfer')) {
    content = 'I can help you with that transfer. Please provide the amount and the account numbers for the transfer.';
  } else if (lowerMessage.includes('balance')) {
    content = 'Your current balance is $5,000.00. How can I assist you with a transfer?';
  } else if (lowerMessage.includes('help')) {
    content = 'I can help you transfer assets between accounts. Just let me know the amount and account details.';
  } else {
    content = 'How can I assist you with your asset transfer today?';
  }

  return {
    id: generateId(),
    role: 'assistant',
    content,
    timestamp: new Date(),
  };
}

export function parseTransferDetails(message: string): TransferDetails | null {
  const amountMatch = message.match(/\$?(\d+(?:\.\d{2})?)/);
  const accountMatch = message.match(/\b\d{10}\b/g);

  if (!amountMatch || !accountMatch || accountMatch.length !== 2) {
    return null;
  }

  const amount = parseFloat(amountMatch[1]);
  const [fromAccount, toAccount] = accountMatch;

  if (!validateTransferAmount(amount) || !validateAccountNumber(fromAccount) || !validateAccountNumber(toAccount)) {
    return null;
  }

  return {
    amount,
    fromAccount,
    toAccount,
  };
}
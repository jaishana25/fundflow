export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export function validateTransferAmount(amount: number): boolean {
  return amount > 0 && amount <= 10000;
}

export function validateAccountNumber(account: string): boolean {
  return /^\d{10}$/.test(account);
}

// utils/chat-helpers.ts (or wherever you find appropriate)
export function parseTransferDetails(content: string) {
  const transferRegex = /transfer (\d+) tokens to account (\w+)/i;
  const match = content.match(transferRegex);

  if (match) {
    return {
      amount: match[1],
      toAccount: match[2],
    };
  }

  return null;
}

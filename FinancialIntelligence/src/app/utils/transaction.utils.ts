import { Transaction } from '../models/transaction.model';

export const calculateTotalAmount = (transactions: Transaction[]): number => {
  return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
};

export const filterTransactionsByType = (
  transactions: Transaction[],
  type: Transaction['type']
): Transaction[] => {
  return transactions.filter(transaction => transaction.type === type);
};
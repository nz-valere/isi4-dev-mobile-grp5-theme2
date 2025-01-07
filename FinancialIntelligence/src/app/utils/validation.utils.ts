import { Transaction } from '../models/transaction.model';

export function validateTransaction(transaction: Partial<Transaction>): string[] {
  const errors: string[] = [];

  if (!transaction.amount || transaction.amount <= 0) {
    errors.push('Le montant doit être supérieur à 0');
  }

  if (!transaction.description?.trim()) {
    errors.push('La description est requise');
  }

  if (transaction.type === 'LOAN' && !transaction.contact?.trim()) {
    errors.push('Le contact est requis pour un prêt');
  }

  return errors;
}
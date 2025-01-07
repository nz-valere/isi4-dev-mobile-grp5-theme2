// Defines the different possible transaction types
export type TransactionType = 'INCOME' | 'EXPENSE' | 'LOAN' | 'CREDIT' | 'SAVINGS';

// Interface describing the structure of a transaction
export interface Transaction {
    id: string; // Unique identifier
    type: TransactionType; // Transaction type (INCOME, EXPENSE, etc.)
    amount: number; // Amount
    date: Date; // Transaction date
    description: string; // Description
    contact?: string; // Optional contact
    loanPercentagePaid?: number; // Percentage paid for a loan (optional)
    needsSync: boolean; // Indicates if the transaction needs to be synchronized
}

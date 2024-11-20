export interface Transaction {
    id?: number;
    type: 'income' | 'expense' | 'loan' | 'credit' | 'savings';
    label: string;
    amount: number;
    date: Date;
    contact?: string;
    repaymentStatus?: number; // Percent repaid, for loans/credits
}

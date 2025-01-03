import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction/transaction.service';
import { Transaction } from '../../models/transaction.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-transaction',
    templateUrl: './transaction.page.html',
    styleUrls: ['./transaction.page.scss'],
    standalone: false
})
export class TransactionPage implements OnInit {
  transaction: Transaction = {
    type: 'income',
    label: '',
    amount: 0,
    date: new Date(),
  };

  sampleData: Transaction[] = [
    { type: 'income', label: 'Salary for November', amount: 3000, date: new Date('2023-11-30') },
    { type: 'expense', label: 'Groceries', amount: 150, date: new Date('2023-11-25') },
    { type: 'loan', label: 'Car Loan Payment', amount: 500, date: new Date('2023-11-20') },
    { type: 'credit', label: 'Credit Card Payment', amount: 250, date: new Date('2023-11-18') },
    { type: 'savings', label: 'Monthly Savings Deposit', amount: 500, date: new Date('2023-11-15') },
  ];

  isEditMode = false;

  constructor(
    private transactionService: TransactionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      const transactionId = parseInt(id, 10);
      const existingTransaction = await this.transactionService.getTransactionById(transactionId);
      if (existingTransaction) {
        this.transaction = { ...existingTransaction };
        this.transaction.date = new Date(existingTransaction.date); // Convert to Date if stored as string
      }
    }
  }

  async saveTransaction() {
    try {
      if (this.isEditMode && this.transaction.id) {
        await this.transactionService.updateTransaction(this.transaction);
      } else {
        await this.transactionService.addTransaction(this.transaction);
      }

      // Optionally clear form after save
      this.resetForm();

      // Navigate to home page after saving
      await this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  }

  resetForm() {
    this.transaction = {
      type: 'income',
      label: '',
      amount: 0,
      date: new Date(),
    };
  }

  async deleteTransaction() {
    if (this.isEditMode && this.transaction.id) {
      try {
        await this.transactionService.deleteTransaction(this.transaction.id);
        await this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  }

  async addSampleData() {
    try {
      const existingTransactions = await this.transactionService.getAllTransactions();
      if (existingTransactions.length === 0) {
        console.log('Adding sample data...');
        for (const sample of this.sampleData) {
          await this.transactionService.addTransaction(sample);
        }
        console.log('Sample data successfully added.');
      } else {
        console.log('Database already contains data.');
      }
    } catch (error) {
      console.error('Error adding sample data:', error);
    }
  }
}

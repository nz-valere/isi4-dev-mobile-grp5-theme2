import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction/transaction.service';
import { Transaction } from '../../models/transaction.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.scss'],
})
export class TransactionPage implements OnInit {
  transaction: Transaction = {
    type: 'income',
    label: '',
    amount: 0,
    date: new Date(),
  };

   sampleData: Transaction[] = [
    { type: 'income', label: 'Salary for November', amount: 3000, date: new Date('2023-11-30')},
    { type: 'expense', label: 'Groceries', amount: 150, date: new Date('2023-11-25'), contact: 'SuperMart' },
    { type: 'loan', label: 'Car Loan Payment', amount: 500, date: new Date('2023-11-20'), contact: 'AutoFinance Co.', repaymentStatus: 40 },
    { type: 'credit', label: 'Credit Card Payment', amount: 250, date: new Date('2023-11-18'), contact: 'Bank XYZ', repaymentStatus: 75 },
    { type: 'savings', label: 'Monthly Savings Deposit', amount: 500, date: new Date('2023-11-15') },
    { type: 'expense', label: 'Electricity Bill', amount: 120, date: new Date('2023-11-10'), contact: 'PowerUtility' },
    { type: 'income', label: 'Freelance Project', amount: 800, date: new Date('2023-10-25') },
    { type: 'loan', label: 'Personal Loan Repayment', amount: 300, date: new Date('2023-10-20'), contact: 'Bank XYZ', repaymentStatus: 60 },
    { type: 'expense', label: 'Dinner Out', amount: 80, date: new Date('2023-10-15'), contact: 'The Fancy Restaurant' },
    { type: 'savings', label: 'Emergency Fund Contribution', amount: 200, date: new Date('2023-09-30') },
    { type: 'credit', label: 'New Phone Purchase', amount: 1200, date: new Date('2023-09-20'), contact: 'Electronics Store', repaymentStatus: 20 },
    { type: 'income', label: 'Dividends', amount: 400, date: new Date('2023-09-15'), contact: 'Investments Co.' },
  ];

  isEditMode = false;

  constructor(private transactionService: TransactionService, private router: Router, private route: ActivatedRoute,) {}

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
    // await this.addSampleData();
  }

  // async addSampleData() {
  //   const count = await this.transactionService.getAllTransactions();
  //   if (count.length === 0) {
  //     console.log('Adding sample data...');
  //     try {
  //       await this.transactionService.transactions.bulkAdd(this.sampleData);
  //       console.log('Sample data successfully added.');
  //     } catch (error) {
  //       console.error('Error adding sample data:', error);
  //     }
  //   } else {
  //     console.log('Database already contains data.');
  //   }
  // }

  async saveTransaction() {
    // if (form.invalid) {
    //   return;
    // }

    try {
      // Add transaction via service
      await this.transactionService.addTransaction(this.transaction);

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
      await this.transactionService.deleteTransaction(this.transaction.id);
      await this.router.navigate(['/home']);
    }
  }
}

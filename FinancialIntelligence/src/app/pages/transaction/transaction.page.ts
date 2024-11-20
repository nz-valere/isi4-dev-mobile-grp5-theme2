import { Component } from '@angular/core';
import { TransactionService } from '../../services/transaction/transaction.service';
import { Transaction } from '../../models/transaction.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.scss'],
})
export class TransactionPage {
  transaction: Transaction = {
    type: 'income',
    label: '',
    amount: 0,
    date: new Date(),
  };

  constructor(private transactionService: TransactionService, private router: Router) {}

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
}

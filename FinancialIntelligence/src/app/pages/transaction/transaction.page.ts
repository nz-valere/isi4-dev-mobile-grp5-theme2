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
  }

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

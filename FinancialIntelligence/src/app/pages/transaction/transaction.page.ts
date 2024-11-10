import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction/transaction.service';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.scss'],
})
export class TransactionPage{

  transaction: Transaction = {
    id: '',
    type: 'income',
    label: '',
    amount: 0,
    date: new Date(),
  };

  constructor(private transactionService: TransactionService) {}

  saveTransaction() {
    this.transactionService.addTransaction(this.transaction);
    // Clear form or navigate back after saving
  }
}

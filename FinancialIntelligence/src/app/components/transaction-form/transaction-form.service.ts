import { Injectable } from '@angular/core';
import { Transaction } from '../../models/transaction.model';
import { FinanceService } from '../../services/finance.service';
import { ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class TransactionFormService {
  constructor(
    private financeService: FinanceService,
    private modalCtrl: ModalController
  ) {}

  async submitTransaction(type: Transaction['type'], formValue: any): Promise<void> {
    const transaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount: formValue.amount,
      date: new Date(),
      description: formValue.description,
      contact: formValue.contact || undefined,
      loanPercentagePaid: type === 'LOAN' ? 0 : undefined,
      needsSync: false
    };

    if (type === 'LOAN') {
      const loanPercentage = this.financeService.calculateLoanPercentage(formValue.contact);
      if (loanPercentage >= 50) {
        throw new Error('Contact debt limit reached');
      }
    }

    this.financeService.addTransaction(transaction);
    await this.modalCtrl.dismiss();
  }
}
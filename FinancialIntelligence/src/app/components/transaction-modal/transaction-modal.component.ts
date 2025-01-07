import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Transaction } from '../../models/transaction.model';
import { FinanceService } from '../../services/finance.service';

@Component({
  selector: 'app-transaction-modal',
  templateUrl: './transaction-modal.component.html',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class TransactionModalComponent implements OnInit {
  @Input() type!: Transaction['type'];
  @Input() title!: string;
  
  transactionForm!: FormGroup;
  showContactField: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private financeService: FinanceService
  ) {}

  ngOnInit() {
    this.showContactField = this.type === 'LOAN';
    this.initForm();
  }

  private initForm() {
    this.transactionForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      contact: ['', this.showContactField ? Validators.required : Validators.nullValidator]
    });
  }

  async onSubmit() {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;
      
      if (this.type === 'LOAN') {
        const loanPercentage = this.financeService.calculateLoanPercentage(formValue.contact);
        if (loanPercentage < 10) {
          await this.showAlert('Attention', 'Le contact n\'a pas remboursé plus de 10% de sa dette totale.');
          return;
        }
        if (loanPercentage >= 50) {
          await this.showAlert('Impossible', 'Le contact a déjà atteint 50% de dette, opération impossible.');
          return;
        }
      }

      const transaction: Transaction = {
        id: Date.now().toString(),
        type: this.type,
        amount: formValue.amount,
        date: new Date(),
        description: formValue.description,
        contact: formValue.contact,
        loanPercentagePaid: this.type === 'LOAN' ? 0 : undefined,
        needsSync: false
      };

      this.financeService.addTransaction(transaction);
      this.dismiss();
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = document.createElement('ion-alert');
    alert.header = header;
    alert.message = message;
    alert.buttons = ['OK'];

    document.body.appendChild(alert);
    await alert.present();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
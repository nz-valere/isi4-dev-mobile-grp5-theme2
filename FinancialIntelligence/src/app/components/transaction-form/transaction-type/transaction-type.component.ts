import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../../models/transaction.model';

@Component({
  selector: 'app-transaction-type',
  templateUrl: './transaction-type.component.html',
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class TransactionTypeComponent {
  @Input() type!: Transaction['type'];

  getTypeLabel(): string {
    const labels: Record<Transaction['type'], string> = {
      'INCOME': 'Entrée',
      'EXPENSE': 'Dépense',
      'LOAN': 'Prêt',
      'CREDIT': 'Crédit',
      'SAVINGS': 'Épargne'
    };
    return labels[this.type];
  }

  getTypeColor(): string {
    const colors: Record<Transaction['type'], string> = {
      'INCOME': 'success',
      'EXPENSE': 'danger',
      'LOAN': 'warning',
      'CREDIT': 'primary',
      'SAVINGS': 'tertiary'
    };
    return colors[this.type];
  }
}
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class TransactionDetailsComponent {
  @Input() form!: FormGroup;
  @Input() showContactField: boolean = false;
}
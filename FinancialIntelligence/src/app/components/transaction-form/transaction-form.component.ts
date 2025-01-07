import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../models/transaction.model';
import { TransactionFormService } from './transaction-form.service';
import { TransactionTypeComponent } from './transaction-type/transaction-type.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { validateTransaction } from '../../utils/validation.utils';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { NativeService } from '../../services/capacitor/native.service';

/**
 * Formulaire de saisie des transactions
 * Gère la création et la modification des transactions
 */
@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    TransactionTypeComponent,
    TransactionDetailsComponent
  ]
})
export class TransactionFormComponent implements OnInit {
  // Type de transaction (entrée, sortie, etc.)
  @Input() type!: Transaction['type'];
  
  // Titre du formulaire
  @Input() title!: string;
  
  // Formulaire réactif
  transactionForm: FormGroup;
  
  // État du formulaire
  isSubmitting = false;
  validationErrors: string[] = [];
  
  // Gestion des photos
  hasPhoto = false;
  photoUrl: string | undefined ;

  constructor(
    private formService: TransactionFormService,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private errorHandler: ErrorHandlerService,
    private nativeService: NativeService
  ) {
    // Initialisation du formulaire
    this.transactionForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      contact: ['']
    });
  }

  ngOnInit() {
    // Ajoute la validation du contact pour les prêts
    if (this.type === 'LOAN') {
      this.transactionForm.get('contact')?.setValidators([Validators.required]);
    }
  }

 
  async takePicture() {
    try {
      const image = await this.nativeService.takePicture();
      this.photoUrl = image.webPath;
      this.hasPhoto = true;
      await this.nativeService.vibrateDevice();
    } catch (error) {
      await this.errorHandler.handleError(error, 'Impossible de prendre une photo');
    }
  }

  // Soumission du formulaire
  async onSubmit() {
    if (this.isSubmitting) return;

    const formValue = this.transactionForm.value;
    
    // Validation des données
    this.validationErrors = validateTransaction({
      ...formValue,
      type: this.type
    });

    if (this.validationErrors.length > 0) {
      await this.nativeService.vibrateDevice();
      return;
    }

    try {
      this.isSubmitting = true;
      const loading = await this.loadingCtrl.create({
        message: 'Enregistrement en cours...'
      });
      await loading.present();

      // Sauvegarde de la photo si présente
      if (this.hasPhoto && this.photoUrl) {
        const filename = `receipt_${Date.now()}.jpg`;
        await this.nativeService.saveFile(filename, this.photoUrl);
        formValue.receiptPath = filename;
      }

      // Enregistrement de la transaction
      await this.formService.submitTransaction(this.type, formValue);
      
      // Notification de confirmation
      await this.nativeService.scheduleNotification(
        'Transaction enregistrée',
        `Votre ${this.getTransactionTypeName()} a été enregistré avec succès`,
        new Date()
      );

      await loading.dismiss();
      this.isSubmitting = false;
    } catch (error) {
      await this.errorHandler.handleError(
        error,
        'Erreur lors de l\'enregistrement de la transaction'
      );
      this.isSubmitting = false;
    }
  }

  // Retourne le libellé du type de transaction
  private getTransactionTypeName(): string {
    const types: Record<Transaction['type'], string> = {
      'INCOME': 'revenu',
      'EXPENSE': 'dépense',
      'LOAN': 'prêt',
      'CREDIT': 'crédit',
      'SAVINGS': 'épargne'
    };
    return types[this.type];
  }
}
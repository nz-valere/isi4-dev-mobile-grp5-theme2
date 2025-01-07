import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { 
  arrowDownOutline, 
  arrowUpOutline, 
  cashOutline, 
  cardOutline, 
  saveOutline,
  walletOutline 
} from 'ionicons/icons';
import { FinanceService } from '../../services/finance.service';
import { ModalService } from '../../services/modal.service';
import { WeeklyChartComponent } from '../../components/weekly-chart/weekly-chart.component';
import { DailyChartComponent } from '../../components/daily-chart/daily-chart.component';
import { ExpenseRecommendationsComponent } from '../../components/expense-recommendations/expense-recommendations.component';
import { DashboardSummaryComponent } from '../../components/dashboard/dashboard-summary/dashboard-summary.component';
import { Transaction } from '../../models/transaction.model';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    WeeklyChartComponent,
    DailyChartComponent,
    ExpenseRecommendationsComponent,
    DashboardSummaryComponent,
  ]
})
export class HomePage implements OnInit, OnDestroy {
  selectedSegment = 'dashboard';
  transactions$: Observable<Transaction[]>;
  private destroy$ = new Subject<void>();
  
  
  constructor(
    private financeService: FinanceService,
    private modalService: ModalService
  ) {
    this.transactions$ = this.financeService.getTransactions();
    addIcons({
      'arrow-down': arrowDownOutline,
      'arrow-up': arrowUpOutline,
      'cash': cashOutline,
      'card': cardOutline,
      'save': saveOutline,
      'wallet': walletOutline
    });
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  ngOnInit() {
    const today = new Date();
    const isStartOfMonth = today.getDate() <= 5;

    if (isStartOfMonth) {
      this.transactions$
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          console.log('Transactions chargées au début du mois');
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async addIncome() {
    await this.modalService.showTransactionModal('INCOME', 'Nouvelle entrée');
  }

  async addExpense() {
    await this.modalService.showTransactionModal('EXPENSE', 'Nouvelle dépense');
  }

  async addLoan() {
    await this.modalService.showTransactionModal('LOAN', 'Nouveau prêt');
  }

  async addCredit() {
    await this.modalService.showTransactionModal('CREDIT', 'Nouveau crédit');
  }

  async addSavings() {
    await this.modalService.showTransactionModal('SAVINGS', 'Nouvelle épargne');
  }
}
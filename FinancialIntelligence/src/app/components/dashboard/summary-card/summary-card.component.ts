import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summary-card',
  templateUrl: './summary-card.component.html',
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class SummaryCardComponent {
  @Input() title!: string;
  @Input() data: any;
}
import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-analysis',
    templateUrl: './analysis.component.html',
    styleUrls: ['./analysis.component.scss'],
    standalone: false
})
export class AnalysisComponent  implements OnInit {

  constructor() { }

  @Input() title: string = ''; // Accepts the title text
  @Input() count: number = 0; // Accepts a number
  @Input() description !: string
  @Input() percentage: number = 0;
  @Input() iconColor !: string; // Accepts a color
  @Input() icon !: any
  col !: string 

  // readonly icons = { FileCheck }

  ngOnInit() {
    if(this.iconColor != 'black') this.col = `bg-gradient-to-b from-${this.iconColor}-500 to-${this.iconColor}-600`
    else this.col = `bg-gradient-to-b from-black to-black`
    console.log(this.col);
    
  }
}

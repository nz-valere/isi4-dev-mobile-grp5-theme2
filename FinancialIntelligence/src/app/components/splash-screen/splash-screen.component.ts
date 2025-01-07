import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class SplashScreenComponent implements OnInit {
  show = true;

  constructor(private animationCtrl: AnimationController) {}

  ngOnInit() {
    // Simule un chargement initial
    setTimeout(() => {
      this.hideSplashScreen();
    }, 3000);
  }

  private async hideSplashScreen() {
    const animation = this.animationCtrl
      .create()
      .addElement(document.querySelector('.splash-screen')!)
      .duration(400)
      .fromTo('opacity', '1', '0')
      .fromTo('transform', 'scale(1)', 'scale(1.1)');

    await animation.play();
    this.show = false;
  }
}
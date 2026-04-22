import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonInput, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { refreshOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonIcon]
})
export class Tab2Page {
  target = 0;
  guess = '';
  attempts = 0;
  message = '';
  hint = '';
  won = false;

  constructor() {
    addIcons({ refreshOutline });
    this.newGame();
  }

  newGame() {
    this.target = Math.floor(Math.random() * 100) + 1;
    this.guess = '';
    this.attempts = 0;
    this.message = '';
    this.hint = '';
    this.won = false;
  }

  submit() {
    const n = parseInt(this.guess, 10);
    if (isNaN(n) || n < 1 || n > 100) {
      this.hint = 'Bitte eine Zahl zwischen 1 und 100 eingeben.';
      return;
    }
    this.attempts++;
    if (n === this.target) {
      this.won = true;
      this.message = `Richtig! Du hast ${this.attempts} Versuche gebraucht.`;
      this.hint = '';
    } else if (n < this.target) {
      this.hint = '📈 Zu niedrig!';
    } else {
      this.hint = '📉 Zu hoch!';
    }
    this.guess = '';
  }
}

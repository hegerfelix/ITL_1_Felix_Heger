import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';

type GameState = 'idle' | 'waiting' | 'ready' | 'result' | 'tooearly';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton]
})
export class Tab3Page implements OnDestroy {
  state: GameState = 'idle';
  reactionTime = 0;
  bestTime: number | null = null;
  private startTime = 0;
  private timer: any = null;

  start() {
    this.state = 'waiting';
    const delay = 2000 + Math.random() * 3000;
    this.timer = setTimeout(() => {
      this.state = 'ready';
      this.startTime = Date.now();
    }, delay);
  }

  tap() {
    if (this.state === 'waiting') {
      clearTimeout(this.timer);
      this.state = 'tooearly';
      return;
    }
    if (this.state === 'ready') {
      this.reactionTime = Date.now() - this.startTime;
      if (this.bestTime === null || this.reactionTime < this.bestTime) {
        this.bestTime = this.reactionTime;
      }
      this.state = 'result';
    }
  }

  reset() {
    this.state = 'idle';
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
  }
}

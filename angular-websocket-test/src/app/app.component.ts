import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CoordinateMessage } from './coordinate-message';
import { LiveCoordsService } from './live-coords.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  title = 'WebSocket Test';
  private sub?: Subscription;
  receivedCount = 0;
  sentCount = 0;
  isStreaming = false;
  private intervalId?: any;
  private timeoutId?: any;

  // Test coordinates around Cairo
  private baseLat = 30.0444;
  private baseLng = 31.2357;
  private radiusDeg = 0.01;
  private tick = 0;

  constructor(private liveCoords: LiveCoordsService) {
    this.sub = this.liveCoords.coords$.subscribe(msg => {
      this.receivedCount++;
      console.log('✅ Received coordinate:', msg);
    });
  }

  get status$() {
    return this.liveCoords.status$;
  }

  get lastMessage$() {
    return this.liveCoords.lastMessage$;
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.stopStreaming();
  }

  sendTestCoordinate(): void {
    const angle = (this.tick % 360) * (Math.PI / 180);
    this.tick += 20;
    
    const lat = this.baseLat + this.radiusDeg * Math.sin(angle);
    const lng = this.baseLng + this.radiusDeg * Math.cos(angle);
    
    this.liveCoords.sendCoordinate('car-1', lat, lng);
    this.sentCount++;
  }

  startStreaming(): void {
    if (this.isStreaming) {
      this.stopStreaming();
      return;
    }

    this.isStreaming = true;
    console.log('🚀 Starting to stream coordinates for 3 minutes...');

    // Send coordinates every second
    this.intervalId = setInterval(() => {
      this.sendTestCoordinate();
    }, 1000);

    // Stop after 3 minutes (180 seconds)
    this.timeoutId = setTimeout(() => {
      this.stopStreaming();
      console.log('⏹️ Stopped streaming after 3 minutes');
    }, 3 * 60 * 1000);
  }

  stopStreaming(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
    this.isStreaming = false;
  }
}


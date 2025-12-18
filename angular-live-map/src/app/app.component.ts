import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CoordinateMessage } from './coordinate-message';
import { LiveCoordsService } from './live-coords.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'Live Map';
  private map?: google.maps.Map;
  private markers = new Map<string, google.maps.Marker>();
  private sub?: Subscription;

  constructor(private liveCoords: LiveCoordsService) {}

  get status$() {
    return this.liveCoords.status$;
  }

  get lastMessage$() {
    return this.liveCoords.lastMessage$;
  }

  ngAfterViewInit(): void {
    // Initialize Google Map
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    this.map = new google.maps.Map(mapElement, {
      center: { lat: 30.0444, lng: 31.2357 }, // Cairo
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // Add a default car marker in Cairo so the map is not empty.
    this.addOrUpdateMarker({
      agentId: 'car-1',
      lat: 30.0444,
      lng: 31.2357,
      timestamp: Date.now()
    });

    this.sub = this.liveCoords.coords$.subscribe(msg => this.addOrUpdateMarker(msg));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private addOrUpdateMarker(msg: CoordinateMessage): void {
    if (!this.map) return;

    let marker = this.markers.get(msg.agentId);
    if (!marker) {
      // Create new marker with car emoji
      marker = new google.maps.Marker({
        position: { lat: msg.lat, lng: msg.lng },
        map: this.map,
        title: msg.agentId,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
              <text x="15" y="20" font-size="24" text-anchor="middle">🚗</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(30, 30),
          anchor: new google.maps.Point(15, 15)
        }
      });
      this.markers.set(msg.agentId, marker);
    } else {
      // Update existing marker position
      marker.setPosition({ lat: msg.lat, lng: msg.lng });
    }

    // Pan map to marker position
    this.map.panTo({ lat: msg.lat, lng: msg.lng });
  }
}


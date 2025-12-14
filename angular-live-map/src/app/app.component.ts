import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
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
  private map?: L.Map;
  private markers = new Map<string, L.Marker>();
  private sub?: Subscription;
  private carIcon = L.divIcon({
    html: '🚗',
    className: 'car-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

  constructor(private liveCoords: LiveCoordsService) {}

  get status$() {
    return this.liveCoords.status$;
  }

  get lastMessage$() {
    return this.liveCoords.lastMessage$;
  }

  ngAfterViewInit(): void {
    this.map = L.map('map', {
      center: [30.0444, 31.2357], // Cairo
      zoom: 12
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

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
    this.map?.remove();
  }

  private addOrUpdateMarker(msg: CoordinateMessage): void {
    if (!this.map) return;

    let marker = this.markers.get(msg.agentId);
    if (!marker) {
      marker = L.marker([msg.lat, msg.lng], { icon: this.carIcon });
      marker.addTo(this.map);
      this.markers.set(msg.agentId, marker);
    } else {
      marker.setLatLng([msg.lat, msg.lng]);
    }

    this.map.panTo([msg.lat, msg.lng], { animate: true });
  }
}


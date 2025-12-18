import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Client, IMessage } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { CoordinateMessage } from './coordinate-message';

@Injectable({ providedIn: 'root' })
export class LiveCoordsService {
  private client: Client;
  coords$ = new Subject<CoordinateMessage>();
  status$ = new BehaviorSubject<'connecting' | 'connected' | 'error'>('connecting');
  lastMessage$ = new BehaviorSubject<CoordinateMessage | null>(null);

  // Change this to your backend URL for production
  // For local: 'http://localhost:8080/ws'
  // For production: 'https://your-openshift-route.com/ws'
  private readonly wsUrl = (window as any).WS_BACKEND_URL || 'http://localhost:8080/ws';

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS(this.wsUrl),
      reconnectDelay: 5000
    });

    this.client.onConnect = () => {
      this.status$.next('connected');
      this.client.subscribe('/topic/coords', (message: IMessage) => {
        const payload = JSON.parse(message.body) as CoordinateMessage;
        console.log('📍 Coordinate received:', payload.agentId, payload.lat, payload.lng);
        this.coords$.next(payload);
        this.lastMessage$.next(payload);
      });
    };

    this.client.onStompError = frame => {
      console.error('STOMP error:', frame);
      this.status$.next('error');
    };
    this.client.onWebSocketError = event => {
      console.error('WebSocket error:', event);
      this.status$.next('error');
    };
    this.client.onWebSocketClose = () => {
      this.status$.next('connecting');
    };

    this.client.activate();
  }

  sendCoordinate(agentId: string, lat: number, lng: number): void {
    if (this.client.connected) {
      const payload: CoordinateMessage = {
        agentId,
        lat,
        lng,
        timestamp: Date.now()
      };
      this.client.publish({
        destination: '/app/coords',
        body: JSON.stringify(payload)
      });
      console.log('📤 Sent coordinate:', payload);
    } else {
      console.warn('⚠️ WebSocket not connected. Cannot send coordinate.');
    }
  }
}


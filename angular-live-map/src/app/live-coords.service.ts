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

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
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
}


// Simple STOMP sender to test the Spring WebSocket relay.
// Usage:
//   npm install @stomp/stompjs sockjs-client
//   node send.js
//
// Adjust HOST/PORT if backend is elsewhere.
const { Client } = require('@stomp/stompjs');
const SockJS = require('sockjs-client');

const HOST = 'http://localhost:8080/ws';
const client = new Client({
  webSocketFactory: () => new SockJS(HOST),
  reconnectDelay: 0
});

// Simple circular stream around Cairo to visualize movement.
const baseLat = 30.0444;
const baseLng = 31.2357;
const radiusDeg = 0.01; // ~1.1km
let tick = 0;

function nextPoint() {
  const angle = (tick % 360) * (Math.PI / 180);
  tick += 20; // 18 steps per circle
  return {
    lat: baseLat + radiusDeg * Math.sin(angle),
    lng: baseLng + radiusDeg * Math.cos(angle)
  };
}

client.onConnect = () => {
  console.log('Connected, streaming coordinates...');
  const interval = setInterval(() => {
    const { lat, lng } = nextPoint();
    const payload = {
      agentId: 'car-1',
      lat,
      lng,
      timestamp: Date.now()
    };
    client.publish({
      destination: '/app/coords',
      body: JSON.stringify(payload)
    });
  }, 1000);

  setTimeout(() => {
    clearInterval(interval);
    client.deactivate();
    console.log('Stopped streaming');
    process.exit(0);
  }, 2 * 60 * 1000);
};

client.onStompError = frame => console.error('Broker error', frame);
client.onWebSocketError = event => console.error('WebSocket error', event);

client.activate();


# Angular WebSocket Test

Simple Angular application to test WebSocket connection with Spring Boot backend.

## Features

- WebSocket connection status indicator
- Button to send test coordinates
- Real-time coordinate sending and receiving
- Statistics (sent/received counts)
- Last received message display

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure backend URL in `src/index.html`:
```html
<script>
  window.WS_BACKEND_URL = 'http://localhost:8080/ws';
  // For production: 'https://your-openshift-route.com/ws';
</script>
```

## Run

```bash
npm start
```

Open `http://localhost:4200` in your browser.

## Build for Production

```bash
npm run build
```

Output will be in `dist/angular-websocket-test/` - deploy this folder to Apache.

## Usage

1. Make sure backend is running
2. Open the app in browser
3. Wait for "Status: connected" (green pill)
4. Click "Send Test Coordinate" button
5. Watch the statistics and last received message update


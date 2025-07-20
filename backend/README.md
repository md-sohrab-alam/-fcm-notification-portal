# FCM Notification Portal - Backend

A Node.js/Express backend for managing Firebase Cloud Messaging (FCM) notifications.

## Features

- Send notifications to specific device tokens
- Send notifications to topics
- Subscribe/unsubscribe devices to topics
- Input validation and error handling
- Rate limiting and security headers
- Comprehensive logging

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `env.example`:
```bash
cp env.example .env
```

3. Download your Firebase service account key:
   - Go to Firebase Console > Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file as `firebase-service-account.json` in the backend directory

4. Update the `.env` file with your Firebase configuration

5. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Health Check
- `GET /api/health` - Check if the server is running

### Send Notifications
- `POST /api/notifications/send` - Send notification to specific tokens
- `POST /api/notifications/send-to-topic` - Send notification to a topic

### Topic Management
- `POST /api/topics/subscribe` - Subscribe tokens to a topic
- `POST /api/topics/unsubscribe` - Unsubscribe tokens from a topic

## Request Examples

### Send to Tokens
```json
{
  "title": "Hello World",
  "body": "This is a test notification",
  "imageUrl": "https://example.com/image.jpg",
  "data": {
    "key": "value"
  },
  "tokens": ["token1", "token2"]
}
```

### Send to Topic
```json
{
  "title": "Topic Notification",
  "body": "This is sent to all subscribers",
  "topic": "news"
}
```

### Subscribe to Topic
```json
{
  "tokens": ["token1", "token2"],
  "topic": "news"
}
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `FIREBASE_DATABASE_URL` - Firebase Realtime Database URL
- `RATE_LIMIT_WINDOW_MS` - Rate limiting window (default: 900000)
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window (default: 100)

## Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation with Joi
- Request logging with Morgan 
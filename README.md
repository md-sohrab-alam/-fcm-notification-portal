# FCM Notification Portal

A modern, full-stack web application for managing Firebase Cloud Messaging (FCM) notifications. Built with Node.js/Express backend and React frontend.

## 🚀 Features

### Backend (Node.js/Express)
- **Send notifications** to specific device tokens
- **Send notifications** to topics
- **Subscribe/unsubscribe** devices to topics
- **Input validation** with Joi
- **Rate limiting** and security headers
- **Comprehensive logging** with Morgan
- **Error handling** and response formatting

### Frontend (React)
- **Modern UI** with Tailwind CSS
- **Dashboard** with statistics and quick actions
- **Send notifications** with form validation
- **Topic management** for subscribing/unsubscribing
- **History tracking** with search and filters
- **Real-time notifications** with toast messages
- **Responsive design** for all devices

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project with FCM enabled

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd FCMNotificationPortal
```

### 2. Backend Setup

```bash
cd backend
npm install
```

#### Configure Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key"
5. Save the JSON file as `firebase-service-account.json` in the backend directory

#### Environment Configuration
```bash
cp env.example .env
```

Edit `.env` file:
```env
PORT=5000
NODE_ENV=development
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
```

#### Start Backend Server
```bash
# Development
npm run dev

# Production
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

#### Start Frontend Development Server
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
FCMNotificationPortal/
├── backend/
│   ├── server.js              # Main server file
│   ├── package.json           # Backend dependencies
│   ├── env.example           # Environment variables template
│   └── README.md             # Backend documentation
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── App.js           # Main app component
│   │   └── index.js         # Entry point
│   ├── public/              # Static files
│   ├── package.json         # Frontend dependencies
│   └── tailwind.config.js   # Tailwind configuration
└── README.md                # This file
```

## 🔧 API Endpoints

### Health Check
- `GET /api/health` - Check server status

### Notifications
- `POST /api/notifications/send` - Send to specific tokens
- `POST /api/notifications/send-to-topic` - Send to topic

### Topic Management
- `POST /api/topics/subscribe` - Subscribe tokens to topic
- `POST /api/topics/unsubscribe` - Unsubscribe tokens from topic

## 📱 Usage

### Dashboard
- View system statistics
- Monitor recent activity
- Quick access to main features

### Send Notifications
1. Choose between sending to tokens or topics
2. Fill in notification details (title, body, image)
3. Add device tokens or select topic
4. Include optional data payload
5. Send and monitor results

### Topic Management
1. Subscribe devices to topics for targeted messaging
2. Unsubscribe devices from topics
3. Manage topic subscriptions efficiently

### History
- View all sent notifications
- Filter by status, type, or search terms
- Export data to CSV
- Monitor success/failure rates

## 🎨 UI Features

- **Modern Design**: Clean, professional interface
- **Responsive**: Works on desktop, tablet, and mobile
- **Dark Mode Ready**: Easy to implement dark theme
- **Accessibility**: WCAG compliant components
- **Loading States**: Smooth user experience
- **Error Handling**: Clear error messages and validation

## 🔒 Security Features

- **Input Validation**: Server-side validation with Joi
- **Rate Limiting**: Prevent abuse with express-rate-limit
- **Security Headers**: Helmet.js for protection
- **CORS Configuration**: Proper cross-origin handling
- **Error Handling**: Secure error responses

## 🚀 Deployment

### Backend Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Serve static files
npx serve -s build
```

## 📊 Monitoring

- **Health Checks**: Monitor server status
- **Error Logging**: Comprehensive error tracking
- **Performance**: Request/response timing
- **Analytics**: Track notification success rates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in each component
- Review the API documentation

## 🔄 Updates

Stay updated with the latest features and security patches by regularly pulling from the main branch.

---

**Built with ❤️ using Node.js, Express, React, and Tailwind CSS** 
# FCM Notification Portal - Deployment Guide

## 🚀 Backend Deployment Options

### Option 1: Render.com (Recommended - Free)

1. **Sign up at Render.com**
2. **Create New Web Service**
3. **Connect your GitHub repository**
4. **Configure settings:**
   - **Name**: `fcm-notification-portal-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

5. **Add Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY_ID=your-private-key-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=your-service-account-email
   FIREBASE_CLIENT_ID=your-client-id
   FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
   FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
   FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
   FIREBASE_CLIENT_X509_CERT_URL=your-cert-url
   ```

6. **Deploy and get your URL** (e.g., `https://fcm-notification-portal-backend.onrender.com`)

### Option 2: Railway.app (Free Tier)

1. **Sign up at Railway.app**
2. **Create New Project**
3. **Connect GitHub repository**
4. **Set Root Directory**: `backend`
5. **Add environment variables** (same as above)
6. **Deploy**

### Option 3: Heroku (Free Tier Discontinued)

1. **Install Heroku CLI**
2. **Login**: `heroku login`
3. **Create app**: `heroku create fcm-notification-portal-backend`
4. **Set environment variables**
5. **Deploy**: `git push heroku main`

## 🔧 Update Frontend API URL

After deploying the backend, update the API URL in:

```javascript
// frontend/src/services/api.js
const API_BASE_URL = 'https://your-backend-url.com/api';
```

## 📋 Environment Variables Setup

### Firebase Service Account
1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate new private key
3. Download JSON file
4. Copy values to environment variables

### Required Environment Variables:
```
NODE_ENV=production
PORT=10000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your-cert-url
```

## 🌐 Frontend Deployment

Frontend is already deployed to GitHub Pages:
- **URL**: https://md-sohrab-alam.github.io/-fcm-notification-portal
- **Status**: Live and accessible

## 🔄 Update Process

1. **Deploy backend** to cloud service
2. **Update frontend API URL** with backend URL
3. **Redeploy frontend**: `npm run deploy`
4. **Test full functionality**

## ✅ Testing Deployment

1. **Backend Health Check**: `https://your-backend-url.com/api/health`
2. **Frontend**: https://md-sohrab-alam.github.io/-fcm-notification-portal
3. **Test notification sending** from frontend 
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Firebase Admin
const serviceAccount = require('./firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Validation middleware
const Joi = require('joi');

const notificationSchema = Joi.object({
  title: Joi.string().required().max(100),
  body: Joi.string().required().max(500),
  imageUrl: Joi.string().uri().optional(),
  data: Joi.object().optional(),
  topic: Joi.string().optional(),
  tokens: Joi.array().items(Joi.string()).optional(),
  messageType: Joi.string().valid('notification', 'data', 'hybrid').optional().default('hybrid')
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'FCM Notification Portal Backend is running' });
});

// Send notification to specific tokens
app.post('/api/notifications/send', async (req, res) => {
  try {
    console.log('Received notification request:', JSON.stringify(req.body, null, 2));
    console.log('Available fields in request:', Object.keys(req.body));
    
    const { error, value } = notificationSchema.validate(req.body, { 
      allowUnknown: true,
      stripUnknown: true 
    });
    
    if (error) {
      console.log('Validation error details:', error.details);
      console.log('Validation error message:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    const { title, body, imageUrl, data, tokens, messageType } = value;
    
    if (!tokens || tokens.length === 0) {
      return res.status(400).json({ error: 'At least one token is required' });
    }

    // Prepare data payload for background processing
    const dataPayload = {
      title: title,
      body: body,
      timestamp: Date.now(),
      ...(imageUrl && { imageUrl: imageUrl }),
      ...(data && { ...data })
    };

    let message;
    
    switch (messageType) {
      case 'notification':
        // Only notification - shows system notification, limited background processing
        message = {
          notification: {
            title,
            body,
            ...(imageUrl && { image: imageUrl })
          },
          data: dataPayload,
          tokens
        };
        break;
        
      case 'data':
        // Only data - no system notification, full background processing
        message = {
          data: dataPayload,
          tokens
        };
        break;
        
      case 'hybrid':
      default:
        // Both notification and data - best for most use cases
        message = {
          notification: {
            title,
            body,
            ...(imageUrl && { image: imageUrl })
          },
          data: dataPayload,
          tokens
        };
        break;
    }

    const response = await admin.messaging().sendMulticast(message);
    
    const results = {
      successCount: response.successCount,
      failureCount: response.failureCount,
      messageType: messageType,
      responses: response.responses.map((resp, index) => ({
        token: tokens[index],
        success: resp.success,
        error: resp.error
      }))
    };

    res.json({
      message: 'Notification sent successfully',
      results
    });

  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Send notification to topic
app.post('/api/notifications/send-to-topic', async (req, res) => {
  try {
    console.log('Received topic notification request:', JSON.stringify(req.body, null, 2));
    console.log('Available fields in topic request:', Object.keys(req.body));
    
    const { error, value } = notificationSchema.validate(req.body, { 
      allowUnknown: true,
      stripUnknown: true 
    });
    
    if (error) {
      console.log('Topic validation error details:', error.details);
      console.log('Topic validation error message:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    const { title, body, imageUrl, data, topic, messageType } = value;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    // Prepare data payload for background processing
    const dataPayload = {
      title: title,
      body: body,
      timestamp: Date.now(),
      ...(imageUrl && { imageUrl: imageUrl }),
      ...(data && { ...data })
    };

    let message;
    
    switch (messageType) {
      case 'notification':
        message = {
          notification: {
            title,
            body,
            ...(imageUrl && { image: imageUrl })
          },
          data: dataPayload,
          topic
        };
        break;
        
      case 'data':
        message = {
          data: dataPayload,
          topic
        };
        break;
        
      case 'hybrid':
      default:
        message = {
          notification: {
            title,
            body,
            ...(imageUrl && { image: imageUrl })
          },
          data: dataPayload,
          topic
        };
        break;
    }

    const response = await admin.messaging().send(message);
    
    res.json({
      message: 'Notification sent to topic successfully',
      messageId: response,
      messageType: messageType
    });

  } catch (error) {
    console.error('Error sending notification to topic:', error);
    res.status(500).json({ error: 'Failed to send notification to topic' });
  }
});

// Subscribe tokens to topic
app.post('/api/topics/subscribe', async (req, res) => {
  try {
    const { tokens, topic } = req.body;
    
    if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
      return res.status(400).json({ error: 'Tokens array is required' });
    }
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const response = await admin.messaging().subscribeToTopic(tokens, topic);
    
    res.json({
      message: 'Successfully subscribed to topic',
      successCount: response.successCount,
      failureCount: response.failureCount
    });

  } catch (error) {
    console.error('Error subscribing to topic:', error);
    res.status(500).json({ error: 'Failed to subscribe to topic' });
  }
});

// Unsubscribe tokens from topic
app.post('/api/topics/unsubscribe', async (req, res) => {
  try {
    const { tokens, topic } = req.body;
    
    if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
      return res.status(400).json({ error: 'Tokens array is required' });
    }
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const response = await admin.messaging().unsubscribeFromTopic(tokens, topic);
    
    res.json({
      message: 'Successfully unsubscribed from topic',
      successCount: response.successCount,
      failureCount: response.failureCount
    });

  } catch (error) {
    console.error('Error unsubscribing from topic:', error);
    res.status(500).json({ error: 'Failed to unsubscribe from topic' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`FCM Notification Portal Backend running on port ${PORT}`);
}); 
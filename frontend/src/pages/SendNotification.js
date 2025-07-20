import React, { useState } from 'react';
import { Send, Users, Bell, Image, Plus, X } from 'lucide-react';
import { notificationAPI } from '../services/api';
import toast from 'react-hot-toast';

const SendNotification = () => {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    imageUrl: '',
    data: {},
    sendType: 'tokens', // 'tokens' or 'topic'
    tokens: [''],
    topic: '',
    messageType: 'hybrid' // 'notification', 'data', or 'hybrid'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTokenChange = (index, value) => {
    const newTokens = [...formData.tokens];
    newTokens[index] = value;
    setFormData(prev => ({ ...prev, tokens: newTokens }));
  };

  const addToken = () => {
    setFormData(prev => ({ ...prev, tokens: [...prev.tokens, ''] }));
  };

  const removeToken = (index) => {
    const newTokens = formData.tokens.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, tokens: newTokens }));
  };

  const addDataField = () => {
    setFormData(prev => ({ 
      ...prev, 
      data: { ...prev.data, [`key${Object.keys(prev.data).length + 1}`]: '' } 
    }));
  };

  const removeDataField = (key) => {
    const newData = { ...formData.data };
    delete newData[key];
    setFormData(prev => ({ ...prev, data: newData }));
  };

  const handleDataFieldChange = (key, value) => {
    setFormData(prev => ({ 
      ...prev, 
      data: { ...prev.data, [key]: value } 
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.body.trim()) {
      newErrors.body = 'Body is required';
    }

    if (formData.sendType === 'tokens') {
      const validTokens = formData.tokens.filter(token => token.trim());
      if (validTokens.length === 0) {
        newErrors.tokens = 'At least one token is required';
      }
    } else {
      if (!formData.topic.trim()) {
        newErrors.topic = 'Topic is required';
      }
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        title: formData.title.trim(),
        body: formData.body.trim(),
        messageType: formData.messageType,
        ...(formData.imageUrl && { imageUrl: formData.imageUrl.trim() }),
        ...(Object.keys(formData.data).length > 0 && { data: formData.data })
      };

      let response;
      if (formData.sendType === 'tokens') {
        const validTokens = formData.tokens.filter(token => token.trim());
        response = await notificationAPI.sendToTokens({
          ...payload,
          tokens: validTokens
        });
      } else {
        response = await notificationAPI.sendToTopic({
          ...payload,
          topic: formData.topic.trim()
        });
      }

      toast.success('Notification sent successfully!');
      
      // Reset form
      setFormData({
        title: '',
        body: '',
        imageUrl: '',
        data: {},
        sendType: 'tokens',
        tokens: [''],
        topic: '',
        messageType: 'hybrid'
      });

    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to send notification';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Send Notification</h1>
        <p className="text-gray-600 mt-1">Send FCM notifications to devices or topics</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text"
                className={`input ${errors.title ? 'border-error-500' : ''}`}
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter notification title"
                maxLength={100}
              />
              {errors.title && <p className="form-error">{errors.title}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Body *</label>
              <textarea
                className={`input resize-none ${errors.body ? 'border-error-500' : ''}`}
                value={formData.body}
                onChange={(e) => handleInputChange('body', e.target.value)}
                placeholder="Enter notification message"
                rows={3}
                maxLength={500}
              />
              {errors.body && <p className="form-error">{errors.body}</p>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image URL (Optional)</label>
            <div className="flex items-center space-x-2">
              <Image className="w-5 h-5 text-gray-400" />
              <input
                type="url"
                className={`input flex-1 ${errors.imageUrl ? 'border-error-500' : ''}`}
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            {errors.imageUrl && <p className="form-error">{errors.imageUrl}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Message Type *</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="messageType"
                  value="hybrid"
                  checked={formData.messageType === 'hybrid'}
                  onChange={(e) => handleInputChange('messageType', e.target.value)}
                  className="text-primary-600"
                />
                <span className="flex items-center space-x-1">
                  <Bell className="w-4 h-4" />
                  <span>Hybrid (Recommended)</span>
                  <span className="text-xs text-gray-500">- Shows notification + background processing</span>
                </span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="messageType"
                  value="data"
                  checked={formData.messageType === 'data'}
                  onChange={(e) => handleInputChange('messageType', e.target.value)}
                  className="text-primary-600"
                />
                <span className="flex items-center space-x-1">
                  <Send className="w-4 h-4" />
                  <span>Data Only</span>
                  <span className="text-xs text-gray-500">- Background processing only, no system notification</span>
                </span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="messageType"
                  value="notification"
                  checked={formData.messageType === 'notification'}
                  onChange={(e) => handleInputChange('messageType', e.target.value)}
                  className="text-primary-600"
                />
                <span className="flex items-center space-x-1">
                  <Bell className="w-4 h-4" />
                  <span>Notification Only</span>
                  <span className="text-xs text-gray-500">- System notification only, limited background processing</span>
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sending Options</h2>
          
          <div className="space-y-4">
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="sendType"
                  value="tokens"
                  checked={formData.sendType === 'tokens'}
                  onChange={(e) => handleInputChange('sendType', e.target.value)}
                  className="text-primary-600"
                />
                <span className="flex items-center space-x-1">
                  <Bell className="w-4 h-4" />
                  <span>Send to Specific Tokens</span>
                </span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="sendType"
                  value="topic"
                  checked={formData.sendType === 'topic'}
                  onChange={(e) => handleInputChange('sendType', e.target.value)}
                  className="text-primary-600"
                />
                <span className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>Send to Topic</span>
                </span>
              </label>
            </div>

            {formData.sendType === 'tokens' ? (
              <div className="form-group">
                <label className="form-label">Device Tokens *</label>
                <div className="space-y-2">
                  {formData.tokens.map((token, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        className="input flex-1"
                        value={token}
                        onChange={(e) => handleTokenChange(index, e.target.value)}
                        placeholder="Enter FCM token"
                      />
                      {formData.tokens.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeToken(index)}
                          className="p-2 text-error-600 hover:bg-error-50 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addToken}
                    className="btn btn-secondary flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Token</span>
                  </button>
                </div>
                {errors.tokens && <p className="form-error">{errors.tokens}</p>}
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">Topic Name *</label>
                <input
                  type="text"
                  className={`input ${errors.topic ? 'border-error-500' : ''}`}
                  value={formData.topic}
                  onChange={(e) => handleInputChange('topic', e.target.value)}
                  placeholder="Enter topic name (e.g., news, updates)"
                />
                {errors.topic && <p className="form-error">{errors.topic}</p>}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Data (Optional)</h2>
          
          <div className="space-y-3">
            {Object.entries(formData.data).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <input
                  type="text"
                  className="input flex-1"
                  value={key}
                  onChange={(e) => {
                    const newData = { ...formData.data };
                    delete newData[key];
                    newData[e.target.value] = value;
                    setFormData(prev => ({ ...prev, data: newData }));
                  }}
                  placeholder="Key"
                />
                <input
                  type="text"
                  className="input flex-1"
                  value={value}
                  onChange={(e) => handleDataFieldChange(key, e.target.value)}
                  placeholder="Value"
                />
                <button
                  type="button"
                  onClick={() => removeDataField(key)}
                  className="p-2 text-error-600 hover:bg-error-50 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addDataField}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Data Field</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              setFormData({
                title: '',
                body: '',
                imageUrl: '',
                data: {},
                sendType: 'tokens',
                tokens: [''],
                topic: '',
                messageType: 'hybrid'
              });
              setErrors({});
            }}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            Reset
          </button>
          <button
            type="submit"
            className="btn btn-primary flex items-center space-x-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Notification</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendNotification; 
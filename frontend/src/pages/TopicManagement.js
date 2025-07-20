import React, { useState } from 'react';
import { Users, Plus, X, CheckCircle, AlertCircle } from 'lucide-react';
import { notificationAPI } from '../services/api';
import toast from 'react-hot-toast';

const TopicManagement = () => {
  const [activeTab, setActiveTab] = useState('subscribe');
  const [formData, setFormData] = useState({
    tokens: [''],
    topic: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.topic.trim()) {
      newErrors.topic = 'Topic is required';
    }

    const validTokens = formData.tokens.filter(token => token.trim());
    if (validTokens.length === 0) {
      newErrors.tokens = 'At least one token is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);

    try {
      const validTokens = formData.tokens.filter(token => token.trim());
      const payload = {
        tokens: validTokens,
        topic: formData.topic.trim()
      };

      let response;
      if (activeTab === 'subscribe') {
        response = await notificationAPI.subscribeToTopic(payload);
        toast.success(`Successfully subscribed ${response.successCount} tokens to topic`);
      } else {
        response = await notificationAPI.unsubscribeFromTopic(payload);
        toast.success(`Successfully unsubscribed ${response.successCount} tokens from topic`);
      }

      // Reset form
      setFormData({
        tokens: [''],
        topic: ''
      });

    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Operation failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const TopicForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {activeTab === 'subscribe' ? 'Subscribe to Topic' : 'Unsubscribe from Topic'}
        </h2>
        
        <div className="space-y-4">
          <div className="form-group">
            <label className="form-label">Topic Name *</label>
            <input
              type="text"
              className={`input ${errors.topic ? 'border-error-500' : ''}`}
              value={formData.topic}
              onChange={(e) => handleInputChange('topic', e.target.value)}
              placeholder="Enter topic name (e.g., news, updates, promotions)"
            />
            {errors.topic && <p className="form-error">{errors.topic}</p>}
          </div>

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
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className={`btn flex items-center space-x-2 ${
              activeTab === 'subscribe' ? 'btn-success' : 'btn-warning'
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                {activeTab === 'subscribe' ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Subscribe</span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    <span>Unsubscribe</span>
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );

  const TopicInfo = () => (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">About Topics</h2>
      <div className="space-y-4 text-sm text-gray-600">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mt-0.5">
            <span className="text-primary-600 font-semibold text-xs">1</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">What are Topics?</p>
            <p>Topics allow you to send messages to multiple devices that have opted in to a particular topic. Think of them as channels or categories.</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mt-0.5">
            <span className="text-primary-600 font-semibold text-xs">2</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">Topic Naming</p>
            <p>Topics should be descriptive and follow a consistent naming convention. Examples: "news", "promotions", "system_updates".</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mt-0.5">
            <span className="text-primary-600 font-semibold text-xs">3</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">Best Practices</p>
            <p>Use lowercase letters, numbers, and underscores only. Avoid special characters and spaces in topic names.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Topic Management</h1>
        <p className="text-gray-600 mt-1">Subscribe and unsubscribe devices to topics</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('subscribe')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
            activeTab === 'subscribe'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Subscribe</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('unsubscribe')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
            activeTab === 'unsubscribe'
              ? 'bg-white text-warning-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <X className="w-4 h-4" />
            <span>Unsubscribe</span>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TopicForm />
        </div>
        <div>
          <TopicInfo />
        </div>
      </div>
    </div>
  );
};

export default TopicManagement; 
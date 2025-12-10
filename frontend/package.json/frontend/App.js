import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, View, Text, ActivityIndicator } from 'react-native';
import { healthApi } from './src/services/api';
import AppNavigator from './src/navigation/AppNavigator';

const theme = {
  colors: {
    primary: '#2C5282',
    secondary: '#F6AD55',
    background: '#F7FAFC',
    text: '#2D3748',
    success: '#38A169',
    error: '#E53E3E',
  }
};

export default function App() {
  const [isHealthy, setIsHealthy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check backend health on app startup
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await healthApi.check();
      setIsHealthy(response.status === 200);
      console.log('Backend health:', response.data);
    } catch (err) {
      console.warn('Backend health check failed:', err.message);
      setIsHealthy(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 12, color: theme.colors.text }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="dark-content" />
      {!isHealthy && (
        <View style={{ padding: 12, backgroundColor: theme.colors.error }}>
          <Text style={{ color: '#fff', fontSize: 12 }}>
            ⚠️ Backend unavailable. Some features may not work.
          </Text>
        </View>
      )}
      <AppNavigator />
    </SafeAreaView>
  );
}

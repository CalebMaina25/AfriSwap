import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { ADKThemeProvider } from '@adk/components';
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
  return (
    <ADKThemeProvider theme={theme}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <AppNavigator />
      </SafeAreaView>
    </ADKThemeProvider>
  );
}
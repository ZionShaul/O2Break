import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { LanguageProvider } from './src/contexts/LanguageContext';
import { SessionProvider } from './src/context/SessionContext';
import { SpotifyProvider } from './src/context/SpotifyContext';
import { AppNavigator } from './src/navigation/AppNavigator';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    Notifications.requestPermissionsAsync().catch(() => {});
  }, []);

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <SessionProvider>
          <SpotifyProvider>
            <NavigationContainer>
              <StatusBar style="light" />
              <AppNavigator />
            </NavigationContainer>
          </SpotifyProvider>
        </SessionProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

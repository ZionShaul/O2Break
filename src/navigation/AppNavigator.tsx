import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { BreathingScreen } from '../screens/BreathingScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { RemindersScreen } from '../screens/RemindersScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { RootTabParamList, HomeStackParamList } from './types';
import { COLORS } from '../utils/theme';

const Tab = createBottomTabNavigator<RootTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="PatternSelect" component={HomeScreen} />
      <HomeStack.Screen
        name="Breathing"
        component={BreathingScreen}
        options={{ presentation: 'fullScreenModal' }}
      />
    </HomeStack.Navigator>
  );
}

const TAB_ICONS: Record<string, string> = {
  HomeTab: '🌬️',
  Stats: '📊',
  Reminders: '🔔',
  Settings: '⚙️',
};

const TAB_LABELS: Record<string, string> = {
  HomeTab: 'בית',
  Stats: 'סטטיסטיקות',
  Reminders: 'תזכורות',
  Settings: 'הגדרות',
};

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
            {TAB_ICONS[route.name]}
          </Text>
        ),
        tabBarLabel: TAB_LABELS[route.name] ?? route.name,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 2,
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="Reminders" component={RemindersScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

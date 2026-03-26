import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import ProgramListScreen from '../screens/ProgramListScreen';
import ProgramDetailScreen from '../screens/ProgramDetailScreen';
import SessionScreen from '../screens/SessionScreen';
import SessionCompleteScreen from '../screens/SessionCompleteScreen';
import HistoryScreen from '../screens/HistoryScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { RemindersScreen } from '../screens/RemindersScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SessionResult } from '../types';
import { RootTabParamList, HomeStackParamList, RootStackParamList } from './types';
import { COLORS } from '../utils/theme';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

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

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home">
        {({ navigation }) => (
          <HomeScreen
            onStart={() => navigation.navigate('ProgramList')}
            onHistory={() => navigation.navigate('History')}
          />
        )}
      </HomeStack.Screen>

      <HomeStack.Screen name="History">
        {({ navigation }) => (
          <HistoryScreen onBack={() => navigation.goBack()} />
        )}
      </HomeStack.Screen>

      <HomeStack.Screen name="ProgramList">
        {({ navigation }) => (
          <ProgramListScreen
            onSelect={(id) => navigation.navigate('ProgramDetail', { programId: id })}
            onBack={() => navigation.goBack()}
          />
        )}
      </HomeStack.Screen>

      <HomeStack.Screen name="ProgramDetail">
        {({ navigation, route }) => (
          <ProgramDetailScreen
            programId={route.params.programId}
            onStart={(id, musicId) =>
              navigation.navigate('Session', { programId: id, musicId: musicId ?? 'silence' })
            }
            onBack={() => navigation.goBack()}
          />
        )}
      </HomeStack.Screen>

      <HomeStack.Screen name="Session">
        {({ navigation, route }) => (
          <SessionScreen
            programId={route.params.programId}
            musicId={route.params.musicId}
            onComplete={(result: SessionResult) =>
              navigation.replace('SessionComplete', {
                result,
                musicId: route.params.musicId,
              })
            }
            onExit={() => navigation.goBack()}
          />
        )}
      </HomeStack.Screen>

      <HomeStack.Screen name="SessionComplete">
        {({ navigation, route }) => (
          <SessionCompleteScreen
            result={route.params.result}
            onHome={() => navigation.popToTop()}
            onRepeat={() =>
              navigation.replace('Session', {
                programId: route.params.result.programId,
                musicId: route.params.musicId,
              })
            }
          />
        )}
      </HomeStack.Screen>
    </HomeStack.Navigator>
  );
}

function TabNavigator() {
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
          backgroundColor: '#0E1520',
          borderTopColor: 'rgba(255,255,255,0.08)',
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

export function AppNavigator() {
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('onboarding_done').then((done) => {
      setOnboarded(!!done);
    });
  }, []);

  if (onboarded === null) return null;

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!onboarded ? (
        <RootStack.Screen name="Onboarding">
          {() => (
            <OnboardingScreen
              onDone={() => {
                AsyncStorage.setItem('onboarding_done', '1');
                setOnboarded(true);
              }}
            />
          )}
        </RootStack.Screen>
      ) : (
        <RootStack.Screen name="Main" component={TabNavigator} />
      )}
    </RootStack.Navigator>
  );
}

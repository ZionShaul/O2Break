import React, { useState, useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationState, SessionResult } from './src/types';
import { LanguageProvider } from './src/contexts/LanguageContext';
import HomeScreen from './src/screens/HomeScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import ProgramListScreen from './src/screens/ProgramListScreen';
import ProgramDetailScreen from './src/screens/ProgramDetailScreen';
import SessionScreen from './src/screens/SessionScreen';
import SessionCompleteScreen from './src/screens/SessionCompleteScreen';
import HistoryScreen from './src/screens/HistoryScreen';

export default function App() {
  const [nav, setNav] = useState<NavigationState>({ screen: 'Home' });
  const [ready, setReady] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Check onboarding on first launch
  useEffect(() => {
    AsyncStorage.getItem('onboarding_done').then(done => {
      if (!done) setNav({ screen: 'Onboarding' });
      setReady(true);
    });
  }, []);

  const navigate = (next: Partial<NavigationState>) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      setNav(prev => ({ ...prev, ...next }));
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    });
  };

  const renderScreen = () => {
    switch (nav.screen) {
      case 'Onboarding':
        return (
          <OnboardingScreen
            onDone={() => {
              AsyncStorage.setItem('onboarding_done', '1');
              navigate({ screen: 'Home' });
            }}
          />
        );
      case 'Home':
        return (
          <HomeScreen
            onStart={() => navigate({ screen: 'ProgramList' })}
            onHistory={() => navigate({ screen: 'History' })}
          />
        );
      case 'History':
        return (
          <HistoryScreen
            onBack={() => navigate({ screen: 'Home' })}
          />
        );
      case 'ProgramList':
        return (
          <ProgramListScreen
            onSelect={(id) => navigate({ screen: 'ProgramDetail', selectedProgramId: id })}
            onBack={() => navigate({ screen: 'Home' })}
          />
        );
      case 'ProgramDetail':
        return (
          <ProgramDetailScreen
            programId={nav.selectedProgramId!}
            onStart={(id, musicId) =>
              navigate({ screen: 'Session', selectedProgramId: id, selectedMusicId: musicId })
            }
            onBack={() => navigate({ screen: 'ProgramList' })}
          />
        );
      case 'Session':
        return (
          <SessionScreen
            programId={nav.selectedProgramId!}
            musicId={nav.selectedMusicId ?? 'silence'}
            onComplete={(result: SessionResult) =>
              navigate({ screen: 'SessionComplete', sessionResult: result })
            }
            onExit={() => navigate({ screen: 'ProgramList' })}
          />
        );
      case 'SessionComplete':
        return (
          <SessionCompleteScreen
            result={nav.sessionResult!}
            onHome={() => navigate({ screen: 'Home' })}
            onRepeat={() =>
              navigate({
                screen: 'Session',
                selectedProgramId: nav.sessionResult!.programId,
                selectedMusicId: nav.selectedMusicId ?? 'silence',
              })
            }
          />
        );
    }
  };

  if (!ready) return null;

  return (
    <LanguageProvider>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {renderScreen()}
      </Animated.View>
    </LanguageProvider>
  );
}

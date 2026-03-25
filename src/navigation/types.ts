import { NavigatorScreenParams } from '@react-navigation/native';

export type HomeStackParamList = {
  PatternSelect: undefined;
  Breathing: { patternId: string; rounds: number };
};

export type RootTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  Stats: undefined;
  Reminders: undefined;
  Settings: undefined;
};

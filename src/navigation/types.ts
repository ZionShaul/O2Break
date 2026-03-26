import { NavigatorScreenParams } from '@react-navigation/native';
import { SessionResult } from '../types';

export type HomeStackParamList = {
  Home: undefined;
  History: undefined;
  ProgramList: undefined;
  ProgramDetail: { programId: string };
  Session: { programId: string; musicId: string };
  SessionComplete: { result: SessionResult; musicId: string };
};

export type RootTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  Stats: undefined;
  Reminders: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  Main: NavigatorScreenParams<RootTabParamList>;
};

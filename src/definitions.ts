import firebase from "firebase";

declare module "@capacitor/core" {
  interface PluginRegistry {
    FirebaseRemoteConfig: FirebaseRemoteConfigPlugin;
  }
}

export interface FirebaseRemoteConfigPlugin {
  initializeFirebase(app: firebase.app.App): Promise<void>;
  setDefaultConfig(options: any): Promise<void>;
  initialize(options?: initOptions): Promise<void>;
  fetch(): Promise<void>;
  activate(): Promise<void>;
  fetchAndActivate(): Promise<void>;
  getBoolean(options: RCValueOption): Promise<RCReturnData>;
  getNumber(options: RCValueOption): Promise<RCReturnData>;
  getString(options: RCValueOption): Promise<RCReturnData>;
}

export interface initOptions {
  minimumFetchInterval?: number;
  fetchTimeout?: number;
}

export interface RCValueOption {
  key: string;
}

export interface RCReturnData {
  key: string;
  value: string;
  source: string;
}

export interface RCReturnDataArray {
  key: string;
  value: any[];
  source: string;
}

export interface FirebaseInitOptions {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

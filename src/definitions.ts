declare module "@capacitor/core" {
  interface PluginRegistry {
    FirebaseRemoteConfig: FirebaseRemoteConfigPlugin;
  }
}

export interface FirebaseRemoteConfigPlugin {
  initialize(options: { minimumFetchIntervalInSeconds: number }): Promise<void>;
  fetch(): Promise<void>;
  activate(): Promise<void>;
  fetchAndActivate(): Promise<void>;
  getBoolean(options: RCValueOption): Promise<{ key: string; value: boolean; source: string; }>;
  getByteArray(options: RCValueOption): Promise<{ key: string; value: any[]; source: string; }>;
  getNumber(options: RCValueOption): Promise<{ key: string; value: number; source: string; }>;
  getString(options: RCValueOption): Promise<{ key: string; value: string; source: string; }>;
}

export interface RCValueOption {
  key: string;
}
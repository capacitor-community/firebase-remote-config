import { WebPlugin } from '@capacitor/core';
import { FirebaseRemoteConfigPlugin } from './definitions';

export class FirebaseRemoteConfigWeb extends WebPlugin implements FirebaseRemoteConfigPlugin {
  constructor() {
    super({
      name: 'FirebaseRemoteConfig',
      platforms: ['web']
    });
  }

  initialize(options: { minimumFetchIntervalInSeconds: number; }): Promise<void> {
    console.log(options);
    throw new Error("Method not implemented.");
  }

  fetch(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  activate(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  fetchAndActivate(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getBoolean(options: import("./definitions").RCValueOption): Promise<{ key: string; value: boolean; source: string; }> {
    console.log(options);
    throw new Error("Method not implemented.");
  }

  getByteArray(options: import("./definitions").RCValueOption): Promise<{ key: string; value: any[]; source: string; }> {
    console.log(options);
    throw new Error("Method not implemented.");
  }
  getNumber(options: import("./definitions").RCValueOption): Promise<{ key: string; value: number; source: string; }> {
    console.log(options);
    throw new Error("Method not implemented.");
  }

  getString(options: import("./definitions").RCValueOption): Promise<{ key: string; value: string; source: string; }> {
    console.log(options);
    throw new Error("Method not implemented.");
  }
  
}

const FirebaseRemoteConfig = new FirebaseRemoteConfigWeb();

export { FirebaseRemoteConfig };

import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(FirebaseRemoteConfig);

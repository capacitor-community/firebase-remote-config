import { WebPlugin } from '@capacitor/core';
import { FirebaseRemoteConfigPlugin } from './definitions';

export class FirebaseRemoteConfigWeb extends WebPlugin implements FirebaseRemoteConfigPlugin {
  constructor() {
    super({
      name: 'FirebaseRemoteConfig',
      platforms: ['web']
    });
  }

  async echo(options: { value: string }): Promise<{value: string}> {
    console.log('ECHO', options);
    return options;
  }
}

const FirebaseRemoteConfig = new FirebaseRemoteConfigWeb();

export { FirebaseRemoteConfig };

import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(FirebaseRemoteConfig);

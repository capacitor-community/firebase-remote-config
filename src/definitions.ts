declare module "@capacitor/core" {
  interface PluginRegistry {
    FirebaseRemoteConfig: FirebaseRemoteConfigPlugin;
  }
}

export interface FirebaseRemoteConfigPlugin {
  echo(options: { value: string }): Promise<{value: string}>;
}

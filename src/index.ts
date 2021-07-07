import { registerPlugin } from "@capacitor/core";

import type { FirebaseRemoteConfigPlugin } from "./definitions";

const FirebaseRemoteConfig = registerPlugin<FirebaseRemoteConfigPlugin>(
  "FirebaseRemoteConfigPlugin",
  {
    web: () => import("./web").then((m) => new m.FirebaseRemoteConfigWeb()),
  }
);
export * from "./definitions";
export { FirebaseRemoteConfig };

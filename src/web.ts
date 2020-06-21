import { WebPlugin } from "@capacitor/core";
import {
  FirebaseRemoteConfigPlugin,
  RCValueOption,
  RCReturnData,
  RCReturnDataArray,
} from "./definitions";

export class FirebaseRemoteConfigWeb extends WebPlugin
  implements FirebaseRemoteConfigPlugin {
  constructor() {
    super({
      name: "FirebaseRemoteConfig",
      platforms: ["web"],
    });
  }

  initialize(options: {
    minimumFetchIntervalInSeconds: number;
  }): Promise<void> {
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
  getBoolean(options: RCValueOption): Promise<RCReturnData> {
    console.log(options);
    throw new Error("Method not implemented.");
  }

  getByteArray(options: RCValueOption): Promise<RCReturnDataArray> {
    console.log(options);
    throw new Error("Method not implemented.");
  }
  getNumber(options: RCValueOption): Promise<RCReturnData> {
    console.log(options);
    throw new Error("Method not implemented.");
  }

  getString(options: RCValueOption): Promise<RCReturnData> {
    console.log(options);
    throw new Error("Method not implemented.");
  }
}

const FirebaseRemoteConfig = new FirebaseRemoteConfigWeb();

export { FirebaseRemoteConfig };

import { registerWebPlugin } from "@capacitor/core";
registerWebPlugin(FirebaseRemoteConfig);

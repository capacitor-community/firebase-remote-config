import { WebPlugin } from "@capacitor/core";
import {
  FirebaseRemoteConfigPlugin,
  RCValueOption,
  RCReturnData,
  RCReturnDataArray,
  FirebaseInitOptions,
} from "./definitions";

declare var window: any;

export class FirebaseRemoteConfigWeb
  extends WebPlugin
  implements FirebaseRemoteConfigPlugin {
  readonly options_missing_mssg = "Firebase options are missing";

  public readonly ready: Promise<any>;
  private readyResolver: Function;
  private remoteConfigRef: any;

  private scripts = [
    {
      key: "firebase-app",
      src: "https://www.gstatic.com/firebasejs/7.15.4/firebase-app.js",
    },
    {
      key: "firebase-rc",
      src:
        "https://www.gstatic.com/firebasejs/7.15.4/firebase-remote-config.js",
    },
  ];

  constructor() {
    super({
      name: "FirebaseRemoteConfig",
      platforms: ["web"],
    });

    this.ready = new Promise((resolve) => (this.readyResolver = resolve));
    this.loadScripts();
  }

  setDefaultWebConfig(options: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
      await this.ready;

      if (!options) {
        reject("No default configuration found.");
        return;
      }

      if (!this.remoteConfigRef) {
        reject(
          "Remote config is not initialized. Make sure initialize() is called at first."
        );
        return;
      }

      this.remoteConfigRef.defaultConfig = options;
      resolve();
    });
  }

  initialize(options: {
    minimumFetchIntervalInSeconds: number;
  }): Promise<void> {
    return new Promise(async (resolve, reject) => {
      await this.ready;

      if (!this.remoteConfigRef) {
        reject(
          "Remote config is not initialized. Make sure initialize() is called at first."
        );
        return;
      }

      const interval =
        options && options.minimumFetchIntervalInSeconds
          ? options.minimumFetchIntervalInSeconds
          : 3600;

      this.remoteConfigRef.settings = {
        minimumFetchIntervalInSeconds: interval,
      };

      resolve();
    });
  }

  fetch(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      await this.ready;

      if (!this.remoteConfigRef) {
        reject(
          "Remote config is not initialized. Make sure initialize() is called at first."
        );
        return;
      }

      this.remoteConfigRef.fetch().then(resolve).catch(reject);
    });
  }

  activate(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      await this.ready;

      if (!this.remoteConfigRef) {
        reject(
          "Remote config is not initialized. Make sure initialize() is called at first."
        );
        return;
      }

      this.remoteConfigRef.activate().then(resolve).catch(reject);
    });
  }

  fetchAndActivate(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      await this.ready;

      if (!this.remoteConfigRef) {
        reject(
          "Remote config is not initialized. Make sure initialize() is called at first."
        );
        return;
      }

      window.firebase
        .remoteConfig()
        .fetchAndActivate()
        .then((data: any) => {
          // console.log(data);
          resolve(data);
        })
        .catch(reject);
    });
  }

  getBoolean(options: RCValueOption): Promise<RCReturnData> {
    return this.getValue(options, "Boolean");
  }

  getByteArray(options: RCValueOption): Promise<RCReturnData> {
    // Should be deprecated 
    // - was implemented as a string which ruined the data.
    // - FB doesn't support byteArray - https://firebase.google.com/docs/reference/js/firebase.remoteconfig.RemoteConfig
    return this.getString(options);
  }
  
  getNumber(options: RCValueOption): Promise<RCReturnData> {
    return this.getValue(options, "Number");
  }

  getString(options: RCValueOption): Promise<RCReturnData> {
    return this.getValue(options, "String");
  }

  async getValue(options: RCValueOption, format:'String'|'Number'|'Boolean' = null): Promise<RCReturnData> {
    await this.ready;
    if (!this.remoteConfigRef)
      throw new Error("Remote config is not initialized. Make sure initialize() is called at first.");
    const retVal =  this.remoteConfigRef.getValue(options.key);
    return {
      key: options.key,
      value: format ? retVal[ "as"+format ]() : retVal._value,
      source: retVal._source,
    }
  }

  get remoteConfig() {
    return this.remoteConfigRef;
  }

  // 
  // Note: The methods below are common to all Firebase capacitor plugins. Best to create `capacitor-community / firebase-common`,
  // move the code there and add it as module to all FB plugins.
  // 

  /**
   * Configure and Initialize FirebaseApp if not present
   * @param options - web app's Firebase configuration
   * @returns firebase analytics object reference
   * Platform: Web
   */
  async initializeFirebase(options: FirebaseInitOptions): Promise<any> {
    if (!options) 
      throw new Error(this.options_missing_mssg);

    await this.firebaseObjectReadyPromise();
      const app = this.isFirebaseInitialized() ? window.firebase : window.firebase.initializeApp(options);
      this.remoteConfigRef = app.remoteConfig();
      this.readyResolver();
    return this.remoteConfigRef;
  }

  /**
   * Check for existing loaded script and load new scripts
   */
  private loadScripts(): Promise<Array<any>> {
    return Promise.all( this.scripts.map( s => this.loadScript(s.key, s.src) ) );
  }

  /**
   * Loaded single script with provided id and source
   * @param id - unique identifier of the script
   * @param src - source of the script
   */
  private loadScript(id: string, src: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (document.getElementById(id)){
        resolve(null);
      } else {
        const file = document.createElement("script");
        file.type = "text/javascript";
        file.src = src;
        file.id = id;
        file.onload = resolve;
        file.onerror = reject;
        document.querySelector("head").appendChild(file);  
      }
    });
  }

  private firebaseObjectReadyPromise(): Promise<void> {
    var tries = 100;
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (window.firebase?.remoteConfig) {
          clearInterval(interval);
          resolve( null );
        } else if (tries-- <= 0) {
          reject("Firebase fails to load");
        }
      }, 50);
    } );
  }

  private isFirebaseInitialized() {
    const length = window.firebase?.apps?.length;
    return length && length > 0;
  }
}

const FirebaseRemoteConfig = new FirebaseRemoteConfigWeb();

export { FirebaseRemoteConfig };

import { registerWebPlugin } from "@capacitor/core";
registerWebPlugin(FirebaseRemoteConfig);

import { registerWebPlugin, WebPlugin } from "@capacitor/core";
import {
  FirebaseRemoteConfigPlugin,
  RCValueOption,
  RCReturnData,
  FirebaseInitOptions,
  initOptions,
} from "./definitions";

declare var window: any;

// Errors
const ErrRemoteConfigNotInitialiazed = new Error(
  "Remote config is not initialized. Make sure initialize() is called first."
);
const ErrMissingDefaultConfig = new Error("No default configuration found");
const ErrMissingOptions = new Error("Firebase options are missing");

// Firebase Library Version
const FIREBASE_VERSION = "8.3.0";

export class FirebaseRemoteConfigWeb extends WebPlugin
  implements FirebaseRemoteConfigPlugin {
  public readonly ready: Promise<any>;
  private readyResolver: Function;
  private remoteConfigRef: any;

  private scripts = [
    {
      key: "firebase-app",
      src: `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app.js`,
    },
    {
      key: "firebase-rc",
      src: `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-remote-config.js`,
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

  async setDefaultConfig(options: any): Promise<void> {
    await this.ready;

    if (!options) throw ErrMissingDefaultConfig;

    if (!this.remoteConfigRef) throw ErrRemoteConfigNotInitialiazed;

    this.remoteConfigRef.defaultConfig = options;
    return;
  }

  async initialize(options?: initOptions): Promise<void> {
    await this.ready;

    if (!this.remoteConfigRef) throw ErrRemoteConfigNotInitialiazed;

    const minimumFetchIntervalMillis =
      options?.minimumFetchInterval ?? 1000 * 60 * 60 * 12; // 12 hours

    const fetchTimeoutMillis = options?.fetchTimeout ?? 1 * 60000; // 1 minute

    this.remoteConfigRef.settings = {
      minimumFetchIntervalMillis,
      fetchTimeoutMillis,
    };

    return;
  }

  async fetch(): Promise<void> {
    await this.ready;

    if (!this.remoteConfigRef) throw ErrRemoteConfigNotInitialiazed;

    const data = await this.remoteConfigRef.fetch();
    return data;
  }

  async activate(): Promise<void> {
    await this.ready;

    if (!this.remoteConfigRef) throw ErrRemoteConfigNotInitialiazed;

    const response = await this.remoteConfigRef.activate();
    return response;
  }

  async fetchAndActivate(): Promise<void> {
    await this.ready;

    if (!this.remoteConfigRef) throw ErrRemoteConfigNotInitialiazed;

    const data = await this.remoteConfigRef.fetchAndActivate();
    return data;
  }

  getBoolean(options: RCValueOption): Promise<RCReturnData> {
    return this.getValue(options, "Boolean");
  }

  getByteArray(options: RCValueOption): Promise<RCReturnData> {
    // Should be deprecated
    // - was implemented as a string which ruined the data.
    // - FB doesn't support byteArray
    //     (https://firebase.google.com/docs/reference/js/firebase.remoteconfig.RemoteConfig)
    return this.getString(options);
  }

  getNumber(options: RCValueOption): Promise<RCReturnData> {
    return this.getValue(options, "Number");
  }

  getString(options: RCValueOption): Promise<RCReturnData> {
    return this.getValue(options, "String");
  }

  private async getValue(
    options: RCValueOption,
    format: "String" | "Number" | "Boolean" = null
  ): Promise<RCReturnData> {
    await this.ready;
    if (!this.remoteConfigRef)
      throw new Error(
        "Remote config is not initialized. Make sure initialize() is called at first."
      );
    const retVal = this.remoteConfigRef.getValue(options.key);
    return {
      key: options.key,
      value: format ? retVal["as" + format]() : retVal._value,
      source: retVal._source,
    };
  }

  get remoteConfig() {
    return this.remoteConfigRef;
  }

  /**
   * Configure and Initialize FirebaseApp if not present
   * @param options - web app's Firebase configuration
   * @returns firebase analytics object reference
   * Platform: Web
   */
  async initializeFirebase(options: FirebaseInitOptions): Promise<any> {
    if (!options) throw ErrMissingOptions;

    await this.firebaseObjectReadyPromise();

    const app = this.isFirebaseInitialized()
      ? window.firebase
      : window.firebase.initializeApp(options);

    this.remoteConfigRef = app.remoteConfig();
    this.readyResolver();

    return this.remoteConfigRef;
  }

  /**
   * Check for existing loaded script and load new scripts
   */
  private loadScripts(): Promise<Array<any>> {
    return Promise.all(this.scripts.map((s) => this.loadScript(s.key, s.src)));
  }

  /**
   * Loaded single script with provided id and source
   * @param id - unique identifier of the script
   * @param src - source of the script
   */
  private async loadScript(id: string, src: string): Promise<any> {
    if (document.getElementById(id)) return;

    return new Promise((resolve, reject) => {
      const file = document.createElement("script");
      file.type = "text/javascript";
      file.src = src;
      file.id = id;
      file.onload = resolve;
      file.onerror = reject;
      document.querySelector("head").appendChild(file);
    });
  }

  private async firebaseObjectReadyPromise(): Promise<void> {
    var tries = 100;
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (window.firebase?.remoteConfig) {
          clearInterval(interval);
          resolve(null);
        } else if (tries-- <= 0) {
          reject("Firebase fails to load");
        }
      }, 50);
    });
  }

  private isFirebaseInitialized() {
    const length = window.firebase?.apps?.length;
    return length && length > 0;
  }
}

const FirebaseRemoteConfig = new FirebaseRemoteConfigWeb();

export { FirebaseRemoteConfig };

registerWebPlugin(FirebaseRemoteConfig);

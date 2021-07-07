import { WebPlugin } from "@capacitor/core";
import {
  FirebaseRemoteConfigPlugin,
  RCValueOption,
  RCReturnData,
  RCReturnDataArray,
} from "./definitions";

declare var window: any;

export class FirebaseRemoteConfigWeb extends WebPlugin
  implements FirebaseRemoteConfigPlugin {
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
    this.configure();
  }

  initializeFirebase(options: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
      await this.ready;

      if (options && !this.isFirebaseInitialized()) {
        const app = window.firebase.initializeApp(options);
        this.remoteConfigRef = app.remoteConfig();

        resolve();
        return;
      }

      reject("Firebase App already initialized.");
    });
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
          console.log(data);
          resolve(data);
        })
        .catch(reject);
    });
  }

  getBoolean(options: RCValueOption): Promise<RCReturnData> {
    return new Promise(async (resolve, reject) => {
      await this.ready;

      if (!this.remoteConfigRef) {
        reject(
          "Remote config is not initialized. Make sure initialize() is called at first."
        );
        return;
      }

      resolve(this.remoteConfigRef.getValue(options.key).asBoolean());
    });
  }

  getByteArray(options: RCValueOption): Promise<RCReturnDataArray> {
    return new Promise(async (resolve, reject) => {
      await this.ready;

      if (!this.remoteConfigRef) {
        reject(
          "Remote config is not initialized. Make sure initialize() is called at first."
        );
        return;
      }

      resolve(this.remoteConfigRef.getValue(options.key).asString());
    });
  }
  getNumber(options: RCValueOption): Promise<RCReturnData> {
    return new Promise(async (resolve, reject) => {
      await this.ready;

      if (!this.remoteConfigRef) {
        reject(
          "Remote config is not initialized. Make sure initialize() is called at first."
        );
        return;
      }

      resolve(this.remoteConfigRef.getValue(options.key).asNumber());
    });
  }

  getString(options: RCValueOption): Promise<RCReturnData> {
    return new Promise(async (resolve, reject) => {
      await this.ready;

      if (!this.remoteConfigRef) {
        reject(
          "Remote config is not initialized. Make sure initialize() is called at first."
        );
        return;
      }

      resolve(this.remoteConfigRef.getValue(options.key).asString());
    });
  }

  get remoteConfig() {
    return this.remoteConfigRef;
  }

  private async configure() {
    try {
      await this.loadScripts();

      if (window.firebase && this.isFirebaseInitialized()) {
        this.remoteConfigRef = window.firebase.remoteConfig();
      } else {
        console.error("Firebase App has not yet initialized.");
      }
    } catch (error) {
      throw error;
    }

    const interval = setInterval(() => {
      if (!window.firebase) {
        return;
      }
      clearInterval(interval);
      this.readyResolver();
    }, 50);
  }

  private loadScripts() {
    return new Promise((resolve, reject) => {
      const scripts = this.scripts.map((script) => script.key);
      if (
        document.getElementById(scripts[0]) &&
        document.getElementById(scripts[1])
      ) {
        return resolve();
      }

      this.scripts.forEach((script: { key: string; src: string }) => {
        const file = document.createElement("script");
        file.type = "text/javascript";
        file.src = script.src;
        file.id = script.key;
        file.onload = resolve;
        file.onerror = reject;
        document.querySelector("head")!.appendChild(file);
      });
    });
  }

  private isFirebaseInitialized() {
    if (!window.firebase) {
      return false;
    }

    const firebaseApps = window.firebase.apps;
    if (firebaseApps && firebaseApps.length === 0) {
      return false;
    }

    return true;
  }
}

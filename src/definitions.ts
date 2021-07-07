export interface FirebaseRemoteConfigPlugin {
  initializeFirebase(options: any): Promise<void>;
  setDefaultWebConfig(options: any): Promise<void>;
  initialize(options: { minimumFetchIntervalInSeconds: number }): Promise<void>;
  fetch(): Promise<void>;
  activate(): Promise<void>;
  fetchAndActivate(): Promise<void>;
  getBoolean(options: RCValueOption): Promise<RCReturnData>;
  getByteArray(options: RCValueOption): Promise<RCReturnDataArray>;
  getNumber(options: RCValueOption): Promise<RCReturnData>;
  getString(options: RCValueOption): Promise<RCReturnData>;
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

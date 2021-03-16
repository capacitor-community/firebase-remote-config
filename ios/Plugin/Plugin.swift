import Foundation
import Capacitor
import FirebaseCore
import FirebaseRemoteConfig

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitor.ionicframework.com/docs/plugins/ios
 */
@objc(FirebaseRemoteConfig)
public class FirebaseRemoteConfig: CAPPlugin {
    
    var remoteConfig: RemoteConfig?
    
    public override func load() {
        if (FirebaseApp.app() == nil) {
          FirebaseApp.configure();
        }
        
        if self.remoteConfig == nil {
            self.remoteConfig = RemoteConfig.remoteConfig()
        }
    }
    
    @objc func initialize(_ call: CAPPluginCall) {
        let minFetchInterval = call.getInt("minimumFetchInterval") ?? 0
        let fetchTimeout = call.getInt("fetchTimeout") ?? 0
        
        guard let remoteConfig = self.remoteConfig else {
          call.reject("Missing initialization")
          return
        }

        let settings: RemoteConfigSettings = RemoteConfigSettings()
        settings.minimumFetchInterval = TimeInterval(minFetchInterval)
        settings.fetchTimeout = TimeInterval(fetchTimeout)
        remoteConfig.configSettings = settings
        call.success()
    }
    
    @objc func fetch(_ call: CAPPluginCall) {
        self.remoteConfig?.fetch(completionHandler: { (status, error) in
            if status == .success {
                call.success()
                return
            } 
            call.reject(error?.localizedDescription ?? "Error occured while executing fetch()")
            return
        })
    }
    
    @objc func activate(_ call: CAPPluginCall) {
        self.remoteConfig?.activate(completion: { (status, error) in
            if error != nil {
                call.reject(error?.localizedDescription ?? "Error occured while executing activate()")
            } else {
                call.success()
            }
        })
    }
    
    @objc func fetchAndActivate(_ call: CAPPluginCall) {
        self.remoteConfig?.fetchAndActivate(completionHandler: { (status, error) in
            if status == .successFetchedFromRemote || status == .successUsingPreFetchedData {
                call.success()
            } else {
                call.reject("Error occured while executing failAndActivate()")
            }
        })
    }
    
    @objc func getBoolean(_ call: CAPPluginCall) {
        if call.hasOption("key") {
            let key = call.getString("key")
            
            if key != nil {
                let value = self.remoteConfig?.configValue(forKey: key).boolValue
                let source = self.remoteConfig?.configValue(forKey: key).source
                call.success([
                    "key": key! as String,
                    "value": value! as Bool,
                    "source": source!.rawValue as Int
                ])
            } else {
                call.reject("Key is missing")
            }
        } else {
            call.reject("Key is missing")
        }
    }
    
    @objc func getNumber(_ call: CAPPluginCall) {
        if call.hasOption("key") {
            let key = call.getString("key")
            
            if key != nil {
                let value = self.remoteConfig?.configValue(forKey: key).numberValue
                let source = self.remoteConfig?.configValue(forKey: key).source
                call.success([
                    "key": key! as String,
                    "value": value!,
                    "source": source!.rawValue as Int
                ])
            } else {
                call.reject("Key is missing")
            }
        } else {
            call.reject("Key is missing")
        }
    }
    
    @objc func getString(_ call: CAPPluginCall) {
        if call.hasOption("key") {
            let key = call.getString("key")
            
            if key != nil {
                let value = self.remoteConfig?.configValue(forKey: key).stringValue
                let source = self.remoteConfig?.configValue(forKey: key).source
                call.success([
                    "key": key! as String,
                    "value": value!,
                    "source": source!.rawValue as Int
                ])
            } else {
                call.reject("Key is missing")
            }
        } else {
            call.reject("Key is missing")
        }
    }
    
    @objc func getByteArray(_ call: CAPPluginCall) {
        call.success()
    }

    @objc func initializeFirebase(_ call: CAPPluginCall) {
        print("FirebaseRemoteConfig: initializeFirebase noop")
        call.success()
    }
    @objc func setDefaultConfig(_ call: CAPPluginCall) {
        let standardUserDefaults = UserDefaults.standard
        let remoteConfigDefaults = standardUserDefaults.object(forKey: "FirebaseRemoteConfigDefaults".lowercased())
        
        if remoteConfigDefaults != nil {
            self.remoteConfig?.setDefaults(fromPlist: remoteConfigDefaults as? String)
        }
        call.success()
    }
}

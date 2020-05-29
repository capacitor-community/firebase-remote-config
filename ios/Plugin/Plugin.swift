import Foundation
import Capacitor
import Firebase

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitor.ionicframework.com/docs/plugins/ios
 */
@objc(FirebaseRemoteConfig)
public class FirebaseRemoteConfig: CAPPlugin {
    
    var remoteConfig: RemoteConfig?
    
    public override func load() {
        if self.remoteConfig == nil {
            self.remoteConfig = RemoteConfig.remoteConfig()
        }
    }
    
    @objc func initialize(_ call: CAPPluginCall) {
        let minFetchInterval = call.getInt("minimumFetchIntervalInSeconds") ?? 0
        
        if self.remoteConfig != nil {
            let settings: RemoteConfigSettings = RemoteConfigSettings()
            settings.minimumFetchInterval = TimeInterval(minFetchInterval)
            self.remoteConfig?.configSettings = settings
        }
    }
    
    @objc func fetch(_ call: CAPPluginCall) {
        self.remoteConfig?.fetch(completionHandler: { (status, error) in
            if status == .success {
                call.success()
            } else {
                call.error(error?.localizedDescription ?? "Error occured while executing fetch()")
            }
        })
    }
    
    @objc func activate(_ call: CAPPluginCall) {
        self.remoteConfig?.activate(completionHandler: { (error) in
            if error != nil {
                call.error(error?.localizedDescription ?? "Error occured while executing activate()")
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
                call.error("Error occured while executing failAndActivate()")
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
                call.error("Key is missing")
            }
        } else {
            call.error("Key is missing")
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
                call.error("Key is missing")
            }
        } else {
            call.error("Key is missing")
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
                call.error("Key is missing")
            }
        } else {
            call.error("Key is missing")
        }
    }
    
    @objc func getByteArray(_ call: CAPPluginCall) {
        call.success()
    }
}


  Pod::Spec.new do |s|
    s.name = 'CapacitorCommunityFirebaseRemoteConfig'
    s.version = '0.1.0'
    s.summary = 'A native plugin for firebase remote config'
    s.license = 'MIT'
    s.homepage = 'https://github.com/capacitor-community/firebase-remote-config'
    s.author = 'Priyank Patel <priyank.patel@stackspace.ca>'
    s.source = { :git => 'https://github.com/capacitor-community/firebase-remote-config', :tag => s.version.to_s }
    s.source_files = 'ios/Plugin/**/*.{swift,h,m,c,cc,mm,cpp}'
    s.ios.deployment_target  = '12.0'
    s.dependency 'Capacitor'
    s.static_framework = true
    s.dependency 'Firebase/RemoteConfig'
  end

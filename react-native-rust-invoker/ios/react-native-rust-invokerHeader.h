#ifdef RCT_NEW_ARCH_ENABLED
#import "react-native-rust-invokerSpec/react-native-rust-invokerSpec.h"

@interface react-native-rust-invoker : NSObject <Nativereact-native-rust-invokerSpec>
#else
#import <React/RCTBridgeModule.h>

@interface react-native-rust-invoker : NSObject <RCTBridgeModule>
#endif

@end
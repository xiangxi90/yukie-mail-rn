#import "react-native-rust-invokerHeader.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "react-native-rust-invokerSpec.h"
#endif

#include "react-native-rust-invoker.h"

@implementation react-native-rust-invoker

RCT_EXPORT_MODULE()

- (void)add:(double)a b:(double)b resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject
{
    NSNumber *result = [[NSNumber alloc] initWithInteger:a + b];
    resolve(result);
}

- (NSNumber *) turboMultiply:(double)num1 num2:(double)num2{
    double res = react-native-rust-invoker::multiply(num1, num2);
    return [NSNumber numberWithDouble:res];
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::Nativereact-native-rust-invokerSpecJSI>(params);
}
#endif

@end
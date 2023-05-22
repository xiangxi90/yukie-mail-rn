ARCHS_IOS = i386-apple-ios x86_64-apple-ios armv7-apple-ios armv7s-apple-ios aarch64-apple-ios
ARCHS_ANDROID =  x86_64-linux-android armv7-linux-androideabi aarch64-linux-android i686-linux-android
LIB=libsigner.a
all: ios android
ios: $(LIB)
android: $(ARCHS_ANDROID)
	$(shell powershell ./copy_android.sh)
.PHONY: $(ARCHS_IOS)
$(ARCHS_IOS): %:
	cross build --target $@ --release
.PHONY: $(ARCHS_ANDROID)
$(ARCHS_ANDROID): %:
	cross build --target $@ --release
$(LIB): $(ARCHS_IOS)
	lipo -create -output $@ $(foreach arch,$(ARCHS_IOS),$(wildcard target/$(arch)/release/$(LIB)))
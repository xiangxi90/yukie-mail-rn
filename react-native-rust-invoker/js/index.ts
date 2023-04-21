import {NativeModules} from 'react-native';
import { Spec } from './Nativereact-native-rust-invoker';

const isTurboModuleEnabled = global.__turboModuleProxy != null;

const react-native-rust-invokerModule = isTurboModuleEnabled
  ? require('./Nativereact-native-rust-invoker').default
  : NativeModules.react-native-rust-invoker;

class react-native-rust-invokerModuleProxy implements Spec {
  private module: Spec;
  
  constructor(module: Spec) {
    this.module = module;
  }
  
  async add(a: number, b: number): Promise<number> {
    return await this.module.add(a, b);
  }
  
  turboMultiply(num1: number, num2: number): number {
    return this.module.turboMultiply(num1, num2);
  }
  
}
  
const instance = new react-native-rust-invokerModuleProxy(react-native-rust-invokerModule);

export default instance;

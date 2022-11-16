
export interface UserData {
  status: string;
  login: string;
  image_url: string;
}

export function newUserData(status: string, login: string, image_url: string): UserData {
  return {
    status: status,
    login: login,
    image_url: image_url,
  };
}

export class MapUserData {

  private keyMap: Map<string, UserData>;
  private valueMap: Map<string, string[]>;

  constructor() {
    this.keyMap = new Map<string, UserData>();
    this.valueMap = new Map<string, string[]>();
  }

  set(key: string, value: UserData): void {
    this.keyMap.set(key, value);
    if (this.valueMap.has(value.login)) {
      this.valueMap.get(value.login)?.push(key);
    } else {
      this.valueMap.set(value.login, [key]);
    }
  }

  delete(key: string): void {
    const value = this.keyMap.get(key);
    if (value) {
      const values = this.valueMap.get(value.login);
      if (values && values.length > 1) {
        this.valueMap.set(value.login, values.filter(k => k !== key));
      } else {
        this.valueMap.delete(value.login);
      }
    }
    this.keyMap.delete(key);
  }

  valueOf(key: string): UserData {
    const value = this.keyMap.get(key);
    if (value) return value;
    return newUserData('', '', '');
  }

  keyOf(value: string): string[] {
    const result = this.valueMap.get(value);
    if (result) return result;
    return [];
  }

  getValues(): UserData[] {
    return Array.from(this.keyMap.values());
  }

  hasKey(key: string): boolean {
    return this.keyMap.has(key);
  }

  hasValue(value: string): boolean {
    return this.valueMap.has(value);
  }

  updateValue(oldValue: UserData, newValue: UserData): void {
    const result = this.valueMap.get(oldValue.login);
    if (result) {
      result.forEach(key => this.keyMap.set(key, newValue));
      this.valueMap.delete(oldValue.login);
      this.valueMap.set(newValue.login, result);
    }
  }

  debug(): void {
    console.log('+-----------------------------------------------------');
    console.log('| chaves in keyMap:', Array.from(this.keyMap.keys()));
    console.log('| valores in keyMap:', Array.from(this.keyMap.values()));
    console.log('\n| chaves in valueMap:', Array.from(this.valueMap.keys()));
    console.log('| valores in valueMap:', Array.from(this.valueMap.values()));
    console.log('+-----------------------------------------------------');
  }
}

export interface UserOnline {
  status: string;
  login: string;
}

export class MapStatus {

  private keyMap: Map<string, UserOnline>;
  private valueMap: Map<string, string[]>;

  constructor() {
    this.keyMap = new Map<string, UserOnline>();
    this.valueMap = new Map<string, string[]>();
  }

  set(key: string, value: UserOnline): void {
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

  valueOf(key: string): UserOnline {
    const value = this.keyMap.get(key);
    if (value) return value;
    return { status: '', login: '' };
  }

  keyOf(value: string): string[] {
    const result = this.valueMap.get(value);
    if (result) return result;
    return [];
  }

  getValues(): IterableIterator<UserOnline> {
    return this.keyMap.values();
  }

  hasKey(key: string): boolean {
    return this.keyMap.has(key);
  }

  hasValue(value: string): boolean {
    return this.valueMap.has(value);
  }

  updateValue(key: string, oldValue: UserOnline, newValue: UserOnline): void {
    this.keyMap.set(key, newValue);
    const result = this.valueMap.get(oldValue.login);
    if (result) {
      this.valueMap.set(newValue.login, result);
    }
    this.valueMap.delete(oldValue.login);
  }
}
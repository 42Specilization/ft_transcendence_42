export interface IntraData {
  first_name: string;
  email: string;
  usual_full_name: string;
  image_url: string;
  login: string;
  matches: string;
  wins: string;
  lose: string;
  isTFAEnable: boolean;
  tfaValidated: boolean;
}

export class MapStatus {

  private keyMap: Map<string, string>;
  private valueMap: Map<string, string[]>;

  constructor() {
    this.keyMap = new Map<string, string>();
    this.valueMap = new Map<string, string[]>();
  }

  set(key: string, value: string): void {
    this.keyMap.set(key, value);
    if (this.valueMap.has(value)) {
      this.valueMap.get(value)?.push(key);
    } else {
      this.valueMap.set(value, [key]);
    }
  }

  delete(key: string): void {
    const value = this.keyMap.get(key);
    if (value) {
      const values = this.valueMap.get(value);
      if (values && values.length > 1) {
        this.valueMap.set(value, values.filter(k => k !== key));
      } else {
        this.valueMap.delete(value);
      }
    }
    this.keyMap.delete(key);
  }

  valueOf(key: string): string {
    const value = this.keyMap.get(key);
    if (value) return value;
    return '';
  }

  keyOf(value: string): string[] {
    const result = this.valueMap.get(value);
    if (result) return result;
    return [];
  }

  getValues(): IterableIterator<string> {
    return this.keyMap.values();
  }

  hasKey(key: string): boolean {
    return this.keyMap.has(key);
  }

  hasValue(value: string): boolean {
    return this.valueMap.has(value);
  }
}
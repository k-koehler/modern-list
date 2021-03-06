interface LRUObject<T> {
  get(index: number): T | null;
  set(index: number, val: T): void;
}

declare function LRU<T>(max: number, opts?: {}): LRUObject<T>;

declare module 'array-lru' {
  export = LRU;
}

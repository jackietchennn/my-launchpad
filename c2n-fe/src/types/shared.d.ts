declare namespace IShared {
  interface Action<T = any> {
    type: string;
    payload: T;
  }
}
const prefix = "litdock_"

export enum StorageKeys {
  HomePageShowType = "homePageShowType",
  Theme = "theme",
}

export function getStorageKey(key: StorageKeys): string {
  return prefix + key
}

export function saveToStorage(key: StorageKeys, value: string): void {
  localStorage.setItem(getStorageKey(key), value)
}

export function getFromStorage<T = string>(key: StorageKeys, defaultValue: T): T {
  return (localStorage.getItem(getStorageKey(key)) as T) ?? defaultValue
}
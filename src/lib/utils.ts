import type { Creator } from "@/types/reference.types"
import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeArray<T>(
  value: T | T[] | undefined
): T[] {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

export function concatenateCreators(creators: Creator[]): string {
  return creators
    .map((creator) => `${creator.firstName} ${creator.lastName}`)
    .join(", ")
}
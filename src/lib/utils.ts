export const generateId = (): string => crypto.randomUUID()

/** Merges class names, filtering falsy values. */
export const cn = (...classes: (string | false | undefined | null)[]): string =>
  classes.filter(Boolean).join(' ')

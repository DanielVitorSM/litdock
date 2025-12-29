/**
 * Converte string de camelCase para snake_case
 * Ex: publicationTitle -> publication_title
 */
export const toSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

/**
 * Converte string de snake_case para camelCase
 * Ex: publication_title -> publicationTitle
 */
export const toCamelCase = (str: string) =>
  str.replace(/_([a-z])/g, (g) => g[1]!.toUpperCase());

/**
 * Converte todas as chaves de um objeto para snake_case (para enviar ao Supabase)
 */
export const mapKeysToSnakeCase = (obj: Record<string, unknown>) => {
  const newObj: Record<string, unknown> = {};
  for (const key in obj) {
    newObj[toSnakeCase(key)] = obj[key];
  }
  return newObj;
};

/**
 * Converte todas as chaves de um objeto para camelCase (para usar no Vue)
 */
export const mapKeysToCamelCase = (obj: Record<string, unknown>) => {
  const newObj: Record<string, unknown> = {};

  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined) continue;

    newObj[toCamelCase(key)] = obj[key];
  }

  return newObj;
};
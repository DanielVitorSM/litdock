export class ReferenceNotFoundError extends Error {
  constructor(source: string, id: string) {
    super(`${source} não encontrado: ${id}`)
    this.name = 'ReferenceNotFoundError'
  }
}

export class ReferenceValidationError extends Error {
  constructor(source: string, message: string) {
    super(`${source}: ${message}`)
    this.name = 'ReferenceValidationError'
  }
}
export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export const notFound = (resource: string) => new AppError(404, `${resource} was not found`);
export const conflict = (message: string) => new AppError(409, message);
export const invalid = (message: string) => new AppError(422, message);

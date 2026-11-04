export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

export const success = <T>(data: T): ServiceResult<T> => ({ success: true, data });

export const failure = (code: string, message: string): ServiceResult<never> => ({
  success: false,
  error: { code, message },
});

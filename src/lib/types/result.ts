import type { ValidationResult } from './validators';

export type Result<T, E = Error> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

export function tryParse<T>(
  data: unknown,
  guard: (d: unknown) => d is T
): Result<T, string> {
  if (guard(data)) {
    return ok(data);
  }
  return err('Data does not match expected type');
}

export function tryParseArray<T>(
  data: unknown,
  itemGuard: (d: unknown) => d is T
): Result<T[], string> {
  if (!Array.isArray(data)) {
    return err('Data is not an array');
  }
  
  const invalidIndex = data.findIndex(item => !itemGuard(item));
  if (invalidIndex !== -1) {
    return err(`Item at index ${invalidIndex} does not match expected type`);
  }
  
  return ok(data);
}

export function validationResultToResult(result: ValidationResult): Result<void, string[]> {
  if (result.valid) {
    return ok(undefined);
  }
  return err(result.errors);
}

export function mapResult<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> {
  return result.ok ? ok(fn(result.value)) : result;
}

export function flatMapResult<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>
): Result<U, E> {
  return result.ok ? fn(result.value) : result;
}

export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  return result.ok ? result.value : defaultValue;
}

export function unwrap<T, E>(result: Result<T, E>): T {
  if (!result.ok) {
    throw result.error;
  }
  return result.value;
}

export function combineResults<T, E>(results: Result<T, E>[]): Result<T[], E[]> {
  const errors: E[] = [];
  const values: T[] = [];
  
  for (const result of results) {
    if (result.ok) {
      values.push(result.value);
    } else {
      errors.push(result.error);
    }
  }
  
  return errors.length === 0 ? ok(values) : err(errors);
}

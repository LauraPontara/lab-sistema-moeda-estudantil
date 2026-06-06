import { ConflictException } from '@nestjs/common';

const POSTGRES_UNIQUE_VIOLATION = '23505';

type PostgresUniqueError = { code: string; constraint_name?: string };

function asUniqueViolation(value: unknown): PostgresUniqueError | null {
  if (
    value &&
    typeof value === 'object' &&
    'code' in value &&
    (value as { code?: unknown }).code === POSTGRES_UNIQUE_VIOLATION
  ) {
    return value as PostgresUniqueError;
  }
  return null;
}

function messageForConstraint(constraint: string | undefined): string {
  const name = (constraint ?? '').toLowerCase();
  if (name.includes('cpf')) return 'Este CPF já está cadastrado.';
  if (name.includes('rg')) return 'Este RG já está cadastrado.';
  if (name.includes('cnpj')) return 'Este CNPJ já está cadastrado.';
  if (name.includes('email')) return 'Este e-mail já está cadastrado.';
  return 'Já existe um registro com estes dados.';
}

// Drizzle/postgres-js: a unique violation chega como o próprio erro ou em `cause`.
// Se for 23505, lança um 409 com mensagem por campo; senão não faz nada (o
// chamador deve relançar o erro original).
export function throwOnUniqueViolation(error: unknown): void {
  const violation =
    asUniqueViolation(error) ??
    asUniqueViolation((error as { cause?: unknown })?.cause);

  if (violation) {
    throw new ConflictException(
      messageForConstraint(violation.constraint_name),
    );
  }
}

import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvValidation } from './dto/env-dto';

export function parseEnv(config: Record<string, any>) {
  const validated = plainToInstance(EnvValidation, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    console.error(errors);
    throw new Error('❌ Invalid environment variables!');
  }

  return validated;
}

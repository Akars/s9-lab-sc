import 'dotenv/config';

const getOrThrow = (name: string): string => {
  const envVar = process.env[name];

  if (typeof envVar === 'undefined') {
    throw new Error(`Undefined variable ${name}`);
  }

  return `${envVar}`;
};

export const DATABASE_ROLE = getOrThrow('DATABASE_ROLE');
export const DATABASE_HOST = getOrThrow('DATABASE_HOST');
export const DATABASE_NAME = getOrThrow('DATABASE_NAME');
export const DATABASE_PWD = getOrThrow('DATABASE_PWD');
export const DATABASE_PORT = parseInt(getOrThrow('DATABASE_PORT'), 10);
export const DS_SYNC = false;

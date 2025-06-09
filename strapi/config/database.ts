import path from 'path';

export default ({ env }) => {
  const isProduction = env('NODE_ENV') === 'production';

  if (isProduction) {
    return {
      connection: {
        client: 'postgres',
        connection: {
          connectionString: env('DATABASE_URL'),
          ssl: { rejectUnauthorized: false },
          schema: 'public',
        },
        acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
      },
      users: {
        client: 'postgres',
        connection: {
          connectionString: env('DATABASE_URL'),
          ssl: { rejectUnauthorized: false },
          schema: 'user-db',
        },
        acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
      },
    };
  } else {
    return {
      connection: {
        client: 'sqlite',
        connection: {
          filename: path.join(__dirname, '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
        },
        useNullAsDefault: true,
      },
      users: {
        client: 'sqlite',
        connection: {
          filename: path.join(__dirname, '..', '..', env('USER_DATABASE_FILENAME', '.tmp/user-db.db')),
        },
        useNullAsDefault: true,
      },
    };
  }
};

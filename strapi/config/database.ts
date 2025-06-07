import path from 'path';

export default ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      connectionString: env('DATABASE_URL', 'postgresql://foreverneardb_user:UIIBvbOl0LyLoyy6d0cqlkCh11NUcGaT@dpg-d125bi49c44c73fvdg40-a/foreverneardb'),
      ssl: env.bool('DATABASE_SSL', false) && {
        rejectUnauthorized: false,
      },
    },
    acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
  },
});

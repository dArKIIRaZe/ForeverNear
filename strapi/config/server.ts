export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS') || ["tobemodified1", "tobemodified2"],
  },
  cors: {
    origin: [
      'https://forevernear-1.onrender.com',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    headers: '*',
  },
  transfer: {
    enabled: true,
  },
});

export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'https://forevernear-1.onrender.com',
        'https://forevernear.onrender.com',
        'http://localhost:3000'
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      headers: '*',
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  'global::deepPopulate',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'forevernear-media.s3.eu-north-1.amazonaws.com',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'forevernear-media.s3.eu-north-1.amazonaws.com',
          ],
        },
      },
    },
  }
];

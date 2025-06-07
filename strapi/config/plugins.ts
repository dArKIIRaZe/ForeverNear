export default ({ env }) => ({
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        accessKeyId: env('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
        region: env('AWS_REGION'),
        params: {
          Bucket: env('AWS_BUCKET'),
          ACL: 'private',
        },
        baseUrl: `https://${env('AWS_BUCKET')}.s3.${env('AWS_REGION')}.amazonaws.com`,
        basePath: '',
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
      breakpoints: {
        large: 1000,
        medium: 750,
        small: 500,
        thumbnail: 250,
      },
    },
  },
});

export default ({ env }) => ({
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        accessKeyId: env('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env('AWS_ACCESS_SECRET'),
        region: env('AWS_REGION'),
        params: {
          Bucket: env('AWS_BUCKET'),
        },
      },
    },
  },
});
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_ACCESS_SECRET=your-secret-access-key
AWS_REGION=your-bucket-region
AWS_BUCKET=your-bucket-name
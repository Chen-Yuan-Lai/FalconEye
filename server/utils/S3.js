import { S3Client } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.USER_ACCESS_KEY,
    secretAccessKey: process.env.USER_SECRET_ACCESS_KEY,
  },
});

export default s3;

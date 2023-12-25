import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.USER_ACCESS_KEY,
    secretAccessKey: process.env.USER_SECRET_ACCESS_KEY,
  },
});

export const putObject = async (fileName, buffer, mimetype) => {
  const bucketName = process.env.S3_BUCKET_NAME;
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: buffer,
    ContentType: mimetype,
  };

  const command = new PutObjectCommand(params);
  const res = await s3.send(command);

  return res;
};

export const getObject = async Key => {
  const Bucket = process.env.S3_BUCKET_NAME;
  const command = new GetObjectCommand({
    Bucket,
    Key,
  });

  const res = await s3.send(command);

  return res;
};

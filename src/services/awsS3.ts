import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

async function uploadToS3(file : Express.Multer.File) {

  const filename = Date.now().toString()
  const cloudfrontURL = process.env.CLOUDFRONT_URL
  
  const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  });

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: filename,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };

  const command = new PutObjectCommand(params);

  try {
    await s3Client.send(command);
    return cloudfrontURL+filename;
  } catch (error) {
    return (error as Error).message;
  }
}

export default uploadToS3;

// Code copied from AWS S3 Short Assignment
// Cursor and ChatGPT helped write this code
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const createPresignedUrlWithClient = ({ region, bucket, key }) => {
  const client = new S3Client({
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  const command = new PutObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 3600 });
};

const signS3 = async (req, res) => {
  const fileName = req.query['file-name'];
  const s3Params = {
    bucket: process.env.S3_BUCKET_NAME,
    key: fileName,
    acl: 'public-read',
    region: 'us-east-1',
  };
  try {
    const clientURL = await createPresignedUrlWithClient(s3Params);
    const returnData = {
      signedRequest: clientURL,
      url: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`,
    };
    return res.json(returnData);
  } catch (error) {
    console.error('S3 Error:', error);
    return res.status(500).json({ error: error.message });
  }
};

export default signS3;

import { S3 } from 'aws-sdk';
import type { NextApiRequest, NextApiResponse } from 'next';

const s3 = new S3({
  region: process.env.AWS_S3_BUCKET_NAME || 'eu-west-3',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const bucketName = process.env.AWS_S3_BUCKET_NAME || 'vsports';
    const objects = await s3.listObjectsV2({ Bucket: bucketName }).promise();

    if (!objects.Contents) {
      throw new Error('Error requesting objects from S3');
    }

    const filenames = objects.Contents.map((object) => object.Key);
    res.status(200).json({ filenames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

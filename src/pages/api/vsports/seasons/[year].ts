import { S3 } from 'aws-sdk';
import { type Season } from '~/@types';
import type { NextApiRequest, NextApiResponse } from 'next';

const s3 = new S3({
  region: process.env.AWS_S3_BUCKET_NAME || 'eu-west-3',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const getDataFromS3 = async (bucketName: string, object: S3.Object): Promise<Season | null> => {
  if (!object.Key) return null;
  const objectData = await s3
    .getObject({
      Bucket: bucketName,
      Key: object.Key,
    })
    .promise();

  if (!objectData.Body) return null;

  const content = objectData.Body.toString();
  return JSON.parse(content) as Season;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const bucketName = process.env.AWS_S3_BUCKET_NAME || 'vsports';
    const data = await s3.listObjectsV2({ Bucket: bucketName }).promise();

    if (!data.Contents) {
      throw new Error('Error getting objects from S3');
    }

    const lastS3Object = data.Contents[data.Contents.length - 1];

    if (!lastS3Object) {
      throw new Error('Object is undefined');
    }

    const lastSeason = await getDataFromS3(bucketName, lastS3Object);
    res.status(200).json(lastSeason);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

import { S3 } from 'aws-sdk';
import { type Season } from '~/@types';
import type { NextApiRequest, NextApiResponse } from 'next';

const s3 = new S3({
  region: process.env.AWS_S3_REGION_NAME || 'eu-west-3',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const bucketName = process.env.AWS_S3_BUCKET_NAME || 'vsports';
    const data = await s3.listObjectsV2({ Bucket: bucketName }).promise();

    if (!data.Contents) {
      throw new Error('S3 object body is undefined');
    }

    const objects = await Promise.all(
      data.Contents.map(async (object): Promise<Season | null> => {
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
      })
    );

    res.status(200).json(objects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

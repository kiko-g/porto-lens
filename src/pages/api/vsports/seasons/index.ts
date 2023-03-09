import type { Season } from '~/@types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { estabilishS3Connection } from '~/utils/s3';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const s3 = estabilishS3Connection();
    const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME || 'vsports';
    const data = await s3.listObjectsV2({ Bucket: bucketName }).promise();

    if (!data.Contents) throw new Error('S3 object body is undefined');

    const seasons = await Promise.all(
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

    res.status(200).json(seasons);
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ message: errorMessage });
  }
}

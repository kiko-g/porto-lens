import type { Season } from '~/@types';
import { estabilishS3Connection } from '~/utils/s3';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const s3 = estabilishS3Connection();
    const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME || 'vsports';
    const data = await s3.listObjectsV2({ Bucket: bucketName }).promise();

    if (!data.Contents) throw new Error('Error getting objects from S3');

    const lastS3Object = data.Contents[data.Contents.length - 1];

    if (!lastS3Object || !lastS3Object.Key) throw new Error('Object is undefined');

    const objectData = await s3
      .getObject({
        Bucket: bucketName,
        Key: lastS3Object.Key,
      })
      .promise();

    if (!objectData.Body) return null;

    const content = objectData.Body.toString();
    const lastSeason = JSON.parse(content) as Season;

    const matchdays = {
      season: lastSeason.season_span,
      matchdays: lastSeason.matchdays,
    };

    res.status(200).json(matchdays);
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ message: errorMessage });
  }
}

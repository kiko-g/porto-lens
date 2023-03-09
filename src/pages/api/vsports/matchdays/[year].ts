import type { Season } from '~/@types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { estabilishS3Connection } from '~/utils/s3';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const s3 = estabilishS3Connection();
    const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME || 'vsports';
    const secondYearStr = req.query.year as string;

    const secondYear = parseInt(secondYearStr);
    if (isNaN(secondYear)) {
      throw new Error(`Invalid year: ${secondYearStr}`);
    }

    const objects = await s3.listObjectsV2({ Bucket: bucketName }).promise();
    if (!objects.Contents) {
      throw new Error('Error requesting objects from S3');
    }

    const filenames = objects.Contents.map((object) => object.Key);
    const filename = filenames.find((x) => x?.includes(`-${secondYearStr}.json`));
    if (!filename) {
      throw new Error(`No records found for the request season (${secondYear - 1}/${secondYear})`);
    }

    const objectData = await s3
      .getObject({
        Bucket: bucketName,
        Key: filename,
      })
      .promise();

    if (!objectData.Body) return null;

    const content = objectData.Body.toString();
    const season = JSON.parse(content) as Season;

    const matchdays = {
      season: season.season_span,
      matchdays: season.matchdays,
    };

    res.status(200).json(matchdays);
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ message: errorMessage });
  }
}

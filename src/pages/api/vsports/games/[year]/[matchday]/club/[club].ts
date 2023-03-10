import type { Season } from '~/@types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { estabilishS3Connection } from '~/utils/s3';
import { normalizeClubName } from '~/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const s3 = estabilishS3Connection();
    const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME || 'vsports';
    const secondYearStr = req.query.year as string;
    const matchdayIndexStr = req.query.matchday as string;
    const clubStr = req.query.club as string;
    const club = normalizeClubName(clubStr);

    const secondYear = parseInt(secondYearStr);
    if (isNaN(secondYear)) {
      throw new Error(`Invalid year: ${secondYearStr}`);
    }

    const matchdayIndex = parseInt(matchdayIndexStr);
    if (isNaN(matchdayIndex)) {
      throw new Error(`Invalid matchday number: ${matchdayIndexStr}`);
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

    if (season.matchdays.length === 0) {
      throw new Error(`No matchdays for the request season (${secondYear - 1}/${secondYear})`);
    }

    if (matchdayIndex < 1 || matchdayIndex > season.matchdays.length) {
      throw new Error(`Matchday number must be between 1 and ${season.matchdays.length}`);
    }

    const games = season.matchdays[matchdayIndex]?.games;
    const clubGame = games?.find(
      (game) =>
        game.home_team.replace(/\s/g, '').toLowerCase() === club ||
        game.away_team.replace(/\s/g, '').toLowerCase() === club
    );

    if (!clubGame) {
      throw new Error(`No games found for the request club (${club})`);
    }

    const matchdayGames = {
      season: season.season_span,
      matchday_number: matchdayIndex,
      game: clubGame,
    };

    res.status(200).json(matchdayGames);
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ message: errorMessage });
  }
}

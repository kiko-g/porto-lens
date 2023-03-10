import Link from 'next/link';
import React from 'react';
import type { Game } from '~/@types';

type Props = {
  game: Game;
};

export default function GameShowcase({ game }: Props) {
  return (
    <div className="flex flex-col rounded">
      {/* Header */}
      <div className="grid grid-cols-3 rounded-t bg-slate-700 px-3 py-2 text-sm tracking-tighter text-white">
        <span className="whitespace-nowrap text-left">{game.home_team}</span>
        <span className="whitespace-nowrap text-center">
          {game.home_score} - {game.away_score}
        </span>
        <span className="whitespace-nowrap text-right">{game.away_team}</span>
      </div>

      {/* Body */}
      <div className="bg-white">
        <div className="grid grid-cols-2 gap-4 px-3 py-2">
          {game.goals
            .map((x) => x)
            .reverse()
            .map((goal, goalIdx) => (
              <li
                key={`goal-${goalIdx}`}
                className="flex h-full flex-1 flex-col gap-1 self-stretch overflow-visible"
              >
                <div
                  dangerouslySetInnerHTML={{ __html: goal.embed }}
                  className="flex h-full flex-1 flex-col gap-1 self-stretch overflow-visible"
                />
                <Link
                  href={goal.share_url}
                  className="text-blue-400 hover:text-blue-500 hover:underline"
                >
                  {goal.title}
                </Link>
              </li>
            ))}
        </div>
      </div>

      {/* Footer */}
      <div className="rounded-b bg-slate-700 px-3 py-2 text-sm tracking-tighter text-white"></div>
    </div>
  );
}

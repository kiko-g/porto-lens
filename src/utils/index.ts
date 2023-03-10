export const normalizeClubName = (club: string) => {
  if (club.includes('porto') || club.includes('fcp')) return 'fcporto';
  else return club;
};

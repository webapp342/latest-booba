export interface Match {
  league: string;
  date: string;
  homeWin: number;
  draw: number;
  awayWin: number;
  homeTeam: string;
  homeLogo: string;
  awayTeam: string;
  awayLogo: string;
  doubleChance0_2: string;
  doubleChance0_1: string;
  doubleChance2_1: string;
  over0_5: string;
  over1_5: string;
  over2_5: string;
  over3_5: string;
  over4_5: string;
  under0_5: string;
  under1_5: string;
  totalGoals: number;
  under2_5: string;
  under3_5: string;
  under4_5: string;
  goalInBothHalves_Y: string;
  goalInBothHalves_N: string;
  firstGoalscorer1: string;
  firstGoalscorer0: string;
  firstGoalscorer2: string;
  under1_5home: string;
  under1home: string;
  draw_0home: string;
  plus_1home: string;
  plus1_5home: string;
  plus2_5home: string;
  under1_5Deplas: string;
  firstGoalScorer : string;
  under1Deplas: string;
  draw_0Deplas: string;
  plus_1Deplas: string;
  plus1_5Deplas: string;
  plus2_5Deplas: string;
  ciftevet: string;
  tekevet: string;

  // Canlı veriye gerek olmadan anlık maç bilgileri
  liveData: {
    goals: { home: number; away: number }; // Ev sahibi ve deplasman takımlarının attığı goller
    elapsed: number; // Maçın ne kadar süresi geçti
    status: string; // Maç durumu (başladı, bitti, vb.)
    halftimeScore: { home: number; away: number }; // Ev sahibi ve deplasman takımlarının attığı goller
  };

  [key: string]: any; // Dinamik anahtarlar için indeks imzası ekleniyor
}

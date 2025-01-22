export interface ScheduleItem {
  date: string;
  startime: string;
  gamecode: string;
  hometeam: string;
  awayteam: string;
}

export interface GameResult {
  gamecode: string;
  homescore: number;
  awayscore: number;
  is_final?: boolean;
}

export interface PlayerStats {
  name: string;
  height: number;
  birthdate: string;
  country: string;
  clubcode: string;
  clubname: string;
  dorsal: string;
  position: string;
  score: number;
  timeplayed: string;
  valuation: number;
  totalrebounds: number;
  offensiverebounds: number;
  defensiverebounds: number;
  assistances: number;
  steals: number;
  turnovers: number;
  blocksagainst: number;
  blocksfavour: number;
  fieldgoals2percent: string;
  fieldgoals3percent: string;
  freethrowspercent: string;
  foulscommited: number;
  foulsreceived: number;
  stats: {
    accumulated: {
      season: {
        code: string;
        gamesplayed: number;
        timeplayed: string;
        score: number;
        fieldgoalsmade2: number;
        fieldgoalsmade3: number;
        freethrowsmade: number;
        fieldgoalsattempted2: number;
        fieldgoalsattempted3: number;
        freethrowsattempted: number;
        offensiverebounds: number;
        defensiverebounds: number;
        totalrebounds: number;
        assistances: number;
        steals: number;
        turnovers: number;
        blocksagainst: number;
        blocksfavour: number;
        foulscommited: number;
        foulsreceived: number;
        valuation: number;
      }[];
    };
  };
}

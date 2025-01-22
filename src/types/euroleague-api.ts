export interface ScheduleItem {
  gameday: string;
  round: string;
  arenacode: string;
  arenaname: string;
  arenacapacity: string;
  date: string;
  startime: string;
  endtime: string;
  group: string;
  game: string;
  gamecode: string;
  hometeam: string;
  homecode: string;
  hometv: string;
  awayteam: string;
  awaycode: string;
  awaytv: string;
  confirmeddate: string;
  confirmedtime: string;
  played: string;
}

export interface ScheduleResponse {
  schedule: {
    item: ScheduleItem[];
  };
}
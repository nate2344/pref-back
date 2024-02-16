export interface IVote {
  id: number;
  mayor: string;
  viceMayor: string;
  voterPhoto: string;
  createdAt: string;
}

export interface IVoteData {
  votes: number;
  photos: string[];
  isMayor: boolean;
  percent?: number;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    coinBalance: number;
  }
  
  export interface Bet {
    _id: string;
    matchId: string;
    teamChosen: 'TeamA' | 'TeamB';
    amount: number;
    odds: number;
    status: 'pending' | 'won' | 'lost';
  }
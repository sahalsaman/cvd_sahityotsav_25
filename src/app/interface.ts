// ICompetition.ts
export interface ICompetition {
  _id?: string;
  name: string;
  resultAdded: boolean;
  published: boolean;
  categoryId?: string; // foreign key reference to Category
  category?: ICategory;
}

// ICategory.ts
export interface ICategory {
  _id: string;
  name: string;
  userId?: string;
  competitions?:ICompetition[]
}

// ITeam.ts
export interface ITeam {
  _id: string;
  userId: string;
  team: string;
  point: number;
  totalResult: number;
}

// IResult.ts
export interface IResult {
  _id?: string;
  userId?: string;
  categoryId: string;
  competitionId: string;
  resultNumber: string;
  published?: boolean;

  // Podium positions
  f_name: string;
  f_team: string;
  s_name?: string;
  s_team?: string;
  s2_name?: string;
  s2_team?: string;
  t_name?: string;
  t_team?: string;
  t2_name?: string;
  t2_team?: string;

  // Optional populated data
  category?: ICategory;
  competition?: ICompetition;
}

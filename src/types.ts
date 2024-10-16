export interface User {
  userId: string;
  firstName: string;
  lastName: string;
}

export interface Assessment {
  name: string;
  score?: number;
  total: number;
}

export interface Unit {
  unitCode: string;
  unitName: string;
  overall: string;
  assessments: Assessment[];
}

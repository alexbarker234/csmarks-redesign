export interface User {
  id: number;
  firstName: string;
  lastName: string;
}

export interface Assessment {
  name: string;
  mark?: number;
  maxMark: number;
}

export interface Unit {
  unitCode: string;
  unitName: string;
  overall: string;
  assessments: Assessment[];
}

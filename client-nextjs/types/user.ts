// File: types/user.ts

export enum Role {
  ADMIN = "admin",
  MECHANIC = "mechanic",
  USER = "user",
}

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  mobile: string;
  address: string;
  role: Role;
  createdAt?: string;
};
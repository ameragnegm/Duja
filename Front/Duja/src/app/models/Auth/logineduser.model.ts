
export interface ILoginedUser {
  userId: string;
  userName: string;
  token: string ; 
  email: string;
  roles: string[];
}
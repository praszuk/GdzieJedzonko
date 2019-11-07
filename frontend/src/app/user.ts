import {Token} from "./auth/token.model";

export class User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  joinDate: string;
  token: Token;
}

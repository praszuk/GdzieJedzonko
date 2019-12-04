import {Role} from './role.enum';

export class User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  date_joined: string;
  role: Role;
}

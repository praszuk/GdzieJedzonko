import {SimpleUser} from './simple-user';

export class Comment {
  id: number;
  user: SimpleUser;
  content: string;
  creation_date: string;
}

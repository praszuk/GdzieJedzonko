import {SimpleUser} from './simple-user';

export class Comment {
  id: number;
  user: SimpleUser;
  comment: string;
  creation_date: string;
}

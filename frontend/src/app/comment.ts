import {User} from './user';

export class Comment {
  id: number;
  user: User;
  comment: string;
  creationDate: string;
}

import {User} from './user.model';

export class Comment {
  id: number;
  user: User;
  comment: string;
  creationDate: string;
}

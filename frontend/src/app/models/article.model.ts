import {User} from './user.model';
import {Comment} from './comment.model';

export class Article {
  id: number;
  title: string;
  content: string;
  creation_date: string;
  restaurant?: object;
  user?: User;
  comments?: Comment[];
  tags?: string[];
}

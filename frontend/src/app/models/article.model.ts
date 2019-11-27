import {User} from '../user';
import {Comment} from '../comment';

export class Article {
  id: number;
  title: string;
  content: string;
  creation_date: string;
  restaurant?: object;
  user?: User;
  comments?: Comment[];
}

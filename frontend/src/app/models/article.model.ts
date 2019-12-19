import {Comment} from './comment.model';
import {Image} from './image.model';
import {SimpleUser} from './simple-user';

export class Article {
  id: number;
  title: string;
  content: string;
  creation_date: string;
  restaurant?: object;
  user?: SimpleUser;
  comments?: Comment[];
  tags?: string[];
  thumbnail?: Image;
  photos?: Image[];
}

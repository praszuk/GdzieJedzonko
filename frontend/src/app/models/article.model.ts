import {Comment} from './comment.model';
import {Image} from './image.model';
import {SimpleUser} from './simple-user';
import {Restaurant} from './restaurant.model';

export class Article {
  id: number;
  title: string;
  content: string;
  creation_date: string;
  restaurant?: Restaurant;
  user?: SimpleUser;
  comments?: Comment[];
  tags?: string[];
  thumbnail?: Image;
  photos?: Image[];
  rating: number;
}

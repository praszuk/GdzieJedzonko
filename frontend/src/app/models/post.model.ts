import {SimpleUser} from './simple-user';
import {Image} from './image.model';

export class Post {
  id: number;
  title: string;
  creation_date: string;
  user: SimpleUser;
  thumbnail?: Image;
}

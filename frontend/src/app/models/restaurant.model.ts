import {SimpleUser} from './simple-user';
import {Post} from './post.model';

export class Restaurant {
  id: number;
  name: string;
  lat: string;
  lon: string;
  city: number;
  website: string;
  address: string;
  // tslint:disable-next-line:variable-name
  article_set: Post[];
  // tslint:disable-next-line:variable-name
  is_approved: boolean;
  owner: SimpleUser;
  rating: number;
}

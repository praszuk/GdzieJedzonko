import {SimpleUser} from './simple-user';

export class Restaurant {
  id: number;
  name: string;
  lat: string;
  lon: string;
  city: number;
  website: string;
  address: string;
  articles: any[];
  owner: SimpleUser;
}

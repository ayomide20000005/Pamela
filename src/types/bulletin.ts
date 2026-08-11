import { Story } from "./story";

export interface BulletinStory {
  story_id: string;
  order_index: number;
  story?: Story;
}

export interface Bulletin {
  id: string;
  title: string;
  bulletin_date: string;
  stories: BulletinStory[];
  created_at: string;
  updated_at: string;
}

export interface NewBulletinInput {
  title: string;
  bulletin_date: string;
}
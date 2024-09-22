export enum ItemTypes {
  Story = 'story',
  Comment = 'comment',
  Job = 'job',
  Poll = 'poll',
  PollOpt = 'pollopt',
}

export enum StoryTypes {
  Top = 'topstories',
  New = 'newstories',
  Best = 'beststories',
  Ask = 'askstories',
  Show = 'showstories',
  Job = 'jobstories',
}

export interface User {
  id: string;
  created: number;
  karma: number;
  about: string;
  submitted: number[];
}

export interface Item {
  id: number;
  deleted?: boolean;
  type: ItemTypes;
  by: string;
  time: number;
  text: string;
  dead?: boolean;
  parent?: number;
  poll?: number;
  kids?: number[];
  url: string;
  score?: number;
  title: string;
  parts?: number[];
  descendants?: number;
}

export interface ItemWithComments extends Item {
  comments: Item[];
}

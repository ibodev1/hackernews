enum ItemTypes {
  Story = "story",
  Comment = "comment",
  Job = "job",
  Poll = "poll",
  PollOpt = "pollopt",
}

enum StoryTypes {
  Top = "topstories",
  New = "newstories",
  Best = "beststories",
  Ask = "askstories",
  Show = "showstories",
  Job = "jobstories",
}

interface User {
  id: string;
  created: number;
  karma: number;
  about: string;
  submitted: number[];
}

interface Item {
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

interface ItemWithComments extends Item {
  comments: Item[];
}

enum Result {
  Success = "success",
  Error = "error",
  Warning = "warning"
}

type Respond<T> = {
  result: Result;
  message?: string;
  responseTime: number;
} & T;

interface ResponseObject {
  result: Result;
  message?: string;
  issues?: unknown; 
  responseTime: number;
}

type Paginate<T> = {
  previousPage: number | null;
  nextPage: number | null;
  total: number;
  totalPages: number;
  data: T | T[];
}

export { ItemTypes, StoryTypes, Result };
export type { Item, User, ResponseObject, Respond, Paginate, ItemWithComments };

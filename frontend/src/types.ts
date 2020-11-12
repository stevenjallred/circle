export type Post = {
  id: number;
  userId: number;
  body: string;
};

export type Collection<T> = {
  meta: any;
  data: T[];
};

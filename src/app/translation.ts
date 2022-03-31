export interface Translation {
  id: number;
  collection: { link: string, name: string };
  description: string | undefined;
  term: string;
  similarity?: string;
}

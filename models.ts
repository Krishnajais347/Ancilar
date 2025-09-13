export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO string
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  text: string;
  createdAt: string; // ISO string
}

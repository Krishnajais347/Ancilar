import { Post, Comment } from "./models";

/**
 * Simple in-memory store. Exposed functions to operate on data.
 * This file acts like a very small 'service' / 'repository'.
 */

const posts: Map<string, Post> = new Map();
const comments: Map<string, Comment> = new Map();

export const DataStore = {
  // Posts
  getAllPosts(): Post[] {
    return Array.from(posts.values()).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },

  getPostById(id: string): Post | undefined {
    return posts.get(id);
  },

  createPost(post: Post): Post {
    posts.set(post.id, post);
    return post;
  },

  updatePost(id: string, payload: Partial<Pick<Post, "title" | "content">>): Post | undefined {
    const existing = posts.get(id);
    if (!existing) return undefined;
    const updated: Post = { ...existing, ...payload };
    posts.set(id, updated);
    return updated;
  },

  deletePost(id: string): boolean {
    return posts.delete(id);
  },

  // Comments
  getCommentsByPostId(postId: string): Comment[] {
    return Array.from(comments.values())
      .filter((c) => c.postId === postId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },

  getCommentById(id: string): Comment | undefined {
    return comments.get(id);
  },

  createComment(comment: Comment): Comment {
    comments.set(comment.id, comment);
    return comment;
  },

  deleteComment(id: string): boolean {
    return comments.delete(id);
  },

  // Cascade delete helper
  deleteCommentsByPostId(postId: string): number {
    const toDelete: string[] = [];
    for (const [id, comment] of comments.entries()) {
      if (comment.postId === postId) toDelete.push(id);
    }
    for (const id of toDelete) comments.delete(id);
    return toDelete.length;
  }
};

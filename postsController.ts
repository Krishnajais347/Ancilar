import { Request, Response } from "express";
import { DataStore } from "../dataStore";
import { v4 as uuidv4 } from "uuid";

/**
 * Routes:
 * POST   /posts
 * GET    /posts
 * PUT    /posts/:id
 * DELETE /posts/:id  (cascade delete comments)
 */

export const createPost = (req: Request, res: Response) => {
  const { title, content } = req.body ?? {};
  if (!title || !content) {
    return res.status(400).json({ error: "title and content are required" });
  }

  const newPost = {
    id: uuidv4(),
    title: String(title),
    content: String(content),
    createdAt: new Date().toISOString()
  };

  DataStore.createPost(newPost);
  return res.status(201).json(newPost);
};

export const listPosts = (req: Request, res: Response) => {
  const posts = DataStore.getAllPosts();
  return res.json(posts);
};

export const updatePost = (req: Request, res: Response) => {
  const id = req.params.id;
  const { title, content } = req.body ?? {};

  if (!title && !content) {
    return res.status(400).json({ error: "At least one of title or content must be provided" });
  }

  const updated = DataStore.updatePost(id, { title, content });
  if (!updated) return res.status(404).json({ error: "Post not found" });

  return res.json(updated);
};

export const deletePost = (req: Request, res: Response) => {
  const id = req.params.id;
  const existing = DataStore.getPostById(id);
  if (!existing) return res.status(404).json({ error: "Post not found" });

  // delete post
  DataStore.deletePost(id);

  // cascade delete comments
  const removedCount = DataStore.deleteCommentsByPostId(id);

  return res.json({ success: true, deletedComments: removedCount });
};

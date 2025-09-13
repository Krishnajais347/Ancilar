import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { DataStore } from "../dataStore";

/**
 * Routes:
 * POST   /posts/:id/comments
 * GET    /posts/:id/comments
 * DELETE /comments/:id
 */

export const addCommentToPost = (req: Request, res: Response) => {
  const postId = req.params.id;
  const { author, text } = req.body ?? {};

  if (!author || !text) {
    return res.status(400).json({ error: "author and text are required" });
  }

  const post = DataStore.getPostById(postId);
  if (!post) return res.status(404).json({ error: "Post not found" });

  const newComment = {
    id: uuidv4(),
    postId,
    author: String(author),
    text: String(text),
    createdAt: new Date().toISOString()
  };

  DataStore.createComment(newComment);
  return res.status(201).json(newComment);
};

export const listCommentsForPost = (req: Request, res: Response) => {
  const postId = req.params.id;
  const post = DataStore.getPostById(postId);
  if (!post) return res.status(404).json({ error: "Post not found" });

  const comments = DataStore.getCommentsByPostId(postId);
  return res.json(comments);
};

export const deleteComment = (req: Request, res: Response) => {
  const id = req.params.id;
  const existing = DataStore.getCommentById(id);
  if (!existing) return res.status(404).json({ error: "Comment not found" });

  DataStore.deleteComment(id);
  return res.json({ success: true });
};

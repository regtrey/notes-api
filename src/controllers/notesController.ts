import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import NoteModel from '../models/NoteModel';
import { assertIsDefined } from '../utils/assertIsDefined';

export const getNotes: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;

  try {
    // Check if value is not null
    assertIsDefined(authenticatedUserId);

    const notes = await NoteModel.find({ userId: authenticatedUserId }).exec();

    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNote: RequestHandler = async (req, res, next) => {
  const { noteId } = req.params;
  const authenticatedUserId = req.session.userId;

  try {
    // Check if value is not null
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, 'Invalid note id');
    }

    const note = await NoteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    if (!note.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, 'You cannot access this note.');
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

type CreateNoteBody = {
  title?: string;
  text?: string;
};

export const createNote: RequestHandler<
  unknown,
  unknown,
  CreateNoteBody,
  unknown
> = async (req, res, next) => {
  const { title, text } = req.body;
  const authenticatedUserId = req.session.userId;

  try {
    // Check if value is not null
    assertIsDefined(authenticatedUserId);

    if (!title) {
      throw createHttpError(400, 'Note must have a title');
    }

    const newNote = await NoteModel.create({
      userId: authenticatedUserId,
      title,
      text,
    });

    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

type UpdateNoteParams = {
  noteId: string;
};

type UpdateNoteBody = {
  title?: string;
  text?: string;
};

export const updateNote: RequestHandler<
  UpdateNoteParams,
  unknown,
  UpdateNoteBody,
  unknown
> = async (req, res, next) => {
  const { noteId } = req.params;
  const newTitle = req.body.title;
  const newText = req.body.text;
  const authenticatedUserId = req.session.userId;

  try {
    // Check if value is not null
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, 'Invalid note id');
    }

    if (!newTitle) {
      throw createHttpError(400, 'Note must have a title');
    }

    const note = await NoteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    if (!note.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, 'You cannot access this note.');
    }

    note.title = newTitle;
    note.text = newText || note.text;

    const updatedNote = await note.save();

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote: RequestHandler = async (req, res, next) => {
  const { noteId } = req.params;
  const authenticatedUserId = req.session.userId;

  try {
    // Check if value is not null
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, 'Invalid note id');
    }

    const note = await NoteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    if (!note.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, 'You cannot access this note.');
    }

    await note.remove();

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

import express from 'express';
import {
  createNote,
  deleteNote,
  getNote,
  getNotes,
  updateNote,
} from '../controllers/notesController';

const router = express.Router();

router.get('/', getNotes);
router.get('/:noteId', getNote);
router.post('/', createNote);
router.patch('/:noteId', updateNote);
router.delete('/:noteId', deleteNote);

export default router;

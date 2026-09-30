const Note = require("../models/note.model");

const createNote = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const note = await Note.create({
      title,
      content,
      user: req.user._id,
    });

    return res.status(201).json({ message: "Note created successfully", note });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    return res.status(200).json(notes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ message: "Note not found or not allowed" });
    }

    return res.status(200).json(note);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateNote = async (req, res) => {
  const { title, content } = req.body;

  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ message: "Note not found or not allowed" });
    }

    note.title = title || note.title;
    note.content = content || note.content;

    const updatedNote = await note.save();

    return res
      .status(200)
      .json({ message: "Note updated successfully", note: updatedNote });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ message: "Note not found or not allowed" });
    }

    await note.deleteOne();

    return res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createNote, getNotes, getNote, updateNote, deleteNote };

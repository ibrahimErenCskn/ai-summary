import { Note } from '@/types';

const STORAGE_KEY = 'ai-summary-notes';

// Function to get all notes from local storage
export function getNotes(): Note[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const storedNotes = localStorage.getItem(STORAGE_KEY);
  return storedNotes ? JSON.parse(storedNotes) : [];
}

// Function to save a note to local storage
export function saveNote(note: Note): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  const notes = getNotes();
  const existingNoteIndex = notes.findIndex((n) => n.id === note.id);
  
  if (existingNoteIndex !== -1) {
    // Update existing note
    notes[existingNoteIndex] = note;
  } else {
    // Add new note
    notes.push(note);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// Function to delete a note from local storage
export function deleteNote(id: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  const notes = getNotes();
  const updatedNotes = notes.filter((note) => note.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
}

// Function to get a note by ID
export function getNoteById(id: string): Note | undefined {
  const notes = getNotes();
  return notes.find((note) => note.id === id);
} 
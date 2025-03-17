'use client';

import { useState, useEffect, useRef } from 'react';
import NoteList from './NoteList';
import NoteEditor from './NoteEditor';
import { Note } from '@/types';
import { getNotes } from '@/lib/storage';

export default function AppLayout() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Load notes from local storage on component mount
  useEffect(() => {
    const loadNotes = () => {
      try {
        const storedNotes = getNotes();
        setNotes(storedNotes);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading notes:', error);
        setIsLoading(false);
      }
    };

    loadNotes();
  }, []);

  // Handle creating a new note
  const handleNewNote = () => {
    setSelectedNote(null);
  };

  // Handle selecting a note
  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setShowAnimation(true);
    
    // Scroll to editor on mobile
    if (window.innerWidth < 768 && editorRef.current) {
      editorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Reset animation after it completes
    setTimeout(() => {
      setShowAnimation(false);
    }, 500);
  };

  // Handle saving a note
  const handleSaveNote = (note: Note) => {
    const updatedNotes = notes.filter((n) => n.id !== note.id);
    const newNotes = [note, ...updatedNotes];
    setNotes(newNotes);
    setSelectedNote(note);
  };

  // Handle deleting a note
  const handleDeleteNote = (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-black">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      {/* Sidebar with note list */}
      <div className="w-full md:w-80 border-r bg-gray-50 h-full md:h-screen overflow-y-auto">
        <NoteList
          notes={notes}
          selectedNoteId={selectedNote?.id || null}
          onSelectNote={handleSelectNote}
          onDeleteNote={handleDeleteNote}
          onNewNote={handleNewNote}
        />
      </div>

      {/* Main content area */}
      <div 
        ref={editorRef}
        className={`flex-1 p-6 overflow-y-auto text-black ${
          showAnimation ? 'animate-fadeIn' : ''
        }`}
      >
        {selectedNote ? (
          <div className="border-l-4 border-blue-500 pl-4">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">
              {selectedNote.title}
            </h2>
            <NoteEditor note={selectedNote} onSave={handleSaveNote} />
          </div>
        ) : (
          <div className="border-l-4 border-green-500 pl-4">
            <h2 className="text-2xl font-bold mb-4 text-green-700">
              Yeni Not Oluştur
            </h2>
            <NoteEditor onSave={handleSaveNote} />
          </div>
        )}
      </div>
    </div>
  );
} 
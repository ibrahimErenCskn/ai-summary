'use client';

import { Note } from '@/types';
import { deleteNote } from '@/lib/storage';

interface NoteListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  onNewNote: () => void;
}

export default function NoteList({
  notes,
  selectedNoteId,
  onSelectNote,
  onDeleteNote,
  onNewNote,
}: NoteListProps) {
  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle note deletion
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Bu notu silmek istediğinizden emin misiniz?')) {
      deleteNote(id);
      onDeleteNote(id);
    }
  };

  // Handle note selection
  const handleNoteSelect = (note: Note) => {
    onSelectNote(note);
    // Mobil görünümde otomatik olarak içerik alanına kaydırma yapabilir
    if (window.innerWidth < 768) {
      document.querySelector('.flex-1.p-6')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="h-full flex flex-col text-black">
      <div className="flex items-center justify-between mb-4 p-4 border-b">
        <h2 className="text-xl font-bold text-black">Notlarım</h2>
        <button
          onClick={onNewNote}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Yeni Not
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Henüz not bulunmuyor. Yeni bir not oluşturun.
          </div>
        ) : (
          <ul className="divide-y">
            {notes.map((note) => (
              <li
                key={note.id}
                onClick={() => handleNoteSelect(note)}
                className={`p-4 cursor-pointer transition-all duration-200 hover:bg-blue-50 ${
                  selectedNoteId === note.id 
                    ? 'bg-blue-100 border-l-4 border-blue-500' 
                    : 'hover:border-l-4 hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-black">{note.title}</h3>
                    <p className="text-sm text-black">
                      {formatDate(note.updatedAt)}
                    </p>
                    <p className="mt-1 text-black line-clamp-2">
                      {note.summary || note.content.substring(0, 100)}
                    </p>
                    {selectedNoteId === note.id && (
                      <div className="mt-2 text-blue-600 text-sm font-medium">
                        Detayları görüntülemek için tıklayın
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleDelete(note.id, e)}
                    className="p-1 text-red-500 hover:text-red-700 focus:outline-none"
                    aria-label="Delete note"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 
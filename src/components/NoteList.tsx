import React from "react";
import type { NoteDTO } from "@/types";

interface NoteListProps {
  notes: NoteDTO[];
  selectedNoteIds: string[];
  onNoteSelect: (noteId: string, selected: boolean) => void;
  onNoteClick: (noteId: string) => void;
}

/**
 * Lista notatek użytkownika z możliwością wyboru
 */
const NoteList: React.FC<NoteListProps> = ({ notes, selectedNoteIds, onNoteSelect, onNoteClick }) => {
  // Jeśli brak notatek, wyświetl informację
  if (notes.length === 0) {
    return <div className="text-gray-500 text-center p-4">Brak notatek</div>;
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <div key={note.id} className="border rounded-md p-3 hover:bg-gray-50">
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id={`note-${note.id}`}
              checked={selectedNoteIds.includes(note.id)}
              onChange={(e) => onNoteSelect(note.id, e.target.checked)}
              className="mt-1"
            />
            <div className="flex-1">
              <button
                className="text-sm font-medium cursor-pointer text-left w-full"
                onClick={() => onNoteClick(note.id)}
              >
                {note.note_summary}
              </button>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{note.note_text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoteList;

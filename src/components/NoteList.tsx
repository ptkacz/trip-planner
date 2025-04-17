import React from "react";
import type { NoteDTO } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface NoteListProps {
  notes: NoteDTO[];
  selectedNoteIds: string[];
  onNoteSelect: (noteId: string) => void;
  onNoteClick: (note: NoteDTO) => void;
}

/**
 * Lista notatek użytkownika z możliwością wyboru
 */
const NoteList: React.FC<NoteListProps> = ({ notes, selectedNoteIds, onNoteSelect, onNoteClick }) => {
  // Jeśli brak notatek, wyświetl informację
  if (notes.length === 0) {
    return <div className="text-center p-4 text-gray-500">Nie masz jeszcze żadnych notatek</div>;
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <div key={note.id} className="flex items-start gap-2">
          <input
            type="checkbox"
            id={`note-${note.id}`}
            checked={selectedNoteIds.includes(note.id)}
            onChange={() => onNoteSelect(note.id)}
            className="mt-1"
          />
          <Card
            className={`flex-1 cursor-pointer hover:bg-gray-50 ${
              selectedNoteIds.includes(note.id) ? "border-blue-400" : ""
            }`}
            onClick={() => onNoteClick(note)}
          >
            <CardContent className="p-3">
              <div className="font-medium truncate">{note.note_summary}</div>
              <div className="text-sm text-gray-500 truncate">
                {note.note_text.substring(0, 60)}
                {note.note_text.length > 60 ? "..." : ""}
              </div>
              <div className="text-xs text-gray-400 mt-1">{new Date(note.created_at).toLocaleDateString()}</div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default NoteList;

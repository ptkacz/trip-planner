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

  const handleCheckboxClick = (e: React.MouseEvent, noteId: string, isChecked: boolean) => {
    e.stopPropagation();
    onNoteSelect(noteId, !isChecked);
  };

  return (
    <div className="space-y-3">
      {notes.map((note) => {
        const isSelected = selectedNoteIds.includes(note.id);

        return (
          <button
            key={note.id}
            className="text-left border rounded-md p-3 w-full hover:bg-gray-50 cursor-pointer"
            onClick={() => onNoteClick(note.id)}
            aria-label={`Notatka: ${note.note_summary}`}
          >
            <div className="flex items-start gap-2">
              <span
                onClick={(e) => handleCheckboxClick(e, note.id, isSelected)}
                className="inline-block"
                role="checkbox"
                aria-checked={isSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    onNoteSelect(note.id, !isSelected);
                  }
                }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  readOnly
                  className="mt-1 pointer-events-none"
                  aria-hidden="true"
                />
              </span>
              <div className="flex-1">
                <h3 className="text-sm font-medium">{note.note_summary}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2 text-left">{note.note_text}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default NoteList;

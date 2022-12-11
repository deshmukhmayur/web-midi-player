import { useEffect, useState } from "react";

type Note = {
  octave: number;
  note: string;
};

const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
function convertNote(noteNum: number): Note {
  return {
    octave: Math.floor(noteNum / 12 - 1),
    note: notes[noteNum % 12],
  };
}

interface PlayerProps {
  midiInput: WebMidi.MIDIInput;
}

export default function Player({ midiInput }: PlayerProps) {
  const [pressedNotes, setPressedNotes] = useState<Note[]>([]);

  useEffect(() => {
    midiInput.onmidimessage = (event) => {
      console.log(event.data);
      const noteNum = event.data.at(1);
      if (!noteNum) {
        return;
      }
      const note = convertNote(noteNum);
      console.log(note);

      if (event.data[2] === 0) {
        setPressedNotes(
          pressedNotes.filter(
            (lastPressedNote) =>
              lastPressedNote.note !== note.note ||
              lastPressedNote.octave !== note.octave
          )
        );
      } else {
        setPressedNotes([...pressedNotes, note]);
      }
    };
  }, [pressedNotes]);

  return (
    <>
      <h2>{midiInput.name}</h2>

      <label>Playing note:</label>

      <div>
        {pressedNotes.map((note, index) => (
          <code key={index}>{note.note}</code>
        ))}
      </div>

    </>
  );
}

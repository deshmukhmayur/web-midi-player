import React from "react";
import { useEffect, useState } from "react";
import Player from "./components/Player";

function App() {
  const [midiInputs, setMidiInputs] = useState<WebMidi.MIDIInput[]>([]);
  const [activeMidiInput, setActiveMidiInput] = useState<WebMidi.MIDIInput>();
  const [midiSupported, setMidiSupported] = useState<boolean>(true);

  useEffect(() => {
    if ("requestMIDIAccess" in navigator === false) {
      setMidiSupported(false);
      return;
    }

    navigator
      .requestMIDIAccess()
      .then((access) => {
        setMidiInputs(Array.from(access.inputs.values()));
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const selectMidiInput: React.ChangeEventHandler<HTMLSelectElement> = (
    event
  ) => {
    const selectedInput = midiInputs.find(
      (input) => input.id === event.target.value
    );
    if (selectedInput) {
      setActiveMidiInput(selectedInput);
    }
  };

  return (
    <>
      <h1>Midi Player</h1>

      {!midiSupported && (
        <div>Unfortunately, your browser does not support MIDI.</div>
      )}

      <div>
        {midiInputs.length === 0 && (
          <>
            <p>
              No MIDI devices found. Make sure the device is properly connected
              and refresh this page.
            </p>
          </>
        )}

        <label htmlFor="inputs">Available Midi Inputs</label>
        <select id="inputs" name="inputs" value={activeMidiInput?.id} onChange={selectMidiInput}>
          <option value="">-- Select a MIDI Controller --</option>
          {midiInputs.map((input) => (
            <option key={input.id} value={input.id}>
              {input.name}
            </option>
          ))}
        </select>
      </div>

      {activeMidiInput && <Player midiInput={activeMidiInput} />}
    </>
  );
}

export default App;

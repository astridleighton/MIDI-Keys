export const findChord = (notes: string[] | null): string => {

    // TODO: implement 4-note chords, remove test values

    // test values
    const notesString = ['C1', 'E1', 'G1']

    const noteToSemitone = {
        'C': 0,
        'C#': 1, 'Db': 1,
        'D': 2,
        'D#': 3, 'Eb': 3,
        'E': 4,
        'F': 5,
        'F#': 6, 'Gb': 6,
        'G': 7,
        'G#': 8, 'Ab': 8,
        'A': 9,
        'A#': 10, 'Bb': 10,
        'B': 11
    };

    const notesInSemitones = notesString.map(note => noteToSemitone[note.slice(0, -1)]);

    const sortedNotes = notesInSemitones.sort((a, b) => a - b);
    const root = notesInSemitones[0];
    console.log('Root: ' + root);
    let intervalVals: number[] = [];
    let chordType: string = "";

    // get interval
    if (sortedNotes.length >= 3) {
        const interval1 = sortedNotes[1] - sortedNotes[0];
        const interval2 = sortedNotes[2] - sortedNotes[1];

        // works for 3 or 4-note chords
        if (sortedNotes.length === 3) {
            intervalVals = [interval1, interval2];
        } else if (sortedNotes.length === 4) {
            const interval3 = sortedNotes[3] - sortedNotes[2];
            intervalVals = [interval1, interval2, interval3];
        }
    }
    
    // determine interval name
    if (intervalVals.length === 2) {
        if (intervalVals[0] === 4 && intervalVals[1] === 3) {
            chordType = "maj";
        } else if (intervalVals[0] === 3 && intervalVals[1] === 3) {
            chordType = "min";
        } else if (intervalVals[0] === 3 && intervalVals[1] === 2) {
            chordType = "dim";
        } else if (intervalVals[0] === 4 && intervalVals[1] === 4) {
            chordType = "aug";
        } else if (intervalVals[0] === 5 && intervalVals[1] === 2) {
            chordType = "sus4";
        } else if (intervalVals[0] === 2 && intervalVals[1] === 5) {
            chordType = "sus2";
        } else if (intervalVals[0] === 3 && intervalVals[1] === 5) {
            chordType = "minMaj";
        } else {
            console.log('Unknown triad chord')
        }
    } else if (intervalVals.length === 3) {
        if (intervalVals[0] === 4 && intervalVals[1] === 3 && intervalVals[2] === 2) {
            chordType = "maj6";
        } else if (intervalVals[0] === 3 && intervalVals[1] === 4 && intervalVals[2] === 2) {
            chordType = "min6";
        } else if (intervalVals[0] === 3 && intervalVals[1] === 4 && intervalVals[2] === 3) {
            chordType = "min7";
        } else if (intervalVals[0] === 4 && intervalVals[1] === 3 && intervalVals[2] === 3) {
            chordType = "7"; // dominant 7th
        } else if (intervalVals[0] === 3 && intervalVals[1] === 3 && intervalVals[2] === 3) {
            chordType = "dim7";
        } else if (intervalVals[0] === 3 && intervalVals[1] === 3 && intervalVals[2] === 4) {
            chordType = "m7♭5"; // half-diminished
        } else if (intervalVals[0] === 4 && intervalVals[1] === 4 && intervalVals[2] === 3) {
            chordType = "aug7";
        } else {
            console.log('Unknown 4-note chord');
        }
    }

    console.log("Chord: " + chordType);

    return "";
    
}
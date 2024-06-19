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

    // get interval
    if (sortedNotes.length >= 3) {
        // triad chords
        const interval1 = sortedNotes[1] - sortedNotes[0];
        const interval2 = sortedNotes[2] - sortedNotes[1];
        intervalVals = [interval1, interval2];
    }
    
    // determine interval name
    if (intervalVals.length === 2) {
        if (intervalVals[0] === 4 && intervalVals[1] === 3) {
            console.log('maj');
        } else if (intervalVals[0] === 3 && intervalVals[1] === 3) {
            console.log('min');
        } else if (intervalVals[0] === 3 && intervalVals[1] === 2) {
            console.log('dim');
        } else if (intervalVals[0] === 4 && intervalVals[1] === 4) {
            console.log('aug');
        } else if (intervalVals[0] === 5 && intervalVals[1] === 2) {
            console.log('sus4');
        } else if (intervalVals[0] === 2 && intervalVals[1] === 5) {
            console.log('sus2');
        } else if (intervalVals[0] === 3 && intervalVals[1] === 5) {
            console.log('minMaj');
        } else {
            console.log('Unknown triad chord')
        }
    }

    return "";
    
}
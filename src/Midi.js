import React, {useContext} from 'react';
//import WebMidi from 'webmidi';


class Midi extends React.Component
{

  
  //const { keyInfo, pitch, modulation } = useContext(MidiDataContext);

    /*constructor(props) {
        super(props);
        this.state = {
          inputs: []
        };
        WebMidi.enable(() => {
          this.setState({
            inputs: WebMidi.inputs
          });
        });
      }

      componentDidMount() {
        const input = WebMidi.getInputByName('Your MIDI Input Name');
        input.addListener('noteon', 'all', e => {
          console.log(`Note ${e.note.number} on`);
        });
      }*/

    render()
    {
        return(
            <div>
                <p>Test Midi component</p>
            </div>
        )
    }
}


export default Midi;
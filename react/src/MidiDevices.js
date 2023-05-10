import React, {useContext} from 'react';
import WebMidi from 'webmidi';

class Midi extends React.Component
{

  //var levelNotes = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72];
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
      }*/

      constructor(props)
      {
        super(props);
        this.state = {
          midiDevices: this.props.devices
        }
      }

      state = {
        support: ".",
      }

      /*
      * Checks browser support when component mounts
      */
      componentDidMount()
      {
        console.log("DEVICES:" + this.state.midiDevices);
      }

      /*
      * Checks if browser supports WebMidi API
      * Returns true or false
      */
      /*checkBrowserSupport = async () =>
      {
        try {
          const midiAccess = await navigator.requestMIDIAccess();
          console.log("Browser supports midi access");
          return true;
        }
        catch (error)
        {
          console.log("Browser does not support midi access.");
          return false;
        }
      }*/

    render()
    {
        return(
          <div>
              <h2>MIDI Devices</h2>
              <p>Browser Support: {this.state.support}</p>
              <p>Inputs: </p>
              <ul>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="option"
                      value="option1"
                    />
                    Option 1
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="option"
                      value="option2"
                    />
                    Option 2
                  </label>
                </li>
            </ul>
          </div>
        )
    }
}


export default Midi;
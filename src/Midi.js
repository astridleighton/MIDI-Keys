import React, {useContext} from 'react';
//import WebMidi from 'webmidi';

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

      state = {
        support: ".",
      }

      /*
      * Checks browser support when component mounts
      */
      async componentDidMount()
      {
        /*if(await this.checkBrowserSupport())
        {
          this.setState({ support : "yes" })
        }
        else
        {
          this.setState({ support : "no" });
        }*/
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
                <p>Midi component</p>
                <p>Browser Support: {this.state.support}</p>
            </div>
        )
    }
}


export default Midi;
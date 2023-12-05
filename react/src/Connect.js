import React, {useContext} from 'react';
import WebMidi from 'webmidi';

class Connect extends React.Component
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
          //const { inputDeviceNames } = props,
          //midiDevices = props,
          midiDevices: [],
          selectedDevice: null,

        }
      }

      state = {
        support: ".",
      }

      // TODO: replace with connected MIDI devices
      setDevice = () => {
        this.setState({
          midiDevices: ["Alesis V49"],
        })
        //alert(this.state.midiDevices);
      }

      // connect to selected device
      handleDeviceChange = (event) => {
        this.setState({ selectedDevice: event.target.value });
      };

      handleSelect = () => {

        //alert("test");

        if (this.state.selectedDevice)
        {
          // pass to app
          this.props.updateConnectedDevice(this.state.selectedDevice);
          alert(this.state.selectedDevice);
        }
        else
        {
          alert(`Please select a MIDI device first.`);
        }
      }

      /*
      * Checks browser support when component mounts
      */
      componentDidMount()
      {
        this.setDevice();
      }

    render()
    {
        return(
          <div className="container d-flex align-items-center flex-column">
            <div className="text-center">
            <h2>MIDI devices: </h2>
            </div>
            <div className="text-center">
            <form>
                  {this.state.midiDevices.map((device, index) => (
                    <div key={index}>
                      <input
                        type="radio"
                        id={device}
                        name="midiDevice"
                        value={device}
                        checked={this.state.selectedDevice === device}
                        onChange={this.handleDeviceChange}
                      />
                      <label htmlFor={device}>{device}</label>
                    </div>
                  ))}
                </form>
            </div>
            <div className="text-center">
            {this.state.selectedDevice && (
                  <div>
                    <button onClick={this.handleSelect}>Connect</button>
                  </div>
                )}
                {!this.state.selectedDevice && <p>Please select a MIDI device.</p>}
            </div> 
          </div>
        )
    }
}


export default Connect;
import React, {useContext} from 'react';
import WebMidi from 'webmidi';

/**
 * Allows the user to connect to a selected device
 * NOTE: Automatically connects to QWERTY keyboard
 * TODO: implement 
 */
class Connect extends React.Component
{

      constructor(props)
      {
        super(props);
        this.state = {
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
      }

      // connect to selected device
      handleDeviceChange = (event) => {
        this.setState({ selectedDevice: event.target.value });
      };

      handleSelect = () => {

        if (this.state.selectedDevice)
        {
          // pass to app
          this.props.updateConnectedDevice(this.state.selectedDevice);
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
            <div className="m-4 d-flex justify-content-center">
              <h2>Connect MIDI Device</h2>
            </div>
            <div className="text-center">
              <h5 className="m-2">Available Devices:</h5>
              <form>
                    {this.state.midiDevices.map((device, index) => (
                      <div key={index} class="form-check">
                        <input
                          type="radio"
                          id={device}
                          name="midiDevice"
                          value={device}
                          class="form-check-input"
                          checked={this.state.selectedDevice === device}
                          onChange={this.handleDeviceChange}
                        />
                        <label class="form-check-label" htmlFor={device}>{device}</label>
                      </div>
                    ))}
                  </form>
            </div>
            <div className="text-center m-2">
              {this.state.selectedDevice && (
                    <div>
                      <button class="btn btn-primary btn-block mb-4 text-center" onClick={this.handleSelect}>Connect</button>
                    </div>
              )} 
            </div> 
          </div>
        )
    }
}


export default Connect;
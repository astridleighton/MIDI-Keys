import React, {useContext} from 'react';
import WebMidi from 'webmidi';
import * as Tone from 'tone';

/**
 * Allows the user to connect to a selected device
 * NOTE: Automatically connects to QWERTY keyboard?
 */
class Connect extends React.Component
{

      /**
       * Shows midi devices and select device
       * @param {*} props 
       */
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

      /**
       * Sets device and pauses audio output
       */
      componentDidMount () {
        Tone.Transport.pause();
        this.setDevice();
    }

      /**
       * Sets selected MIDI device
       * TODO: allow user to choose from connected devices
       */
      setDevice = () => {
        this.setState({
          midiDevices: ["Alesis V49"],
        })
      }

      /**
       * Connects to selected device
       * @param {*} event 
       */
      handleDeviceChange = (event) => {
        this.setState({ selectedDevice: event.target.value });
      };

      /**
       * Passes selected device
       */
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

    /**
     * Shows device options
     * @returns view
     */
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
                      <div key={index} className="form-check">
                        <input
                          type="radio"
                          id={device}
                          name="midiDevice"
                          value={device}
                          class="form-check-input"
                          checked={this.state.selectedDevice === device}
                          onChange={this.handleDeviceChange}
                        />
                        <label className="form-check-label" htmlFor={device}>{device}</label>
                      </div>
                    ))}
                  </form>
            </div>
            <div className="text-center m-2">
              {this.state.selectedDevice && (
                    <div>
                      <button className="btn btn-primary btn-block mb-4 bg-black text-center" onClick={this.handleSelect}>Connect</button>
                    </div>
              )} 
            </div> 
          </div>
        )
    }
}

export default Connect;
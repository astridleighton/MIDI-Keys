import React, {useContext} from 'react';
import WebMidi from 'webmidi';
import * as Tone from 'tone';
import DeviceCard from './DeviceCard';
import { Button, List, FormControl, FormLabel, RadioGroup, FromControlLabel, ListItemButton, ListItemText, ListItemIcon, Radio, Box, FormControlLabel, Container, Typography, Grid } from '@mui/material';

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
          midiDevices: ["Alesis V49", "Test Device 2"],
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
      handleSelect = (event) => {

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
          <Container>
            <Grid container>
              <Grid item sm={2}>
                {/*Left margin*/}
              </Grid>
              <Grid item sm={8} sx={{ display: 'flex', justifyContent: 'center', mt: '50px' }}>
                <Typography variant="h4" sx={{fontFamily: 'Lato, sans-serif', fontWeight: "bold"}}>
                  Connect MIDI Device
                </Typography>
              </Grid>
              <Grid item  sm={2}>
                {/*Right margin*/}
              </Grid>
              <Grid item sm={12} sx={{ display: 'flex', justifyContent: 'center', margin: '50px' }}>
                <FormControl
                sx={{
                  textAlign: 'center'
                  }}>
                  <FormLabel>Select MIDI device from list.</FormLabel>
                    <RadioGroup
                      aria-label="sounds"
                      name="sound-group"
                      defaultValue="synth"
                      /*onChange={(e) => this.handleButtonClick1(e.target.value)}*/
                      >
                        <List
                          sx = {{
                            '& .MuiListItem-root': {
                                borderRadius: '8px',
                                backgroundColor: 'black',
                                marginBottom: '8px',
                                color: 'white'
                              },
                              '& .MuiRadio-root': {
                                color: 'white', // Radio button color
                              },
                              '& .MuiSvgIcon-root': {
                                stroke: 'white', // Star icon outline color
                              },
                          }}
                        >
                          {this.state.midiDevices.map((device, index) => 
                          <DeviceCard key={index} name={device} />
                          )
                          }
                        </List>
                          
                          <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                onClick={this.handleSubmit}
                                sx={{
                                    backgroundColor: 'grey',
                                    color: 'white',
                                    padding: '10px',
                                    margin: '15px',
                                }}
                            >
                              Connect
                          </Button>
                    </RadioGroup>
              </FormControl>
              </Grid>
            </Grid>
            <div className="text-center m-2">
              {this.state.selectedDevice && (
                    <div>
                      <button className="btn btn-primary btn-block mb-4 bg-black text-center" onClick={this.handleSelect}>Connect</button>
                    </div>
              )} 
            </div> 
          </Container>
        )
    }
}

export default Connect;
import React, {useState} from 'react';
import WebMidi from 'webmidi';
import * as Tone from 'tone';
import DeviceCard from '../cards/DeviceCard';
import { Button, List, FormControl, FormLabel, RadioGroup, FromControlLabel, ListItemButton, ListItemText, ListItemIcon, Radio, Box, FormControlLabel, Container, Typography, Grid } from '@mui/material';
import { useMIDIContext } from '../App';

import './Connect.scss'
/**
 * Allows the user to connect to a selected device
 * NOTE: Automatically connects to QWERTY keyboard?
 */
const Connect = ({updateConnectedDevice, midiInputDevices}) =>
{

  // TODO: ensure device can actually be selected

  const [selectedDevice, setSelectedDevice] = useState(null);
  const { midiInputs, connectedDevice } = useMIDIContext();

  const handleDeviceSelect = (device) => {
    setSelectedDevice(device);
  }

  const handleDeviceConnect = (device) => {
    updateConnectedDevice(device);
  }

    return(
      <div className="connect-container">
        <div className="connect-header">
          <h1 className="connect-title">Connect</h1>
        </div>
        <div className="connect-content">
        <FormLabel>Select MIDI device from list.</FormLabel>
                <RadioGroup
                  aria-label="sounds"
                  name="sound-group"
                  defaultValue="synth"
                  onChange={(e) => this.handleDeviceSelect(e.target.value)}
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
                      {midiInputDevices && midiInputDevices.map((device, index) => 
                      <DeviceCard key={index} name={device} />
                      )
                      }
                    </List>
                      
                      <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={handleDeviceConnect()}
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
        </div>
      </div>
    )
}

export default Connect;
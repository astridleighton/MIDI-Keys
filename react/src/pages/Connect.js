import React, {useState} from 'react';
import { Button, List, FormControl, FormLabel, RadioGroup, ListItem, Radio, Box, FormControlLabel } from '@mui/material';

import './Connect.scss'

/**
 * Allows the user to connect to a selected device
 * NOTE: Automatically connects to QWERTY keyboard?
 */
/**
 * Allows the user to view available MIDI devices and connect to a selected device
 * TODO: add connect device as default value
 * @param {*} param0 
 * @returns 
 */
const Connect = ({connectedDevice, updateConnectedDevice, midiInputDevices}) =>
{

  // state
  const [selectedDevice, setSelectedDevice] = useState(null);
  const connectedDeviceName = connectedDevice;

  /**
   * Updates state based on selected device
   * @param {*} device selected device
   */
  const handleDeviceSelect = (device) => {
    setSelectedDevice(device);
  }

  /**
   * Connects to selected device using prop function from App
   */
  const handleDeviceConnect = () => {
    updateConnectedDevice(selectedDevice);
  }

  // returns connect view
  return(
    <div className="connect-container">
      <div className="connect-header">
        <h1 className="connect-title">Connect</h1>
      </div>
      <div className="connect-content">
      <FormLabel>Select MIDI device from list:</FormLabel>
        <RadioGroup
          aria-label="devices"
          name="device-group"
          defaultValue={connectedDevice}
          onChange={(e) => handleDeviceSelect(midiInputDevices[e.target.value])}
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
                  }
              }}
            >
              {midiInputDevices && midiInputDevices.length ? (
                midiInputDevices.map((device, index) => (
                  <ListItem key={index} sx={{ color: "#FFF" }}>
                    <FormControlLabel
                      value={index}
                      control={<Radio />}
                      label={device.name}
                    />
                  </ListItem>
                ))
              ) : (
                <p>No available MIDI devices.</p>
              )}

            </List>
              <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    onClick={handleDeviceConnect}
                    disabled={!selectedDevice}
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
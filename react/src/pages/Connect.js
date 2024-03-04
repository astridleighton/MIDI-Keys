import React, {useEffect} from 'react';
import WebMidi from 'webmidi';
import * as Tone from 'tone';
import DeviceCard from '../cards/DeviceCard';
import { Button, List, FormControl, FormLabel, RadioGroup, FromControlLabel, ListItemButton, ListItemText, ListItemIcon, Radio, Box, FormControlLabel, Container, Typography, Grid } from '@mui/material';

/**
 * Allows the user to connect to a selected device
 * NOTE: Automatically connects to QWERTY keyboard?
 */
const Connect = ({connectedDevice, midiInputs, updateConnectedDevice}) =>
{
  useEffect(() => {
    console.log("Connected device changed to: ", connectedDevice)
  }, [connectedDevice]);

  const handleDeviceSelection = (device) => {
    updateConnectedDevice(device);
  }

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
                      {midiInputs.map((device, index) => 
                      <DeviceCard key={index} name={device} />
                      )
                      }
                    </List>
                      
                      <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={handleDeviceSelection()}
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
      </Container>
    )
}

export default Connect;
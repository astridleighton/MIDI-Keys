import * as Tone from 'tone';

class DrumService {
    /**
       * Creates an instance of the kick
       */
        createKickPlayer() {
        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/4OP-FM/kick.mp3", function(){
            const kickPlayer = new Tone.Player(buffer.get()).toDestination();
            kickPlayer.start(0.5);

        });
      }

      /**
       * Creates an instance of the snare
       */
        createSnarePlayer () {
        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/4OP-FM/snare.mp3", function(){
            const snarePlayer = new Tone.Player(buffer.get()).toDestination();
            snarePlayer.start(0.5);

        });
      }

      /**
       * Creates an instance of tom1
       */
      createTom1Player () {
        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/4OP-FM/tom1.mp3", function(){
            const tom1Player = new Tone.Player(buffer.get()).toDestination();
            tom1Player.start(0.5);

        });
      }

      /**
       * Creates an instance of tom2
       */
      createTom2Player() {
        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/4OP-FM/tom2.mp3", function(){
            const tom2Player = new Tone.Player(buffer.get()).toDestination();
            tom2Player.start(0.5);

        });
      }

      /**
       * Creates an instance of tom3 (floor tom)
       */
      createTom3Player() {
        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/4OP-FM/tom3.mp3", function(){
            const tom3Player = new Tone.Player(buffer.get()).toDestination();
            tom3Player.start(0.5);

        });
      }

      /**
       * Creates an instance of the hi-hat
       */
      createHiHatPlayer() {
        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/4OP-FM/hihat.mp3", function(){
            const hiHatPlayer = new Tone.Player(buffer.get()).toDestination();
            hiHatPlayer.start(0.5);

        });
      }

      /**
       * Creates an instance of a bongo sound
       */
      createBongo1Player() {
        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/Bongos/snare.mp3", function(){
            const hiHatPlayer = new Tone.Player(buffer.get()).toDestination();
            hiHatPlayer.start(0.5);

        });
      }

      /**
       * Creates an instance of another bongo sound
       */
      createBongo2Player() {
        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/Bongos/tom1.mp3", function(){
            const bongo2Player = new Tone.Player(buffer.get()).toDestination();
            bongo2Player.start(0.5);
        });
      }
}

export default DrumService;
window.AudioContext = (
  window.AudioContext ||
  window.webkitAudioContext ||
  null
);

if (!AudioContext) {
  throw new Error("AudioContext not supported!");
} 

// Create a new audio context.
var ctx = new AudioContext();

// Create a AudioGainNode to control the main volume.
var mainVolume = ctx.createGainNode();
// Connect the main volume node to the context destination.
mainVolume.connect(ctx.destination);


function loadSound(soundFileName, loop, autoplay){
	// Create an object with a sound source and a volume control.
	var sound = {};
	sound.source = ctx.createBufferSource();
	sound.volume = ctx.createGainNode();

	// Connect the sound source to the volume control.
	sound.source.connect(sound.volume);
	// Hook up the sound volume control to the main volume.
	sound.volume.connect(mainVolume);

	// Make the sound source loop.
	sound.source.loop = !!loop;

	// Load a sound file using an ArrayBuffer XMLHttpRequest.
	var request = new XMLHttpRequest();
	request.open("GET", soundFileName, true);
	request.responseType = "arraybuffer";
	request.onload = function(e) {

		// Create a buffer from the response ArrayBuffer.
		var buffer = ctx.createBuffer(this.response, false);
		sound.buffer = this.response;

		// Make the sound source use the buffer and start playing it.
		if (autoplay){
			sound.play();
		}
		sound.panner = ctx.createPanner();
		// Instead of hooking up the volume to the main volume, hook it up to the panner.
		sound.volume.connect(sound.panner);
		// And hook up the panner to the main volume.
		sound.panner.connect(mainVolume);
	};
	request.send();
	sound.play = function(){
		this.source.buffer = ctx.createBuffer(this.buffer, false);
		this.source.noteOn(ctx.currentTime);
	}
	return sound
}


// var background = loadSound('horror_ambience.wav', true, true);
var monster = loadSound('monster-1.wav');
// In the frame handler function, get the object's position.
// And copy the position over to the sound of the object.
document.addEventListener('keydown', function(evt){
	if (evt.keyCode === 76){
		// 'L'
		console.log('growl left');
		monster.panner.setPosition(-50000, -50000, -50000);
		monster.play();
	}else if(evt.keyCode === 82){
		// 'R'
		console.log('growl right');
		monster.panner.setPosition(50000, 50000, 50000);
		monster.play();
	}
	console.log(evt);
});

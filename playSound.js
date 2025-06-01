let audioContext = new AudioContext();

const buttonEl = document.querySelector('button');

buttonEl.addEventListener('click', function() {

  if(audioContext.state === 'suspended') {
    audioContext.resume();
  }

  laserate();

})

function laserate() {

  let osc = audioContext.createOscillator();
  osc.type = 'triangle';
  osc.frequency.value = 350;
  osc.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 1);
  let gain = audioContext.createGain();
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.9);
  osc.start();
  osc.stop(audioContext.currentTime + 1);
  osc.connect(gain).connect(audioContext.destination);

}
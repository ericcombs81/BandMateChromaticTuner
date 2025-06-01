navigator.mediaDevices.getUserMedia({audio: true})
  .then(function(stream) {
    // Use the stream to create an audio source node
    const audioContext = new AudioContext();
    const sourceNode = audioContext.createMediaStreamSource(stream);

    //AnalyserNode
    const analyserNode = audioContext.createAnalyser();
    sourceNode.connect(analyserNode);

    // Connect the audio source node to the audio destination node
    sourceNode.connect(audioContext.destination);
  })
  .catch(function(error) {
    console.error('Error accessing microphone', error);
  });
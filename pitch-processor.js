// pitch-processor.js

class PitchProcessor extends AudioWorkletProcessor {
    static get parameterDescriptors() {
      return [];
    }
  
    constructor() {
      super();
      this.bufferLength = 4096;
      this.inputBuffer = new Float32Array(this.bufferLength);
    }
  
    process(inputs, outputs, parameters) {
      // Get input audio data from the inputs array
      const inputData = inputs[0][0];
      this.inputBuffer.set(inputData);
  
      // Calculate autocorrelation
      const autocorrelationData = autocorrelation(this.inputBuffer);
  
      // Find the peak in the autocorrelation data
      let maxIndex = 0;
      let maxValue = -Infinity;
      for (let i = 0; i < autocorrelationData.length; i++) {
        if (autocorrelationData[i] > maxValue) {
          maxValue = autocorrelationData[i];
          maxIndex = i;
        }
      }
  
      // Calculate the pitch frequency in Hz
      const sampleRate = this.sampleRate;
      const fundamentalFrequency = sampleRate / maxIndex;
  
      // Send the pitch frequency to the main thread
      this.port.postMessage(fundamentalFrequency);
  
      // Return true to indicate that the processor is still active
      return true;
    }
  
    // Override the default sample rate to get the actual value from the audio context
    get sampleRate() {
      return this.context.sampleRate;
    }
  }
  
  // Autocorrelation function
  function autocorrelation(data) {
    const n = data.length;
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += data[i];
    }
    const mean = sum / n;
    let autocovariance = new Array(n).fill(0);
    for (let i = 
  
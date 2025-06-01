const start = document.getElementById("start");
start.addEventListener('click', getGoing);
var switching = false;
var instrument = "Flute";
var sharpFlat = "sharp";
let pitchNumber = -1;
var toggled = false;
var fart = 20;

// Used for smooth animation of tuner needle
let currentPosition = 0;
let targetPosition = 0;
const smoothingFactor = 0.1;

let speed = 0;

let trebleArrayFlat = ['TrebleClef/t-d-n-3.png', 'TrebleClef/t-eb-f-3.png', 'TrebleClef/t-e-n-3.png', 'TrebleClef/t-f-n-3.png',
        'TrebleClef/t-gb-f-3.png', 'TrebleClef/t-g-n-3.png', 'TrebleClef/t-ab-f-3.png', 'TrebleClef/t-a-n-3.png', 'TrebleClef/t-bb-f-3.png',
        'TrebleClef/t-b-n-3.png', 'TrebleClef/t-c-n-4.png', 'TrebleClef/t-db-f-4.png', 'TrebleClef/t-d-n-4.png', 'TrebleClef/t-eb-f-4.png',
        'TrebleClef/t-e-n-4.png', 'TrebleClef/t-f-n-4.png', 'TrebleClef/t-gb-f-4.png', 'TrebleClef/t-g-n-4.png', 'TrebleClef/t-ab-f-4.png',
        'TrebleClef/t-a-n-4.png', 'TrebleClef/t-bb-f-4.png', 'TrebleClef/t-b-n-4.png', 'TrebleClef/t-c-n-5.png', 'TrebleClef/t-db-f-5.png',
        'TrebleClef/t-d-n-5.png', 'TrebleClef/t-eb-f-5.png', 'TrebleClef/t-e-n-5.png', 'TrebleClef/t-f-n-5.png', 'TrebleClef/t-gb-f-5.png',
        'TrebleClef/t-g-n-5.png', 'TrebleClef/t-ab-f-5.png', 'TrebleClef/t-a-n-5.png', 'TrebleClef/t-bb-f-5.png', 'TrebleClef/t-b-n-5.png',
        'TrebleClef/t-c-n-6.png', 'TrebleClef/t-db-f-6.png', 'TrebleClef/t-d-n-6.png', 'TrebleClef/t-eb-f-6.png', 'TrebleClef/t-e-n-6.png',
        'TrebleClef/t-f-n-6.png', 'TrebleClef/t-gb-f-6.png', 'TrebleClef/t-g-n-6.png', 'TrebleClef/t-ab-f-6.png', 'TrebleClef/t-a-n-6.png',
        'TrebleClef/t-bb-f-6.png', 'TrebleClef/t-b-n-6.png', 'TrebleClef/t-c-n-7.png', 'TrebleClef/t-blank.png'];
let trebleArraySharp = ['TrebleClef/t-d-n-3.png', 'TrebleClef/t-eb-s-3.png', 'TrebleClef/t-e-n-3.png', 'TrebleClef/t-f-n-3.png',
        'TrebleClef/t-gb-s-3.png', 'TrebleClef/t-g-n-3.png', 'TrebleClef/t-ab-s-3.png', 'TrebleClef/t-a-n-3.png', 'TrebleClef/t-bb-s-3.png',
        'TrebleClef/t-b-n-3.png', 'TrebleClef/t-c-n-4.png', 'TrebleClef/t-db-s-4.png', 'TrebleClef/t-d-n-4.png', 'TrebleClef/t-eb-s-4.png',
        'TrebleClef/t-e-n-4.png', 'TrebleClef/t-f-n-4.png', 'TrebleClef/t-gb-s-4.png', 'TrebleClef/t-g-n-4.png', 'TrebleClef/t-ab-s-4.png',
        'TrebleClef/t-a-n-4.png', 'TrebleClef/t-bb-s-4.png', 'TrebleClef/t-b-n-4.png', 'TrebleClef/t-c-n-5.png', 'TrebleClef/t-db-s-5.png',
        'TrebleClef/t-d-n-5.png', 'TrebleClef/t-eb-s-5.png', 'TrebleClef/t-e-n-5.png', 'TrebleClef/t-f-n-5.png', 'TrebleClef/t-gb-s-5.png',
        'TrebleClef/t-g-n-5.png', 'TrebleClef/t-ab-s-5.png', 'TrebleClef/t-a-n-5.png', 'TrebleClef/t-bb-s-5.png', 'TrebleClef/t-b-n-5.png',
        'TrebleClef/t-c-n-6.png', 'TrebleClef/t-db-s-6.png', 'TrebleClef/t-d-n-6.png', 'TrebleClef/t-eb-s-6.png', 'TrebleClef/t-e-n-6.png',
        'TrebleClef/t-f-n-6.png', 'TrebleClef/t-gb-s-6.png', 'TrebleClef/t-g-n-6.png', 'TrebleClef/t-ab-s-6.png', 'TrebleClef/t-a-n-6.png',
        'TrebleClef/t-bb-s-6.png', 'TrebleClef/t-b-n-6.png', 'TrebleClef/t-c-n-7.png', 'TrebleClef/t-blank.png'];
let bassArrayFlat = ["BassClef/b-e-n-1.png", "BassClef/b-f-n-1.png", "BassClef/b-gb-f-1.png", "BassClef/b-g-n-1.png", "BassClef/b-ab-f-1.png",
        "BassClef/b-a-n-1.png", "BassClef/b-bb-f-1.png", "BassClef/b-b-n-1.png", "BassClef/b-c-n-2.png", "BassClef/b-db-f-2.png", "BassClef/b-d-n-2.png",
        "BassClef/b-eb-f-2.png", "BassClef/b-e-n-2.png", "BassClef/b-f-n-2.png", "BassClef/b-gb-f-2.png", "BassClef/b-g-n-2.png", "BassClef/b-ab-f-2.png",
        "BassClef/b-a-n-2.png", "BassClef/b-bb-f-2.png", "BassClef/b-b-n-2.png", "BassClef/b-c-n-3.png", "BassClef/b-db-f-3.png", "BassClef/b-d-n-3.png",
        "BassClef/b-eb-f-3.png", "BassClef/b-e-n-3.png", "BassClef/b-f-n-3.png", "BassClef/b-gb-f-3.png", "BassClef/b-g-n-3.png", "BassClef/b-ab-f-3.png",
        "BassClef/b-a-n-3.png", "BassClef/b-bb-f-3.png", "BassClef/b-b-n-3.png", "BassClef/b-c-n-4.png", "BassClef/b-db-f-4.png", "BassClef/b-d-n-4.png",
        "BassClef/b-eb-f-4.png", "BassClef/b-e-n-4.png", "BassClef/b-f-n-4.png", "BassClef/b-gb-f-4.png", "BassClef/b-g-n-4.png", "BassClef/b-ab-f-4.png",
        "BassClef/b-a-n-4.png", "BassClef/b-bb-f-4.png", "BassClef/b-blank.png"];
let bassArraySharp = ["BassClef/b-e-n-1.png", "BassClef/b-f-n-1.png", "BassClef/b-gb-s-1.png", "BassClef/b-g-n-1.png", "BassClef/b-ab-s-1.png",
        "BassClef/b-a-n-1.png", "BassClef/b-bb-s-1.png", "BassClef/b-b-n-1.png", "BassClef/b-c-n-2.png", "BassClef/b-db-s-2.png", "BassClef/b-d-n-2.png",
        "BassClef/b-eb-s-2.png", "BassClef/b-e-n-2.png", "BassClef/b-f-n-2.png", "BassClef/b-gb-s-2.png", "BassClef/b-g-n-2.png", "BassClef/b-ab-s-2.png",
        "BassClef/b-a-n-2.png", "BassClef/b-bb-s-2.png", "BassClef/b-b-n-2.png", "BassClef/b-c-n-3.png", "BassClef/b-db-s-3.png", "BassClef/b-d-n-3.png",
        "BassClef/b-eb-s-3.png", "BassClef/b-e-n-3.png", "BassClef/b-f-n-3.png", "BassClef/b-gb-s-3.png", "BassClef/b-g-n-3.png", "BassClef/b-ab-s-3.png",
        "BassClef/b-a-n-3.png", "BassClef/b-bb-s-3.png", "BassClef/b-b-n-3.png", "BassClef/b-c-n-4.png", "BassClef/b-db-s-4.png", "BassClef/b-d-n-4.png",
        "BassClef/b-eb-s-4.png", "BassClef/b-e-n-4.png", "BassClef/b-f-n-4.png", "BassClef/b-gb-s-4.png", "BassClef/b-g-n-4.png", "BassClef/b-ab-s-4.png",
        "BassClef/b-a-n-4.png", "BassClef/b-bb-s-4.png", "BassClef/b-blank.png"];
let altoArraySharp = ["AltoClef/a-c-n-3.png", "AltoClef/a-db-s-3.png", "AltoClef/a-D-n-3.png", "AltoClef/a-eb-s-3.png", "AltoClef/a-e-n-3.png",
        "AltoClef/a-f-n-3.png", "AltoClef/a-gb-f-3.png", "AltoClef/a-g-n-3.png", "AltoClef/a-ab-s-3.png", "AltoClef/a-a-n-3.png", "AltoClef/a-bb-s-3.png",
        "AltoClef/a-b-n-3.png", "AltoClef/a-c-n-4.png", "AltoClef/a-db-s-4.png", "AltoClef/a-D-n-4.png", "AltoClef/a-eb-s-4.png", "AltoClef/a-e-n-4.png",
        "AltoClef/a-f-n-4.png", "AltoClef/a-gb-s-4.png", "AltoClef/a-g-n-4.png", "AltoClef/a-ab-s-4.png", "AltoClef/a-a-n-4.png", "AltoClef/a-bb-s-4.png",
        "AltoClef/a-b-n-4.png", "AltoClef/a-c-n-5.png", "AltoClef/a-db-s-5.png", "AltoClef/a-D-n-5.png", "AltoClef/a-eb-s-5.png", "AltoClef/a-e-n-5.png",
        "AltoClef/a-f-n-5.png", "AltoClef/a-gb-s-5.png", "AltoClef/a-g-n-5.png", "AltoClef/a-blank.png"];
let altoArrayFlat = ["AltoClef/a-c-n-3.png", "AltoClef/a-db-f-3.png", "AltoClef/a-D-n-3.png", "AltoClef/a-eb-f-3.png", "AltoClef/a-e-n-3.png",
        "AltoClef/a-f-n-3.png", "AltoClef/a-gb-f-3.png", "AltoClef/a-g-n-3.png", "AltoClef/a-ab-f-3.png", "AltoClef/a-a-n-3.png", "AltoClef/a-bb-f-3.png",
        "AltoClef/a-b-n-3.png", "AltoClef/a-c-n-4.png", "AltoClef/a-db-f-4.png", "AltoClef/a-D-n-4.png", "AltoClef/a-eb-f-4.png", "AltoClef/a-e-n-4.png",
        "AltoClef/a-f-n-4.png", "AltoClef/a-gb-f-4.png", "AltoClef/a-g-n-4.png", "AltoClef/a-ab-f-4.png", "AltoClef/a-a-n-4.png", "AltoClef/a-bb-f-4.png",
        "AltoClef/a-b-n-4.png", "AltoClef/a-c-n-5.png", "AltoClef/a-db-f-5.png", "AltoClef/a-D-n-5.png", "AltoClef/a-eb-f-5.png", "AltoClef/a-e-n-5.png",
        "AltoClef/a-f-n-5.png", "AltoClef/a-gb-f-5.png", "AltoClef/a-g-n-5.png", "AltoClef/a-blank.png"];


document.getElementById("staff").innerHTML = "<img src=\"" + trebleArrayFlat[47] + "\">";

if (instrument == "Voice BC") {
        var picture = "BassClef/b-blank.png";
} else if (instrument == "Viola") {
        var picture = "AltoClef/b-blank.png";
}
else {
        var picture = "TrebleClef/t-blank.png";
}


function getGoing() {
        init();
}
/*
The MIT License (MIT)
Copyright (c) 2014 Chris Wilson
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Note: autoCorrelate comes from https://github.com/cwilso/PitchDetect/pull/23
with the above license.

*/

function init() {
        redrawCanvas();
        var source;
        var audioContext = new AudioContext();
        var analyser = audioContext.createAnalyser();
        analyser.minDecibels = -100;
        analyser.maxDecibels = -10;
        analyser.smoothingTimeConstant = 0.0;

        if (switching == true) {

                if (instrument == "Voice BC" || instrument == "Bassoon" || instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Cello" || instrument == "Tuba") {
                        document.getElementById("staff").innerHTML = "<img src=\"" + bassArrayFlat[43] + "\">";
                } else if (instrument == "Viola") {
                        document.getElementById("staff").innerHTML = "<img src=\"" + altoArrayFlat[32] + "\">";
                }

                else {
                        if (instrument == "Voice BC" || instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instrument == "Oboe" ||
                                instrument == "Violin" || instrument == "Voice TC" || instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" ||
                                instrument == "Soprano Sax" || instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC" ||
                                instrument == "Alto Sax" || instrument == "Bari Sax" || instrument == "Horn" || instrument == "English Horn" || instrument == "Guitar") {
                                document.getElementById("staff").innerHTML = "<img src=\"" + trebleArrayFlat[47] + "\">";
                        }
                }
                switching = false;
        }


        if (!navigator?.mediaDevices?.getUserMedia) {
                // No audio allowed
                alert('Sorry, getUserMedia is required for the app.')
                return;
        } else {

                navigator.mediaDevices.getUserMedia({ audio: true })
                        .then(function (stream) {
                                // Initialize the SourceNode
                                source = audioContext.createMediaStreamSource(stream);
                                // Connect the source node to the analyzer
                                source.connect(analyser);
                                visualize();
                        }
                        )
                        .catch(function (error) {
                                alert('Sorry, microphone permissions are required for the app. Feel free to read on without playing :)')
                        });
        }

        // Visualizing, copied from voice change o matic
        function visualize() {

                var previousValueToDisplay = 0;
                var smoothingCount = 0;
                var smoothingThreshold = 5;
                var smoothingCountThreshold = 5;
                picture = trebleArrayFlat[47];

                // Thanks to PitchDetect: https://github.com/cwilso/PitchDetect/blob/master/js/pitchdetect.js
                var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
                function noteFromPitch(frequency) {
                        var noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
                        return Math.round(noteNum) + 69;
                }

                var drawNote = function () {
                        toggled = false;
                        drawNoteVisual = requestAnimationFrame(drawNote);
                        var bufferLength = analyser.fftSize;
                        var buffer = new Float32Array(bufferLength);
                        analyser.getFloatTimeDomainData(buffer);
                        var autoCorrelateValue = autoCorrelate(buffer, audioContext.sampleRate)

                        // Handle rounding
                        var valueToDisplay = autoCorrelateValue;


                        //This is if the sound is too quiet
                        if (autoCorrelateValue === -1) {
                                if (switching == true) {

                                        if (instrument == "Voice BC" || instrument == "Bassoon" || instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Cello" || instrument == "Tuba") {
                                                document.getElementById("staff").innerHTML = "<img src=\"" + bassArrayFlat[43] + "\">";
                                        } else if (instrument == "Viola") {
                                                document.getElementById("staff").innerHTML = "<img src=\"" + altoArrayFlat[32] + "\">";
                                        }

                                        else {
                                                if (instrument == "Voice BC" || instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instrument == "Oboe" ||
                                                        instrument == "Violin" || instrument == "Voice TC" || instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" ||
                                                        instrument == "Soprano Sax" || instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC" ||
                                                        instrument == "Alto Sax" || instrument == "Bari Sax" || instrument == "Horn" || instrument == "English Horn" || instrument == "Guitar") {
                                                        document.getElementById("staff").innerHTML = "<img src=\"" + trebleArrayFlat[47] + "\">";
                                                }
                                        }
                                        switching = false;
                                }

                                return;
                        }
                        
                        smoothingThreshold = 1;
                        smoothingCountThreshold = 8; // was 5 and 10.  The higher the countThreshold, the slower the visual changes happen. 


         // lower the CountThreshold

        // If this is the first sound, show it immediately
        // Otherwise, if it actually is a change of letter name, show it immediately





                        function noteIsSimilarEnough() {
                                // Check threshold for number, or just difference for notes.
                                if (typeof (valueToDisplay) == 'number') {
                                        return Math.abs(valueToDisplay - previousValueToDisplay) < smoothingThreshold;
                                } else { // Hint: this never happens.
                                        return valueToDisplay === previousValueToDisplay;
                                }
                        }
                        // Check if this value has been within the given range for n iterations
                        if (noteIsSimilarEnough()) {
                                //I didn't think this would happen much.  It happens constantly.
                                if (smoothingCount < smoothingCountThreshold) {
                                        smoothingCount++;
                                        return;
                                } else {
                                        previousValueToDisplay = valueToDisplay;
                                        smoothingCount = 0;
                                }
                        } else {
                                previousValueToDisplay = valueToDisplay;
                                smoothingCount = 0;
                                return;
                        }
                        

                        //At this point, "valueToDisplay" is the exact Hz.  It will be what appears.  Use this info.
                        if (instrument == "Voice BC" || instrument == "Bassoon" || instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Cello" || instrument == "Tuba") {
                                picture = bassArrayFlat[43];
                        } else if (instrument == "Viola") {
                                document.getElementById("staff").innerHTML = "<img src=\"" + altoArrayFlat[32] + "\">";
                        }

                        else {
                                picture = trebleArrayFlat[47];
                        }
                        redrawCanvas();
                        freq = valueToDisplay;
                        if (valueToDisplay < 16.35 - (17.32 - 16.35)) {
                                valueToDisplay = "Too low";
                                if (instrument == "Voice BC" || instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instrument == "Oboe" ||
                                        instrument == "Violin" || instrument == "Voice TC" || instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" ||
                                        instrument == "Soprano Sax" || instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC" ||
                                        instrument == "Alto Sax" || instrument == "Bari Sax" || instrument == "Horn" || instrument == "English Horn" || instrument == "Guitar") {
                                        picture = trebleArrayFlat[47];
                                } else if (instrument == "Viola") {
                                        document.getElementById("staff").innerHTML = "<img src=\"" + altoArrayFlat[32] + "\">";
                                }

                                else {
                                        if (instrument == "Voice BC" || instrument == "Bassoon" || instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Cello" || instrument == "Tuba") {

                                                picture = bassArrayFlat[43];
                                        }
                                }
                                document.getElementById("staff").innerHTML = "<img src=\"" + picture + "\">";
                        }
                        else if (valueToDisplay < 16.35 + (17.32 - 16.35) / 2 && valueToDisplay > 16.35 - (17.32 - 16.35) / 2) { valueToDisplay = "C"; pitchNumber = 0; }  //0
                        else if (valueToDisplay < 17.32 + (18.35 - 17.32) / 2 && valueToDisplay > 17.32 - (17.32 - 16.35) / 2) { valueToDisplay = "C#"; pitchNumber = 1; drawLine(16.35, 17.32, 18.35, freq);}
                        else if (valueToDisplay < 18.35 + (19.45 - 18.35) / 2 && valueToDisplay > 18.35 - (18.35 - 17.32) / 2) { valueToDisplay = "D"; pitchNumber = 2; drawLine(17.32, 18.35, 19.45, freq);}
                        else if (valueToDisplay < 19.45 + (20.60 - 19.45) / 2 && valueToDisplay > 19.45 - (19.45 - 18.35) / 2) { valueToDisplay = "D#"; pitchNumber = 3; drawLine(18.35, 19.45, 20.60, freq);}
                        else if (valueToDisplay < 20.60 + (21.83 - 20.60) / 2 && valueToDisplay > 20.60 - (20.60 - 19.45) / 2) { valueToDisplay = "E"; pitchNumber = 4; drawLine(19.45, 20.60, 21.83, freq);}
                        else if (valueToDisplay < 21.83 + (23.12 - 21.83) / 2 && valueToDisplay > 21.83 - (21.83 - 20.60) / 2) { valueToDisplay = "F"; pitchNumber = 5; drawLine(20.60, 21.83, 23.12, freq);}
                        else if (valueToDisplay < 23.12 + (24.50 - 23.12) / 2 && valueToDisplay > 23.12 - (23.12 - 21.83) / 2) { valueToDisplay = "F#"; pitchNumber = 6; drawLine(21.83, 23.12, 24.50, freq);}
                        else if (valueToDisplay < 24.50 + (25.96 - 24.50) / 2 && valueToDisplay > 24.50 - (24.50 - 23.12) / 2) { valueToDisplay = "G"; pitchNumber = 7; drawLine(23.12, 24.50, 25.96, freq);}
                        else if (valueToDisplay < 25.96 + (27.50 - 25.96) / 2 && valueToDisplay > 25.96 - (25.96 - 24.50) / 2) { valueToDisplay = "G#"; pitchNumber = 8; drawLine(24.50, 25.96, 27.50, freq);}
                        else if (valueToDisplay < 27.50 + (29.14 - 27.50) / 2 && valueToDisplay > 27.50 - (27.50 - 25.96) / 2) { valueToDisplay = "A"; pitchNumber = 9; drawLine(25.96, 27.50, 29.14, freq);}
                        else if (valueToDisplay < 29.14 + (30.87 - 29.14) / 2 && valueToDisplay > 29.14 - (29.14 - 27.50) / 2) { valueToDisplay = "A#"; pitchNumber = 10; drawLine(27.50, 29.14, 30.87, freq);}
                        else if (valueToDisplay < 30.87 + (32.70 - 30.87) / 2 && valueToDisplay > 30.87 - (30.87 - 29.14) / 2) { valueToDisplay = "B"; pitchNumber = 11; drawLine(29.14, 30.87, 32.70, freq);}
                        else if (valueToDisplay < 32.70 + (34.65 - 32.70) / 2 && valueToDisplay > 32.70 - (32.70 - 30.87) / 2) { valueToDisplay = "C"; pitchNumber = 12; drawLine(30.87, 32.70, 34.65, freq);} //1
                        else if (valueToDisplay < 34.65 + (36.71 - 34.65) / 2 && valueToDisplay > 34.65 - (34.65 - 32.70) / 2) { valueToDisplay = "C#"; pitchNumber = 13; drawLine(32.70, 34.65, 36.71, freq);}
                        else if (valueToDisplay < 36.71 + (38.89 - 36.71) / 2 && valueToDisplay > 36.71 - (36.71 - 34.65) / 2) { valueToDisplay = "D"; pitchNumber = 14; drawLine(34.65, 36.71, 38.89, freq);}
                        else if (valueToDisplay < 38.89 + (41.20 - 38.89) / 2 && valueToDisplay > 38.89 - (38.89 - 36.71) / 2) { valueToDisplay = "D#"; pitchNumber = 15; drawLine(36.71, 38.89, 41.20, freq);}
                        else if (valueToDisplay < 41.20 + (43.65 - 41.20) / 2 && valueToDisplay > 41.20 - (41.20 - 38.89) / 2) { valueToDisplay = "E"; pitchNumber = 16; drawLine(38.89, 41.20, 43.65, freq);}
                        else if (valueToDisplay < 43.65 + (46.25 - 43.65) / 2 && valueToDisplay > 43.65 - (43.65 - 41.20) / 2) { valueToDisplay = "F"; pitchNumber = 17; drawLine(41.20, 43.65, 46.25, freq);}
                        else if (valueToDisplay < 46.25 + (49.00 - 46.25) / 2 && valueToDisplay > 46.25 - (46.25 - 43.65) / 2) { valueToDisplay = "F#"; pitchNumber = 18; drawLine(43.65, 46.25, 49.00, freq);}
                        else if (valueToDisplay < 49.00 + (51.91 - 49.00) / 2 && valueToDisplay > 49.00 - (49.00 - 46.25) / 2) { valueToDisplay = "G"; pitchNumber = 19; drawLine(46.25, 49.00, 51.91, freq);}
                        else if (valueToDisplay < 51.91 + (55.00 - 51.91) / 2 && valueToDisplay > 51.91 - (51.91 - 49.00) / 2) { valueToDisplay = "G#"; pitchNumber = 20; drawLine(49.00, 51.91, 55.00, freq);}
                        else if (valueToDisplay < 55.00 + (58.27 - 55.00) / 2 && valueToDisplay > 55.00 - (55.00 - 51.91) / 2) { valueToDisplay = "A"; pitchNumber = 21; drawLine(51.91, 55.00, 58.27, freq);}
                        else if (valueToDisplay < 58.27 + (61.74 - 58.27) / 2 && valueToDisplay > 58.27 - (58.27 - 55.00) / 2) { valueToDisplay = "A#"; pitchNumber = 22; drawLine(55.00, 58.27, 61.74, freq);}
                        else if (valueToDisplay < 61.74 + (65.41 - 61.74) / 2 && valueToDisplay > 61.74 - (61.74 - 58.27) / 2) { valueToDisplay = "B"; pitchNumber = 23; drawLine(58.27, 61.74, 65.41, freq);}
                        else if (valueToDisplay < 65.41 + (69.30 - 65.41) / 2 && valueToDisplay > 65.41 - (65.41 - 61.74) / 2) { valueToDisplay = "C"; pitchNumber = 24; drawLine(61.74, 65.41, 69.30, freq);} //2
                        else if (valueToDisplay < 69.30 + (73.42 - 69.30) / 2 && valueToDisplay > 69.30 - (69.30 - 65.41) / 2) { valueToDisplay = "C#"; pitchNumber = 25; drawLine(65.41, 69.30, 73.42, freq);}
                        else if (valueToDisplay < 73.42 + (77.78 - 73.42) / 2 && valueToDisplay > 73.42 - (73.42 - 69.30) / 2) { valueToDisplay = "D"; pitchNumber = 26; drawLine(69.30, 73.42, 77.78, freq);}
                        else if (valueToDisplay < 77.78 + (82.41 - 77.78) / 2 && valueToDisplay > 77.78 - (77.78 - 73.42) / 2) { valueToDisplay = "D#"; pitchNumber = 27; drawLine(73.42, 77.78, 82.41, freq);}
                        else if (valueToDisplay < 82.41 + (87.31 - 82.41) / 2 && valueToDisplay > 82.41 - (82.41 - 77.78) / 2) { valueToDisplay = "E"; pitchNumber = 28; drawLine(77.78, 82.41, 87.31, freq);}
                        else if (valueToDisplay < 87.31 + (92.50 - 87.31) / 2 && valueToDisplay > 87.31 - (87.31 - 82.41) / 2) { valueToDisplay = "F"; pitchNumber = 29; drawLine(82.41, 87.31, 92.50, freq);}
                        else if (valueToDisplay < 92.50 + (98.00 - 92.50) / 2 && valueToDisplay > 92.50 - (92.50 - 87.31) / 2) { valueToDisplay = "F#"; pitchNumber = 30; drawLine(87.31, 92.50, 98.00, freq);}
                        else if (valueToDisplay < 98.00 + (103.83 - 98.00) / 2 && valueToDisplay > 98.00 - (98.00 - 92.50) / 2) { valueToDisplay = "G"; pitchNumber = 31; drawLine(92.50, 98.00, 103.83, freq);}
                        else if (valueToDisplay < 103.83 + (110.00 - 103.83) / 2 && valueToDisplay > 103.83 - (103.83 - 98.00) / 2) { valueToDisplay = "G#"; pitchNumber = 32; drawLine(98.00, 103.83, 110.00, freq);}
                        else if (valueToDisplay < 110.00 + (116.54 - 110.00) / 2 && valueToDisplay > 110.00 - (110.00 - 103.83) / 2) { valueToDisplay = "A"; pitchNumber = 33; drawLine(103.83, 110.00, 116.54, freq);}
                        else if (valueToDisplay < 116.54 + (123.47 - 116.54) / 2 && valueToDisplay > 116.54 - (116.54 - 110.00) / 2) { valueToDisplay = "A#"; pitchNumber = 34; drawLine(110.00, 116.54, 123.47, freq);}
                        else if (valueToDisplay < 123.47 + (130.81 - 123.47) / 2 && valueToDisplay > 123.47 - (123.47 - 116.54) / 2) { valueToDisplay = "B"; pitchNumber = 35; drawLine(116.54, 123.47, 130.81, freq);}
                        else if (valueToDisplay < 130.81 + (138.59 - 130.81) / 2 && valueToDisplay > 130.81 - (130.81 - 123.47) / 2) { valueToDisplay = "C"; pitchNumber = 36; drawLine(123.47, 130.81, 138.59, freq);} //3
                        else if (valueToDisplay < 138.59 + (146.83 - 138.59) / 2 && valueToDisplay > 138.59 - (138.59 - 130.81) / 2) { valueToDisplay = "C#"; pitchNumber = 37; drawLine(130.81, 138.59, 146.83, freq);}
                        else if (valueToDisplay < 146.83 + (155.56 - 146.83) / 2 && valueToDisplay > 146.83 - (146.83 - 138.59) / 2) { valueToDisplay = "D"; pitchNumber = 38; drawLine(138.59, 146.83, 155.56, freq);}
                        else if (valueToDisplay < 155.56 + (164.81 - 155.56) / 2 && valueToDisplay > 155.56 - (155.56 - 146.83) / 2) { valueToDisplay = "D#"; pitchNumber = 39; drawLine(146.83, 155.56, 164.81, freq);}
                        else if (valueToDisplay < 164.81 + (174.61 - 164.81) / 2 && valueToDisplay > 164.81 - (164.81 - 155.56) / 2) { valueToDisplay = "E"; pitchNumber = 40; drawLine(155.56, 164.81, 174.61, freq);}
                        else if (valueToDisplay < 174.61 + (185.00 - 174.61) / 2 && valueToDisplay > 174.61 - (174.61 - 164.81) / 2) { valueToDisplay = "F"; pitchNumber = 41; drawLine(164.81, 174.61, 185.00, freq);}
                        else if (valueToDisplay < 185.00 + (196.00 - 185.00) / 2 && valueToDisplay > 185.00 - (185.00 - 174.61) / 2) { valueToDisplay = "F#"; pitchNumber = 42; drawLine(174.61, 185.00, 196.00, freq);}
                        else if (valueToDisplay < 196.00 + (207.65 - 196.00) / 2 && valueToDisplay > 196.00 - (196.00 - 185.00) / 2) { valueToDisplay = "G"; pitchNumber = 43; drawLine(185.00, 196.00, 207.65,  freq);}
                        else if (valueToDisplay < 207.65 + (220.00 - 207.65) / 2 && valueToDisplay > 207.65 - (207.65 - 196.00) / 2) { valueToDisplay = "G#"; pitchNumber = 44; drawLine(196.00, 207.65, 220.00, freq);}
                        else if (valueToDisplay < 220.00 + (233.08 - 220.00) / 2 && valueToDisplay > 220.00 - (220.00 - 207.65) / 2) { valueToDisplay = "A"; pitchNumber = 45; drawLine(207.65, 220.00, 233.08, freq);}
                        else if (valueToDisplay < 233.08 + (246.94 - 233.08) / 2 && valueToDisplay > 233.08 - (233.08 - 220.00) / 2) { valueToDisplay = "A#"; pitchNumber = 46; drawLine(220.00, 233.08, 246.94, freq);}
                        else if (valueToDisplay < 246.94 + (261.63 - 246.94) / 2 && valueToDisplay > 246.94 - (246.94 - 233.08) / 2) { valueToDisplay = "B"; pitchNumber = 47; drawLine(233.08, 246.94, 261.63, freq);}
                        else if (valueToDisplay < 261.63 + (277.18 - 261.63) / 2 && valueToDisplay > 261.63 - (261.63 - 246.94) / 2) { valueToDisplay = "C"; pitchNumber = 48; drawLine(246.94, 261.63, 277.18, freq);}//4
                        else if (valueToDisplay < 277.18 + (293.66 - 277.18) / 2 && valueToDisplay > 277.18 - (277.18 - 261.63) / 2) { valueToDisplay = "C#"; pitchNumber = 49; drawLine(261.63, 277.18, 293.66, freq);}
                        else if (valueToDisplay < 293.66 + (311.13 - 293.66) / 2 && valueToDisplay > 293.66 - (293.66 - 277.18) / 2) { valueToDisplay = "D"; pitchNumber = 50; drawLine(277.18, 293.66, 311.13, freq);}
                        else if (valueToDisplay < 311.13 + (329.63 - 311.13) / 2 && valueToDisplay > 311.13 - (311.13 - 293.66) / 2) { valueToDisplay = "D#"; pitchNumber = 51; drawLine(293.66, 311.13, 329.63, freq);}
                        else if (valueToDisplay < 329.63 + (349.23 - 329.63) / 2 && valueToDisplay > 329.63 - (329.63 - 311.13) / 2) { valueToDisplay = "E"; pitchNumber = 52; drawLine(311.13, 329.63, 349.23, freq);}
                        else if (valueToDisplay < 349.23 + (369.99 - 349.23) / 2 && valueToDisplay > 349.23 - (349.23 - 329.63) / 2) { valueToDisplay = "F"; pitchNumber = 53; drawLine(329.63, 349.23, 369.99, freq);}
                        else if (valueToDisplay < 369.99 + (392.00 - 369.99) / 2 && valueToDisplay > 369.99 - (369.99 - 349.23) / 2) { valueToDisplay = "F#"; pitchNumber = 54; drawLine(349.23, 369.99, 392.00, freq);}
                        else if (valueToDisplay < 392.00 + (415.30 - 392.00) / 2 && valueToDisplay > 392.00 - (392.00 - 369.99) / 2) { valueToDisplay = "G"; pitchNumber = 55; drawLine(369.99, 392.00, 415.30, freq);}
                        else if (valueToDisplay < 415.30 + (440.00 - 415.30) / 2 && valueToDisplay > 415.30 - (415.30 - 392.00) / 2) { valueToDisplay = "G#"; pitchNumber = 56; drawLine(392.00, 415.30, 440.00, freq);}
                        else if (valueToDisplay < 440.00 + (466.16 - 440.00) / 2 && valueToDisplay > 440.00 - (440.00 - 415.30) / 2) { valueToDisplay = "A"; pitchNumber = 57; drawLine(415.30, 440.00, 466.16, freq);}
                        else if (valueToDisplay < 466.16 + (493.88 - 466.16) / 2 && valueToDisplay > 466.16 - (466.16 - 440.00) / 2) { valueToDisplay = "A#"; pitchNumber = 58; drawLine(440.00, 466.16, 493.88, freq);}
                        else if (valueToDisplay < 493.88 + (523.25 - 493.88) / 2 && valueToDisplay > 493.88 - (493.88 - 466.16) / 2) { valueToDisplay = "B"; pitchNumber = 59; drawLine(466.16, 493.88, 523.25, freq);}
                        else if (valueToDisplay < 523.25 + (554.37 - 523.25) / 2 && valueToDisplay > 523.25 - (523.25 - 493.88) / 2) { valueToDisplay = "C"; pitchNumber = 60; drawLine(493.88, 523.25, 554.37, freq);}//5
                        else if (valueToDisplay < 554.37 + (587.33 - 554.37) / 2 && valueToDisplay > 554.37 - (554.37 - 523.25) / 2) { valueToDisplay = "C#"; pitchNumber = 61; drawLine(523.25, 554.37, 587.33, freq);}
                        else if (valueToDisplay < 587.33 + (622.25 - 587.33) / 2 && valueToDisplay > 587.33 - (587.33 - 554.37) / 2) { valueToDisplay = "D"; pitchNumber = 62; drawLine(554.37, 587.33, 622.25, freq);}
                        else if (valueToDisplay < 622.25 + (659.25 - 622.25) / 2 && valueToDisplay > 622.25 - (622.25 - 587.33) / 2) { valueToDisplay = "D#"; pitchNumber = 63; drawLine(587.33, 622.25, 659.25, freq);}
                        else if (valueToDisplay < 659.25 + (698.46 - 659.25) / 2 && valueToDisplay > 659.25 - (659.25 - 622.25) / 2) { valueToDisplay = "E"; pitchNumber = 64; drawLine(622.25, 659.25, 698.46, freq);}
                        else if (valueToDisplay < 698.46 + (739.99 - 698.46) / 2 && valueToDisplay > 698.46 - (698.46 - 659.25) / 2) { valueToDisplay = "F"; pitchNumber = 65; drawLine(659.25, 698.46, 739.99, freq);}
                        else if (valueToDisplay < 739.99 + (783.99 - 739.99) / 2 && valueToDisplay > 739.99 - (739.99 - 698.46) / 2) { valueToDisplay = "F#"; pitchNumber = 66; drawLine(698.46, 739.99, 783.99, freq);}
                        else if (valueToDisplay < 783.99 + (830.61 - 783.99) / 2 && valueToDisplay > 783.99 - (783.99 - 739.99) / 2) { valueToDisplay = "G"; pitchNumber = 67; drawLine(739.99, 783.99, 830.61, freq);}
                        else if (valueToDisplay < 830.61 + (880.00 - 830.61) / 2 && valueToDisplay > 830.61 - (830.61 - 783.99) / 2) { valueToDisplay = "G#"; pitchNumber = 68; drawLine(783.99, 830.61, 880.00, freq);}
                        else if (valueToDisplay < 880.00 + (932.23 - 880.00) / 2 && valueToDisplay > 880.00 - (880.00 - 830.61) / 2) { valueToDisplay = "A"; pitchNumber = 69; drawLine(830.61, 880.00, 932.33, freq);}
                        else if (valueToDisplay < 932.33 + (987.77 - 932.33) / 2 && valueToDisplay > 932.33 - (932.33 - 880.00) / 2) { valueToDisplay = "A#"; pitchNumber = 70; drawLine(880.00, 932.33, 987.77, freq);}
                        else if (valueToDisplay < 987.77 + (1046.50 - 987.77) / 2 && valueToDisplay > 987.77 - (987.77 - 932.33) / 2) { valueToDisplay = "B"; pitchNumber = 71; drawLine(932.33, 987.77, 1046.50, freq);}
                        else if (valueToDisplay < 1046.50 + (1108.73 - 1046.50) / 2 && valueToDisplay > 1046.50 - (1046.50 - 987.77) / 2) { valueToDisplay = "C"; pitchNumber = 72; drawLine(987.77, 1046.50, 1108.73, freq);}//6
                        else if (valueToDisplay < 1108.73 + (1174.66 - 1108.73) / 2 && valueToDisplay > 1108.73 - (1108.73 - 1046.50) / 2) { valueToDisplay = "C#"; pitchNumber = 73; drawLine(1046.50, 1108.73, 1174.66, freq);}
                        else if (valueToDisplay < 1174.66 + (1244.51 - 1174.66) / 2 && valueToDisplay > 1174.66 - (1174.66 - 1108.73) / 2) { valueToDisplay = "D"; pitchNumber = 74; drawLine(1108.73, 1174.66, 1244.51, freq);}
                        else if (valueToDisplay < 1244.51 + (1318.51 - 1244.51) / 2 && valueToDisplay > 1244.51 - (1244.51 - 1174.66) / 2) { valueToDisplay = "D#"; pitchNumber = 75; drawLine(1174.66, 1244.51, 1318.51, freq);}
                        else if (valueToDisplay < 1318.51 + (1396.91 - 1318.51) / 2 && valueToDisplay > 1318.51 - (1318.51 - 1244.51) / 2) { valueToDisplay = "E"; pitchNumber = 76; drawLine(1244.51, 1318.51, 1396.91, freq);}
                        else if (valueToDisplay < 1396.91 + (1479.98 - 1396.91) / 2 && valueToDisplay > 1396.91 - (1396.91 - 1318.51) / 2) { valueToDisplay = "F"; pitchNumber = 77; drawLine(1318.51, 1396.91, 1479.98, freq);}
                        else if (valueToDisplay < 1479.98 + (1567.98 - 1479.98) / 2 && valueToDisplay > 1479.98 - (1479.98 - 1396.91) / 2) { valueToDisplay = "F#"; pitchNumber = 78; drawLine(1396.91, 1479.98, 1567.98, freq);}
                        else if (valueToDisplay < 1567.98 + (1661.22 - 1567.98) / 2 && valueToDisplay > 1567.98 - (1567.98 - 1479.98) / 2) { valueToDisplay = "G"; pitchNumber = 79; drawLine(1479.98, 1567.98, 1661.22, freq);}
                        else if (valueToDisplay < 1661.22 + (1760.00 - 1661.22) / 2 && valueToDisplay > 1661.22 - (1661.22 - 1567.98) / 2) { valueToDisplay = "G#"; pitchNumber = 80; drawLine(1567.98, 1661.22, 1760.00, freq);}
                        else if (valueToDisplay < 1760.00 + (1864.66 - 1760.00) / 2 && valueToDisplay > 1760.00 - (1760.00 - 1661.22) / 2) { valueToDisplay = "A"; pitchNumber = 81; drawLine(1661.22, 1760.00, 1864.66, freq);}
                        else if (valueToDisplay < 1864.66 + (1975.53 - 1864.66) / 2 && valueToDisplay > 1864.66 - (1864.66 - 1760.00) / 2) { valueToDisplay = "A#"; pitchNumber = 82; drawLine(1760.00, 1864.66, 1975.53, freq);}
                        else if (valueToDisplay < 1975.53 + (2093.00 - 1975.53) / 2 && valueToDisplay > 1975.53 - (1975.53 - 1864.66) / 2) { valueToDisplay = "B"; pitchNumber = 83; drawLine(1864.66, 1975.53, 2093.00, freq);}
                        else if (valueToDisplay < 2093.00 + (2217.46 - 2093.00) / 2 && valueToDisplay > 2093.00 - (2093.00 - 1975.53) / 2) { valueToDisplay = "C"; pitchNumber = 84; drawLine(1975.53, 2093.00, 2217.46, freq);} //7
                        else if (valueToDisplay < 2217.46 + (2349.32 - 2217.46) / 2 && valueToDisplay > 2217.46 - (2217.46 - 2093.00) / 2) { valueToDisplay = "C#"; pitchNumber = 85; drawLine(2093.00, 2217.46, 2349.32, freq);}
                        else if (valueToDisplay < 2349.32 + (2489.02 - 2349.32) / 2 && valueToDisplay > 2349.32 - (2349.32 - 2217.46) / 2) { valueToDisplay = "D"; pitchNumber = 86; drawLine(2217.46, 2349.32, 2489.02, freq);}
                        else if (valueToDisplay < 2489.02 + (2637.02 - 2489.02) / 2 && valueToDisplay > 2489.02 - (2489.02 - 2349.32) / 2) { valueToDisplay = "D#"; pitchNumber = 87; drawLine(2349.32, 2489.02, 2637.02, freq);}
                        else if (valueToDisplay < 2637.02 + (2793.83 - 2637.02) / 2 && valueToDisplay > 2637.02 - (2637.02 - 2489.02) / 2) { valueToDisplay = "E"; pitchNumber = 88; drawLine(2489.02, 2637.02, 2793.83, freq);}
                        else if (valueToDisplay < 2793.83 + (2959.96 - 2793.83) / 2 && valueToDisplay > 2793.83 - (2793.83 - 2637.02) / 2) { valueToDisplay = "F"; pitchNumber = 89; drawLine(2637.02, 2793.83, 2959.96, freq);}
                        else if (valueToDisplay < 2959.96 + (3135.96 - 2959.96) / 2 && valueToDisplay > 2959.96 - (2959.96 - 2793.83) / 2) { valueToDisplay = "F#"; pitchNumber = 90; drawLine(2793.83, 2959.96, 3135.96, freq);}
                        else if (valueToDisplay < 3135.96 + (3322.44 - 3135.96) / 2 && valueToDisplay > 3135.96 - (3135.96 - 2959.96) / 2) { valueToDisplay = "G"; pitchNumber = 91; drawLine(2959.96, 3135.96, 3322.44, freq);}
                        else if (valueToDisplay < 3322.44 + (3520.00 - 3322.44) / 2 && valueToDisplay > 3322.44 - (3322.44 - 3135.96) / 2) { valueToDisplay = "G#"; pitchNumber = 92; drawLine(3135.96, 3322.44, 3520.00, freq);}
                        else if (valueToDisplay < 3520.00 + (3729.31 - 3520.00) / 2 && valueToDisplay > 3520.00 - (3520.00 - 3322.44) / 2) { valueToDisplay = "A"; pitchNumber = 93; drawLine(3322.44, 3520.00, 3729.31, freq);}
                        else if (valueToDisplay < 3729.31 + (3951.07 - 3729.31) / 2 && valueToDisplay > 3729.31 - (3729.31 - 3520.00) / 2) { valueToDisplay = "A#"; pitchNumber = 94; drawLine(3520.00, 3729.31, 3951.07, freq);}
                        else if (valueToDisplay < 3951.07 + (4186.01 - 3951.07) / 2 && valueToDisplay > 3951.07 - (3951.07 - 3729.31) / 2) { valueToDisplay = "B"; pitchNumber = 95; drawLine(3729.31, 3951.07, 4186.01, freq);}
                        else if (valueToDisplay < 4186.01 + (4434.92 - 4186.01) / 2 && valueToDisplay > 4186.01 - (4186.01 - 3951.07) / 2) { valueToDisplay = "C"; pitchNumber = 96; drawLine(3951.07, 4186.01, 4434.92, freq);} //8
                        else if (valueToDisplay < 4434.92 + (4698.63 - 4434.92) / 2 && valueToDisplay > 4434.92 - (4434.92 - 4186.01) / 2) { valueToDisplay = "C# 8"; pitchNumber = 97; drawLine(4186.01, 4434.92, 4698.63, freq);}
                        else if (valueToDisplay < 4698.63 + (4978.03 - 4698.63) / 2 && valueToDisplay > 4698.63 - (4698.63 - 4434.92) / 2) { valueToDisplay = "D"; pitchNumber = 98; drawLine(4434.92, 4698.63, 4978.03, freq);}
                        else if (valueToDisplay < 4978.03 + (5274.04 - 4978.03) / 2 && valueToDisplay > 4978.03 - (4978.03 - 4698.63) / 2) { valueToDisplay = "D#"; pitchNumber = 99; drawLine(4698.63, 4978.03, 5274.04, freq);}
                        else if (valueToDisplay < 5274.04 + (5587.65 - 5274.04) / 2 && valueToDisplay > 5274.04 - (5274.04 - 4978.03) / 2) { valueToDisplay = "E"; pitchNumber = 100; drawLine(4978.03, 5274.04, 5587.65, freq);}
                        else if (valueToDisplay < 5587.65 + (5919.91 - 5587.65) / 2 && valueToDisplay > 5587.65 - (5587.65 - 5274.04) / 2) { valueToDisplay = "F"; pitchNumber = 101; drawLine(5274.04, 5587.65, 5919.91, freq);}
                        else if (valueToDisplay < 5919.91 + (6271.93 - 5919.91) / 2 && valueToDisplay > 5919.91 - (5919.91 - 5587.65) / 2) { valueToDisplay = "F#"; pitchNumber = 102; drawLine(5587.65, 5919.91, 6271.93, freq);}
                        else if (valueToDisplay < 6271.93 + (6644.88 - 5919.91) / 2 && valueToDisplay > 6271.93 - (6271.93 - 5919.91) / 2) { valueToDisplay = "G"; pitchNumber = 103; drawLine(5919.91, 6271.93, 6644.88, freq);}
                        else if (valueToDisplay < 6644.88 + (7040.00 - 6644.88) / 2 && valueToDisplay > 6644.88 - (6644.88 - 6271.93) / 2) { valueToDisplay = "G#"; pitchNumber = 104; drawLine(6271.93, 6644.88, 7040.00, freq);}
                        else if (valueToDisplay < 7040.00 + (7458.62 - 7040.00) / 2 && valueToDisplay > 7040.00 - (7040.00 - 6644.88) / 2) { valueToDisplay = "A"; pitchNumber = 105; drawLine(6644.88, 7040.00, 7458.62, freq);}
                        else if (valueToDisplay < 7458.62 + (7902.13 - 7458.62) / 2 && valueToDisplay > 7458.62 - (7458.62 - 7040.00) / 2) { valueToDisplay = "A#"; pitchNumber = 106;}
                        else if (valueToDisplay > 7458.62 + (7902.13 - 7458.62) / 2) {
                                valueToDisplay = "Too high!";
                                document.getElementById("staff").innerHTML = "<img src=\"" + picture + "\">";
                        }
                        else {

                                if (instrument == "Voice BC" || instrument == "Bassoon" || instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Cello" || instrument == "Tuba") {
                                        picture = bassArrayFlat[43];
                                        document.getElementById("staff").innerHTML = "<img src=\"" + picture + "\">";
                                } else if (instrument == "Viola") {
                                        picture = altoArrayFlat[32];
                                        document.getElementById("staff").innerHTML = "<img src=\"" + picture + "\">"; y
                                } else if (instrument == "Viola") {

                                }

                                else {
                                        picture = trebleArrayFlat[47];
                                        document.getElementById("staff").innerHTML = "<img src=\"" + picture + "\">";
                                }
                        }
                        //Logic to select the picture.  Change to blank later.  Add logic for treble, bass, or alto;
                        
                        if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instrument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                if (sharpFlat == "sharp") {
                                        for (let i = 38; i < 85; i++) {
                                                if (pitchNumber == i) {
                                                        picture = trebleArraySharp[i - 38];
                                                        toggled = true;
                                                        break;
                                                }
                                        } if(toggled != true) {
                                                picture = trebleArraySharp[47];
                                                valueToDisplay = "Blank";
                                                
                                        }
                                        
                                } else {
                                        for (let i = 38; i < 85; i++) {
                                                if (pitchNumber == i) {
                                                        picture = trebleArrayFlat[i - 38];
                                                        toggled = true;
                                                        break;
                                                }
                                        } if(toggled != true) {
                                                picture = trebleArraySharp[47];
                                                valueToDisplay = "Blank";
                                                
                                        }
                                }
                        }
                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {
                                
                                switch(valueToDisplay) {
                                        case "C": valueToDisplay = "D";
                                        break;
                                        case "C#": valueToDisplay = "D#";
                                        break;
                                        case "D": valueToDisplay = "E";
                                        break;
                                        case "D#": valueToDisplay = "F";
                                        break;
                                        case "E": valueToDisplay = "F#";
                                        break;
                                        case "F": valueToDisplay = "G";
                                        break;
                                        case "F#": valueToDisplay = "G#";
                                        break;
                                        case "G": valueToDisplay = "A";
                                        break;
                                        case "G#": valueToDisplay = "A#";
                                        break;
                                        case "A": valueToDisplay = "B";
                                        break;
                                        case "A#": valueToDisplay = "C";
                                        break;
                                        case "B": valueToDisplay = "C#";
                                        break;
                                }
                                
                                if (sharpFlat == "sharp") {
                                        for (let i = 38; i < 85; i++) {
                                                if (pitchNumber == i - 2) {
                                                        picture = trebleArraySharp[i - 38];
                                                        toggled = true;
                                                        break;
                                                }
                                        } if(toggled != true) {
                                                picture = trebleArraySharp[47];
                                                valueToDisplay = "Blank";
                                                
                                        }
                                } else {
                                        for (let i = 38; i < 85; i++) {
                                                if (pitchNumber == i - 2) {
                                                        picture = trebleArrayFlat[i - 38];
                                                        toggled = true;
                                                        break;
                                                }
                                        } if(toggled != true) {
                                                picture = trebleArraySharp[47];
                                                valueToDisplay = "Blank";
                                                
                                        }
                                }
                        }
                        else if (instrument == "Viola") {
                                if (sharpFlat == "sharp") {
                                        for (let i = 36; i < 68; i++) {
                                                if (pitchNumber == i) {
                                                        picture = altoArraySharp[i - 36];
                                                        break;
                                                }
                                                else (picture = altoArraySharp[32]);
                                                valueToDisplay = "Blank";
                                        }
                                } else {
                                        for (let i = 38; i < 85; i++) {
                                                if (pitchNumber == i) {
                                                        picture = altoArrayFlat[i - 38];
                                                        break;
                                                }
                                                else (picture = altoArraySharp[32]);
                                                valueToDisplay = "Blank";
                                        }
                                }
                        }
                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {
 
                                switch(valueToDisplay) {
                                        case "C": valueToDisplay = "D";
                                        break;
                                        case "C#": valueToDisplay = "D#";
                                        break;
                                        case "D": valueToDisplay = "E";
                                        break;
                                        case "D#": valueToDisplay = "F";
                                        break;
                                        case "E": valueToDisplay = "F#";
                                        break;
                                        case "F": valueToDisplay = "G";
                                        break;
                                        case "F#": valueToDisplay = "G#";
                                        break;
                                        case "G": valueToDisplay = "A";
                                        break;
                                        case "G#": valueToDisplay = "A#";
                                        break;
                                        case "A": valueToDisplay = "B";
                                        break;
                                        case "A#": valueToDisplay = "C";
                                        break;
                                        case "B": valueToDisplay = "C#";
                                        break;
                                }

                                if (sharpFlat == "sharp") {
                                        for (let i = 38; i < 85; i++) {
                                                if (pitchNumber == i - 14) {
                                                        picture = trebleArraySharp[i - 38];
                                                        toggled = true;
                                                        break;
                                                }
                                        } if(toggled != true) {
                                                picture = trebleArraySharp[47];
                                                valueToDisplay = "Blank";
                                                
                                        }
                                } else {
                                        for (let i = 38; i < 85; i++) {
                                                if (pitchNumber == i - 14) {
                                                        picture = trebleArrayFlat[i - 38];
                                                        toggled = true;
                                                        break;
                                                }
                                        } if(toggled != true) {
                                                picture = trebleArraySharp[47];
                                                valueToDisplay = "Blank";
                                                
                                        }
                                }
                        }
                        else if (instrument == "Alto Sax") {

                                switch(valueToDisplay) {
                                        case "C": valueToDisplay = "A";
                                        break;
                                        case "C#": valueToDisplay = "A#";
                                        break;
                                        case "D": valueToDisplay = "B";
                                        break;
                                        case "D#": valueToDisplay = "C";
                                        break;
                                        case "E": valueToDisplay = "C#";
                                        break;
                                        case "F": valueToDisplay = "D";
                                        break;
                                        case "F#": valueToDisplay = "D#";
                                        break;
                                        case "G": valueToDisplay = "E";
                                        break;
                                        case "G#": valueToDisplay = "F";
                                        break;
                                        case "A": valueToDisplay = "F#";
                                        break;
                                        case "A#": valueToDisplay = "G";
                                        break;
                                        case "B": valueToDisplay = "G#";
                                        break;
                                }

                                if (sharpFlat == "sharp") {
                                        for (let i = 38; i < 85; i++) {
                                                if (pitchNumber == i - 9) {
                                                        picture = trebleArraySharp[i - 38];
                                                        toggled = true;
                                                        break;
                                                }
                                        } if(toggled != true) {
                                                picture = trebleArraySharp[47];
                                                valueToDisplay = "Blank";
                                                
                                        }
                                } else {
                                        for (let i = 38; i < 85; i++) {
                                                if (pitchNumber == i - 9) {
                                                        picture = trebleArrayFlat[i - 38];
                                                        toggled = true;
                                                        break;
                                                }
                                        } if(toggled != true) {
                                                picture = trebleArraySharp[47];
                                                valueToDisplay = "Blank";
                                                
                                        }
                                }
                        }
                        else if (instrument == "Bari Sax") {

                                switch(valueToDisplay) {
                                        case "C": valueToDisplay = "A";
                                        break;
                                        case "C#": valueToDisplay = "A#";
                                        break;
                                        case "D": valueToDisplay = "B";
                                        break;
                                        case "D#": valueToDisplay = "C";
                                        break;
                                        case "E": valueToDisplay = "C#";
                                        break;
                                        case "F": valueToDisplay = "D";
                                        break;
                                        case "F#": valueToDisplay = "D#";
                                        break;
                                        case "G": valueToDisplay = "E";
                                        break;
                                        case "G#": valueToDisplay = "F";
                                        break;
                                        case "A": valueToDisplay = "F#";
                                        break;
                                        case "A#": valueToDisplay = "G";
                                        break;
                                        case "B": valueToDisplay = "G#";
                                        break;
                                }

                                if (sharpFlat == "sharp") {
                                        for (let i = 38; i < 85; i++) {
                                                if (pitchNumber == i - 21) {
                                                        picture = trebleArraySharp[i - 38];
                                                        toggled = true;
                                                        break;
                                                }
                                        } if(toggled != true) {
                                                picture = trebleArraySharp[47];
                                                valueToDisplay = "Blank";
                                                
                                        }
                                } else {
                                        for (let i = 38; i < 85; i++) {
                                                if (pitchNumber == i - 21) {
                                                        picture = trebleArrayFlat[i - 38];
                                                        toggled = true;
                                                        break;
                                                }
                                        } if(toggled != true) {
                                                picture = trebleArraySharp[47];
                                                valueToDisplay = "Blank";
                                                
                                        }
                                }
                        }
                        else if (instrument == "Horn" || instrument == "English Horn") {

                                switch(valueToDisplay) {
                                        case "C": valueToDisplay = "G";
                                        break;
                                        case "C#": valueToDisplay = "G#";
                                        break;
                                        case "D": valueToDisplay = "A";
                                        break;
                                        case "D#": valueToDisplay = "A#";
                                        break;
                                        case "E": valueToDisplay = "B";
                                        break;
                                        case "F": valueToDisplay = "C";
                                        break;
                                        case "F#": valueToDisplay = "C#";
                                        break;
                                        case "G": valueToDisplay = "D";
                                        break;
                                        case "G#": valueToDisplay = "D#";
                                        break;
                                        case "A": valueToDisplay = "E";
                                        break;
                                        case "A#": valueToDisplay = "F";
                                        break;
                                        case "B": valueToDisplay = "F#";
                                        break;
                                }

                                if (sharpFlat == "sharp") {
                                        for (let i = 38; i < 85; i++) {
                                                if (pitchNumber == i - 7) {
                                                        picture = trebleArraySharp[i - 38];
                                                        toggled = true;
                                                        break;
                                                }
                                        } if(toggled != true) {
                                                picture = trebleArraySharp[47];
                                                valueToDisplay = "Blank";
                                                
                                        }
                                } else {
                                        for (let i = 38; i < 85; i++) {
                                                if (pitchNumber == i - 7) {
                                                        picture = trebleArrayFlat[i - 38];
                                                        toggled = true;
                                                        break;
                                                }
                                        } if(toggled != true) {
                                                picture = trebleArraySharp[47];
                                                valueToDisplay = "Blank";
                                                
                                        }
                                }
                        }
                        else if (instrument == "Guitar") {
                                if (sharpFlat == "sharp") {
                                        for (let i = 38; i < 85; i++) {
                                                if (pitchNumber == i - 12) {
                                                        picture = trebleArraySharp[i - 38];
                                                        toggled = true;
                                                        break;
                                                }
                                        } if(toggled != true) {
                                                picture = trebleArraySharp[47];
                                                valueToDisplay = "Blank";
                                                
                                        }
                                } else {
                                        for (let i = 38; i < 85; i++) {
                                                if (pitchNumber == i - 12) {
                                                        picture = trebleArrayFlat[i - 38];
                                                        toggled = true;
                                                        break;
                                                }
                                        } if(toggled != true) {
                                                picture = trebleArraySharp[47];
                                                valueToDisplay = "Blank";
                                                
                                        }
                                }
                        }
                        else if (instrument == "Bassoon" || instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {
                                if (sharpFlat == "sharp") {
                                        for (let i = 16; i < 59; i++) {
                                                if (pitchNumber == i) {
                                                        picture = bassArraySharp[i - 16];
                                                        toggled = true;
                                                        break;
                                                }
                                        } if(toggled != true) {
                                                picture = bassArraySharp[43];
                                                valueToDisplay = "Blank";
                                                
                                        }
                                } else {
                                        for (let i = 16; i < 59; i++) {
                                                if (pitchNumber == i) {
                                                        picture = bassArrayFlat[i - 16];
                                                        toggled = true;
                                                        break;
                                                }
                                        } if(toggled != true) {
                                                picture = bassArraySharp[43];
                                                valueToDisplay = "Blank";
                                                
                                        }
                                }
                        }
                        else if (instrument == "viola") {
                                if (sharpFlat == "sharp") {
                                        for (let i = 36; i < 68; i++) {
                                                if (pitchNumber == i) {
                                                        picture = altoArraySharp[i - 36];
                                                        toggled = true;
                                                        break;
                                                }
                                        } if(toggled != true) {
                                                picture = altoArraySharp[32];
                                                valueToDisplay = "Blank";
                                                
                                        }
                                } else {
                                        for (let i = 36; i < 68; i++) {
                                                if (pitchNumber == i) {
                                                        picture = altoArrayFlat[i - 36];
                                                        toggled = true;
                                                        break;
                                                }
                                        } if(toggled != true) {
                                                picture = altoArraySharp[32];
                                                valueToDisplay = "Blank";
                                                
                                        }
                                }
                        }

                        document.getElementById("staff").innerHTML = "<img src=\"" + picture + "\">";

                        if (valueToDisplay == null || valueToDisplay == "Too high!") { valueToDisplay = "" }
                        if (valueToDisplay == "C#" && sharpFlat == "sharp") {
                                document.getElementById("noteLetter").innerHTML = "C<span class=\"superscript\">&sharp;</span>";
                        } else if (valueToDisplay == "C#" && sharpFlat == "flat") {
                                document.getElementById("noteLetter").innerHTML = "D<span class=\"superscript\">&flat;</span>";
                        } else if (valueToDisplay == "D#" && sharpFlat == "sharp") {
                                document.getElementById("noteLetter").innerHTML = "D<span class=\"superscript\">&sharp;</span>";
                        } else if (valueToDisplay == "D#" && sharpFlat == "flat") {
                                document.getElementById("noteLetter").innerHTML = "E<span class=\"superscript\">&flat;</span>";
                        } else if (valueToDisplay == "F#" && sharpFlat == "sharp") {
                                document.getElementById("noteLetter").innerHTML = "F<span class=\"superscript\">&sharp;</span>";
                        } else if (valueToDisplay == "F#" && sharpFlat == "flat") {
                                document.getElementById("noteLetter").innerHTML = "G<span class=\"superscript\">&flat;</span>";
                        } else if (valueToDisplay == "G#" && sharpFlat == "sharp") {
                                document.getElementById("noteLetter").innerHTML = "G<span class=\"superscript\">&sharp;</span>";
                        } else if (valueToDisplay == "G#" && sharpFlat == "flat") {
                                document.getElementById("noteLetter").innerHTML = "A<span class=\"superscript\">&flat;</span>";
                        } else if (valueToDisplay == "A#" && sharpFlat == "sharp") {
                                document.getElementById("noteLetter").innerHTML = "A<span class=\"superscript\">&sharp;</span>";
                        } else if (valueToDisplay == "A#" && sharpFlat == "flat") {
                                document.getElementById("noteLetter").innerHTML = "B<span class=\"superscript\">&flat;</span>";
                        } else if (valueToDisplay == "Blank" || valueToDisplay == "blank") {
                                document.getElementById("noteLetter").innerHTML = "";
                        } else {
                                document.getElementById("noteLetter").innerHTML = valueToDisplay;
                        }


                }

                drawNote();
        }
}


// Must be called on analyser.getFloatTimeDomainData and audioContext.sampleRate
// From https://github.com/cwilso/PitchDetect/pull/23
function autoCorrelate(buffer, sampleRate) {
        // Perform a quick root-mean-square to see if we have enough signal
        var SIZE = buffer.length;
        var sumOfSquares = 0;
        for (var i = 0; i < SIZE; i++) {
                var val = buffer[i];
                sumOfSquares += val * val;
        }
        var rootMeanSquare = Math.sqrt(sumOfSquares / SIZE)
        if (rootMeanSquare < 0.01) {
                return -1;
        }

        // Find a range in the buffer where the values are below a given threshold.
        var r1 = 0;
        var r2 = SIZE - 1;
        var threshold = 0.2;

        // Walk up for r1
        for (var i = 0; i < SIZE / 2; i++) {
                if (Math.abs(buffer[i]) < threshold) {
                        r1 = i;
                        break;
                }
        }

        // Walk down for r2
        for (var i = 1; i < SIZE / 2; i++) {
                if (Math.abs(buffer[SIZE - i]) < threshold) {
                        r2 = SIZE - i;
                        break;
                }
        }

        // Trim the buffer to these ranges and update SIZE.
        buffer = buffer.slice(r1, r2);
        SIZE = buffer.length

        // Create a new array of the sums of offsets to do the autocorrelation
        var c = new Array(SIZE).fill(0);
        // For each potential offset, calculate the sum of each buffer value times its offset value
        for (let i = 0; i < SIZE; i++) {
                for (let j = 0; j < SIZE - i; j++) {
                        c[i] = c[i] + buffer[j] * buffer[j + i]
                }
        }

        // Find the last index where that value is greater than the next one (the dip)
        var d = 0;
        while (c[d] > c[d + 1]) {
                d++;
        }

        // Iterate from that index through the end and find the maximum sum
        var maxValue = -1;
        var maxIndex = -1;
        for (var i = d; i < SIZE; i++) {
                if (c[i] > maxValue) {
                        maxValue = c[i];
                        maxIndex = i;
                }
        }

        var T0 = maxIndex;

        // Not as sure about this part, don't @ me
        // From the original author:
        // interpolation is parabolic interpolation. It helps with precision. We suppose that a parabola pass through the
        // three points that comprise the peak. 'a' and 'b' are the unknowns from the linear equation system and b/(2a) is
        // the "error" in the abscissa. Well x1,x2,x3 should be y1,y2,y3 because they are the ordinates.
        var x1 = c[T0 - 1];
        var x2 = c[T0];
        var x3 = c[T0 + 1]

        var a = (x1 + x3 - 2 * x2) / 2;
        var b = (x3 - x1) / 2
        if (a) {
                T0 = T0 - b / (2 * a);
        }

        return sampleRate / T0;
}

//Notebefore and noteafter help to figure out the distance to the next note, as well as sharp or flat
//Frequency is going to figure the exact cents sharp or flat, and will be used to draw the needle position
//I need a previous needle position, and a new needle position, and I need to smooth into it.
function drawLine(noteBefore, note, noteAfter, frequency) {

        //speed += 1;
        //console.log(speed);
       
     if(frequency == note) {   
        
        document.getElementById("cents").innerHTML = "0";
        

        var x1 = canvas.width * 0.5 + 7;
        var y1 = canvas.height * needlePosition;
        var x2 = canvas.width * .9;
        var y2 = canvas.height * needlePosition + 15;
        var x3 = canvas.width * .9;
        var y3 = canvas.height * needlePosition - 15;

        ctx.beginPath();
      ctx.moveTo(x1, y1); // Move to the first point
      ctx.lineTo(x2, y2); // Draw a line to the second point
      ctx.lineTo(x3, y3); // Draw a line to the third point
      ctx.closePath(); // Close the path to create a triangle

      // Set the stroke and fill style
      ctx.strokeStyle = "white"; // Color of the stroke
      ctx.fillStyle = "rgb(153, 191, 84)"; // Fill color

      // Stroke and fill the triangle
      ctx.stroke();
      ctx.fill();
       
        //if you are playing flat
     } else if(frequency < note) {
        let freqRange = note - noteBefore;
        let centsOff = ((note - frequency) / freqRange) * 100;
        centsOffToString = Math.round(Math.round(centsOff * -10) / 10);
        document.getElementById("cents").innerHTML = centsOffToString;
        let percentDownTuner = centsOff * 2;
        let needlePosition = (percentDownTuner / 100 * .44)+ .5;
       
        

        var x1 = canvas.width * 0.5 + 7;
        var y1 = canvas.height * needlePosition;
        var x2 = canvas.width * .9;
        var y2 = canvas.height * needlePosition + 15;
        var x3 = canvas.width * .9;
        var y3 = canvas.height * needlePosition - 15;

        ctx.beginPath();
      ctx.moveTo(x1, y1); // Move to the first point
      ctx.lineTo(x2, y2); // Draw a line to the second point
      ctx.lineTo(x3, y3); // Draw a line to the third point
      ctx.closePath(); // Close the path to create a triangle

      // Set the stroke and fill style
      ctx.strokeStyle = "white"; // Color of the stroke
      if(centsOff <= 5 && centsOff >= -5) {
        ctx.fillStyle = "rgb(153, 191, 84)";
      }
      else {
      ctx.fillStyle = "rgb(209, 108, 34)"; // Fill color
      }

      // Stroke and fill the triangle
      ctx.stroke();
      ctx.fill();
        
        //if you are playing sharp
     } else {
        let freqRange = noteAfter - note;
        let centsOff = ((frequency - note) / freqRange) * 100;
        document.getElementById("cents").innerHTML = "+" + Math.round(Math.round(centsOff * 10) / 10);
        let percentUpTuner = centsOff * 2;
        let needlePosition = ((100 - percentUpTuner) / 100 * .44) + .06;

        var x1 = canvas.width * 0.5 + 7;
        var y1 = canvas.height * needlePosition;
        var x2 = canvas.width * .9;
        var y2 = canvas.height * needlePosition + 15;
        var x3 = canvas.width * .9;
        var y3 = canvas.height * needlePosition - 15;

        ctx.beginPath();
      ctx.moveTo(x1, y1); // Move to the first point
      ctx.lineTo(x2, y2); // Draw a line to the second point
      ctx.lineTo(x3, y3); // Draw a line to the third point
      ctx.closePath(); // Close the path to create a triangle

      // Set the stroke and fill style
      ctx.strokeStyle = "white"; // Color of the stroke
      if(centsOff <= 5 && centsOff >= -5) {
        ctx.fillStyle = "rgb(153, 191, 84)";
      }
      else {
      ctx.fillStyle = "rgb(209, 108, 34)"; // Fill color
      }

      // Stroke and fill the triangle
      ctx.stroke();
      ctx.fill();
     }
}

function animateNeedle() {

}



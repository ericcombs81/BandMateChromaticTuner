const start = document.getElementById("start");
start.addEventListener('click', getGoing);

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
        var source;
        var audioContext = new AudioContext();
        var analyser = audioContext.createAnalyser();
        analyser.minDecibels = -100;
        analyser.maxDecibels = -10;
        analyser.smoothingTimeConstant = 0.85;


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

                // Thanks to PitchDetect: https://github.com/cwilso/PitchDetect/blob/master/js/pitchdetect.js
                var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
                function noteFromPitch(frequency) {
                        var noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
                        return Math.round(noteNum) + 69;
                }

                var drawNote = function () {
                        drawNoteVisual = requestAnimationFrame(drawNote);
                        var bufferLength = analyser.fftSize;
                        var buffer = new Float32Array(bufferLength);
                        analyser.getFloatTimeDomainData(buffer);
                        var autoCorrelateValue = autoCorrelate(buffer, audioContext.sampleRate)

                        // Handle rounding
                        var valueToDisplay = autoCorrelateValue;



                        if (autoCorrelateValue === -1) {
                                document.getElementById('note').innerText = 'Too quiet...';
                                document.getElementById("staff").innerHTML = "";
                                return;
                        }

                        smoothingThreshold = 5;
                        smoothingCountThreshold = 10;

                        function noteIsSimilarEnough() {
                                // Check threshold for number, or just difference for notes.
                                if (typeof (valueToDisplay) == 'number') {
                                        return Math.abs(valueToDisplay - previousValueToDisplay) < smoothingThreshold;
                                } else {
                                        return valueToDisplay === previousValueToDisplay;
                                }
                        }
                        // Check if this value has been within the given range for n iterations
                        if (noteIsSimilarEnough()) {
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
                        instrument = "flute";
                        sharpFlat = "sharp";

                        if (valueToDisplay < 16.35 - (17.32 - 16.35)) {
                                valueToDisplay = "Too low";
                                document.getElementById("staff").innerHTML = "";
                        }
                        else if (valueToDisplay < 16.35 + (17.32 - 16.35) / 2 && valueToDisplay > 16.35 - (17.32 - 16.35) / 2) { valueToDisplay = "C 0"; }
                        else if (valueToDisplay < 17.32 + (18.35 - 17.32) / 2 && valueToDisplay > 17.32 - (17.32 - 16.35) / 2) { valueToDisplay = "C# 0"; }
                        else if (valueToDisplay < 18.35 + (19.45 - 18.35) / 2 && valueToDisplay > 18.35 - (18.35 - 17.32) / 2) { valueToDisplay = "D 0"; }
                        else if (valueToDisplay < 19.45 + (20.60 - 19.45) / 2 && valueToDisplay > 19.45 - (19.45 - 18.35) / 2) { valueToDisplay = "D# 0"; }
                        else if (valueToDisplay < 20.60 + (21.83 - 20.60) / 2 && valueToDisplay > 20.60 - (20.60 - 19.45) / 2) { valueToDisplay = "E 0"; }
                        else if (valueToDisplay < 21.83 + (23.12 - 21.83) / 2 && valueToDisplay > 21.83 - (21.83 - 20.60) / 2) { valueToDisplay = "F 0"; }
                        else if (valueToDisplay < 23.12 + (24.50 - 23.12) / 2 && valueToDisplay > 23.12 - (23.12 - 21.83) / 2) { valueToDisplay = "F# 0"; }
                        else if (valueToDisplay < 24.50 + (25.96 - 24.50) / 2 && valueToDisplay > 24.50 - (24.50 - 23.12) / 2) { valueToDisplay = "G 0"; }
                        else if (valueToDisplay < 25.96 + (27.50 - 25.96) / 2 && valueToDisplay > 25.96 - (25.96 - 24.50) / 2) { valueToDisplay = "G# 0"; }
                        else if (valueToDisplay < 27.50 + (29.14 - 27.50) / 2 && valueToDisplay > 27.50 - (27.50 - 25.96) / 2) { valueToDisplay = "A 0"; }
                        else if (valueToDisplay < 29.14 + (30.87 - 29.14) / 2 && valueToDisplay > 29.14 - (29.14 - 27.50) / 2) { valueToDisplay = "A# 0"; }
                        else if (valueToDisplay < 30.87 + (32.70 - 30.87) / 2 && valueToDisplay > 30.87 - (30.87 - 29.14) / 2) { valueToDisplay = "B 0"; }
                        else if (valueToDisplay < 32.70 + (34.65 - 32.70) / 2 && valueToDisplay > 32.70 - (32.70 - 30.87) / 2) { valueToDisplay = "C 1"; }
                        else if (valueToDisplay < 34.65 + (36.71 - 34.65) / 2 && valueToDisplay > 34.65 - (34.65 - 32.70) / 2) { valueToDisplay = "C# 1"; }
                        else if (valueToDisplay < 36.71 + (38.89 - 36.71) / 2 && valueToDisplay > 36.71 - (36.71 - 34.65) / 2) { valueToDisplay = "D 1"; }
                        else if (valueToDisplay < 38.89 + (41.20 - 38.89) / 2 && valueToDisplay > 38.89 - (38.89 - 36.71) / 2) { valueToDisplay = "D# 1"; }
                        else if (valueToDisplay < 41.20 + (43.65 - 41.20) / 2 && valueToDisplay > 41.20 - (41.20 - 38.89) / 2) { valueToDisplay = "E 1"; }
                        else if (valueToDisplay < 43.65 + (46.25 - 43.65) / 2 && valueToDisplay > 43.65 - (43.65 - 41.20) / 2) { valueToDisplay = "F 1"; }
                        else if (valueToDisplay < 46.25 + (49.00 - 46.25) / 2 && valueToDisplay > 46.25 - (46.25 - 43.65) / 2) { valueToDisplay = "F# 1"; }
                        else if (valueToDisplay < 49.00 + (51.91 - 49.00) / 2 && valueToDisplay > 49.00 - (49.00 - 46.25) / 2) { valueToDisplay = "G 1"; }
                        else if (valueToDisplay < 51.91 + (55.00 - 51.91) / 2 && valueToDisplay > 51.91 - (51.91 - 49.00) / 2) { valueToDisplay = "G# 1"; }
                        else if (valueToDisplay < 55.00 + (58.27 - 55.00) / 2 && valueToDisplay > 55.00 - (55.00 - 51.91) / 2) { valueToDisplay = "A 1"; }
                        else if (valueToDisplay < 58.27 + (61.74 - 58.27) / 2 && valueToDisplay > 58.27 - (58.27 - 55.00) / 2) { valueToDisplay = "A# 1"; }
                        else if (valueToDisplay < 61.74 + (65.41 - 61.74) / 2 && valueToDisplay > 61.74 - (61.74 - 58.27) / 2) { valueToDisplay = "B 1"; }
                        else if (valueToDisplay < 65.41 + (69.30 - 65.41) / 2 && valueToDisplay > 65.41 - (65.41 - 61.74) / 2) { valueToDisplay = "C 2"; }
                        else if (valueToDisplay < 69.30 + (73.42 - 69.30) / 2 && valueToDisplay > 69.30 - (69.30 - 65.41) / 2) { valueToDisplay = "C# 2"; }
                        else if (valueToDisplay < 73.42 + (77.78 - 73.42) / 2 && valueToDisplay > 73.42 - (73.42 - 69.30) / 2) { valueToDisplay = "D 2"; }
                        else if (valueToDisplay < 77.78 + (82.41 - 77.78) / 2 && valueToDisplay > 77.78 - (77.78 - 73.42) / 2) { valueToDisplay = "D# 2"; }
                        else if (valueToDisplay < 82.41 + (87.31 - 82.41) / 2 && valueToDisplay > 82.41 - (82.41 - 77.78) / 2) { valueToDisplay = "E 2"; }
                        else if (valueToDisplay < 87.31 + (92.50 - 87.31) / 2 && valueToDisplay > 87.31 - (87.31 - 82.41) / 2) { valueToDisplay = "F 2"; }
                        else if (valueToDisplay < 92.50 + (98.00 - 92.50) / 2 && valueToDisplay > 92.50 - (92.50 - 87.31) / 2) { valueToDisplay = "F# 2"; }
                        else if (valueToDisplay < 98.00 + (103.83 - 98.00) / 2 && valueToDisplay > 98.00 - (98.00 - 92.50) / 2) { valueToDisplay = "G 2"; }
                        else if (valueToDisplay < 103.83 + (110.00 - 103.83) / 2 && valueToDisplay > 103.83 - (103.83 - 98.00) / 2) { valueToDisplay = "G# 2"; }
                        else if (valueToDisplay < 110.00 + (116.54 - 110.00) / 2 && valueToDisplay > 110.00 - (110.00 - 103.83) / 2) { valueToDisplay = "A 2"; }
                        else if (valueToDisplay < 116.54 + (123.47 - 116.54) / 2 && valueToDisplay > 116.54 - (116.54 - 110.00) / 2) { valueToDisplay = "A# 2"; }
                        else if (valueToDisplay < 123.47 + (130.81 - 123.47) / 2 && valueToDisplay > 123.47 - (123.47 - 116.54) / 2) { valueToDisplay = "B 2"; }
                        else if (valueToDisplay < 130.81 + (138.59 - 130.81) / 2 && valueToDisplay > 130.81 - (130.81 - 123.47) / 2) { valueToDisplay = "C 3"; 
                        if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {
                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-d-n-3.png'>";
                        }
                }
                        else if (valueToDisplay < 138.59 + (146.83 - 138.59) / 2 && valueToDisplay > 138.59 - (138.59 - 130.81) / 2) { valueToDisplay = "C# 3"; 
                        if(sharpFlat == "sharp") {
                                if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-d-n-3.png'>";
                                }
                        } else {
                                if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-d-n-3.png'>";
                                }
                        }
                }
                        else if (valueToDisplay < 146.83 + (155.56 - 146.83) / 2 && valueToDisplay > 146.83 - (146.83 - 138.59) / 2) {
                                valueToDisplay = "D 3";
                                if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-d-n-3.png'>";
                                }
                                else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                }
                                else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                }
                                else if (instrument == "Alto Sax") {

                                }
                                else if (instrument == "Bari Sax") {

                                }
                                else if (instrument == "Horn") {

                                }
                                else if (instrument == "Guitar") {

                                }
                                else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                }
                                else if (instrument == "viola") {

                                }
                        }
                        else if (valueToDisplay < 155.56 + (164.81 - 155.56) / 2 && valueToDisplay > 155.56 - (155.56 - 146.83) / 2) {
                                valueToDisplay = "D# 3";
                                if (sharpFlat == "sharp") {

                                        if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-eb-s-3.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }

                                } else {
                                        if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-eb-f-3.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }
                                }
                        }
                        else if (valueToDisplay < 164.81 + (174.61 - 164.81) / 2 && valueToDisplay > 164.81 - (164.81 - 155.56) / 2) {
                                valueToDisplay = "E 3";

                                if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-e-n-3.png'>";
                                }
                                else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                }
                                else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                }
                                else if (instrument == "Alto Sax") {

                                }
                                else if (instrument == "Bari Sax") {

                                }
                                else if (instrument == "Horn") {

                                }
                                else if (instrument == "Guitar") {

                                }
                                else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                }
                                else if (instrument == "viola") {

                                }
                        }

                        else if (valueToDisplay < 174.61 + (185.00 - 174.61) / 2 && valueToDisplay > 174.61 - (174.61 - 164.81) / 2) {
                                valueToDisplay = "F 3";



                                if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-F-n-3.png'>";
                                }
                                else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                }
                                else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                }
                                else if (instrument == "Alto Sax") {

                                }
                                else if (instrument == "Bari Sax") {

                                }
                                else if (instrument == "Horn") {

                                }
                                else if (instrument == "Guitar") {

                                }
                                else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                }
                                else if (instrument == "viola") {

                                }

                        }

                        else if (valueToDisplay < 185.00 + (196.00 - 185.00) / 2 && valueToDisplay > 185.00 - (185.00 - 174.61) / 2) {
                                valueToDisplay = "F# 3";

                                if (sharpFlat == "sharp") {

                                        if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-gb-s-3.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }

                                } else {
                                        if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-gb-f-3.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }
                                }
                        }
                        else if (valueToDisplay < 196.00 + (207.65 - 196.00) / 2 && valueToDisplay > 196.00 - (196.00 - 185.00) / 2) {
                                valueToDisplay = "G 3";

                                if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-g-n-3.png'>";
                                }
                                else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                }
                                else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                }
                                else if (instrument == "Alto Sax") {

                                }
                                else if (instrument == "Bari Sax") {

                                }
                                else if (instrument == "Horn") {

                                }
                                else if (instrument == "Guitar") {

                                }
                                else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                }
                                else if (instrument == "viola") {

                                }

                        }
                        else if (valueToDisplay < 207.65 + (220.00 - 207.65) / 2 && valueToDisplay > 207.65 - (207.65 - 196.00) / 2) {
                                valueToDisplay = "G# 3";

                                if (sharpFlat == "sharp") {

                                        if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-ab-s-3.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }

                                } else {
                                        if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-af-f-3.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }
                                }
                        }
                        else if (valueToDisplay < 220.00 + (233.08 - 220.00) / 2 && valueToDisplay > 220.00 - (220.00 - 207.65) / 2) {
                                valueToDisplay = "A 3";

                                if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-a-n-3.png'>";
                                }
                                else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                }
                                else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                }
                                else if (instrument == "Alto Sax") {

                                }
                                else if (instrument == "Bari Sax") {

                                }
                                else if (instrument == "Horn") {

                                }
                                else if (instrument == "Guitar") {

                                }
                                else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                }
                                else if (instrument == "viola") {

                                }

                        }
                        else if (valueToDisplay < 233.08 + (246.94 - 233.08) / 2 && valueToDisplay > 233.08 - (233.08 - 220.00) / 2) {
                                valueToDisplay = "A# 3";

                                if (sharpFlat == "sharp") {

                                        if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-bb-s-3.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }

                                } else {
                                        if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-bb-f-3.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }
                                }
                        }
                        else if (valueToDisplay < 246.94 + (261.63 - 246.94) / 2 && valueToDisplay > 246.94 - (246.94 - 233.08) / 2) {
                                valueToDisplay = "B 3";

                                if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-b-n-3.png'>";
                                }
                                else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                }
                                else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                }
                                else if (instrument == "Alto Sax") {

                                }
                                else if (instrument == "Bari Sax") {

                                }
                                else if (instrument == "Horn") {

                                }
                                else if (instrument == "Guitar") {

                                }
                                else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                }
                                else if (instrument == "viola") {

                                }

                        }
                        else if (valueToDisplay < 261.63 + (277.18 - 261.63) / 2 && valueToDisplay > 261.63 - (261.63 - 246.94) / 2) {
                                valueToDisplay = "C 4";

                                if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-c-n-4.png'>";
                                }
                                else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                }
                                else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                }
                                else if (instrument == "Alto Sax") {

                                }
                                else if (instrument == "Bari Sax") {

                                }
                                else if (instrument == "Horn") {

                                }
                                else if (instrument == "Guitar") {

                                }
                                else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                }
                                else if (instrument == "viola") {

                                }

                        }
                        else if (valueToDisplay < 277.18 + (293.66 - 277.18) / 2 && valueToDisplay > 277.18 - (277.18 - 261.63) / 2) {
                                valueToDisplay = "C# 4";

                                if (sharpFlat == "sharp") {

                                        if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-db-s-4.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }

                                } else {
                                        if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-db-f-4.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }
                                }
                        }
                        else if (valueToDisplay < 293.66 + (311.13 - 293.66) / 2 && valueToDisplay > 293.66 - (293.66 - 277.18) / 2) {
                                valueToDisplay = "D 4";

                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-d-n-3.png'>";
                                }
                                else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-d-n-4.png'>";
                                }
                                else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                }
                                else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                }
                                else if (instrument == "Alto Sax") {

                                }
                                else if (instrument == "Bari Sax") {

                                }
                                else if (instrument == "Horn") {

                                }
                                else if (instrument == "Guitar") {

                                }
                                else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                }
                                else if (instrument == "viola") {

                                }

                        }
                        else if (valueToDisplay < 311.13 + (329.63 - 311.13) / 2 && valueToDisplay > 311.13 - (311.13 - 293.66) / 2) {
                                valueToDisplay = "D# 4";

                                if (sharpFlat == "sharp") {

                                        if (instrument == "Piccolo" || instrument == "Bells") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-eb-s-3.png'>";
                                        }
                                        else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-eb-s-4.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }

                                } else {
                                        if (instrument == "Piccolo" || instrument == "Bells") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-eb-f-3.png'>";
                                        }
                                        else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-eb-f-4.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }
                                }
                        }
                        else if (valueToDisplay < 329.63 + (349.23 - 329.63) / 2 && valueToDisplay > 329.63 - (329.63 - 311.13) / 2) {
                                valueToDisplay = "E 4";

                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-e-n-3.png'>";
                                }
                                else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-e-n-4.png'>";
                                }
                                else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                }
                                else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                }
                                else if (instrument == "Alto Sax") {

                                }
                                else if (instrument == "Bari Sax") {

                                }
                                else if (instrument == "Horn") {

                                }
                                else if (instrument == "Guitar") {

                                }
                                else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                }
                                else if (instrument == "viola") {

                                }

                        }
                        else if (valueToDisplay < 349.23 + (369.99 - 349.23) / 2 && valueToDisplay > 349.23 - (349.23 - 329.63) / 2) {
                                valueToDisplay = "F 4";

                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-f-n-3.png'>";
                                }
                                else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-f-n-4.png'>";
                                }
                                else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                }
                                else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                }
                                else if (instrument == "Alto Sax") {

                                }
                                else if (instrument == "Bari Sax") {

                                }
                                else if (instrument == "Horn") {

                                }
                                else if (instrument == "Guitar") {

                                }
                                else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                }
                                else if (instrument == "viola") {

                                }

                        }
                        else if (valueToDisplay < 369.99 + (392.00 - 369.99) / 2 && valueToDisplay > 369.99 - (369.99 - 349.23) / 2) {
                                valueToDisplay = "F# 4";

                                if (sharpFlat == "sharp") {

                                        if (instrument == "Piccolo" || instrument == "Bells") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-gb-s-3.png'>";
                                        }
                                        else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-gb-s-4.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }

                                } else {
                                        if (instrument == "Piccolo" || instrument == "Bells") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-gb-b-3.png'>";
                                        }
                                        else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-gb-b-4.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }
                                }
                        }
                        else if (valueToDisplay < 392.00 + (415.30 - 392.00) / 2 && valueToDisplay > 392.00 - (392.00 - 369.99) / 2) {
                                valueToDisplay = "G 4";

                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-g-n-3.png'>";
                                }
                                else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-g-n-4.png'>";
                                }
                                else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                }
                                else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                }
                                else if (instrument == "Alto Sax") {

                                }
                                else if (instrument == "Bari Sax") {

                                }
                                else if (instrument == "Horn") {

                                }
                                else if (instrument == "Guitar") {

                                }
                                else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                }
                                else if (instrument == "viola") {

                                }

                        }
                        else if (valueToDisplay < 415.30 + (440.00 - 415.30) / 2 && valueToDisplay > 415.30 - (415.30 - 392.00) / 2) {
                                valueToDisplay = "G# 4";

                                if (sharpFlat == "sharp") {

                                        if (instrument == "Piccolo" || instrument == "Bells") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-ab-s-3.png'>";
                                        }
                                        else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-ab-s-4.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }

                                } else {
                                        if (instrument == "Piccolo" || instrument == "Bells") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-ab-b-3.png'>";
                                        }
                                        else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-ab-b-4.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }
                                }
                        }
                        else if (valueToDisplay < 440.00 + (466.16 - 440.00) / 2 && valueToDisplay > 440.00 - (440.00 - 415.30) / 2) {
                                valueToDisplay = "A 4";

                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-a-n-3.png'>";
                                }
                                else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-a-n-4.png'>";
                                }
                                else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                }
                                else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                }
                                else if (instrument == "Alto Sax") {

                                }
                                else if (instrument == "Bari Sax") {

                                }
                                else if (instrument == "Horn") {

                                }
                                else if (instrument == "Guitar") {

                                }
                                else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                }
                                else if (instrument == "viola") {

                                }

                        }
                        else if (valueToDisplay < 466.16 + (493.88 - 466.16) / 2 && valueToDisplay > 466.16 - (466.16 - 440.00) / 2) {
                                valueToDisplay = "A# 4";

                                if (sharpFlat == "sharp") {

                                        if (instrument == "Piccolo" || instrument == "Bells") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-bb-s-3.png'>";
                                        }
                                        else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-bb-s-4.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }

                                } else {
                                        if (instrument == "Piccolo" || instrument == "Bells") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-bb-f-3.png'>";
                                        }
                                        else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-bb-f-4.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }
                                }
                        }
                        else if (valueToDisplay < 493.88 + (523.25 - 493.88) / 2 && valueToDisplay > 493.88 - (493.88 - 466.16) / 2) {
                                valueToDisplay = "B 4";

                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-b-n-3.png'>";
                                }
                                else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-b-n-4.png'>";
                                }
                                else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                }
                                else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                }
                                else if (instrument == "Alto Sax") {

                                }
                                else if (instrument == "Bari Sax") {

                                }
                                else if (instrument == "Horn") {

                                }
                                else if (instrument == "Guitar") {

                                }
                                else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                }
                                else if (instrument == "viola") {

                                }

                        }
                        else if (valueToDisplay < 523.25 + (554.37 - 523.25) / 2 && valueToDisplay > 523.25 - (523.25 - 493.88) / 2) {
                                valueToDisplay = "C 5";

                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-c-n-4.png'>";
                                }
                                else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-c-n-5.png'>";
                                }
                                else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                }
                                else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                }
                                else if (instrument == "Alto Sax") {

                                }
                                else if (instrument == "Bari Sax") {

                                }
                                else if (instrument == "Horn") {

                                }
                                else if (instrument == "Guitar") {

                                }
                                else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                }
                                else if (instrument == "viola") {

                                }

                        }
                        else if (valueToDisplay < 554.37 + (587.33 - 554.37) / 2 && valueToDisplay > 554.37 - (554.37 - 523.25) / 2) {
                                valueToDisplay = "C# 5";

                                if (sharpFlat == "sharp") {

                                        if (instrument == "Piccolo" || instrument == "Bells") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-db-s-4.png'>";
                                        }
                                        else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-db-s-5.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }

                                } else {
                                        if (instrument == "Piccolo" || instrument == "Bells") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-db-f-4.png'>";
                                        }
                                        else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-db-f-5.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }
                                }
                        }
                        else if (valueToDisplay < 587.33 + (622.25 - 587.33) / 2 && valueToDisplay > 587.33 - (587.33 - 554.37) / 2) {
                                valueToDisplay = "D 5";

                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-d-n-4.png'>";
                                }
                                else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-d-n-5.png'>";
                                }
                                else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                }
                                else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                }
                                else if (instrument == "Alto Sax") {

                                }
                                else if (instrument == "Bari Sax") {

                                }
                                else if (instrument == "Horn") {

                                }
                                else if (instrument == "Guitar") {

                                }
                                else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                }
                                else if (instrument == "viola") {

                                }

                        }
                        else if (valueToDisplay < 622.25 + (659.25 - 622.25) / 2 && valueToDisplay > 622.25 - (622.25 - 587.33) / 2) {
                                valueToDisplay = "D# 5";

                                if (sharpFlat == "sharp") {

                                        if (instrument == "Piccolo" || instrument == "Bells") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-eb-s-4.png'>";
                                        }
                                        else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-eb-s-5.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }

                                } else {
                                        if (instrument == "Piccolo" || instrument == "Bells") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-eb-b-4.png'>";
                                        }
                                        else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-eb-b-5.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }
                                }
                        }
                        else if (valueToDisplay < 659.25 + (698.46 - 659.25) / 2 && valueToDisplay > 659.25 - (659.25 - 622.25) / 2) {
                                valueToDisplay = "E 5";

                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-e-n-4.png'>";
                                }
                                else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-e-n-5.png'>";
                                }
                                else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                }
                                else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                }
                                else if (instrument == "Alto Sax") {

                                }
                                else if (instrument == "Bari Sax") {

                                }
                                else if (instrument == "Horn") {

                                }
                                else if (instrument == "Guitar") {

                                }
                                else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                }
                                else if (instrument == "viola") {

                                }

                        }
                        else if (valueToDisplay < 698.46 + (739.99 - 698.46) / 2 && valueToDisplay > 698.46 - (698.46 - 659.25) / 2) {
                                valueToDisplay = "F 5";

                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-f-n-4.png'>";
                                }
                                else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-f-n-5.png'>";
                                }
                                else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                }
                                else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                }
                                else if (instrument == "Alto Sax") {

                                }
                                else if (instrument == "Bari Sax") {

                                }
                                else if (instrument == "Horn") {

                                }
                                else if (instrument == "Guitar") {

                                }
                                else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                }
                                else if (instrument == "viola") {

                                }

                        }
                        else if (valueToDisplay < 739.99 + (783.99 - 739.99) / 2 && valueToDisplay > 739.99 - (739.99 - 698.46) / 2) {
                                valueToDisplay = "F# 5";

                                if (sharpFlat == "sharp") {

                                        if (instrument == "Piccolo" || instrument == "Bells") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-gb-s-4.png'>";
                                        }
                                        else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-gb-s-5.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }

                                } else {
                                        if (instrument == "Piccolo" || instrument == "Bells") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-gb-b-4.png'>";
                                        }
                                        else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-gb-b-5.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }
                                }
                        }
                        else if (valueToDisplay < 783.99 + (830.61 - 783.99) / 2 && valueToDisplay > 783.99 - (783.99 - 739.99) / 2) {
                                valueToDisplay = "G 5";

                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-g-n-4.png'>";
                                }
                                else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-g-n-5.png'>";
                                }
                                else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                }
                                else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                }
                                else if (instrument == "Alto Sax") {

                                }
                                else if (instrument == "Bari Sax") {

                                }
                                else if (instrument == "Horn") {

                                }
                                else if (instrument == "Guitar") {

                                }
                                else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                }
                                else if (instrument == "viola") {

                                }

                        }
                        else if (valueToDisplay < 830.61 + (880.00 - 830.61) / 2 && valueToDisplay > 830.61 - (830.61 - 783.99) / 2) {
                                valueToDisplay = "G# 5";

                                if (sharpFlat == "sharp") {

                                        if (instrument == "Piccolo" || instrument == "Bells") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-ab-s-4.png'>";
                                        }
                                        else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-ab-s-5.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }

                                } else {
                                        if (instrument == "Piccolo" || instrument == "Bells") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-ab-f-4.png'>";
                                        }
                                        else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-ab-f-5.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }
                                }
                        }
                        else if (valueToDisplay < 880.00 + (932.23 - 880.00) / 2 && valueToDisplay > 880.00 - (880.00 - 830.61) / 2) {
                                valueToDisplay = "A 5";

                                if (sharpFlat == "sharp") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-a-n-4.png'>";
                                }
                                else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-a-n-5.png'>";
                                }
                                else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                }
                                else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                }
                                else if (instrument == "Alto Sax") {

                                }
                                else if (instrument == "Bari Sax") {

                                }
                                else if (instrument == "Horn") {

                                }
                                else if (instrument == "Guitar") {

                                }
                                else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                }
                                else if (instrument == "viola") {

                                }

                        }
                        else if (valueToDisplay < 932.33 + (987.77 - 932.33) / 2 && valueToDisplay > 932.33 - (932.33 - 880.00) / 2) {
                                valueToDisplay = "A# 5";

                                if (sharpFlat == "sharp") {

                                        if (instrument == "Piccolo" || instrument == "Bells") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-bb-s-4.png'>";
                                        }
                                        else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-bb-s-5.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }

                                } else {
                                        if (instrument == "Piccolo" || instrument == "Bells") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-bb-f-4.png'>";
                                        }
                                        else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-bb-f-5.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }
                                }
                        }
                        else if (valueToDisplay < 987.77 + (1046.50 - 987.77) / 2 && valueToDisplay > 987.77 - (987.77 - 932.33) / 2) {
                                valueToDisplay = "B 5";

                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-b-n-4.png'>";
                                }
                                else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-b-n-5.png'>";
                                }
                                else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                }
                                else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                }
                                else if (instrument == "Alto Sax") {

                                }
                                else if (instrument == "Bari Sax") {

                                }
                                else if (instrument == "Horn") {

                                }
                                else if (instrument == "Guitar") {

                                }
                                else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                }
                                else if (instrument == "viola") {

                                }

                        }
                        else if (valueToDisplay < 1046.50 + (1108.73 - 1046.50) / 2 && valueToDisplay > 1046.50 - (1046.50 - 987.77) / 2) {
                                valueToDisplay = "C 6";

                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-c-n-5.png'>";
                                }
                                else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-c-n-6.png'>";
                                }
                                else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                }
                                else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                }
                                else if (instrument == "Alto Sax") {

                                }
                                else if (instrument == "Bari Sax") {

                                }
                                else if (instrument == "Horn") {

                                }
                                else if (instrument == "Guitar") {

                                }
                                else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                }
                                else if (instrument == "viola") {

                                }

                        }
                        else if (valueToDisplay < 1108.73 + (1174.66 - 1108.73) / 2 && valueToDisplay > 1108.73 - (1108.73 - 1046.50) / 2) {
                                valueToDisplay = "C# 6";

                                if (sharpFlat == "sharp") {

                                        if (instrument == "Piccolo" || instrument == "Bells") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-db-s-5.png'>";
                                        }
                                        else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-db-s-6.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }

                                } else {
                                        if (instrument == "Piccolo" || instrument == "Bells") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-db-b-5.png'>";
                                        }
                                        else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-db-b-6.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }
                                }
                        }
                        else if (valueToDisplay < 1174.66 + (1244.51 - 1174.66) / 2 && valueToDisplay > 1174.66 - (1174.66 - 1108.73) / 2) {
                                valueToDisplay = "D 6";

                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-d-n-5.png'>";
                                }
                                else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-d-n-6.png'>";
                                }
                                else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                }
                                else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                }
                                else if (instrument == "Alto Sax") {

                                }
                                else if (instrument == "Bari Sax") {

                                }
                                else if (instrument == "Horn") {

                                }
                                else if (instrument == "Guitar") {

                                }
                                else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                }
                                else if (instrument == "viola") {

                                }

                        }
                        else if (valueToDisplay < 1244.51 + (1318.51 - 1244.51) / 2 && valueToDisplay > 1244.51 - (1244.51 - 1174.66) / 2) {
                                valueToDisplay = "D# 6";

                                if (sharpFlat == "sharp") {

                                        if (instrument == "Piccolo" || instrument == "Bells") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-eb-s-5.png'>";
                                        }
                                        else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-eb-s-6.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }

                                } else {
                                        if (instrument == "Piccolo" || instrument == "Bells") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-eb-f-5.png'>";
                                        }
                                        else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-eb-f-6.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }
                                }
                        }
                        else if (valueToDisplay < 1318.51 + (1396.91 - 1318.51) / 2 && valueToDisplay > 1318.51 - (1318.51 - 1244.51) / 2) {
                                valueToDisplay = "E 6";

                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-e-n-5.png'>";
                                }
                                else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-e-n-6.png'>";
                                }
                                else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                }
                                else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                }
                                else if (instrument == "Alto Sax") {

                                }
                                else if (instrument == "Bari Sax") {

                                }
                                else if (instrument == "Horn") {

                                }
                                else if (instrument == "Guitar") {

                                }
                                else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                }
                                else if (instrument == "viola") {

                                }

                        }
                        else if (valueToDisplay < 1396.91 + (1479.98 - 1396.91) / 2 && valueToDisplay > 1396.91 - (1396.91 - 1318.51) / 2) {
                                valueToDisplay = "F 6";

                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-f-n-5.png'>";
                                }
                                else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-f-n-6.png'>";
                                }
                                else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                }
                                else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                }
                                else if (instrument == "Alto Sax") {

                                }
                                else if (instrument == "Bari Sax") {

                                }
                                else if (instrument == "Horn") {

                                }
                                else if (instrument == "Guitar") {

                                }
                                else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                }
                                else if (instrument == "viola") {

                                }

                        }
                        else if (valueToDisplay < 1479.98 + (1567.98 - 1479.98) / 2 && valueToDisplay > 1479.98 - (1479.98 - 1396.91) / 2) {
                                valueToDisplay = "F# 6";

                                if (sharpFlat == "sharp") {

                                        if (instrument == "Piccolo" || instrument == "Bells") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-gb-s-5.png'>";
                                        }
                                        else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-gb-s-6.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }

                                } else {
                                        if (instrument == "Piccolo" || instrument == "Bells") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-gb-b-5.png'>";
                                        }
                                        else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-gb-b-6.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }
                                }
                        }
                        else if (valueToDisplay < 1567.98 + (1661.22 - 1567.98) / 2 && valueToDisplay > 1567.98 - (1567.98 - 1479.98) / 2) {
                                valueToDisplay = "G 6";

                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-g-n-5.png'>";
                                }
                                else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-g-n-6.png'>";
                                }
                                else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                }
                                else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                }
                                else if (instrument == "Alto Sax") {

                                }
                                else if (instrument == "Bari Sax") {

                                }
                                else if (instrument == "Horn") {

                                }
                                else if (instrument == "Guitar") {

                                }
                                else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                }
                                else if (instrument == "viola") {

                                }

                        }
                        else if (valueToDisplay < 1661.22 + (1760.00 - 1661.22) / 2 && valueToDisplay > 1661.22 - (1661.22 - 1567.98) / 2) {
                                valueToDisplay = "G# 6";

                                if (sharpFlat == "sharp") {

                                        if (instrument == "Piccolo" || instrument == "Bells") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-ab-s-5.png'>";
                                        }
                                        else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-ab-s-6.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }

                                } else {
                                        if (instrument == "Piccolo" || instrument == "Bells") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-ab-b-5.png'>";
                                        }
                                        else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-ab-b-6.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }
                                }
                        }
                        else if (valueToDisplay < 1760.00 + (1864.66 - 1760.00) / 2 && valueToDisplay > 1760.00 - (1760.00 - 1661.22) / 2) {
                                valueToDisplay = "A 6";
                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-a-n-5.png'>";
                                }
                                else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-a-n-6.png'>";
                                }
                                else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                }
                                else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                }
                                else if (instrument == "Alto Sax") {

                                }
                                else if (instrument == "Bari Sax") {

                                }
                                else if (instrument == "Horn") {

                                }
                                else if (instrument == "Guitar") {

                                }
                                else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                }
                                else if (instrument == "viola") {

                                }

                        }
                        else if (valueToDisplay < 1864.66 + (1975.53 - 1864.66) / 2 && valueToDisplay > 1864.66 - (1864.66 - 1760.00) / 2) {
                                valueToDisplay = "A# 6";
                                if (sharpFlat == "sharp") {

                                        if (instrument == "Piccolo" || instrument == "Bells") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-bb-b-5.png'>";
                                        }
                                        else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-bb-b-6.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }

                                } else {
                                        if (instrument == "Piccolo" || instrument == "Bells") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-bb-s-5.png'>";
                                        }
                                        else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-bb-s-6.png'>";
                                        }
                                        else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                        }
                                        else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                        }
                                        else if (instrument == "Alto Sax") {

                                        }
                                        else if (instrument == "Bari Sax") {

                                        }
                                        else if (instrument == "Horn") {

                                        }
                                        else if (instrument == "Guitar") {

                                        }
                                        else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                        }
                                        else if (instrument == "viola") {

                                        }
                                }
                        }
                        else if (valueToDisplay < 1975.53 + (2093.00 - 1975.53) / 2 && valueToDisplay > 1975.53 - (1975.53 - 1864.66) / 2) {
                                valueToDisplay = "B 6";
                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-b-n-5.png'>";
                                }
                                else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-b-n-6.png'>";
                                }
                                else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                }
                                else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                }
                                else if (instrument == "Alto Sax") {

                                }
                                else if (instrument == "Bari Sax") {

                                }
                                else if (instrument == "Horn") {

                                }
                                else if (instrument == "Guitar") {

                                }
                                else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                }
                                else if (instrument == "viola") {

                                }

                        }
                        else if (valueToDisplay < 2093.00 + (2217.46 - 2093.00) / 2 && valueToDisplay > 2093.00 - (2093.00 - 1975.53) / 2) {
                                valueToDisplay = "C 7";
                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-c-n-6.png'>";
                                }
                                else if (instrument == "Recorder" || instrument == "Ukulele" || instrument == "Flute" || instument == "Oboe" || instrument == "Violin" || instrument == "Recorder" || instrument == "Voice TC") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-c-n-7.png'>";
                                }
                                else if (instrument == "Clarinet" || instrument == "Trumpet" || instrument == "Cornet" || instrument == "Soprano Sax") {

                                }
                                else if (instrument == "Bass Clarinet" || instrument == "Tenor Sax" || instrument == "Baritone TC" || instrument == "Euphonium TC") {

                                }
                                else if (instrument == "Alto Sax") {

                                }
                                else if (instrument == "Bari Sax") {

                                }
                                else if (instrument == "Horn") {

                                }
                                else if (instrument == "Guitar") {

                                }
                                else if (instrument == "Baritone BC" || instrument == "Euphonium BC" || instrument == "Trombone" || instrument == "Bass" || instrument == "Bassoon" || instrument == "Voice BC" || instrument == "Cello" || instrument == "Tuba") {

                                }
                                else if (instrument == "viola") {

                                }

                        }
                        else if (valueToDisplay < 2217.46 + (2349.32 - 2217.46) / 2 && valueToDisplay > 2217.46 - (2217.46 - 2093.00) / 2) { valueToDisplay = "C# 7"; 
                        if(sharpFlat == sharp) {
                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-db-s-6.png'>";
                                }
                        }
                        else {
                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-db-f-6.png'>";
                                }
                        }
                }
                        else if (valueToDisplay < 2349.32 + (2489.02 - 2349.32) / 2 && valueToDisplay > 2349.32 - (2349.32 - 2217.46) / 2) { valueToDisplay = "D 7"; 
                        if (instrument == "Piccolo" || instrument == "Bells") {
                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-d-n-6.png'>";
                        }
                }
                        else if (valueToDisplay < 2489.02 + (2637.02 - 2489.02) / 2 && valueToDisplay > 2489.02 - (2489.02 - 2349.32) / 2) { valueToDisplay = "D# 7"; 
                        if(sharpFlat == sharp) {
                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-eb-s-6.png'>";
                                }
                        }
                        else {
                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-eb-f-6.png'>";
                                }
                        }
                }
                        else if (valueToDisplay < 2637.02 + (2793.83 - 2637.02) / 2 && valueToDisplay > 2637.02 - (2637.02 - 2489.02) / 2) { valueToDisplay = "E 7"; 
                        if (instrument == "Piccolo" || instrument == "Bells") {
                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-e-n-6.png'>";
                        }
                }
                        else if (valueToDisplay < 2793.83 + (2959.96 - 2793.83) / 2 && valueToDisplay > 2793.83 - (2793.83 - 2637.02) / 2) { valueToDisplay = "F 7"; 
                        if (instrument == "Piccolo" || instrument == "Bells") {
                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-f-n-6.png'>";
                        }
                }
                        else if (valueToDisplay < 2959.96 + (3135.96 - 2959.96) / 2 && valueToDisplay > 2959.96 - (2959.96 - 2793.83) / 2) { valueToDisplay = "F# 7"; 
                        if(sharpFlat == sharp) {
                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-gb-s-6.png'>";
                                }
                        }
                        else {
                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-gb-f-6.png'>";
                                }
                        }
                }
                        else if (valueToDisplay < 3135.96 + (3322.44 - 3135.96) / 2 && valueToDisplay > 3135.96 - (3135.96 - 2959.96) / 2) { valueToDisplay = "G 7"; 
                        if (instrument == "Piccolo" || instrument == "Bells") {
                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-g-n-6.png'>";
                        }
                }
                        else if (valueToDisplay < 3322.44 + (3520.00 - 3322.44) / 2 && valueToDisplay > 3322.44 - (3322.44 - 3135.96) / 2) { valueToDisplay = "G# 7"; 
                        if(sharpFlat == sharp) {
                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-ab-s-6.png'>";
                                }
                        }
                        else {
                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-ab-f-6.png'>";
                                }
                        }
                }
                        else if (valueToDisplay < 3520.00 + (3729.31 - 3520.00) / 2 && valueToDisplay > 3520.00 - (3520.00 - 3322.44) / 2) { valueToDisplay = "A 7"; 
                        if (instrument == "Piccolo" || instrument == "Bells") {
                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-a-n-6.png'>";
                        }
                }
                        else if (valueToDisplay < 3729.31 + (3951.07 - 3729.31) / 2 && valueToDisplay > 3729.31 - (3729.31 - 3520.00) / 2) { valueToDisplay = "A# 7"; 
                        if(sharpFlat == sharp) {
                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-bb-s-6.png'>";
                                }
                        }
                        else {
                                if (instrument == "Piccolo" || instrument == "Bells") {
                                        document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-bb-f-6.png'>";
                                }
                        }
                }
                        else if (valueToDisplay < 3951.07 + (4186.01 - 3951.07) / 2 && valueToDisplay > 3951.07 - (3951.07 - 3729.31) / 2) { valueToDisplay = "B 7"; 
                        if (instrument == "Piccolo" || instrument == "Bells") {
                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-b-n-6.png'>";
                        }
                }
                        else if (valueToDisplay < 4186.01 + (4434.92 - 4186.01) / 2 && valueToDisplay > 4186.01 - (4186.01 - 3951.07) / 2) { valueToDisplay = "C 8"; 
                        if (instrument == "Piccolo" || instrument == "Bells") {
                                document.getElementById("staff").innerHTML = "<img src='TrebleClef/t-c-n-7.png'>";
                        }
                }
                        else if (valueToDisplay < 4434.92 + (4698.63 - 4434.92) / 2 && valueToDisplay > 4434.92 - (4434.92 - 4186.01) / 2) { valueToDisplay = "C# 8"; }
                        else if (valueToDisplay < 4698.63 + (4978.03 - 4698.63) / 2 && valueToDisplay > 4698.63 - (4698.63 - 4434.92) / 2) { valueToDisplay = "D 8"; }
                        else if (valueToDisplay < 4978.03 + (5274.04 - 4978.03) / 2 && valueToDisplay > 4978.03 - (4978.03 - 4698.63) / 2) { valueToDisplay = "D# 8"; }
                        else if (valueToDisplay < 5274.04 + (5587.65 - 5274.04) / 2 && valueToDisplay > 5274.04 - (5274.04 - 4978.03) / 2) { valueToDisplay = "E 8"; }
                        else if (valueToDisplay < 5587.65 + (5919.91 - 5587.65) / 2 && valueToDisplay > 5587.65 - (5587.65 - 5274.04) / 2) { valueToDisplay = "F 8"; }
                        else if (valueToDisplay < 5919.91 + (6271.93 - 5919.91) / 2 && valueToDisplay > 5919.91 - (5919.91 - 5587.65) / 2) { valueToDisplay = "F# 8"; }
                        else if (valueToDisplay < 6271.93 + (6644.88 - 5919.91) / 2 && valueToDisplay > 6271.93 - (6271.93 - 5919.91) / 2) { valueToDisplay = "G 8"; }
                        else if (valueToDisplay < 6644.88 + (7040.00 - 6644.88) / 2 && valueToDisplay > 6644.88 - (6644.88 - 6271.93) / 2) { valueToDisplay = "G# 8"; }
                        else if (valueToDisplay < 7040.00 + (7458.62 - 7040.00) / 2 && valueToDisplay > 7040.00 - (7040.00 - 6644.88) / 2) { valueToDisplay = "A 8"; }
                        else if (valueToDisplay < 7458.62 + (7902.13 - 7458.62) / 2 && valueToDisplay > 7458.62 - (7458.62 - 7040.00) / 2) { valueToDisplay = "A# 8"; }
                        else if (valueToDisplay > 7458.62 + (7902.13 - 7458.62) / 2) {
                                valueToDisplay = "Too high!";
                                document.getElementById("staff").innerHTML = "";
                        }
                        else { valueToDisplay = ""; }




                        document.getElementById('note').innerText = valueToDisplay;
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
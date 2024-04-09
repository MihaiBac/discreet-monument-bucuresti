let audioContext;
let gainNodeMain;
let gainAudio;
let gainVoce;

let mainTrack;

let interval;

let samples =[];
let playing = [];

const mainAudio = document.querySelector("audio");

//paths will need to be changed
const samplePaths = ["audio/voci/1912-01.mp3", "audio/voci/1933-01.mp3", "audio/voci/1944-01.mp3", "audio/voci/1946-02.mp3","audio/voci/1954-01.mp3", "audio/voci/1959-01.mp3", "audio/voci/1961-01.mp3", "audio/voci/1962-02.mp3", "audio/voci/1968-02.mp3", "audio/voci/1969-01.mp3", "audio/voci/1971-01.mp3", "audio/voci/1971-02.mp3", "audio/voci/1972-02.mp3", "audio/voci/1973-02.mp3", "audio/voci/1976-01.mp3", "audio/voci/1977-02.mp3", "audio/voci/1979-03.mp3", "audio/voci/1989-02.mp3"];


let now = getCurrentTime();

//!!!fill in the second in the hour when the samples should play
let scheduledTimes = [0, 1 * 50, 2*50, 3*50, 4*50, 5*50, 6*50, 7*50, 8*50, 9*50, 10*50, 11*50, 12*50, 13*50, 14*50, 15*50, 16*50, 17*50];

//!!!change loop length to 1h (3600), and the int btw smpls as appropriate
let intervalBtwSamples = 50;
let voiceLoopLength = 50 * 18;

let whenToPlay;

function setupAudio () {
    if(!audioContext) {
    audioContext = new AudioContext();
    gainNodeMain = audioContext.createGain();
    gainAudio = audioContext.createGain();
    gainVoce = audioContext.createGain();
    gainVoce.gain.value = 1.1;
    gainAudio.gain.value = 0.9;

    mainTrack = audioContext.createMediaElementSource(mainAudio);
    mainTrack.connect(gainAudio).connect(gainNodeMain).connect(audioContext.destination);
    
    gainNodeMain.gain.value = .7; 
    
    mainAudio.load();
    }
}


function startAudio() {
    if (audioContext === "suspended") {
        audioContext.resume();
    } 
    //bug in Safari on mac plays twice; seems to be ok on iPhone and iPad
    mainAudio.play();
  
    //!!!change interval to sth like 10 sec (10000 ms)
    interval = setInterval(checkTime, 5000);
}

let sampleToPlay = 0;
function startSamples(i) {
     now = getCurrentTime();
     
    if(i > 0) {
        whenToPlay = scheduledTimes[i] - now;
    } else if (i === 0) {
        whenToPlay = voiceLoopLength - now;
    }


     console.log("preparing track " + i + " to play in: " + whenToPlay + "; now: " + now)
     setupSample(samplePaths[i])
        .then((response) => {
            samples.push(response)
            playing[sampleToPlay] = playSample(samples[sampleToPlay], whenToPlay)   
            
            //console.log(playing[sampleToPlay], whenToPlay)
            sampleToPlay++
        })

}

let loadNext = true;
let nextPlayTime = voiceLoopLength;
function checkTime() {
    now = getCurrentTime();
    //console.log(now)
    if (loadNext === true && now < nextPlayTime) {
        for (let i = 0; i < scheduledTimes.length; i++) {
            if (now < scheduledTimes[i] && scheduledTimes[i] - now < intervalBtwSamples) {
                nextPlayTime = scheduledTimes[i];
                loadNext = false;
                startSamples(i)
            } else if (i === 0 && now > scheduledTimes[scheduledTimes.length-1]){
                nextPlayTime = scheduledTimes[i];
                loadNext = false;
                startSamples(i)
            }
        }
    }
    else if (loadNext === false && now > nextPlayTime) {
        loadNext = true;
        nextPlayTime = nextPlayTime + intervalBtwSamples;
        //console.log("loadNext: " + loadNext)
    }
}

function getCurrentTime() {
    var d = new Date();
    var min = d.getMinutes()
    var sec = d.getSeconds()
    
    
    //!!!change secunde to secunde in hour (min * 60 + sec)
    //var secunde = min * 60 + sec;
    var minLoop = min % 15  
    var secunde = minLoop * 60 + sec
    
    return secunde;
}

async function getFile(filePath) {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    return audioBuffer;
}

async function setupSample(path) {
    let audioBuffer;
    const sample = await getFile(path);
    audioBuffer = sample;
    return audioBuffer;
}

function playSample(audioBuffer, time) {
    //console.log("audio buffer:" + audioBuffer, time)
    const acTime = audioContext.currentTime
    //console.log("audio context time: " + acTime)
    time = acTime + time;
    const sampleSource = audioContext.createBufferSource();
    sampleSource.buffer = audioBuffer;
  
   // const gainVoce = audioContext.createGain;

    sampleSource.connect(gainVoce).connect(gainNodeMain);
    sampleSource.start(time);

    return sampleSource;
}

function stopAudio() {
    mainAudio.pause();
    for (let i = 0; i < playing.length; i++) {
        playing[i].stop();
    }
    clearInterval(interval)
    audioContext.close()
}

export {setupAudio, startAudio, stopAudio}
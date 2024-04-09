import {pm10, pm25} from './DM_I_checkAirQ.js';
import { myTimeout } from './DM_I_checkLocation.js';
import { startAudio, stopAudio } from './DM_I_audio.js';

//var sound = document.getElementById("sound");

function showWork() {
    document.getElementById('contentI').classList.add("hide");
    document.getElementById('contentII').classList.add("hide");
    document.getElementById('monument').classList.remove("hide");
    openFullscreen();
    getScreenLock();

}

function openFullscreen() {
    const elem = document.getElementById('monument');

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        /* Safari, making div element full screen seems to work on iPad but not iPhone */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
    }
}

function hideWork() {
    document.getElementById('after').classList.remove("hide");
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }

    document.getElementById('monument').classList.add("hide");

    hush();
    stopAudio();
}



//initialize canvas and implement alternative mode for getting the video in Hydra in order to get the 'environment' mode in iOS

const canvas = document.getElementById("myCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


var hydra = new Hydra({
    canvas,
    detectAudio: false,
    enableStreamCapture: false,
})

const constraints = {
    video: {
        width: {
            min: 1280,
            ideal: 1920,
            max: 2560,
        },
        height: {
            min: 720,
            ideal: 1080,
            max: 1440,
        },
        facingMode: "environment"
    },

}

async function initializeCamera() {
    let myPromise = new Promise(function (resolve, reject) {
        try {
            const videoStream = navigator.mediaDevices.getUserMedia(constraints);
            resolve(videoStream);
        } catch (error) {
            reject(error);
        }
        
    })

    const v = await myPromise;
    return v;
}

async function playVideo(v) {
    const video = document.createElement('video')
    video.setAttribute('autoplay', '')
    video.setAttribute('muted', '')
    video.setAttribute('playsinline', '')
    video.srcObject = v;


    return new Promise((resolve, reject) => {
        video.addEventListener('loadedmetadata', () => {
            video.play().then(() => resolve(video))
        })
    })
}


function startHydra() {
    document.getElementById('startButton').classList.add('hide')
    document.getElementById('incarcare').classList.remove('hide')

    clearTimeout(myTimeout);

    initializeCamera()
        .then(
            function (value) {
                playVideo(value)
                    .then(
                        function (value) {
                            schiteaza(value)
                        }
                    );
            }
        )
        .catch((err) => {
            document.getElementById('incarcare').innerHTML = err;
            console.log(err);
        })
}


//here goes the hydra code, uses the pm25 and pm10 global variables
let i = 0;
let isOn = false;
const timeout = 60000;

function schiteaza(video) {
    //console.log(i)
    if (i === 0) {
        osc(1, .3, [0, 3].smooth().fast(.3))
            .mask(shape(10, [.3, .5].fast(0.25).smooth(), .1).modulate(noise(3, .1))).pixelate(9, 9).luma(.3)
            .diff(src(s0).modulate(noise(10, .1, .3).rotate().pixelate(5, 5).mask(shape(4, [.4, .7].fast(.1).smooth(), .1))))
            .modulateScale(o1)
            .out(o0)
 
        noise(5, .1)
            .mask(shape(4, .6))
            .pixelate([12, 9, 5].smooth().fast(.01 * pm10), [12, 5, 9].smooth().fast(.01 * pm25))
            .out(o1)
        render(o0)
    
        i++;
        setTimeout(schiteaza, timeout)
    } 
    else if (i === 1) {
        osc(pm10, .1, .3)
            .rotate(-1)
            .pixelate([20, 100].fast(.3), [50, 20, 100].fast(.2))
            .mask(voronoi(pm25, 1))
            .mask(shape(90, .7, .2)
            .scale([.2, 1].smooth().fast(.1)))
            .out(o1)
        i++
        setTimeout(schiteaza, timeout)
   }
   else if (i === 2) {
        noise(pm25, .1)
            .mask(shape(90, .7, .2).modulate(voronoi(pm10, 1)))
            .out(o1)
        i = 0;
        setTimeout(schiteaza, timeout)
   }

   if (isOn === false) {
    s0.init({
        src: video
    })
    showWork();
    startAudio();
    isOn = true;
    }
}



//screen lock
async function getScreenLock() {
    let wakeLock = null;

    if ("wakeLock" in navigator) {
        try {
            wakeLock = await navigator.wakeLock.request("screen");
            //console.log("Wake Lock is active!");
        } catch (err) {
            // The Wake Lock request has failed - usually system related, such as battery.
            console.log(`${err.name}, ${err.message}`);
        }

    } else {
        console.log("Wake lock is not supported by this browser.");
    }

}

export {startHydra, hideWork}
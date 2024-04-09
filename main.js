import {getLocation} from './modules/DM_I_checkLocation.js'
import {startHydra, hideWork} from './modules/hydraDM_1.js'
import { setupAudio } from './modules/DM_I_audio.js';
import { showInfo, inchideInfo } from './modules/DM_I_info.js';

//check location
document.querySelector('#verificaLocatia').addEventListener('click', ()=>{
    getLocation();
    setupAudio();
})

//start stop video modulation
document.querySelector('#startButton').addEventListener('click', ()=>{
    startHydra();
})
document.querySelector('#stopButton').addEventListener('click', ()=> {
    hideWork();
})

//reload
document.querySelector('#reload').addEventListener('click', ()=>{
    location.reload();
})

//info
document.querySelector('#moreInfo').addEventListener('click', ()=>{
    showInfo();
})
document.querySelector('#inchideInfo').addEventListener('click', ()=>{
    inchideInfo();
})

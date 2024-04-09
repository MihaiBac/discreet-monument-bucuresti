import { checkAirQ } from './DM_I_checkAirQ.js'

const targetLat = 44.4350 //pt test in sofia 42.6875;
const targetLong = 26.1011 //pt test in sofia 23.2553;
const pathArray = window.location.pathname.split('/')

let myTimeout;
let locationText = document.getElementById("location");
let butonLocation = document.getElementById('verificaLocatia');

//check spectator position 
//!!! change +-min max vals for the final work
async function checkPosition(position) {
    const minLat = targetLat - 0.0005; //0.001; 90
    const maxLat = targetLat + 0.0005; //0.001; 90
    const minLong = targetLong - 0.0005; //0.001; 90
    const maxLong = targetLong + 0.0005; //0.001; 90

    if(pathArray[pathArray.length - 1] === "DM_I_RO.html") {
        locationText.innerHTML = "<span class='white'>coordonatele tale actuale sunt:</span><br>" + "latitudine: " + position.coords.latitude + "<br>longitudine: " + position.coords.longitude + "<br><br>pentru a vedea lucrarea, mergi în piața universității";
    } else if(pathArray[pathArray.length - 1] === "DM_I_ENG.html") {
        locationText.innerHTML = "<span class='white'>your coordinates are:</span><br>" + "latitude: " + position.coords.latitude + "<br>longitude: " + position.coords.longitude + "<br><br>to see the work, please go to piața universității";
    }

    if (position.coords.latitude >= minLat && position.coords.latitude <= maxLat && position.coords.longitude >= minLong && position.coords.longitude <= maxLong) {
        
        
        if(pathArray[pathArray.length - 1] === "DM_I_RO.html") {
            locationText.innerHTML = "<span class='white'>coordonatele tale actuale sunt:</span><br>" + "latitudine: " + position.coords.latitude + "<br>longitudine: " + position.coords.longitude;
        } else if(pathArray[pathArray.length - 1] === "DM_I_ENG.html") {
            locationText.innerHTML = "<span class='white'>your coordinates are:</span><br>" + "latitude: " + position.coords.latitude + "<br>longitude: " + position.coords.longitude;
        }

        locationText.style.color = "green";

        try {
            const checkAir = await checkAirQ();
        } catch (error) {
            locationText.innerHTML = "something went wrong<br>please refresh the page to try again"
                locationText.style.color = "red";
            console.log(error)
        }

        myTimeout = setTimeout(returnToCheckPosition, 120 * 1000);
    }
}

function returnToCheckPosition() {
    //console.log("return to check position");
    let dateAQI = document.querySelector("#dateAQI")

    document.getElementById("explicatie").classList.remove("hide");
    locationText.classList.add("hide");
    locationText.style.color = "red";
    document.getElementById('startButton').classList.add('hide');
    dateAQI.classList.add('hide');
    dateAQI.style.color = "red";
    butonLocation.classList.remove('hide');
}


function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            locationText.innerHTML = "User denied the request for Geolocation.<br><br>Please check if Geolocation is allowed in your settings and refresh this page." 
            + "<br><br>On <b>iOS</b>:<br>1. Go to the Settings of your device > Privacy & Security > Location Services.<br>2. Make sure that Location Services is on.<br>3. Scroll down to find the browser that you are using.<br>4. Tap the app and select the option: Ask"
            + "<br><br>On <b>Android</b>:<br>1. Go to the Settings of your device > Location.<br>2. Make sure Location is On"
            + "<br><br>If this error persists please check that Location is also allowed for dalpofzs.com in the Settings of your browser."
            + "<br><br>In <b>Chrome</b> on Android:<br>1. Tap the three dots to the right of the address bar.<br>2.Go to Settings > Site settings > Location.<br>3.Make sure Location is On.<br>4.Make sure dalpofzs.com is not among the blocked websites."
            + "<br><br>In <b>Safari</b> on iOS:<br>1. While on our website, tap the AA button at the left of the address bar.<br>2.Go to Website Settings > Location.<br>3.Set the Location preferences for dalpofzs.com to Ask."
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            locationText.innerHTML = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.");
            locationText.innerHTML = "An unknown error occurred.";
            break;
    }
}

function getLocation() {
    document.getElementById("explicatie").classList.add("hide");
    document.getElementById('verificaLocatia').classList.add('hide');
    locationText.classList.remove("hide");
    locationText.innerHTML = "...obtaining current location... please wait";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(checkPosition, showError, {
                enableHighAccuracy: true,
            });
    } else {
        locationText.innerHTML = "Geolocation is not supported by this browser.";
    }
}

export {getLocation, myTimeout}
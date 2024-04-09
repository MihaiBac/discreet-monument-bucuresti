let pm25 = 25;
let pm10 = 50;
let dateAQI = document.querySelector("#dateAQI");
const pathArray = window.location.pathname.split('/')

async function checkAirQ() {
    dateAQI.classList.remove("hide")

    try {
        let response = await fetch ('https://dm-functions.netlify.app/.netlify/functions/checkAirQ') 
        let airQual = await response.json()
        let airQ = airQual.message
        
        //console.log(airQ)
                
        if(airQ.status !== 'ok') {
            //console.log(airQ.status)
            printAlternativ();
        }
        else {
            dateAQI.style.color = "white";
            printAirQ(airQ)
        }

        document.getElementById('startButton').classList.remove('hide');
    } catch (error) {
        console.log(error)
    }
}

function printAirQ(airQ) {
    //console.log(airQ);
    pm25 = airQ.data.iaqi.pm25.v;
    pm10 = airQ.data.iaqi.pm10.v;

    dateAQI.style.color = "white";
    if (pathArray[pathArray.length - 1] === "DM_I_RO.html") {
        dateAQI.innerHTML = "calitatea aerului (" + airQ.data.time.s + "):<br>" + "PM 2.5 = " + airQ.data.iaqi.pm25.v + " µg/m3; PM 10 = " + airQ.data.iaqi.pm10.v + " µg/m3<br><br><br><br><span class='small'>datele au fost preluate de la stația: " + " " + airQ.data.city.name + ", " + airQ.data.attributions[0].name + " <a href='" + airQ.data.attributions[0].url + "' target='blank'>" + airQ.data.attributions[0].url + "</a>" + "<br> " + airQ.data.city.location + "<br> url: <a href='" + airQ.data.city.url + "' target='blank'>" + airQ.data.city.url + "</a>" + "<br> World Air Quality Index Project " + "<a href='https://waqi.info/' target='blank'>https://waqi.info/</a></span>"; 
    } else if (pathArray[pathArray.length - 1] === "DM_I_ENG.html"){
        dateAQI.innerHTML = "air quality (" + airQ.data.time.s + "):<br>" + "PM 2.5 = " + airQ.data.iaqi.pm25.v + " µg/m3; PM 10 = " + airQ.data.iaqi.pm10.v + " µg/m3<br><br><br><br><span class='small'>data from the station: " + " " + airQ.data.city.name + ", " + airQ.data.attributions[0].name + " <a href='" + airQ.data.attributions[0].url + "' target='blank'>" + airQ.data.attributions[0].url + "</a>" + "<br> " + airQ.data.city.location + "<br> url: <a href='" + airQ.data.city.url + "' target='blank'>" + airQ.data.city.url + "</a>" + "<br> World Air Quality Index Project " + "<a href='https://waqi.info/' target='blank'>https://waqi.info/</a></span>"; 
    }
    
}

//if we can't get real time data
function printAlternativ() {
    dateAQI.style.color = "white";
    if (pathArray[pathArray.length - 1] === "DM_I_RO.html") {
        dateAQI.innerHTML = "nu am reușit să accesăm date recente legate de calitatea aerului. vom folosi valorile maxime admise (și deseori depășite în bucurești):<br>PM 2.5 = 25 µg/m3; PM 10 = 50 µg/m3";
    } else if (pathArray[pathArray.length - 1] === "DM_I_ENG.html"){
        dateAQI.innerHTML = "we didn't manage to access recent air quality data. we will use the maximum legal values (often exceeded in bucurești):<br>PM 2.5 = 25 µg/m3; PM 10 = 50 µg/m3";
    }
}

export { checkAirQ, pm10, pm25 };
let infoDiv = document.querySelector("#info")
const contentI = document.querySelector("#contentI")
const contentII = document.querySelector("#contentII")

function showInfo() {
    infoDiv.classList.remove('hide')
    contentI.classList.add('hide')
    contentII.classList.add('hide')

}

function inchideInfo() {
    infoDiv.classList.add('hide')
    contentI.classList.remove('hide')
    contentII.classList.remove('hide')
}


export {showInfo, inchideInfo}
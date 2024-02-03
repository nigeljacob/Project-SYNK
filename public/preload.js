let title = document.getElementById("titleSpan");
let desc = document.getElementById("desc");


let count = 1;
setInterval(function() {
    if(count == 1) {
        title.innerHTML = "."
    }else if(count == 2) {
        title.innerHTML = ".."
    } else if(count == 3) {
        title.innerHTML = "..."
        count = 0
    }
    count++;
}, 500)

let descCount = 1

setInterval(function() {
    if(descCount == 1) {
        desc.innerHTML = "Lighting bright minds..."
    }else if(descCount == 2) {
        desc.innerHTML = "Unleashing boundless potential..."
    } else if(descCount == 3) {
        desc.innerHTML = "Fueling lifelong learning..."
    }else if(descCount ==4) {
        desc.innerHTML = "Starting synk..."
    }
    descCount++;
}, 1000)
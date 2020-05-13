// var inputElem = document.querySelector('.chatMessage');
// var messages = document.querySelector('.messages');
// var mainContainer = document.querySelector('.container');
const socket = io.connect('http://localhost:3000');

// function createHTMLMessage(msg, source){
// 	var li = document.createElement("li");
// 	var div = document.createElement("div");
// 	div.innerHTML += msg;
// 	div.className += "messageInstance " + source;
// 	li.appendChild(div);
// 	messages.appendChild(li);
// }

// inputElem.addEventListener('keypress', function (e) {
// 	// var key = e.which || e.keyCode;
// 	// if (key === 13) {
//   //   console.log('client message' + inputElem.value);
//   //   createHTMLMessage(inputElem.value, 'client');
//   //   socket.emit('chat', inputElem.value);
//   //   inputElem.value = "";
//   // }
// });


socket.on('connect', function(data) {
    socket.emit('join', 'hello server from client');
    document.body.insertAdjacentHTML("beforebegin", "<div class='alert' id='connectAlert'> Connected!</div>");
    setTimeout(function ()  {
        document.getElementById('connectAlert').remove();
    }, 5000)
});

socket.on('disconnect', function(data) {
    document.body.insertAdjacentHTML("beforebegin",
        "<div class='alert' id='disconnectAlert' style='background-color: red'> Disconnected!</div>");
});

socket.on('message', function(message) {
    window.alert(message);
    // let level = message;
	// document.getElementById('mic1').setAttribute("value", level)
    // prompt('trying to update meter: ' )
});

socket.on('test', function (data) {
    window.alert('test');
});

socket.on('update level', function (level) {
    let meter = document.getElementById('mic1');
    meter.setAttribute("value", level);
    // var hue = Math.floor((100 - level) * 120 / 100);  // go from green to red
    // var saturation = Math.abs(level - 50)/50;
    // meter.setAttribute.color = hue;
});

socket.on('update log', function (peakStr) {
    let newLogItem = document.createElement('li');
    newLogItem.innerText = peakStr; //new Date().toLocaleString() + ': ' + level;
    document.getElementById('levelLog').prepend(newLogItem);
});

socket.on('update log arr', function (peakArr) {
    let levelLog = document.getElementById('levelLog');
    let lastChild = levelLog.lastElementChild;
    while(lastChild) {
        levelLog.removeChild(lastChild);
        lastChild = levelLog.lastElementChild;
    }
    for(let peak of peakArr ) {
        let newLogItem = document.createElement('li');
        newLogItem.innerText = peak; //new Date().toLocaleString() + ': ' + level;
        levelLog.prepend(newLogItem);
    }
})

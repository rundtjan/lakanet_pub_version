'use strict';

//rooms - second variable tells how many persons will fit in to the classroom
var rooms = [["Slöjdsal", null], ["B1", 18], ["B2", 20], ["Keramiksal", null], ["Gymn.sal", null], ["13", "50+21"], ["Festsal", null], ["Studierum", 17], ["23", 50], ["31", "15+5"], ["32", 12], ["33A", 23], ["33B", 18], ["34-MUM", 21], ["35", 26], ["36", 18], ["37-musik", null], ["41-konst", 18], ["42", 34], ["43", 21], ["44", 23], ["Vävateljé", null], ["46", 12], ["47", 25], ["49", 12], ["Köket", null]],
    
  time = [[8,9,"8.00"], [9, 10, "9.00"],[10,11,"10.00"], [11,12.5,"11.00"],[12.5,14,"12.30-14.00"], [14.25,15.75,"14.15-15.45"], [16.5,18,"16.30-18.00"],[18.083, 19.583, "18.05-19.35"], [19.75, 21.25, "19.45-21.15"]],
  lessons = time.length,
  marginUp = 10,
  roomWidth = 160,
  send = "reii234kdksolkdie2345",
  lessonHeight = 50,
  roomHeight = lessons * lessonHeight,
  dayWidth = 100 + rooms.length * (roomWidth + 5) + rooms.length/5*100,
  dayHeight = roomHeight + 60,
  roomCords = [],
  days = ["måndag", "tisdag", "onsdag", "torsdag", "fredag"],
  satHT = ["10.9", "17.9", "24.9", "1.10", "8.10", "15.10", "22.10", "29.10", "12.11", "19.11", "26.11", "3.12"],
  satVT = ["14.1", "21.1", "28.1", "4.2", "11.2", "18.2", "4.3", "11.3", "18.3", "25.3", "1.4", "15.4"],
  satRoomHeight = (satHT.length + 1) * lessonHeight,
  satHeight = satRoomHeight + 60,
  satBooking = false,
  eventRoom,
  eventDay,
  eventSaturday,
  eventTime = {},
  otherOwner,
  eventY,
  eventYear = 2022,
  activeYear = 2022,
  id,
  cookieArr = document.cookie.split("%22"),
  user = cookieArr[3],
  color = {management: "#d9d9d9", emma: "#ff9999", nettej: "#ff9999", pablog: "#cc99ff", annalj: "yellow", tinar: "#f9e4b7", heidih: "#00ffcc", mariab: "#ffcc66", jana: "#99ccff", hanspeterh: "#d9b38c", annav: "#ffd6cc", sisib: "#ffd6cc", tittil: "#66ff33", alexandrar: "#cc99ff", ghitah: "#ccffcc", monical: "#ccffcc", annawl: "#ffccff"},
  url = "/data",
  gData;

function ajaxRequest (method, url, callback, sendString) {//standard ajax-function
      console.log("sending", method, url)
      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function () { // check if readyState is 4, then execute callback on response
         if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
             console.log("success", method, url)
            callback(xmlhttp.response);
         }
      };

      xmlhttp.open(method, url, true);
  if (sendString){xmlhttp.send(sendString);}
      else {xmlhttp.send();}
   }

ajaxRequest("GET", url, callback) //gets bookings from the database
//ajaxRequest("POST", url+"retrieve", callback, `{"send": "${ send }"}`)

console.log(satTimeToY("26.1"))

function recheck(){
    console.log("recheck");
    ajaxRequest("GET", url, callback)
    //ajaxRequest("POST", url+"retrieve", callback, `{"send": "${ send }"}`)
}

setInterval(recheck, 60000);

var topMenu = document.createElement("div")
topMenu.setAttribute("class", "topMenu")
var buttonText = (activeYear-1).toString() + "-" + activeYear.toString();
topMenu.innerHTML = '<div id="logo"><b>Lakanet 2.0</b> - läsåret 2022-2023</div><button type="button" id="showLastYear" onclick="showLastYear()">'+buttonText+'</button><button type="button" id="logout" onclick="logout()">Logga ut</button>'
document.body.appendChild(topMenu)

function showLastYear(){
    window.location.href = "/ifjol"
}

var topMargin = document.createElementNS("http://www.w3.org/2000/svg", "svg");
topMargin.setAttribute("height", 40)
topMargin.setAttribute("width", dayWidth)
document.body.appendChild(topMargin)

var svgNames = document.createElementNS("http://www.w3.org/2000/svg", "svg");//holder for the roomnamecircles
svgNames.setAttribute("width", dayWidth)
svgNames.setAttribute("height", roomWidth)
svgNames.setAttribute("id", "svgNames")
document.body.appendChild(svgNames)


function logout(){
    document.cookie = "values=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    if (typeof(Storage) !== "undefined" && window.localStorage.getItem("lakanetSet") == "true") {
            window.localStorage.removeItem("lakanetSet")
            window.localStorage.removeItem("user");
            window.localStorage.removeItem("token");
        }
     window.location.href = "/"
}

for (var z = 0; z < days.length; z++){//svg:s for all days

var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("width", dayWidth)
svg.setAttribute("height", dayHeight)
svg.setAttribute("id", days[z])
document.body.appendChild(svg)

addLines(days[z]);//"timetables" between roomrectangles
  
var x = 100;
for (var i = 0; i < rooms.length; i++) {//adding the rooms
  
  addRoom(days[z], x, rooms[i][0])
  if (z == 0){
  roomCords.push([rooms[i][0], x, rooms[i][1]])}
  x += roomWidth+5
  if ([4,9,14,19].indexOf(i) > -1) {x += 100}
}

}

for (var z = 0; z < 2; z++){//svg:s for saturdays

var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("width", dayWidth)
svg.setAttribute("height", satHeight)
if (z == 0){var satId = "ht"} else {var satId = "vt"}
svg.setAttribute("id", satId)
document.body.appendChild(svg)

addLines(satId, true);//"timetables" between roomrectangles
  
var x = 100;
for (var i = 0; i < rooms.length; i++) {//adding the rooms for saturdays
  
  addSaturday(satId, x, rooms[i][0])
  x += roomWidth+5
  if ([4,9,14,19].indexOf(i) > -1) {x += 100}
}

}

function addTopRowNames(id){
for (var x = 0; x < roomCords.length; x++){//adding names of rooms (top-row)
var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
document.getElementById(id).appendChild(g)
g.setAttribute("transform", "translate(" + parseInt(roomCords[x][1]) +", 0)")
g.setAttribute("id", "name"+roomCords[x][0]+id)
var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
circle.setAttribute("cx", roomWidth/2);
circle.setAttribute("cy", roomWidth/2);
circle.setAttribute("r", roomWidth/2);
circle.setAttribute("fill", "#43cece");
document.getElementById("name"+roomCords[x][0]+id).appendChild(circle)
var foreign = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
//document.getElementById("name"+roomCords[x][0])
g.appendChild(foreign)
foreign.setAttribute("x", 0)
foreign.setAttribute("y", roomWidth/2-45)
foreign.setAttribute("width", roomWidth-6)
foreign.setAttribute("height", roomWidth-6);
var div = document.createElement("div")
div.setAttribute("display", "block")
if (roomCords[x][0].length < 4){
   div.style.fontSize = "70px"
} else if (roomCords[x][0].length < 7){
    div.style.fontSize = "40px"
foreign.setAttribute("y", roomWidth/2-25)
} else if (roomCords[x][0].length < 10){
    div.style.fontSize = "30px"
foreign.setAttribute("y", roomWidth/2-20)
} else {
    div.style.fontSize = "30px"
foreign.setAttribute("y", roomWidth/2-20)
}
div.setAttribute("class", "roomName")
foreign.appendChild(div);
div.innerHTML = roomCords[x][0];

}}

addTopRowNames("svgNames");
//addTopRowNames("satNames");


function addOtherRowsNames(){
for (var z = 1; z < days.length; z++){
for (var x = 0; x < roomCords.length; x++){//adding names of rooms (top-row)
var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
document.getElementById(days[z]).appendChild(g)
g.setAttribute("transform", "translate(" + parseInt(roomCords[x][1]) +", 0)")

var foreign = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
g.appendChild(foreign)
foreign.setAttribute("x", 0)
foreign.setAttribute("y", 10)
foreign.setAttribute("width", roomWidth-6)
foreign.setAttribute("height", 30);
var div = document.createElement("div")
div.setAttribute("display", "block")
div.setAttribute("class", "roomNameOther")
foreign.appendChild(div);
div.innerHTML = roomCords[x][0]
if (roomCords[x][2] != null){div.innerHTML += " <span style='font-size:12px'><i>("+roomCords[x][2]+")</i></span>"}

}}}

addOtherRowsNames()

function addSatRowsNames(){
for (var z = 0; z < 2; z++){
for (var x = 0; x < roomCords.length; x++){//adding names of rooms (top-row)
var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
document.getElementById(["ht", "vt"][z]).appendChild(g)
g.setAttribute("transform", "translate(" + parseInt(roomCords[x][1]) +", 0)")

var foreign = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
g.appendChild(foreign)
foreign.setAttribute("x", 0)
foreign.setAttribute("y", 10)
foreign.setAttribute("width", roomWidth-6)
foreign.setAttribute("height", 10);
var div = document.createElement("div")
div.setAttribute("display", "block")
div.setAttribute("class", "roomNameOther")
foreign.appendChild(div);
div.innerHTML = roomCords[x][0]
if (roomCords[x][2] != null){div.innerHTML += " <span style='font-size:12px'><i>("+roomCords[x][2]+")</i></span>"}

}}}

addSatRowsNames();

function addRoomButtons(room){
    var button = document.createElement("button")
    button.setAttribute("id", room);
    button.addEventListener("click", changeRoom, false);
    button.textContent = room;
    document.getElementById("roomdropdown").appendChild(button);
}

for (var i = 0; i < rooms.length; i++){
    addRoomButtons(rooms[i][0])
}

function addDayButtons(day){
    var button = document.createElement("button")
    button.setAttribute("value", day);
    button.addEventListener("click", changeDay, false);
    button.textContent = day;
    document.getElementById("daydropdown").appendChild(button);
}

for (var i = 0; i < days.length; i++){
    addDayButtons(days[i])
}

function changeRoom(event){
    var e = event.target
    console.log(e.id)
    document.getElementById("modalRoom").textContent = e.id;
    eventRoom = e.id;
    //document.getElementsByClassName("dropdown-content")[0].style.display = "none";
}

function changeDay(event){
    var e = event.target
    console.log(e.value)
    document.getElementById("modalDay").textContent = e.value;
    eventDay = e.value;
    //document.getElementsByClassName("dropdown-content")[0].style.display = "none";
}


function yToTime(y) {//finding what time the user has pointed on using the y-coordinate
  var temp = time[Math.floor(y/lessonHeight)];
      temp = temp[2].split("-");
  //console.log(temp);
  eventTime.startH = temp[0].split(".")[0]
  eventTime.startMin = temp[0].split(".")[1]
  if (temp[1]){
     eventTime.endH = temp[1].split(".")[0]
  eventTime.endMin = temp[1].split(".")[1]
  }
  //console.log(eventTime)
}

function yToSatTime(y, semester) {//finding what time the user has pointed on using the y-coordinate
  if (semester == "ht"){
  eventSaturday = satHT[Math.floor(y/lessonHeight)-1];} else
  {eventSaturday = satVT[Math.floor(y/lessonHeight)-1];}
  console.log(eventSaturday)/*
      temp = temp[2].split("-");
  //console.log(temp);
  eventTime.startH = temp[0].split(".")[0]
  eventTime.startMin = temp[0].split(".")[1]
  if (temp[1]){
     eventTime.endH = temp[1].split(".")[0]
  eventTime.endMin = temp[1].split(".")[1]
  }*/
  //console.log(eventTime)
}

function timeToY(t,start) {//start = true or false = start or end - finding the y-coordinate based on the clocktime
  var check = false;
  var y = marginUp;
  for (var i = 0; i < time.length; i++){
      if (t >= time[i][0] && t <= time[i][1]){
          y += i * lessonHeight + (t-time[i][0])/(time[i][1]-time[i][0])*lessonHeight
          check = true;
          i = time.length;
      }
  }
      if (check == false){
   for (var i = 0; i < time.length-1; i++){
      if (t >= time[i][1] && t <= time[i+1][0]){
          if (start == true){y += (i+1)* lessonHeight -10}
          else {y += (i+1)* lessonHeight +10}
          check = true;
          i = time.length;
      }
  }     
    }
    
    if (check == false){
      if (t > time[time.length-1][1]){
          y += roomHeight;
      }
    }
  //console.log("y is: "+y)
  return y
}

function satTimeToY(day){
    var y = marginUp + lessonHeight;
    if (satHT.indexOf(day) > -1){
        y += lessonHeight * satHT.indexOf(day);
    }
    else {y += lessonHeight * satVT.indexOf(day);}
    return y
}

function createTimeSh(x, i, id, y){//module for creating the text for the timetable
if (i == 1){
    var textDay = document.createElementNS("http://www.w3.org/2000/svg", "text");
    document.getElementById(id).appendChild(textDay);
    textDay.setAttribute("x", x+7)
        textDay.setAttribute("y", y-20)
        textDay.style.fontSize = "40px"
        textDay.style.fontWeight = "bold"
        textDay.innerHTML = id.substr(0,3)
}
    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        document.getElementById(id).appendChild(text);
        text.setAttribute("x", x+10)
        text.setAttribute("y", y+15)
        text.innerHTML = time[i][2];
}

function satCreateTimeSh(x, i, id, y){
    
    if (i == 1){
    var textDay = document.createElementNS("http://www.w3.org/2000/svg", "text");
    document.getElementById(id).appendChild(textDay);
    textDay.setAttribute("x", x+7)
        textDay.setAttribute("y", y-70)
        textDay.style.fontSize = "40px"
        textDay.style.fontWeight = "bold"
        textDay.innerHTML = "lör"
}
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        document.getElementById(id).appendChild(text);
        text.setAttribute("x", x+10)
        text.setAttribute("y", y+15)
        if (id == "ht") {text.innerHTML = "Lör "+ satHT[i]} else {text.innerHTML = "Lör "+ satVT[i]};
}

function addLines(id, saturday){//creating the lines for the timetable
    var length;
    if (!saturday){length = time.length} else {length = satHT.length+1}
    for (var i = 1; i < length; i++) {
            
        var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        document.getElementById(id).appendChild(line);
        line.setAttribute("x1",0)
        line.setAttribute("y1", i*lessonHeight + marginUp)
        line.setAttribute("x2", dayWidth)
        line.setAttribute("y2", line.getAttribute("y1"))
        line.setAttribute("style", "stroke-width:0.5;stroke:black")
        if (i == 0){line.setAttribute("style", "display:none")}
        if (!saturday){
        var x = 0;
        while (x + roomWidth*5 < dayWidth){
            createTimeSh(x, i, id, parseInt(line.getAttribute("y1")));
        
        x += 5*(roomWidth+5)+100
        }
        createTimeSh(dayWidth-110, i, id, parseInt(line.getAttribute("y1")));
    }
        else {
             var x = 0;
        while (x + roomWidth*5 < dayWidth){
            satCreateTimeSh(x, i-1, id, parseInt(line.getAttribute("y1")));
        
        x += 5*(roomWidth+5)+100
        }
        satCreateTimeSh(dayWidth-110, i-1, id, parseInt(line.getAttribute("y1")));
        }
    }
}

function addRect(s,info,x,y,idP,idR,w,h,f,o) {//module for creating different rectangles
  if (s == "day") {y=marginUp,w=roomWidth,h=roomHeight,f="white";}
  else if (s == "saturday") {y=marginUp,w=roomWidth,h=satRoomHeight,f="white";}
  else if (s == "lesson") {w=roomWidth, h=lessonHeight, f="#d1f3f3"}
  else if (s == "clicker") {y=marginUp,w=roomWidth,h=roomHeight,f="white", idR=info.day+ "#" + info.room.replace(" ", "")}
  else if (s == "clickerSat") {y=marginUp,w=roomWidth,h=satHeight,f="white", idR=info.day+ "#" + info.room.replace(" ", "")}
  var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  document.getElementById(idP).appendChild(rect);
  rect.setAttribute('x',x);
  rect.setAttribute('y',y);
  rect.setAttribute('width',w);
  rect.setAttribute('height',h);
  rect.setAttribute('fill',f);
 if (s == "day" || s == "saturday") {rect.setAttribute('stroke', '#43cece');
    rect.setAttribute('stroke-width', 1);
   rect.setAttribute('rx', 15);
    rect.setAttribute('ry', 15);  }
if (s == "booking"){
   rect.setAttribute('rx', 5);
    rect.setAttribute('ry', 5);
    rect.setAttribute('stroke', 'black');
    rect.setAttribute('stroke-width', 1);
}
  if (s == "clicker" || s == "clickerSat") {
    rect.setAttribute('style', 'opacity:0.0')
    rect.addEventListener("mouseover", showSat, false);
    rect.addEventListener("click", add, false);
  }
  if (idR) {rect.setAttribute('id',idR);}
  if (o) {rect.setAttribute('style','opacity:'+o)}
  
  return rect
}

function addRoom(day, x, room){// for creating a room
 
  addRect("day",{day: day, room: room},x, marginUp, day);
  for (var i = 0; i < 4; i++){
    addRect("lesson",null,x,(i*(lessonHeight*2)+lessonHeight+marginUp), day)
  }
  
addRect("clicker",{day: day, room: room},x, marginUp, day);

  
}

function addSaturday(semester, x, room){// for creating a room
 
  addRect("saturday",{day: semester, room: room},x, marginUp, semester);
  for (var i = 0; i < 6; i++){
    addRect("lesson",null,x,(i*(lessonHeight*2)+lessonHeight+marginUp), semester)
  }
  
addRect("clickerSat",{day: semester, room: room},x, marginUp, semester);

  
}

function compareNumbers(a, b) {
    var a1, b1;
    for (var i = 0; i < gData.length; i++){
        if (gData[i]._id == a){
            a1 = i; i = gData.length} 
    }
    
        for (var i = 0; i < gData.length; i++){
        if (gData[i]._id == b){b1 = i; i = gData.length} 
    }
  return a1 - b1;
}

function makeBookings(booking){
    
    var para = checkForParallell(booking);
    var width = roomWidth;
    var x = 0; roomCords.forEach(function(elem2){if (booking.room == elem2[0]) {x = elem2[1]}})
    if (para.length > 0){width = width / (para.length+1);

para.push(booking._id)
para.sort(compareNumbers)
console.log(para);
        var temp = x;
        x += roomWidth/para.length*para.indexOf(booking._id);
        //console.log("id:", booking.id,x-temp, width, para.length, para)
    }
    
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            if (days.indexOf(booking.day) > -1){
            document.getElementById(booking.day).appendChild(g);}
            else {if (satHT.indexOf(booking.day) > -1){
                document.getElementById("ht").appendChild(g);
            } else {
                document.getElementById("vt").appendChild(g);
            }
                
            }
            g.setAttribute("id", booking._id+"g")
            if (days.indexOf(booking.day) > -1){
            var y = timeToY(booking.start)} else
            {var y = satTimeToY(booking.day)}
            if (days.indexOf(booking.day) > -1){
            var height = timeToY(booking.end)-timeToY(booking.start);}
            else {var height = lessonHeight}
            //if (height < 0){console.log(timeToY(booking.end), timeToY(booking.start))}
            g.setAttribute("transform", "translate("+x+","+y+")")
    var rect = addRect("booking",null,0,0,booking._id+"g",null,width,height,color[booking.owner])
            
            var foreign = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
            g.appendChild(foreign);
            foreign.setAttribute("x", 3)
            foreign.setAttribute("y", 3)
            foreign.setAttribute("width", width-6)
            foreign.setAttribute("height", height-6);
            foreign.setAttribute("id", booking._id+"foreign")
            var div = document.createElement("div")
            div.setAttribute("class", "booking")
            div.setAttribute("display", "block")
            div.setAttribute("style", "height:"+parseInt(height-6)+"px")
            //console.log(div.getAttribute("style"))
            foreign.appendChild(div);
            div.innerHTML = booking.header;
    var clicker = addRect("booking",null,0,0,booking._id+"g",booking._id+"#booking",width,height,color[booking.owner], "0.0")
            clicker.setAttribute("title", "test" /*booking.header + " " + booking.info + " " + booking.timestring*/)
            clicker.addEventListener("click", update, false)
            
            clicker.addEventListener("mouseover", show, false)
            clicker.addEventListener("mousemove", show, false)
            clicker.addEventListener("mouseout", hide, false)
    
}


function callback(data){//receiving bookings from database // sätt till att hantera lördagar
if (!gData){
    console.log(data);
gData = JSON.parse(data);
    gData.forEach(function(elem){
        if (elem.year == activeYear){
            
            makeBookings(elem)
        }
    })
} else {
var testData = JSON.parse(data);
    testData.forEach(function(elem){
            var check = false;
            if (elem.year == activeYear){
        gData.forEach(function(elem2){
            
            if (elem._id == elem2._id){check = true}
        })
        if (check == false){makeBookings(elem);
        console.log(elem._id, "bookar")
            gData.push(elem)
        }}
    })
}
gData = JSON.parse(data);
id = gData[gData.length-1]._id
    
}

function show(event){//mouseover at this moment
 var e = event.target;
  var id = e.id.substring(0, e.id.indexOf("#"))
  var tooltip = document.getElementById("tooltip")
  tooltip.style.display = "block";
  var ttText = ""
  gData.forEach(function(elem){if (elem._id == id){
      ttText += elem.header + " " + elem.info + " " + elem.timestring + " " + elem.day + " " + elem.room + " bokat av: " + elem.owner
  }})

  tooltip.textContent = ttText;
  tooltip.style.top = (event.pageY + 20).toString() + "px";
  tooltip.style.left = (event.pageX + 20).toString() + "px";

  
}

function showSat(event){//mouseover at this moment
 var e = event.target;
 console.log(e.id)/*
  var id = e.id.substring(0, e.id.indexOf("#"))
  var tooltip = document.getElementById("tooltip")
  tooltip.style.display = "block";
  var ttText = ""
  gData.forEach(function(elem){if (elem._id == id){
      ttText += elem.header + " " + elem.info + " " + elem.timestring + " " + elem.day + " " + elem.room
  }})
  tooltip.textContent = ttText;
  tooltip.style.top = (event.pageY + 20).toString() + "px";
  tooltip.style.left = (event.pageX + 20).toString() + "px";
*/
  
}

function hide(event) {
    document.getElementById("tooltip").style.display = "none"
}



function add(event){//on click for making a booking
  
  var e = event.target;
    console.log(e.id.substring(0, e.id.indexOf("#")))
  if (e.id.substring(0, e.id.indexOf("#")) == "ht" || e.id.substring(0, e.id.indexOf("#")) == "vt"){
      satBooking = true;
      eventDay = "lördag";
      eventRoom = e.id.substring(e.id.indexOf("#")+1);
      var dim = e.getBoundingClientRect();
      eventY = event.clientY - dim.top;
      yToSatTime(eventY, e.id.substring(0, e.id.indexOf("#")))
       document.getElementById("myModal").style.display = "block";
  document.getElementById("modalDay").textContent = eventDay + " " + eventSaturday;
  document.getElementById("modalRoom").textContent = eventRoom;
  document.getElementsByName("startH")[0].value = 9;
   document.getElementsByName("startMin")[0].value = "00";
   document.getElementsByName("endH")[0].value = 15;
   document.getElementsByName("endMin")[0].value = "00";
       return;}
  eventDay = e.id.substring(0, e.id.indexOf("#"))
  eventRoom = e.id.substring(e.id.indexOf("#")+1)
  //console.log(eventDay + " and " + eventRoom)
    var dim = e.getBoundingClientRect();//dimensions of element being clicked
    eventY = event.clientY - dim.top;//y from top of element
  yToTime(eventY)
  document.getElementById("myModal").style.display = "block";
  document.getElementById("modalDay").textContent = eventDay;
  document.getElementById("modalRoom").textContent = eventRoom;
  document.getElementsByName("startH")[0].value = eventTime.startH;
   document.getElementsByName("startMin")[0].value = eventTime.startMin;
  if (eventTime.endH && eventTime.endMin){
   document.getElementsByName("endH")[0].value = eventTime.endH;
   document.getElementsByName("endMin")[0].value = eventTime.endMin;}
  
}

function update(id){//on click for changing a booking

  var id = event.target.id.split("#")[0]
  var booking;
  gData.forEach(function (elem){if (id == elem._id) {booking = elem}})
  //console.log(booking)
  if (booking.owner != user){var confirm = window.confirm("Vill du verkligen ändra den här bokningen, som har gjorts av " + booking.owner + "?");
      if (confirm == false){return} else {otherOwner = booking.owner}
  }
  eventDay = booking.day;
  eventRoom = booking.room;
  document.getElementById("myModal").style.display = "block";
  document.getElementById("myModal").message = booking._id;
  document.getElementById("modalDay").textContent = booking.day;
  document.getElementById("modalRoom").textContent = booking.room;
   document.getElementsByName("header")[0].value = booking.header
   document.getElementsByName("info")[0].value = booking.info;
 var time = booking.timestring.split("-")
 var startH = time[0].split(".")[0]
 var startMin = time[0].split(".")[1]
 var endH = time[1].split(".")[0]
 var endMin = time[1].split(".")[1] 
  document.getElementsByName("startH")[0].value = startH
   document.getElementsByName("startMin")[0].value = startMin;
   document.getElementsByName("endH")[0].value = endH;
   document.getElementsByName("endMin")[0].value = endMin;
   document.getElementById("save").innerHTML = "Spara ändring";
   document.getElementById("delete").style.display = "inline";

  
}

function saveEvent(){//from save on the modal for making a booking
if (user == "observer"){cancelModal(); return}
  
  var header = document.getElementsByName("header")[0].value;
  if (!header){document.getElementById("herjaHeader").style.display = "block"; return}
 var info = document.getElementsByName("info")[0].value;
  var startH = document.getElementsByName("startH")[0].value;
  var startMin = document.getElementsByName("startMin")[0].value;
  var endH = document.getElementsByName("endH")[0].value;
  var endMin = document.getElementsByName("endMin")[0].value;
  var start = parseInt(startH) + Math.round((parseInt(startMin)/60)*1000)/1000
  var end = parseInt(endH) + Math.round((parseInt(endMin)/60)*1000)/1000
  
if (startH == "" || startMin == ""|| endH == "" || endMin == "" || parseInt(startH) > 23 || parseInt(startMin) > 59 || parseInt(endH) > 23 || parseInt(endMin) > 59 || parseInt(startMin) > 59 || parseInt(startH) < 0 || parseInt(startMin) < 0 || parseInt(endH) < 0 || parseInt(startMin) < 0 || parseInt(endMin) < 0 || end < start) {
  document.getElementById("herjaTime").style.display = "inline";
  console.log("fel tid")
  return;
}

  if (startH.length == 1) {startH = "0"+startH}
  if (startMin.length == 1){startMin = "0"+startMin}
  if (endH.length == 1){endH = "0"+endH}
  if (endMin.length ==1){endMin = "0"+endMin}
  
  var timeString = startH + "." + startMin + "-" + endH + "." + endMin
  
  if (satBooking) {//if we're making a booking for a saturday
  var json = {"send": send, booking: {"year": eventYear, "header": header, "info": info, "owner": user, "room": eventRoom, "day": eventSaturday, "timestring": timeString,"start": start,"end": end}};
  console.log(days.indexOf("måndag"), "och lördag", days.indexOf(json.day))
  console.log(json)
  eventSaturday = undefined;
  satBooking = false;
  ajaxRequest("POST", url, recheck, JSON.stringify(json))
  cancelModal();
  return;}
 
  if (document.getElementById("myModal").message){//if the modal is open for updating a booking
  json = {"id": document.getElementById("myModal").message, "send": send, "update": {"header": header, "info": info, "owner": user, "room": eventRoom, "day": eventDay, "timestring": timeString, "start": start, "end": end}}
  if (otherOwner){json.update.owner = otherOwner; otherOwner = undefined}
  ajaxRequest("PUT", url, recheck, JSON.stringify(json));
    deleteBooking(document.getElementById("myModal").message);
    
    json.update._id = json.id;
    json = json.update;
    makeBookings(json);

    
  } else {//if the modal is open to save a new booking
  var json = {"send": send, "booking": {"year": eventYear, "header": header, "info": info, "owner": user, "room": eventRoom, "day": eventDay, "timestring": timeString,"start": start,"end": end}};

   ajaxRequest("POST", url, recheck, JSON.stringify(json))
   
}
   
  
   var para = checkForParallell(json);//funkar inte för ny bokning just nu

   if (para.length > 0) {
     for (var p = 0; p < para.length; p++){
         deleteBooking(para[p]);
         gData.forEach(function(elem){
             if (elem._id==para[p]){
                 makeBookings(elem)
             }
         })
     }   
    }

cancelModal();
}

function deleteFromDb(){
    if (user == "observer"){return};
    var json = {"send": send, _id: document.getElementById("myModal").message};
    deleteBooking(json._id);
   ajaxRequest("DELETE", url, recheck, JSON.stringify(json)) 
   cancelModal();
}


function deleteBooking(id){
    var element = document.getElementById(id+"g")
    element.setAttribute("class", "deleted")
    element.setAttribute("id", undefined)
}

function cancelModal(){
    document.getElementById("save").innerHTML = "Spara";
    document.getElementById("myModal").message = undefined;
    document.getElementById("myModal").style.display = "none";
  document.getElementById("herjaTime").style.display = "none";
  document.getElementById("herjaHeader").style.display = "none";
  document.getElementById("delete").style.display = "none";
  document.getElementById("modalDay").textContent = "";
  document.getElementById("modalRoom").textContent = "";
  document.getElementsByName("startH")[0].value = "";
   document.getElementsByName("startMin")[0].value = "";
  document.getElementsByName("endH")[0].value = "";
   document.getElementsByName("endMin")[0].value = "";
  document.getElementsByName("header")[0].value = "";
  document.getElementsByName("info")[0].value = "";
  eventRoom = "";
  eventDay = "";
  eventTime = {};
    
}

function checkForParallell(booking){
    var paraArr = [];
    
    gData.forEach(function(elem){
        
        if (elem.year == booking.year && elem.day == booking.day && elem.room == booking.room && booking._id != elem._id){
            if (days.indexOf(booking.day) == -1){paraArr.push(elem._id)}
            else if ((elem.start == booking.start && elem.end == booking.end) || (elem.start > booking.start && elem.start < booking.end) || (elem.end < booking.end && elem.end > booking.start) || (booking.start > elem.start && booking.start < elem.end) || (booking.end < elem.end && booking.end > elem.start)){
                if (days.indexOf(booking.day) > -1){paraArr.push(elem._id)}
            }
        }
    })

return paraArr
    
}

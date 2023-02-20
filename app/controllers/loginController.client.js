'use strict';
var isIE = /*@cc_on!@*/false || !!document.documentMode;
console.log(window.navigator.userAgent.indexOf("MSIE"));

if (isIE){alert("Du verkar använda Internet Explorer - vänligen använd istället en modern browser t.ex. Chrome, för att Lakanet2.0 ska fungera.")}

var url = "/login"

var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("width", 400);
svg.setAttribute("height", 400);
document.body.appendChild(svg)
var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
svg.appendChild(g)
var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
circle.setAttribute("cx", 200)
circle.setAttribute("cy", 200)
circle.setAttribute("r", 190)
circle.setAttribute("fill", "#43cece")
g.appendChild(circle)
var text = document.createElementNS("http://www.w3.org/2000/svg", "text")
text.setAttribute('x', 93);
text.setAttribute("fill", "white")
text.setAttribute('y', 135);
text.setAttribute('font-size', 55)
text.textContent = 'Lakanet';
g.appendChild(text)
var foreign = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
foreign.setAttribute("width", 200)
foreign.setAttribute("height", 145)
foreign.setAttribute("x", 100)
foreign.setAttribute("y", 160)
g.appendChild(foreign)
var div = document.createElement("div")
div.setAttribute("display", "block")
div.setAttribute("style", "color:white")
div.innerHTML = "Användarnamn:<br><input type='text' name='username'><br>Lösenord:<br><input type='password' name='password'><br><br><button type='button' id='login' onclick='login()'>Logga in</button>"
foreign.appendChild(div);


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
   
if (typeof(Storage) !== "undefined" && window.localStorage.getItem("lakanetSet") == "true") {
        console.log("hittade det här");
            var user = window.localStorage.getItem("user");
            var token = window.localStorage.getItem("token");
            var sendString = '{"user":"' + user + '", "token":"'+token+'"}';
            ajaxRequest("POST", "/fastForward", checkResponse, sendString)
        }

function checkResponse(data){
    console.log(data)
    if (data == "match!"){
        console.log("hallå");
        if (typeof(Storage) !== "undefined") {
            var cookie = JSON.parse(decodeURIComponent(document.cookie).split("values=j:")[1]);
            console.log(cookie);
                window.localStorage.setItem("lakanetSet", "true");
                window.localStorage.setItem("user", cookie.user);
                window.localStorage.setItem("token", cookie.token);
        }
        window.location.href = "/"
    } else if (data == "fastForward!"){
        window.location.href = "/";
    } else {alert("Fel användarnamn eller lösenord!")}
}

function login() {
    var username = document.getElementsByName("username")[0].value;
    var password = document.getElementsByName("password")[0].value;
    var sendString = '{"username":"' + username + '", "password":"' + password + '"}'
    ajaxRequest("POST", url, checkResponse, sendString)

}

var input = document.getElementsByName("password")[0]

input.addEventListener("keyup", function(event) {

  event.preventDefault();

  if (event.keyCode === 13) {

    document.getElementById("login").click();
  }
});

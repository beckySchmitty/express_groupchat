/** Client-side of groupchat. */

const urlParts = document.URL.split("/");
const roomName = urlParts[urlParts.length - 1];
const ws = new WebSocket(`ws://localhost:3000/chat/${roomName}`);


const name = prompt("Username?");


/** called when connection opens, sends join info to server. */

ws.onopen = function(evt) {
  console.log("open", evt);

  let data = {type: "join", name: name};
  ws.send(JSON.stringify(data));
};


/** called when msg received from server; displays it. */

ws.onmessage = function(evt) {
  console.log("message", evt);

  let msg = JSON.parse(evt.data);
  let item;

  if (msg.type === "note") {
    item = $(`<li><i>${msg.text}</i></li>`);
  }

  else if (msg.type === "chat") {
    item = $(`<li><b>${msg.name}: </b>${msg.text}</li>`);
  }

  else if (msg.type === "joke") {
    item = $(`<li><b>${msg.name}: </b>${msg.text}</li>`);
  }

  else if (msg.type === "memberList") {
    item = $(`<li><b>${msg.name}: </b>${msg.text}</li>`);
  }

  else {
    return console.error(`bad message: ${msg}`);
  }

  $('#messages').append(item);
};


/** called on error; logs it. */

ws.onerror = function (evt) {
  console.error(`err ${evt}`);
};


/** called on connection-closed; logs it. */

ws.onclose = function (evt) {
  console.log("close", evt);
};


/** send message when button pushed. */

$('form').submit(async function (evt) {
  evt.preventDefault();

  // handle /joke 
  if ($("#m").val() === '/joke') {
    let joke = await getJoke();
    let data = {type: "joke", text: joke};
    ws.send(JSON.stringify(data));

    // handle /members
  } else if ($("#m").val() === '/members') {
    let data = {type: "memberList", text: $("#m").val()};
    ws.send(JSON.stringify(data));
    // handle normal chat sent
  } else {
    let data = {type: "chat", text: $("#m").val()};
    ws.send(JSON.stringify(data));
  }

  $('#m').val('');
});

// calls JokeAPI, returns single line joke about coding
async function getJoke() {
  let resp = await axios.get('https://v2.jokeapi.dev/joke/Coding?type=single');
  let joke = resp.data.joke || "Lol the Api for jokes is not working";
  return joke;
}


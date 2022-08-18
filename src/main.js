var conn;
var peer = new Peer();
let peer_id_number;
let isIdHidden = false;
let connected = false;
let errorShown = false;

peer.on("open", function (id) {
  peer_id_number = id;
  // console.log("My game ID is:" + id);
  document.getElementById("peerIdDisplay").innerHTML = id;
});

function cleanTheData(data) {
  data = filterXSS(data);
  return data;
}

function ConnectToPeer() {
  if (document.getElementById("peerIdTxtBox").value.length > 4) {
    var peerId = document.getElementById("peerIdTxtBox").value;
    let error = false;
    // console.log(peerId);
    conn = peer.connect(peerId);
    document.getElementById("error").style.display = "block";
    document.getElementById("error").innerHTML =
      "connecting to " + peerId + ".....";

    peer.on("error", function (err) {
      error = true;
      // console.log(err);
      document.getElementById("error").innerHTML =
        "Could not connect to peer " + peerId + ", try again :(";
    });

    setTimeout(function () {
      if (!error) {
        document.getElementById("error").innerHTML = "connected :)";
        connected = true;
      }
    }, 5300);

    setTimeout(function () {
      document.getElementById("error").style.display = "none";
    }, 10000);
  }
}
peer.on("connection", function (conn) {
  // console.log("peer connected");
  conn.on("open", function () {
    // console.log("conn open");
  });
  conn.on("data", function (data) {
    data = cleanTheData(data);
    let message_hist = document.getElementById("messages_history");
    let elem = document.createElement("div");
    elem.innerHTML = data;
    elem.className = "message from";
    // <div class="message from">This is my second text message on ios7</div>
    message_hist.appendChild(elem);
    message_hist.scrollBy(0, 500);
  });
});

function SendMessage() {
  if (connected) {
    if (document.getElementById("messageTextBox").value.length > 0) {
      let payload = cleanTheData(
        document.getElementById("messageTextBox").value
      );
      let message_hist = document.getElementById("messages_history");
      let elem = document.createElement("div");
      elem.innerHTML = payload;
      elem.className = "message to";
      // <div class="message from">This is my second text message on ios7</div>
      message_hist.appendChild(elem);

      conn.send(payload);
      message_hist.scrollBy(0, 500);
    }
  } else {
    if (!errorShown) {
      let message_hist = document.getElementById("messages_history");
      let elem = document.createElement("div");
      elem.innerHTML =
        "You need to connect to the person before sending message :(";
      elem.className = "message from";
      // <div class="message from">This is my second text message on ios7</div>
      message_hist.appendChild(elem);
      errorShown = true;
      setTimeout(function () {
        errorShown = false;
      }, 10000);
    }
  }
  document.getElementById("messageTextBox").value = "";
}

function hideId() {
  if (!isIdHidden) {
    document.getElementById("peerIdDisplay").innerHTML = "●●●●●●●●●●";
    document.getElementById("hideIdBtn").innerHTML = "Show Game ID";
    isIdHidden = true;
  } else {
    document.getElementById("peerIdDisplay").innerHTML = peer_id_number;
    document.getElementById("hideIdBtn").innerHTML = "Hide Game ID";
    isIdHidden = false;
  }
}

function copyId() {
  document.getElementById("notification").innerHTML =
    "Failed to copy link to clipboard";
  navigator.clipboard.writeText(peer_id_number).then(() => {
    document.getElementById("notification").innerHTML =
      "Copied Game id to clipboard";
  });
  document.getElementById("notification").style.animation = "nanimation 2s 1";

  setTimeout(function () {
    document.getElementById("notification").style.animation = "";
    // console.log("ckear");
  }, 3000);
}

document.getElementById("messageTextBox").addEventListener("keypress", (e) => {
  if (e.keyCode == 13) {
    SendMessage();
  }
});

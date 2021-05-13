import { sleep, capitalizeEachWord } from "./helpers.js";

var residenceEntry = document.getElementById("residence");
var workplaceEntry = document.getElementById("workplace");
var start_timeEntry = document.getElementById("start-time");
var end_timeEntry = document.getElementById("end-time");
var createButton = document.getElementById("create-button");
var loginLinks = document.getElementById("login-links");

const userIsLoggedIn = localStorage.getItem("loggedIn");
document.body.onload = renderLoginLinks();

function renderLoginLinks() {
  console.log("Rendering login links");
  if (userIsLoggedIn) {
    loginLinks.innerHTML = `
    <a href="index.html" id="logout">• Logout</a>
    `;
    var logout = document.getElementById("logout");
    logout.addEventListener("click", () => {
      localStorage.clear();
    });
  } else {
    window.location.replace("./index.html");
  }
}

createButton.addEventListener("mouseup", createCarple);

function createCarple() {
  var dataToSend = JSON.stringify({
    records: [
      {
        fields: {
          residence: capitalizeEachWord(residenceEntry.value),
          workplace: capitalizeEachWord(workplaceEntry.value),
          end_time: end_timeEntry.value,
          start_time: start_timeEntry.value,
          discussion: "",
        },
      },
    ],
  });

  fetch(
    "https://api.airtable.com/v0/appnvxGwUmI16KQPz/Groups?api_key=keyUbkyh9tjdFBa9O",
    {
      method: "post",
      body: dataToSend,
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => {
      console.log("Request complete! response:", res);
    })
    .then(() => {
      console.log("Redirecting...");
      showEntry();
    });
}

function showEntry() {
  fetch(
    "https://api.airtable.com/v0/appnvxGwUmI16KQPz/Groups?api_key=keyUbkyh9tjdFBa9O"
  )
    .then((response) => response.json())
    .then((data) => {
      for (var i = 0; i < data.records.length; i++) {
        if (isMatch(data.records[i])) {
          detailViewOf(data.records[i].id);
        }
      }
    });
}

//checks if UserInput and Current Record are matched
function isMatch(record) {
  const FIELDS = ["residence", "workplace", "start_time", "end_time"];
  var userInput = {
    residence: residenceEntry.value,
    workplace: workplaceEntry.value,
    start_time: start_timeEntry.value,
    end_time: end_timeEntry.value,
  };

  //check each field for match
  for (var j = 0; j < FIELDS.length; j++) {
    const tableEntry = record.fields[FIELDS[j]].toLowerCase();
    const userEntry = userInput[FIELDS[j]].toLowerCase();
    if (tableEntry != userEntry) {
      return false;
    } else {
      console.log("Record:", record);
      console.log("userInput:", userInput);
    }
  }

  return true;
}

function detailViewOf(recordID) {
  window.location.replace(`detail-view.html?id=${recordID}`);
}

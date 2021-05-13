import { capitalizeEachWord } from "./helpers.js";

//Create initial data of all records
var DATA;
fetch(
  "https://api.airtable.com/v0/appnvxGwUmI16KQPz/Groups?api_key=keyUbkyh9tjdFBa9O"
)
  .then((response) => response.json())
  .then((data) => {
    DATA = data;
    console.log("DATA INITIALIZED", DATA);
  });

const FIELDS = ["residence", "workplace", "start_time", "end_time"];
const userIsLoggedIn = localStorage.getItem("loggedIn");

//Elements
//Inputs
var residenceInput = document.getElementById("residence");
var workplaceInput = document.getElementById("workplace");
var start_timeInput = document.getElementById("start-time");
var end_timeInput = document.getElementById("end-time");

//Buttons
var submitButton = document.getElementById("submit");
var listViewButton = document.getElementById("list-view");
var createViewButton = document.getElementById("create-view");

//Variable Content Container
var contentContainer = document.getElementById("contentDisplayed");

//Event Listeners
submitButton.addEventListener("click", filterRecords);
listViewButton.addEventListener("mouseup", () => renderListView(DATA.records));
createViewButton.addEventListener("mouseup", () => {
  if (userIsLoggedIn) {
    window.location.href = "../create-view.html";
  } else {
    alert("Please login in order to Create a Carple!");
  }
});

//login links
var loginLinks = document.getElementById("login-links");
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
  }
}

//Function used to search for a matching etry
function filterRecords() {
  if (workplaceInput.value == "") {
    alert("ERROR: Please enter a workplace!");
  } else {
    var matchFound = false;
    var exactMatchIndex = -1;
    var matchedRecords = [];
    for (var i = 0; i < DATA.records.length; i++) {
      matchFound = isMatch(DATA.records[i]);
      if (matchFound) {
        matchedRecords.push(DATA.records[i]);
        exactMatchIndex = i;
        console.log("MATCH FOUND:", DATA.records[i]);
      }
    }

    for (var j = 0; j < DATA.records.length; j++) {
      if (exactMatchIndex != j) {
        matchFound = isMatchPartly(DATA.records[j]);
        if (matchFound) {
          matchedRecords.push(DATA.records[j]);
          console.log("MATCH FOUND:", DATA.records[j]);
        }
      }
    }
  }

  //If a match is found render it else display that
  //no results were found
  if (matchedRecords.length >= 1) {
    renderListView(matchedRecords);
  } else {
    contentContainer.innerHTML = `
      <div class="row justify-content-center">
        <h1 class="text-center p-4" style="color: red; font-size: 60px;">
        No results found...
        </h1>
      </div>
    `;
  }
}

//checks if UserInput and Current Record are matched
function isMatch(record) {
  var userInput = {
    residence: residenceInput.value,
    workplace: workplaceInput.value,
    start_time: start_timeInput.value,
    end_time: end_timeInput.value,
  };

  //check each field for match
  for (var j = 0; j < FIELDS.length; j++) {
    const tableEntry = record.fields[FIELDS[j]].toLowerCase();
    const userEntry = userInput[FIELDS[j]].toLowerCase();
    if (!tableEntry.includes(userEntry)) {
      return false;
    }
  }

  return true;
}

function isMatchPartly(record) {
  var matches = 0;
  var fieldsToCheck = ["residence", "workplace"];
  var userInput = {
    residence: residenceInput.value,
    workplace: workplaceInput.value,
  };

  //check each field for match
  for (var j = 0; j < fieldsToCheck.length; j++) {
    const tableEntry = record.fields[fieldsToCheck[j]].toLowerCase();
    const userEntry = userInput[fieldsToCheck[j]].toLowerCase();
    if (tableEntry.includes(userEntry)) {
      matches++;
    }
  }

  if (matches > 0) {
    return true;
  } else {
    return false;
  }
}

//renders a list view of table entries
//Add a spinner(?)
function renderListView(records) {
  contentContainer.innerHTML = "";

  for (var i = 0; i < records.length; i++) {
    //capitalize each word in corresponding fields
    var residenceCap = capitalizeEachWord(records[i].fields["residence"]);
    var workplaceCap = capitalizeEachWord(records[i].fields["workplace"]);

    const tableEntry = {
      residence: residenceCap,
      workplace: workplaceCap,
      start_time: records[i].fields["start_time"],
      end_time: records[i].fields["end_time"],
    };

    //conditional to change color of card shadow
    var card_shadow = "card-shadow-blue";
    if (i % 2 != 0) {
      card_shadow = "card-shadow-magenta";
    }

    //HTML for each table entry
    //renders each one of them as a card
    contentContainer.innerHTML += `
    <div class="row justify-content-center">
        <div onclick=${detailViewOf(records[i].id)}
        class="col-8 d-flex flex-column bg-blue m-4 p-4 justify-content-center align-items-center ${card_shadow}"
        style="cursor: pointer;"
        target='_blank'">
          <div class="title-text text-shadow">
            <i style="color: lightgreen;"class="fas fa-home"></i>
            ${tableEntry.residence}
            <i class="fas fa-long-arrow-alt-right"></i> 
            <i style="color: red;"
            class="fas fa-map-marker-alt"></i>
            ${tableEntry.workplace}
          </div>
          <div class="time-text text-shadow">
            ${tableEntry.start_time}-${tableEntry.end_time}
          </div>
        </div>
    </div>`;
  }
}

function detailViewOf(recordID) {
  return `window.open('detail-view.html?id=${recordID}','_blank');`;
}
//sort list view by residence/workplace/start_time & end_time
//do it via insertion sort

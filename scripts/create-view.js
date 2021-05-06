import { capitalizeEachWord } from "./helpers.js";
var residenceEntry = document.getElementById("residence");
var workplaceEntry = document.getElementById("workplace");
var start_timeEntry = document.getElementById("start-time");
var end_timeEntry = document.getElementById("end-time");
var createButton = document.getElementById("create-button");

createButton.addEventListener("mouseup", createCarple);

function test() {
  console.log(capitalizeEachWord(residenceEntry.value));
  console.log(capitalizeEachWord(workplaceEntry.value));
  console.log(start_timeEntry.value);
  console.log(end_timeEntry.value);
}

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

  console.log(dataToSend);
  fetch(
    "https://api.airtable.com/v0/appnvxGwUmI16KQPz/Groups?api_key=keyUbkyh9tjdFBa9O",
    {
      method: "post",
      body: dataToSend,
    }
  ).then((res) => {
    console.log("Request complete! response:", res);
  });
}

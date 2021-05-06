import { capitalizeEachWord } from "./helpers.js";

var body = document.body;

var residence = document.getElementById("residence");
var workplace = document.getElementById("workplace");
var startTime = document.getElementById("start-time");
var endTime = document.getElementById("end-time");
var discussion = document.getElementById("discussion");

var idParam = window.location.search.split("?id=");
console.log(idParam);
renderDetailView(idParam[1]);

var postButton = document.getElementById("post-button");
postButton.addEventListener("click", () => updateDiscussion(idParam[1]));

function renderDetailView(ID) {
  fetch(
    `https://api.airtable.com/v0/appnvxGwUmI16KQPz/Groups/${ID}?api_key=keyUbkyh9tjdFBa9O`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      residence.textContent = capitalizeEachWord(data.fields.residence);
      workplace.textContent = capitalizeEachWord(data.fields.workplace);
      startTime.textContent = data.fields.start_time;
      endTime.textContent = data.fields.end_time;
      discussion.innerHTML = renderDiscussionContent(data.fields.discussion);
    });
}

function renderDiscussionContent(discussion) {
  var finalHTML = "";

  //Seperate Each Post
  console.log(discussion);
  var discussionEntries = discussion.trim().split("#endDiscussion");
  console.log(discussionEntries);
  for (var i = discussionEntries.length - 2; i >= 0; i--) {
    var postContent = discussionEntries[i].split("#startDiscussion");
    var memberInfo = postContent[0].split(" ");

    var post = {
      memberName: memberInfo[0] + " " + memberInfo[1],
      memberPhone: memberInfo[2],
      memberEntry: postContent[1],
    };

    console.log("Post", post);

    finalHTML += `
      <div class="bg-dark-green m-3 container-fluid">
        <div class="row flex-column">
          <div class="col d-flex justify-content-between m-2">
            <span>${post.memberName}</span><span>${post.memberPhone}</span>
          </div>
          <div class="col m-2">
            <span>${post.memberEntry}</span>
          </div>
        </div>
      </div>
    `;
  }

  return finalHTML;
}

function updateDiscussion(ID) {
  var Airtable = require("airtable");
  var base = new Airtable({ apiKey: "keyUbkyh9tjdFBa9O" }).base(
    "appnvxGwUmI16KQPz"
  );

  base("Groups").update(
    [
      {
        id: ID,
        fields: {
          discussion:
            "FirstName1 LastName1 4089215982#startDiscussionSampleContent1#endDiscussion\nFirstName2 LastName2 4084555982#startDiscussionSampleContent2#endDiscussio...",
        },
      },
    ],
    function (err, records) {
      if (err) {
        console.error(err);
        return;
      }
      records.forEach(function (record) {
        console.log(record.get("end_time"));
      });
    }
  );
}
// Create entry form
// follow airtable formatting

import { capitalizeEachWord, sleep } from "./helpers.js";

var body = document.body;
const userIsLoggedIn = localStorage.getItem("loggedIn");
// Display Elements
var residence = document.getElementById("residence");
var workplace = document.getElementById("workplace");
var startTime = document.getElementById("start-time");
var endTime = document.getElementById("end-time");
var discussion = document.getElementById("discussion");

//discussion content
var discussionContent;

// Input Elements
var firstName = document.getElementById("firstname");
var lastName = document.getElementById("lastname");
var discussionEntry = document.getElementById("discussionEntry");
var contactNum = document.getElementById("contactNum");

var idParam = window.location.search.split("?id=");
renderDetailView(idParam[1]);

var postButton = document.getElementById("post-button");
postButton.addEventListener("click", () => postToDiscussion(idParam[1]));

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

function renderDetailView(ID) {
  fetch(
    `https://api.airtable.com/v0/appnvxGwUmI16KQPz/Groups/${ID}?api_key=keyUbkyh9tjdFBa9O`
  )
    .then((response) => response.json())
    .then((data) => {
      residence.textContent = capitalizeEachWord(data.fields.residence);
      workplace.textContent = capitalizeEachWord(data.fields.workplace);
      startTime.textContent = data.fields.start_time;
      endTime.textContent = data.fields.end_time;
      discussion.innerHTML = renderDiscussionContent(data.fields.discussion);
      discussionContent = data.fields.discussion;
    });
}

function renderDiscussionContent(discussion) {
  var finalHTML = "";

  console.log(discussion);
  if (typeof discussion === "undefined") {
    finalHTML = "<h1 class='text-center'>There are no posts yet...</h1>";
    return finalHTML;
  } else {
    //Seperate Each Post
    var discussionEntries = discussion.trim().split("#endDiscussion");
    for (var i = discussionEntries.length - 2; i >= 0; i--) {
      var postContent = discussionEntries[i].split("#startDiscussion");
      var memberInfo = postContent[0].trim().split(" ");

      var post = {
        memberName: memberInfo[0] + " " + memberInfo[1],
        memberPhone: memberInfo[2],
        memberEntry: postContent[1],
      };

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
}

function postToDiscussion(ID) {
  // Format Data
  //append if discussion is not empty
  if (discussionEntry.value.length == 0) {
    alert("ERROR: Please fill out all the fields");
  } else {
    if (typeof discussionContent != "undefined") {
      var formattedData =
        discussionContent +
        `${capitalizeEachWord(
          localStorage.getItem("firstName")
        )} ${capitalizeEachWord(
          localStorage.getItem("lastName")
        )} ${localStorage.getItem("contactNum")}#startDiscussion${
          discussionEntry.value
        }#endDiscussion `;
    } else {
      var formattedData = `${capitalizeEachWord(
        localStorage.getItem("firstName")
      )} ${capitalizeEachWord(
        localStorage.getItem("lastName")
      )} ${localStorage.getItem("contactNum")}#startDiscussion${
        discussionEntry.value
      }#endDiscussion `;
    }

    // Compose Data
    var dataToSend = JSON.stringify({
      records: [
        {
          id: ID,
          fields: {
            discussion: formattedData,
          },
        },
      ],
    });

    // Send Data
    fetch(
      "https://api.airtable.com/v0/appnvxGwUmI16KQPz/Groups?api_key=keyUbkyh9tjdFBa9O",
      {
        method: "PATCH",
        body: dataToSend,
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      console.log("Request complete! response:", res);
    });
    updateDiscussion();
  }
}

function updateDiscussion() {
  sleep(1).then(() => {
    location.reload();
  });
}
// follow airtable formatting

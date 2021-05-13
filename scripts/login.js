var usernameLogin = document.getElementById("usernameLogin");
var passwordLogin = document.getElementById("passwordLogin");
var loginButton = document.getElementById("login");
var errorsList = document.getElementById("errors");
var signUpButton = document.getElementById("signup");

console.log(usernameLogin);
console.log(passwordLogin);

usernameLogin.addEventListener("input", highlightFilled);
passwordLogin.addEventListener("input", highlightFilled);
loginButton.addEventListener("mouseup", login);
signUpButton.addEventListener("mouseup", () => {
  window.location.replace("./signup.html");
});

function test() {
  console.log("Test");
}

function highlightFilled() {
  var value = this.value;

  if (this.name != "contactNum") {
    if (value.length > 0) {
      this.dataset.state = "valid";
    } else {
      this.dataset.state = "invalid";
    }
  } else {
    if (this.value.toString().length == 10) {
      this.dataset.state = "valid";
    } else {
      this.dataset.state = "invalid";
    }
  }
}

function login() {
  var userMatched = false;

  if (!usernameLogin.value || !passwordLogin.value) {
    errorsList.innerHTML = `
    <li class="badge bg-danger" style="font-size: 15px;">Please fill out all the fields</li>
    `;
    return;
  }

  fetch(
    `https://api.airtable.com/v0/appnvxGwUmI16KQPz/Users?api_key=keyUbkyh9tjdFBa9O`
  )
    .then((response) => response.json())
    .then((data) => {
      for (var i = 0; i < data.records.length; i++) {
        if (
          data.records[i].fields["username"] == usernameLogin.value &&
          data.records[i].fields["password"] == passwordLogin.value
        ) {
          localStorage.setItem("loggedIn", true);
          localStorage.setItem(
            "firstName",
            data.records[i].fields["first_name"]
          );
          localStorage.setItem("lastName", data.records[i].fields["last_name"]);
          localStorage.setItem(
            "contactNum",
            data.records[i].fields["contact_num"]
          );
          localStorage.setItem("username", data.records[i].fields["username"]);
          userMatched = true;
          break;
        }
      }
    })
    .then(() => {
      if (userMatched) {
        window.location.replace("./index.html");
      } else {
        errorsList.innerHTML = `
        <li class="badge bg-danger" style="font-size: 15px;">Username and Password did not match.</li>
        `;
        usernameLogin.dataset.state = "invalid";
        passwordLogin.dataset.state = "invalid";
      }
    });
}

import { sleep } from "./helpers.js";
// Input Elements
var firstName = document.getElementById("firstName");
var lastName = document.getElementById("lastName");
var username = document.getElementById("username");
var password = document.getElementById("password");
var contactNum = document.getElementById("contactNum");
var confirmPassword = document.getElementById("confirmPassword");
var errorsList = document.getElementById("errors");
var inputFields = document.getElementById("inputFields");

// Submit Button
var signUpButton = document.getElementById("signup");
signUpButton.addEventListener("mouseup", createAcccount);

// Highlighting filled fields
const input = document.querySelectorAll("input");

console.log(input);

for (var i = 0; i < input.length; i++) {
  input[i].addEventListener("input", highlightFilled);
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

function createAcccount() {
  var formattedNum = contactNum.value.toString();
  var signupSuccess = true;
  errorsList.innerHTML = "";

  if (
    !firstName.value ||
    !lastName.value ||
    !contactNum.value ||
    !username.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    errorsList.innerHTML +=
      "<li class='p-1' style='font-size: 15px;'>Please fill out all the fields</li>";
    signupSuccess = false;
  }

  if (formattedNum.length < 10) {
    errorsList.innerHTML +=
      "<li class='p-1' style='font-size: 15px;'>Contact Num must be 10 digits</li>";
    contactNum.dataset.state = "invalid";
    signupSuccess = false;
  }

  if (password.value != confirmPassword.value) {
    errorsList.innerHTML +=
      "<li class='p-1' style='font-size: 15px;'>Passwords did not match! Please try again.</li>";
    password.dataset.state = "invalid";
    confirmPassword.dataset.state = "invalid";
    signupSuccess = false;
  }

  if (signupSuccess) {
    fetch(
      `https://api.airtable.com/v0/appnvxGwUmI16KQPz/Users?api_key=keyUbkyh9tjdFBa9O`
    )
      .then((response) => response.json())
      .then((data) => {
        var usernameTaken = data.records.filter(
          (record) => record.fields["username"] == username.value
        );

        if (usernameTaken.length >= 1) {
          errorsList.innerHTML +=
            "<li class='badge bg-danger' style='font-size: 15px;'>Username is already taken!</li>";
          signupSuccess = false;
        }
      })
      .then(() => {
        if (signupSuccess) {
          formattedNum = `(${formattedNum.slice(0, 3)})${formattedNum.slice(
            3,
            6
          )}-${formattedNum.slice(6)}`;

          var dataToSend = JSON.stringify({
            records: [
              {
                fields: {
                  username: username.value,
                  password: password.value,
                  first_name: firstName.value,
                  last_name: lastName.value,
                  contact_num: formattedNum,
                },
              },
            ],
          });

          fetch(
            "https://api.airtable.com/v0/appnvxGwUmI16KQPz/Users?api_key=keyUbkyh9tjdFBa9O",
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
              inputFields.innerHTML = `
              <h4 class='text-center'>Signup Success!</h4>
              <h4 class='text-center'>Redirecting to Login Page...</h4>
              <div class="spinner-border text-light" role="status">
              </div>
`;
              sleep(3).then(() => window.location.replace("./login.html"));
            });
        }
      });
  }
}

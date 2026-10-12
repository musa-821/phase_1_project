// ===== STEP 1: THINGS WE NEED =====
// The admin username and password (change these to your own)
const adminUsername = "admin";
const adminPassword = "admin123";

// The page that opens after a successful login (change to your students page name)
const studentPage = "index.html";

const form = document.getElementById("login-form");
const usernameBox = document.getElementById("username");
const passwordBox = document.getElementById("password");
const showPasswordBox = document.getElementById("show-password");
const errorMessage = document.getElementById("error-message");

// ===== STEP 2: ALREADY LOGGED IN? =====
// If the admin is already logged in, skip this page
if (sessionStorage.getItem("isAdminLoggedIn") == "true") {
  window.location.href = studentPage;
}

// ===== STEP 3: LOGIN BUTTON =====
form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading

  var username = usernameBox.value.trim();
  var password = passwordBox.value;

  if (username == adminUsername && password == adminPassword) {
    // Correct: remember the login and open the students page
    sessionStorage.setItem("isAdminLoggedIn", "true");
    window.location.href = studentPage;
  } else {
    // Wrong: show the error and clear the password box
    errorMessage.classList.remove("hidden");
    passwordBox.value = "";
    passwordBox.focus();
  }
});

// ===== STEP 4: HIDE THE ERROR WHEN THE USER TYPES AGAIN =====
usernameBox.addEventListener("input", hideError);
passwordBox.addEventListener("input", hideError);

function hideError() {
  errorMessage.classList.add("hidden");
}

// ===== STEP 5: SHOW / HIDE PASSWORD =====
showPasswordBox.addEventListener("change", function () {
  if (showPasswordBox.checked) {
    passwordBox.type = "text";
  } else {
    passwordBox.type = "password";
  }
});
window.addEventListener("beforeunload", function () {
  sessionStorage.removeItem("isAdminLoggedIn");
});
if (window.location.pathname.endsWith("login.html")) {
  sessionStorage.removeItem("isAdminLoggedIn");
}
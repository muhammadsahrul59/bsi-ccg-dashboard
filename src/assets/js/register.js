import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5gN65t8IR-lLobeTCfyIAQXTDkW9vCmc",
  authDomain: "authloginccg.firebaseapp.com",
  projectId: "authloginccg",
  storageBucket: "authloginccg.firebasestorage.app",
  messagingSenderId: "649967513477",
  appId: "1:649967513477:web:c813a2c15a19959eab1eec",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//submit button
const submit = document.getElementById("submit");
submit.addEventListener("click", function (event) {
  event.preventDefault();

  // inputs
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Check if email or password is empty
  if (email === "" || password === "") {
    alert("Please Input Email and Password !");
    return;
  }

  // Create user and send verification email
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Send verification email
      return sendEmailVerification(user);
    })
    .then(() => {
      // Email verification sent successfully
      window.location.href = "./email-verification.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      // Handle specific error cases
      if (errorCode === "auth/email-already-in-use") {
        alert("This email is already registered !");
      } else if (errorCode === "auth/weak-password") {
        alert("Password should be at least 8 characters !");
      } else if (errorCode === "auth/password-does-not-meet-requirements") {
        alert("Password Must Contain an Uppercase & Special Character");
      } else {
        alert(errorMessage);
      }
    });
});

const passwordInput = document.getElementById("password");
const submitButton = document.getElementById("submit");
const passwordChecklist = {
  length: document.getElementById("length-check"),
  uppercase: document.getElementById("uppercase-check"),
  special: document.getElementById("special-check"),
};

function validatePassword(password) {
  const rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  Object.keys(rules).forEach((rule) => {
    if (rules[rule]) {
      passwordChecklist[rule].classList.add("valid");
      passwordChecklist[rule].querySelector("i").className = "fa fa-check";
    } else {
      passwordChecklist[rule].classList.remove("valid");
      passwordChecklist[rule].querySelector("i").className = "fa fa-times";
    }
  });

  // Enable the submit button if all rules are valid
  submitButton.disabled = !Object.values(rules).every(Boolean);
}

passwordInput.addEventListener("input", (e) =>
  validatePassword(e.target.value)
);

const togglePassword = document.getElementById("toggle-password");

togglePassword.addEventListener("click", () => {
  const isPasswordHidden = passwordInput.type === "password";
  passwordInput.type = isPasswordHidden ? "text" : "password";

  // Update icon
  togglePassword.className = isPasswordHidden
    ? "fa-solid fa-eye position-absolute end-0 top-35 translate-middle-y me-3"
    : "fa-solid fa-eye-slash position-absolute end-0 top-35 translate-middle-y me-3";
});

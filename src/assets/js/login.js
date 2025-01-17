import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
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
auth.languageCode = "en";
const provider = new GoogleAuthProvider();

//login google

const loginGoogle = document.getElementById("login-google");
loginGoogle.addEventListener("click", function (event) {
  event.preventDefault(); // Add this line to prevent form submission

  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      console.log(user);
      window.location.href = "./index.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Google Sign In Error:", errorCode, errorMessage);
    });
});

//submit button
const submit = document.getElementById("submit");
submit.addEventListener("click", function (event) {
  event.preventDefault();

  // inputs
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Cek jika email atau password kosong
  if (email === "" || password === "") {
    alert("Please Input Email and Password !");
    return; // Menghentikan eksekusi lebih lanjut jika input kosong
  }

  // Melakukan login jika email dan password sudah diisi
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      if (!user.emailVerified) {
        signOut(auth);
        alert("Please verify your email before loggin in !");
        return;
      }
      window.location.href = "./index.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("The password is incorrect. Try Again !");
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
    ? "fa-solid fa-eye position-absolute end-0 top-75 translate-middle-y me-3"
    : "fa-solid fa-eye-slash position-absolute end-0 top-75 translate-middle-y me-3";
});

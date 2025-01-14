import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  updatePassword,
  signInWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebase configuration
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

// Flag to track logout process
let isLoggingOut = false;

// Timeout duration (1 minute in milliseconds)
const TIMEOUT_DURATION = 300000;
let timeoutId;

// Function to reset the inactivity timeout
const resetTimeout = () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    handleAutoLogout();
  }, TIMEOUT_DURATION);
};

// Auto logout function
const handleAutoLogout = async () => {
  try {
    isLoggingOut = true;
    await signOut(auth);
    alert("Session expired due to inactivity.");
    window.location.href = "./authentication-login.html";
  } catch (error) {
    console.error("Error during auto sign-out:", error);
    alert("Error during auto sign-out.");
  } finally {
    isLoggingOut = false;
  }
};

// Handle authentication state changes
onAuthStateChanged(auth, (user) => {
  if (!user && !isLoggingOut) {
    window.location.href = "./authentication-login.html";
  } else if (user) {
    console.log("User logged in:", user.email);
    resetTimeout(); // Start the timeout when user is logged in
  }
});

// Handle logout manually via button
document.getElementById("logout").addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    isLoggingOut = true;
    await signOut(auth);
    alert("Logout Success");
    window.location.href = "./authentication-login.html";
  } catch (error) {
    console.error("Error during sign-out:", error);
    alert("Error during sign-out.");
  } finally {
    isLoggingOut = false;
  }
});

// Add event listeners for user activity
["click", "mousemove", "keypress", "scroll", "touchstart"].forEach((event) => {
  window.addEventListener(event, resetTimeout);
});

// Start the initial timeout
resetTimeout();

// Function to toggle password visibility
function setupPasswordToggle(inputId, toggleId) {
  const passwordInput = document.getElementById(inputId);
  const toggleButton = document.getElementById(toggleId);

  if (passwordInput && toggleButton) {
    toggleButton.addEventListener("click", function () {
      // Toggle password visibility
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);

      // Toggle icon
      this.classList.toggle("fa-eye");
      this.classList.toggle("fa-eye-slash");
    });
  }
}

// Function to check password strength
function checkPassword(password) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  // Update checklist items
  document
    .getElementById("length-check")
    .classList.toggle("valid", checks.length);
  document
    .getElementById("uppercase-check")
    .classList.toggle("valid", checks.uppercase);
  document
    .getElementById("special-check")
    .classList.toggle("valid", checks.special);

  // Update icons
  document.querySelectorAll(".password-checklist li").forEach((item) => {
    if (item.classList.contains("valid")) {
      item.querySelector("i").classList.remove("fa-times");
      item.querySelector("i").classList.add("fa-check");
    } else {
      item.querySelector("i").classList.remove("fa-check");
      item.querySelector("i").classList.add("fa-times");
    }
  });
}

// Setup event listeners when document loads
document.addEventListener("DOMContentLoaded", function () {
  // Setup password toggles for all password fields
  setupPasswordToggle("password", "toggle-password");
  setupPasswordToggle("oldPassword", "toggle-old-password");
  setupPasswordToggle("newPassword", "toggle-new-password");
  setupPasswordToggle("confirmPassword", "toggle-confirm-password");

  // Setup password strength checker
  const passwordInputs = document.querySelectorAll('input[type="password"]');
  passwordInputs.forEach((input) => {
    input.addEventListener("input", (e) => checkPassword(e.target.value));
  });
});

// Change Password

// Get form element
const changePasswordForm = document.getElementById("changePasswordForm");

// Add submit event listener to form
changePasswordForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Get input values
  const oldPassword = document.getElementById("oldPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Validate new password matches confirm password
  if (newPassword !== confirmPassword) {
    const passwordError = document.getElementById("passwordError");
    passwordError.style.display = "block";
    return;
  }

  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("No user is currently signed in.");
      return;
    }

    // Create credentials with old password
    const credential = EmailAuthProvider.credential(user.email, oldPassword);

    // Reauthenticate user
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);

    // Show success message
    alert("Password successfully updated!");

    // Clear form
    changePasswordForm.reset();

    // Hide any error messages
    const passwordError = document.getElementById("passwordError");
    passwordError.style.display = "none";
  } catch (error) {
    console.error("Error updating password:", error);

    // Show appropriate error message based on error code
    if (error.code === "auth/wrong-password") {
      alert("The old password you entered is incorrect.");
    } else if (error.code === "auth/weak-password") {
      alert("The new password is too weak. Please choose a stronger password.");
    } else {
      alert("An error occurred while updating the password. Please try again.");
    }
  }
});

// Password validation
document.getElementById("newPassword").addEventListener("input", function () {
  const password = this.value;

  // Validate password requirements
  const hasLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Update checklist items
  document.getElementById("length-check").classList.toggle("valid", hasLength);
  document
    .getElementById("uppercase-check")
    .classList.toggle("valid", hasUpperCase);
  document
    .getElementById("special-check")
    .classList.toggle("valid", hasSpecialChar);
});

// Confirm password validation
document
  .getElementById("confirmPassword")
  .addEventListener("input", function () {
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = this.value;
    const passwordError = document.getElementById("passwordError");

    if (newPassword !== confirmPassword) {
      passwordError.style.display = "block";
    } else {
      passwordError.style.display = "none";
    }
  });

let isSignUp = false;
const USERS_KEY = 'rentalHubUsers';
const CURRENT_USER_KEY = 'rentalHubCurrentUser';

const authTitle = document.getElementById('authTitle');
const authSubtitle = document.getElementById('authSubtitle');
const nameGroup = document.getElementById('nameGroup');
const confirmGroup = document.getElementById('confirmGroup');
const checkboxText = document.getElementById('checkboxText');
const forgotLink = document.getElementById('forgotLink');
const authBtn = document.getElementById('authBtn');
const switchText = document.getElementById('switchText');
const switchLink = document.getElementById('switchLink');

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch { return []; }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function showError(message) {
  const errorEl = document.getElementById('passwordError');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }
}

function hideError() {
  const errorEl = document.getElementById('passwordError');
  if (errorEl) errorEl.style.display = 'none';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showWelcomePopup(name, isNewUser = false) {
  const popup = document.getElementById('welcomePopup');
  const message = document.getElementById('welcomeMessage');
  
  message.textContent = isNewUser ? `Welcome ${name}!` : `Welcome back, ${name}!`;
  popup.style.display = 'flex';
  
  setTimeout(() => {
    window.location.href = 'main.html';
  }, 3000);
}

function signUp(fullName, email, password) {
  const users = getUsers();
  
  if (users.find(u => u.email === email)) {
    showError('Email already exists');
    return false;
  }
  
  const newUser = { id: Date.now(), fullName, email, password };
  users.push(newUser);
  saveUsers(users);
  setCurrentUser({ id: newUser.id, fullName, email });
  showWelcomePopup(fullName, true);
  return true;
}

function signIn(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    showError('Invalid email or password');
    return false;
  }
  
  setCurrentUser({ id: user.id, fullName: user.fullName, email });
  showWelcomePopup(user.fullName, false);
  return true;
}

function toggleAuthMode() {
  isSignUp = !isSignUp;
  hideError();
  
  if (isSignUp) {
    authTitle.textContent = 'Create Account';
    authSubtitle.textContent = 'Join Rental Hub today';
    nameGroup.style.display = 'block';
    confirmGroup.style.display = 'block';
    checkboxText.textContent = 'I agree to Terms & Conditions';
    forgotLink.style.display = 'none';
    authBtn.textContent = 'Sign Up';
    switchText.innerHTML = 'Already have an account? <a href="#" id="switchLink">Sign In</a>';
  } else {
    authTitle.textContent = 'Welcome Back';
    authSubtitle.textContent = 'Sign in to your account';
    nameGroup.style.display = 'none';
    confirmGroup.style.display = 'none';
    checkboxText.textContent = 'Remember me';
    forgotLink.style.display = 'inline';
    authBtn.textContent = 'Sign In';
    switchText.innerHTML = 'Don\'t have an account? <a href="#" id="switchLink">Sign Up</a>';
  }
  
  // Event delegation will handle the click
}

// Check if user is already logged in
window.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
  if (currentUser) {
    window.location.href = 'main.html';
  }
});

// Use event delegation for switch link clicks
document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'switchLink') {
    e.preventDefault();
    toggleAuthMode();
  }
});

document.getElementById('authForm').addEventListener('submit', (e) => {
  e.preventDefault();
  hideError();
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  
  if (!validateEmail(email)) {
    showError('Please enter a valid email');
    return;
  }
  
  if (password.length < 6) {
    showError('Password must be at least 6 characters');
    return;
  }
  
  if (isSignUp) {
    const fullName = document.getElementById('fullName').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('remember').checked;
    
    if (!fullName) {
      showError('Please enter your full name');
      return;
    }
    
    if (password !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }
    
    if (!agreeTerms) {
      showError('Please agree to Terms & Conditions');
      return;
    }
    
    signUp(fullName, email, password);
  } else {
    signIn(email, password);
  }
});
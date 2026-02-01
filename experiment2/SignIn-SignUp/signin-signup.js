const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

const signupForm = document.getElementById('signupForm');
const signinForm = document.getElementById('signinForm');
const signupMsg = document.getElementById('signupMsg');
const signinMsg = document.getElementById('signinMsg');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// simple users storage (for demo purposes only)
function loadUsers(){
  return JSON.parse(localStorage.getItem('users') || '{}');
}
function saveUsers(u){
  localStorage.setItem('users', JSON.stringify(u));
}

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  signupMsg.textContent = '';
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim().toLowerCase();
  const password = document.getElementById('signupPassword').value;
  if(!name || !email || !password){
    signupMsg.textContent = 'Please fill all fields';
    signupMsg.className = 'form-msg error';
    return;
  }
  const users = loadUsers();
  if(users[email]){
    signupMsg.textContent = 'Email already registered';
    signupMsg.className = 'form-msg error';
    return;
  }
  users[email] = { name, password };
  saveUsers(users);
  signupMsg.textContent = 'Registered successfully. Please sign in.';
  signupMsg.className = 'form-msg success';
  signupForm.reset();
  // switch to sign in panel after a brief delay
  setTimeout(() => container.classList.remove('active'), 800);
});

signinForm.addEventListener('submit', (e) => {
  e.preventDefault();
  signinMsg.textContent = '';
  const email = document.getElementById('signinEmail').value.trim().toLowerCase();
  const password = document.getElementById('signinPassword').value;
  const users = loadUsers();
  if(!users[email] || users[email].password !== password){
    signinMsg.textContent = 'Invalid email or password';
    signinMsg.className = 'form-msg error';
    return;
  }
  localStorage.setItem('currentUser', JSON.stringify({ email, name: users[email].name }));
  // redirect to dashboard
  window.location.href = "../Dashboard/dashboard.html";
});
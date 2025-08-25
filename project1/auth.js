
function qs(id){ return document.getElementById(id); }
const demoUsers = [{name:'Demo User', email:'test@demo.com', password:'1234'}];

function loadUsers(){
  try{
    const s = localStorage.getItem('spot_users');
    if(!s){ localStorage.setItem('spot_users', JSON.stringify(demoUsers)); return demoUsers; }
    return JSON.parse(s);
  }catch(e){ return demoUsers; }
}

function saveUsers(users){ localStorage.setItem('spot_users', JSON.stringify(users)); }

function showError(id,msg){ const el = qs(id); el.style.display='block'; el.textContent = msg; setTimeout(()=>el.style.display='none',4000); }

document.addEventListener('DOMContentLoaded', ()=>{
  const path = location.pathname.split('/').pop();
  const users = loadUsers();

  // login form
  const lf = qs('loginForm');
  if(lf){
    lf.addEventListener('submit', e=>{
      e.preventDefault();
      const email = qs('email').value.trim().toLowerCase();
      const pass = qs('password').value;
      const u = users.find(x=>x.email===email && x.password===pass);
      if(u){ localStorage.setItem('spot_user', JSON.stringify(u)); location.href='index.html'; }
      else showError('error', 'Invalid credentials. Try demo: test@demo.com / 1234');
    });
    qs('btnRegister').addEventListener('click', ()=> location.href='register.html');
  }

  // register form
  const rf = qs('regForm');
  if(rf){
    qs('btnBack').addEventListener('click', ()=> location.href='login.html');
    rf.addEventListener('submit', e=>{
      e.preventDefault();
      const name = qs('name').value.trim();
      const email = qs('remail').value.trim().toLowerCase();
      const pass = qs('rpass').value;
      if(!name || !email || !pass){ showError('rerror','All fields required'); return; }
      if(users.find(x=>x.email===email)){ showError('rerror','Email already registered'); return; }
      users.push({name, email, password: pass});
      saveUsers(users);
      localStorage.setItem('spot_user', JSON.stringify({name, email}));
      location.href='index.html';
    });
  }

  // If already logged in and on login/register, go to index
  const logged = localStorage.getItem('spot_user');
  if(logged && (path==='login.html' || path==='register.html')) location.href='index.html';
});

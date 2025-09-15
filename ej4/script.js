
const API = 'http://localhost:3000/users';
const $ul = document.getElementById('users');
const $form = document.getElementById('form');
const $reload = document.getElementById('reload');
const $toast = document.getElementById('toast');

function toast(msg, ms = 1800){
  $toast.textContent = msg;
  $toast.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => $toast.hidden = true, ms);
}

async function fetchJSON(url, opts){
  const res = await fetch(url, { headers:{'Content-Type':'application/json'}, ...opts });
  if(!res.ok){
    const text = await res.text().catch(()=> '');
    throw new Error(`HTTP ${res.status} – ${text || res.statusText}`);
  }
  return res.status !== 204 ? res.json() : null;
}

function render(users){
  $ul.innerHTML = '';
  users.forEach(u => {
    const li = document.createElement('li');

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.innerHTML = `
      <div><span class="role">${u.role}</span>· ${u.name}</div>
      <small>${u.email}</small>
    `;

    const btnProm = document.createElement('button');
    btnProm.className = 'ghost';
    btnProm.textContent = 'Promote';
    btnProm.onclick = () => updateRole(u, +1);

    const btnDem = document.createElement('button');
    btnDem.className = 'ghost';
    btnDem.textContent = 'Demote';
    btnDem.onclick = () => updateRole(u, -1);

    const btnDel = document.createElement('button');
    btnDel.className = 'danger';
    btnDel.textContent = 'Delete';
    btnDel.onclick = () => removeUser(u.id);

    li.append(meta, btnProm, btnDem, btnDel);
    $ul.appendChild(li);
  });
}

async function load(){
  try{
    const users = await fetchJSON(API);
    render(users);
  }catch(err){
    console.error(err);
    toast(' No se pudo cargar. ¿Está corriendo JSON Server?');
  }
}

function nextRole(current, dir){
  const order = ['Viewer','Editor','Admin'];
  let i = order.indexOf(current);
  if(i < 0) i = 0;
  i = Math.min(order.length-1, Math.max(0, i + dir));
  return order[i];
}

async function updateRole(user, dir){
  try{
    const role = nextRole(user.role, dir);
    await fetchJSON(`${API}/${user.id}`, { method:'PATCH', body: JSON.stringify({ role }) });
    toast(`Rol actualizado a ${role}`);
    load();
  }catch(err){
    console.error(err);
    toast(' Error actualizando rol');
  }
}

async function removeUser(id){
  try{
    await fetchJSON(`${API}/${id}`, { method:'DELETE' });
    toast(' Usuario eliminado');
    load();
  }catch(err){
    console.error(err);
    toast(' Error eliminando');
  }
}

$form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData($form);
  const payload = Object.fromEntries(fd.entries());
  try{
    await fetchJSON(API, { method:'POST', body: JSON.stringify(payload) });
    $form.reset();
    toast(' Usuario agregado');
    load();
  }catch(err){
    console.error(err);
    toast(' Error agregando usuario');
  }
});

$reload.addEventListener('click', load);

// Init
load();

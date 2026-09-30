'use strict';

const view = document.getElementById('view');
const statusEl = document.getElementById('status');
let contacts = [];
let segments = ['Nou','Habitual','Empresa','Grup','VIP'];

function esc(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
async function api(url, options={}){
  const response = await fetch(url,{...options,headers:{'Content-Type':'application/json',...(options.headers||{})}});
  const data = await response.json().catch(()=>({}));
  if(!response.ok) throw new Error(data.error||`Error ${response.status}`);
  return data;
}
function setStatus(text=''){statusEl.textContent=text}

async function loadCrm(q=''){
  setStatus('Carregant...');
  const out=await api('/api/crm/contacts'+(q?`?q=${encodeURIComponent(q)}`:''));
  contacts=out.items||[];segments=out.segments||segments;
  renderCrm();setStatus(`${contacts.length} contactes`);
}

function renderCrm(){
  view.innerHTML=`
    <div class="head"><div><h1>CRM</h1><div class="muted">Contactes, preferències i seguiment comercial del Grup Tràfec.</div></div><button class="btn" id="newContact">+ Nou contacte</button></div>
    <div class="panel toolbar"><input id="search" placeholder="Buscar per nom, telèfon, email, segment..." style="max-width:420px"><button class="btn secondary" id="searchBtn">Buscar</button><button class="btn secondary" id="clearBtn">Netejar</button></div>
    <div class="panel tableWrap"><table><thead><tr><th>Client</th><th>Telèfon</th><th>Email</th><th>Segment</th><th></th></tr></thead><tbody>
      ${contacts.map(c=>`<tr><td><b>${esc(c.name)}</b></td><td>${esc(c.phone)}</td><td>${esc(c.email)}</td><td>${esc(c.segment)}</td><td><button class="rowBtn" data-edit="${esc(c.id)}">Editar</button></td></tr>`).join('')||'<tr><td colspan="5" class="empty">Encara no hi ha contactes CRM.</td></tr>'}
    </tbody></table></div>`;
  document.getElementById('newContact').onclick=()=>renderForm();
  document.getElementById('searchBtn').onclick=()=>loadCrm(document.getElementById('search').value.trim()).catch(showError);
  document.getElementById('clearBtn').onclick=()=>loadCrm().catch(showError);
  document.getElementById('search').onkeydown=e=>{if(e.key==='Enter')loadCrm(e.target.value.trim()).catch(showError)};
  document.querySelectorAll('[data-edit]').forEach(btn=>btn.onclick=()=>renderForm(contacts.find(x=>x.id===btn.dataset.edit)));
}

function renderForm(contact=null){
  const c=contact||{};
  view.innerHTML=`
    <div class="head"><div><h1>${contact?'Editar contacte':'Nou contacte'}</h1><div class="muted">CRM global de Grup Tràfec.</div></div><button class="btn secondary" id="back">← CRM</button></div>
    <form class="panel" id="contactForm"><div class="grid">
      <div><label>Nom *</label><input id="f_name" required value="${esc(c.name||'')}"></div>
      <div><label>Segment</label><select id="f_segment">${segments.map(s=>`<option ${s===c.segment?'selected':''}>${esc(s)}</option>`).join('')}</select></div>
      <div><label>Telèfon</label><input id="f_phone" value="${esc(c.phone||'')}"></div>
      <div><label>Email</label><input id="f_email" type="email" value="${esc(c.email||'')}"></div>
      <div class="wide"><label>Preferències i al·lèrgies</label><textarea id="f_preferences">${esc(c.preferences||'')}</textarea></div>
      <div class="wide"><label>Notes</label><textarea id="f_notes">${esc(c.notes||'')}</textarea></div>
      <div class="wide"><label><input id="f_active" type="checkbox" style="width:auto" ${c.active===false?'':'checked'}> Actiu</label></div>
    </div><div class="toolbar" style="margin-top:16px"><button class="btn" type="submit">Guardar</button><button class="btn secondary" type="button" id="cancel">Cancel·lar</button></div></form>`;
  document.getElementById('back').onclick=()=>loadCrm().catch(showError);
  document.getElementById('cancel').onclick=()=>loadCrm().catch(showError);
  document.getElementById('contactForm').onsubmit=async e=>{
    e.preventDefault();setStatus('Guardant...');
    const field=id=>document.getElementById(id);
    const payload={
      name:field('f_name').value.trim(),
      phone:field('f_phone').value.trim(),
      email:field('f_email').value.trim(),
      segment:field('f_segment').value,
      preferences:field('f_preferences').value.trim(),
      notes:field('f_notes').value.trim(),
      active:field('f_active').checked
    };
    try{
      if(contact) await api(`/api/crm/contacts/${encodeURIComponent(contact.id)}`,{method:'PUT',body:JSON.stringify(payload)});
      else await api('/api/crm/contacts',{method:'POST',body:JSON.stringify(payload)});
      await loadCrm();setStatus('Guardat');
    }catch(error){showError(error)}
  };
}

function renderHome(){
  view.innerHTML=`<div class="head"><div><h1>GRUP TRÀFEC</h1><div class="muted">Gestió central del grup.</div></div></div><div class="panel"><b>Nucli nou actiu.</b><p>Les funcions es construeixen aquí una sola vegada. Els centres i miniapps s’afegiran després com a accessos governats.</p></div>`;
  setStatus('');
}
function showError(error){setStatus('Error');alert(error.message||error)}

document.querySelector('[data-view="home"]').onclick=()=>{document.querySelectorAll('.side button').forEach(x=>x.classList.remove('active'));document.querySelector('[data-view="home"]').classList.add('active');renderHome()};
document.querySelector('[data-view="crm"]').onclick=()=>{document.querySelectorAll('.side button').forEach(x=>x.classList.remove('active'));document.querySelector('[data-view="crm"]').classList.add('active');loadCrm().catch(showError)};
renderHome();

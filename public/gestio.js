'use strict';

let governMiniapps = [];
let governCentres = [];
let governEmployees = [];

function shellActive(name){
  document.querySelectorAll('[data-shell]').forEach(btn=>btn.classList.toggle('active',btn.dataset.shell===name));
}

function toolCard(title, text, action, disabled=false){
  return `<button class="toolCard${disabled?' disabled':''}" ${disabled?'disabled':''} data-tool="${esc(action)}"><span class="toolTitle">${esc(title)}</span><span class="toolText">${esc(text)}</span></button>`;
}

function renderGestioHome(){
  shellActive('home');
  view.innerHTML=`
    <div class="head"><div><h1>Gestió Grup Tràfec</h1><div class="muted">Accés de govern i configuració del sistema.</div></div></div>
    <div class="toolGrid">
      ${toolCard('Front Office','Eines operatives de cara al servei.','front')}
      ${toolCard('Back Office','Eines de gestió i seguiment.','back')}
      ${toolCard('RRHH','Persones i organització.','rrhh')}
      ${toolCard('Configuració','Centres, empleats i miniapps disponibles.','config')}
    </div>`;
  setStatus('');
  bindToolCards();
}

function bindToolCards(){
  document.querySelectorAll('[data-tool]').forEach(btn=>{
    btn.onclick=()=>{
      const tool=btn.dataset.tool;
      if(tool==='front') renderFrontOffice();
      else if(tool==='back') renderBackOffice();
      else if(tool==='rrhh') loadGovern('rrhh').catch(showError);
      else if(tool==='config') loadGovern('config').catch(showError);
      else if(tool==='reserves') loadReservations().catch(showError);
      else if(tool==='crm') loadCrm().catch(showError);
      else if(tool==='commercial') loadCommercial().catch(showError);
    };
  });
}

function renderFrontOffice(){
  shellActive('front');
  view.innerHTML=`
    <div class="head"><div><h1>Front Office</h1><div class="muted">Només hi connectem eines que existeixen.</div></div></div>
    <div class="toolGrid">
      ${toolCard('Reserves / Ocupació','Obre l’eina de reserves existent.','reserves')}
    </div>`;
  setStatus('');bindToolCards();
}

function renderBackOffice(){
  shellActive('back');
  view.innerHTML=`
    <div class="head"><div><h1>Back Office</h1><div class="muted">Eines de gestió ja connectades.</div></div></div>
    <div class="toolGrid">
      ${toolCard('CRM','Obre el CRM existent.','crm')}
      ${toolCard('Comercial / Grups','Obre la gestió comercial existent.','commercial')}
    </div>`;
  setStatus('');bindToolCards();
}

async function loadGovern(target='config'){
  setStatus('Carregant...');
  const [appsOut, centresOut, employeesOut] = await Promise.all([
    api('/api/govern/miniapps'),
    api('/api/govern/centres'),
    api('/api/govern/employees')
  ]);
  governMiniapps=appsOut.items||[];
  governCentres=centresOut.items||[];
  governEmployees=employeesOut.items||[];
  if(target==='rrhh') renderRrhh(); else renderConfig();
  setStatus('');
}

function centreNames(ids){
  const set=new Set(ids||[]);
  return governCentres.filter(c=>set.has(c.id)).map(c=>c.name).join(', ')||'—';
}

function miniappNames(ids){
  const set=new Set(ids||[]);
  return governMiniapps.filter(a=>set.has(a.id)).map(a=>a.name).join(', ')||'—';
}

function renderRrhh(){
  shellActive('rrhh');
  view.innerHTML=`
    <div class="head"><div><h1>RRHH</h1><div class="muted">Les dades només apareixen quan es crea un empleat.</div></div><button class="btn" id="rrhhNew">+ Nou empleat</button></div>
    <div class="panel tableWrap"><table><thead><tr><th>Nom</th><th>Funció / rol</th><th>Centre</th><th>Estat</th><th></th></tr></thead><tbody>
      ${governEmployees.map(e=>`<tr><td><b>${esc(e.name)}</b></td><td>${esc(e.role||'—')}</td><td>${esc(centreNames(e.centreIds))}</td><td>${e.active===false?'Inactiu':'Actiu'}</td><td><button class="rowBtn" data-edit-employee="${esc(e.id)}">Editar</button></td></tr>`).join('')||'<tr><td colspan="5" class="empty">No hi ha empleats creats.</td></tr>'}
    </tbody></table></div>`;
  document.getElementById('rrhhNew').onclick=()=>renderEmployeeForm();
  document.querySelectorAll('[data-edit-employee]').forEach(btn=>btn.onclick=()=>renderEmployeeForm(governEmployees.find(x=>x.id===btn.dataset.editEmployee)));
}

function renderConfig(){
  shellActive('config');
  view.innerHTML=`
    <div class="head"><div><h1>Configuració</h1><div class="muted">Aquí es construeix cada centre: sense centres ni empleats inventats.</div></div><div class="toolbar"><button class="btn secondary" id="newEmployee">+ Nou empleat</button><button class="btn" id="newCentre">+ Nou centre</button></div></div>
    <div class="panel tableWrap"><h3>Centres</h3><table><thead><tr><th>Centre</th><th>Miniapps assignades</th><th>Estat</th><th></th></tr></thead><tbody>
      ${governCentres.map(c=>`<tr><td><b>${esc(c.name)}</b></td><td>${esc(miniappNames(c.miniapps))}</td><td>${c.active===false?'Inactiu':'Actiu'}</td><td><button class="rowBtn" data-edit-centre="${esc(c.id)}">Configurar</button></td></tr>`).join('')||'<tr><td colspan="4" class="empty">No hi ha cap centre creat. Crea el primer quan correspongui.</td></tr>'}
    </tbody></table></div>
    <div class="panel tableWrap"><h3>Empleats</h3><table><thead><tr><th>Nom</th><th>Funció / rol</th><th>Centre</th><th></th></tr></thead><tbody>
      ${governEmployees.map(e=>`<tr><td><b>${esc(e.name)}</b></td><td>${esc(e.role||'—')}</td><td>${esc(centreNames(e.centreIds))}</td><td><button class="rowBtn" data-edit-employee="${esc(e.id)}">Editar</button></td></tr>`).join('')||'<tr><td colspan="4" class="empty">No hi ha empleats creats.</td></tr>'}
    </tbody></table></div>`;
  document.getElementById('newCentre').onclick=()=>renderCentreForm();
  document.getElementById('newEmployee').onclick=()=>renderEmployeeForm();
  document.querySelectorAll('[data-edit-centre]').forEach(btn=>btn.onclick=()=>renderCentreForm(governCentres.find(x=>x.id===btn.dataset.editCentre)));
  document.querySelectorAll('[data-edit-employee]').forEach(btn=>btn.onclick=()=>renderEmployeeForm(governEmployees.find(x=>x.id===btn.dataset.editEmployee)));
}

function renderCentreForm(centre=null){
  const c=centre||{};
  const selected=new Set(c.miniapps||[]);
  shellActive('config');
  view.innerHTML=`
    <div class="head"><div><h1>${centre?'Configurar centre':'Nou centre'}</h1><div class="muted">El centre neix buit. Selecciona només les miniapps que vulguis assignar-li.</div></div><button class="btn secondary" id="backConfig">← Configuració</button></div>
    <form class="panel" id="centreForm">
      <div class="grid"><div class="wide"><label>Nom del centre *</label><input id="centreName" required value="${esc(c.name||'')}"></div><div class="wide"><label>Notes</label><textarea id="centreNotes">${esc(c.notes||'')}</textarea></div></div>
      <h3>Miniapps disponibles</h3>
      <div class="checkGrid">${governMiniapps.map(a=>`<label class="checkItem"><input type="checkbox" name="centreApp" value="${esc(a.id)}" ${selected.has(a.id)?'checked':''}><span>${esc(a.name)}</span></label>`).join('')}</div>
      <div class="toolbar formActions"><label class="inlineCheck"><input id="centreActive" type="checkbox" ${c.active===false?'':'checked'}> Centre actiu</label><button class="btn" type="submit">Guardar centre</button></div>
    </form>`;
  document.getElementById('backConfig').onclick=()=>loadGovern('config').catch(showError);
  document.getElementById('centreForm').onsubmit=async e=>{
    e.preventDefault();
    const payload={
      name:document.getElementById('centreName').value.trim(),
      notes:document.getElementById('centreNotes').value.trim(),
      miniapps:[...document.querySelectorAll('input[name="centreApp"]:checked')].map(x=>x.value),
      active:document.getElementById('centreActive').checked
    };
    try{
      setStatus('Guardant...');
      if(centre) await api(`/api/govern/centres/${encodeURIComponent(centre.id)}`,{method:'PUT',body:JSON.stringify(payload)});
      else await api('/api/govern/centres',{method:'POST',body:JSON.stringify(payload)});
      await loadGovern('config');setStatus('Guardat');
    }catch(error){showError(error)}
  };
}

function renderEmployeeForm(employee=null){
  const e=employee||{};
  const selected=new Set(e.centreIds||[]);
  shellActive('config');
  view.innerHTML=`
    <div class="head"><div><h1>${employee?'Editar empleat':'Nou empleat'}</h1><div class="muted">No es pressuposa cap centre: només s’assignen els que existeixen.</div></div><button class="btn secondary" id="backEmployees">← Configuració</button></div>
    <form class="panel" id="employeeForm"><div class="grid">
      <div><label>Nom *</label><input id="employeeName" required value="${esc(e.name||'')}"></div>
      <div><label>Funció / rol</label><input id="employeeRole" value="${esc(e.role||'')}"></div>
      <div><label>Telèfon</label><input id="employeePhone" value="${esc(e.phone||'')}"></div>
      <div><label>Email</label><input id="employeeEmail" type="email" value="${esc(e.email||'')}"></div>
    </div>
    <h3>Centres assignats</h3>
    <div class="checkGrid">${governCentres.map(c=>`<label class="checkItem"><input type="checkbox" name="employeeCentre" value="${esc(c.id)}" ${selected.has(c.id)?'checked':''}><span>${esc(c.name)}</span></label>`).join('')||'<div class="empty compact">Encara no hi ha centres creats. L’empleat pot quedar sense centre assignat.</div>'}</div>
    <div class="toolbar formActions"><label class="inlineCheck"><input id="employeeActive" type="checkbox" ${e.active===false?'':'checked'}> Empleat actiu</label><button class="btn" type="submit">Guardar empleat</button></div></form>`;
  document.getElementById('backEmployees').onclick=()=>loadGovern('config').catch(showError);
  document.getElementById('employeeForm').onsubmit=async ev=>{
    ev.preventDefault();
    const payload={
      name:document.getElementById('employeeName').value.trim(),
      role:document.getElementById('employeeRole').value.trim(),
      phone:document.getElementById('employeePhone').value.trim(),
      email:document.getElementById('employeeEmail').value.trim(),
      centreIds:[...document.querySelectorAll('input[name="employeeCentre"]:checked')].map(x=>x.value),
      active:document.getElementById('employeeActive').checked
    };
    try{
      setStatus('Guardant...');
      if(employee) await api(`/api/govern/employees/${encodeURIComponent(employee.id)}`,{method:'PUT',body:JSON.stringify(payload)});
      else await api('/api/govern/employees',{method:'POST',body:JSON.stringify(payload)});
      await loadGovern('config');setStatus('Guardat');
    }catch(error){showError(error)}
  };
}

document.querySelector('[data-shell="home"]').onclick=renderGestioHome;
document.querySelector('[data-shell="front"]').onclick=renderFrontOffice;
document.querySelector('[data-shell="back"]').onclick=renderBackOffice;
document.querySelector('[data-shell="rrhh"]').onclick=()=>loadGovern('rrhh').catch(showError);
document.querySelector('[data-shell="config"]').onclick=()=>loadGovern('config').catch(showError);

renderGestioHome();

/* RishtaSutra member/admin demo portal.
   Demo storage is browser-local. Do not use this localStorage implementation for real member data. */
(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const DB = 'rishtasutra_demo_v2';
  const SESSION = 'rishtasutra_demo_session';
  const FREE_LIMIT = 2;
  const demoMembers = [
    {id:'sample-1',name:'Aarav Kulkarni',age:29,gender:'Groom',education:'MBA',city:'Pune',about:'Values family, learning and a balanced lifestyle.',sample:true},
    {id:'sample-2',name:'Ananya Deshmukh',age:27,gender:'Bride',education:'M.Com',city:'Mumbai',about:'Enjoys travel, reading and meaningful conversations.',sample:true},
    {id:'sample-3',name:'Rohan Patil',age:30,gender:'Groom',education:'Software Engineer',city:'Bengaluru',about:'Interested in technology, music and exploring new places.',sample:true},
    {id:'sample-4',name:'Isha Shah',age:26,gender:'Bride',education:'Architect',city:'Pune',about:'Creative, curious and close to family.',sample:true}
  ];
  const getDB = () => { try { return JSON.parse(localStorage.getItem(DB)) || {users:[],events:[],ads:[],usage:{}}; } catch { return {users:[],events:[],ads:[],usage:{}}; } };
  const saveDB = d => localStorage.setItem(DB, JSON.stringify(d));
  const session = () => { try { return JSON.parse(sessionStorage.getItem(SESSION)); } catch { return null; } };
  const setSession = u => u ? sessionStorage.setItem(SESSION, JSON.stringify({id:u.id,email:u.email,name:u.name,role:u.role})) : sessionStorage.removeItem(SESSION);
  const toast = msg => { const el=$('#toast'); if(el){el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),3600);} else alert(msg); };
  const safe = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fileData = file => new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve({name:file.name,type:file.type,data:r.result,size:file.size});r.onerror=reject;r.readAsDataURL(file);});
  const currentUser = () => { const s=session(); if(!s)return null; const d=getDB(); return d.users.find(u=>u.id===s.id) || (s.role==='admin'?s:null); };
  const openPortal = () => { const u=currentUser(); if(!u){ $('#portalOpenBtn')?.blur(); document.querySelector('[data-open-auth="login"]')?.click(); toast('Log in first to open your portal.'); return; } $('#portalSection').hidden=false; $('#portalSection').scrollIntoView({behavior:'smooth'}); renderPortal(); };
  const usageFor = (d,u) => d.usage[u.id] || {used:[],paid:false};
  function renderPortal(){
    const u=currentUser(); if(!u)return;
    $('#portalWelcome').innerHTML=`<div><strong>Welcome, ${safe(u.name)}!</strong><span>${u.role==='admin'?'Administrator demo account':'Member account'} · ${safe(u.email)}</span></div>${u.role==='admin'?'<button class="btn btn-primary" id="adminOpen">Open admin panel</button>':''}`;
    const d=getDB(); const usage=usageFor(d,u); const remaining=usage.paid?'Unlimited':Math.max(0,FREE_LIMIT-usage.used.length);
    $('#quotaText').textContent=usage.paid?'Paid access active — unlimited views/downloads':`${remaining} free view/download${remaining===1?'':'s'} remaining`;
    $('#quotaBar').style.width=usage.paid?'100%':`${(usage.used.length/FREE_LIMIT)*100}%`;
    const own=u.profile||{};
    const form=$('#biodataForm');
    ['fullName','age','gender','education','city','about'].forEach(k=>{if(form.elements[k])form.elements[k].value=own[k]|| (k==='fullName'?u.name:'');});
    $('#biodataStatus').textContent=own.file?`Attached biodata: ${own.file.name}`:'No biodata file attached yet.';
    const members=[...demoMembers,...d.users.filter(x=>x.id!==u.id&&x.profile&&x.profile.fullName).map(x=>({id:x.id,name:x.profile.fullName,age:x.profile.age,gender:x.profile.gender,education:x.profile.education,city:x.profile.city,about:x.profile.about,member:true}))];
    $('#memberDirectory').innerHTML=members.map(m=>`<article class="member-row"><div><strong>${safe(m.name)}</strong><span>${safe(m.age||'—')} · ${safe(m.education||'Education not added')} · ${safe(m.city||'Location not added')}</span><small>${m.sample?'Fictional sample profile':'Member profile'}</small></div><div class="member-actions"><button class="btn btn-outline btn-small" data-member-view="${safe(m.id)}">View</button><button class="btn btn-primary btn-small" data-member-download="${safe(m.id)}">Download</button></div></article>`).join('')||'<p>No member profiles are available yet.</p>';
    const events=d.events.slice().sort((a,b)=>b.created-a.created);
    $('#portalEvents').innerHTML=events.map(eventCard).join('')||'<p class="event-empty">No events published yet.</p>';
    const ads=d.ads.filter(a=>a.active);
    $('#portalAds').innerHTML=ads.map(ad=>`<a class="sponsor-card" href="${safe(ad.url)}" target="_blank" rel="noopener noreferrer"><img src="${ad.image.data}" alt="${safe(ad.brand)} advertisement"><strong>${safe(ad.brand)}</strong><span>${safe(ad.description)}</span><small>Sponsored · Opens advertiser website ↗</small></a>`).join('')||'<p class="event-empty">No sponsored ads published yet.</p>';
    if(u.role==='admin') renderAdmin();
  }
  function eventCard(e){return `<article class="event-card"><img src="${e.image.data}" alt="${safe(e.title)}"><div><span class="event-status">${safe(e.status)}</span><h3>${safe(e.title)}</h3><time>${safe(e.date)}</time><p>${safe(e.description)}</p></div></article>`;}
  function adCard(a){return `<article class="admin-item"><img src="${a.image.data}" alt=""><div><strong>${safe(a.brand)}</strong><p>${safe(a.description)}</p><small>${safe(a.placement)} placement · ${a.active?'Live':'Paused'}</small></div><button class="btn btn-outline btn-small" data-ad-toggle="${a.id}">${a.active?'Pause':'Publish'}</button><button class="btn btn-outline btn-small" data-ad-delete="${a.id}">Delete</button></article>`;}
  function renderAdmin(){
    const d=getDB();
    $('#adminEventList').innerHTML=d.events.map(e=>`<article class="admin-item"><img src="${e.image.data}" alt=""><div><strong>${safe(e.title)}</strong><p>${safe(e.date)} · ${safe(e.status)}</p></div><button class="btn btn-outline btn-small" data-event-delete="${e.id}">Delete</button></article>`).join('')||'<p>No events yet.</p>';
    $('#adminAdList').innerHTML=d.ads.map(adCard).join('')||'<p>No advertisements yet.</p>';
    $('#adminMemberList').innerHTML=d.users.map(m=>`<article class="admin-item"><div><strong>${safe(m.name)}</strong><p>${safe(m.email)}</p><small>${m.role==='admin'?'Admin':'Member'} · ${m.profile?'Biodata completed':'Profile incomplete'}</small></div></article>`).join('')||'<p>No registered demo members yet.</p>';
  }
  function openAdmin(){if(currentUser()?.role!=='admin'){toast('Admin access only. Sign in with the demo administrator account.');return;}$('#adminModal').hidden=false;renderAdmin();}
  function switchAdminTab(tab){$$('[data-admin-tab]').forEach(b=>b.classList.toggle('active',b.dataset.adminTab===tab));$('#adminEventsPane').hidden=tab!=='events';$('#adminAdsPane').hidden=tab!=='ads';$('#adminMembersPane').hidden=tab!=='members';}
  function accessMember(id,download){
    const u=currentUser();if(!u){toast('Please log in to view member profiles.');return;}
    const d=getDB(),usage=usageFor(d,u);
    if(!usage.paid&&!usage.used.includes(id)&&usage.used.length>=FREE_LIMIT){toast('You have used your 2 free profile views/downloads. Choose paid access to continue.');showPaywall();return;}
    const m=demoMembers.find(x=>x.id===id)||d.users.find(x=>x.id===id);
    if(!m){toast('Profile not found.');return;}
    const profile=m.profile||m;
    if(!usage.used.includes(id)&&!usage.paid)usage.used.push(id);
    d.usage[u.id]=usage;saveDB(d);
    if(download){
      const blob=new Blob([`RISHTASUTRA BIODATA\\n\\nName: ${profile.fullName||profile.name||''}\\nAge: ${profile.age||''}\\nGender: ${profile.gender||''}\\nEducation: ${profile.education||''}\\nCity: ${profile.city||''}\\nAbout: ${profile.about||''}\\n\\nDemo export. Verify all details with the profile owner.`],{type:'text/plain'});
      const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`RishtaSutra-${(profile.fullName||profile.name||'biodata').replace(/[^a-z0-9_-]/gi,'_')}.txt`;a.click();URL.revokeObjectURL(url);toast('Biodata text downloaded.');
    } else {
      alert(`MEMBER BIODATA\\n\\nName: ${profile.fullName||profile.name||''}\\nAge: ${profile.age||''}\\nGender: ${profile.gender||''}\\nEducation: ${profile.education||''}\\nCity: ${profile.city||''}\\nAbout: ${profile.about||''}\\n\\nContact details are not displayed in this demo.`);
    }
    renderPortal();
  }
  function showPaywall(){
    const old=$('#paywallModal');if(old)old.remove();
    const box=document.createElement('div');box.id='paywallModal';box.className='admin-backdrop';box.innerHTML=`<section class="paywall-card"><button class="modal-close" id="paywallClose">×</button><span class="mini-label">MEMBERSHIP</span><h2>Continue with paid access</h2><p>Your two free profile views/downloads have been used. Paid access can unlock more member profiles.</p><div class="paywall-price">₹1,999 <small>/ 6 months (demo price)</small></div><p class="admin-warning">Payment processing is not connected. This demo cannot collect money or activate a real subscription.</p><button class="btn btn-primary" id="demoActivate">Activate demo access</button></section>`;document.body.append(box);
    $('#paywallClose').onclick=()=>box.remove();
    $('#demoActivate').onclick=()=>{const u=currentUser();if(!u)return;const d=getDB();d.usage[u.id]={...(d.usage[u.id]||{used:[]}),paid:true};saveDB(d);box.remove();renderPortal();toast('Demo paid access activated in this browser only. No payment was taken.');};
  }
  // Intercept the original UI's front-end-only authentication form.
  const authForm=$('#authForm');
  authForm.addEventListener('submit',async e=>{
    e.preventDefault();e.stopImmediatePropagation();
    const isRegister=$('.auth-tab.active').dataset.authTab==='register';
    const email=$('#authEmail').value.trim().toLowerCase(),password=$('#authPassword').value;
    const name=$('#authName').value.trim();
    if(isRegister&&!$('#authConsent').checked){toast('Accept the terms to continue.');return;}
    const d=getDB();
    if(isRegister){
      if(d.users.some(x=>x.email===email)){toast('This email already exists in this browser. Log in instead.');return;}
      const u={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),name,email,password,role:'member',profile:{fullName:name}};
      d.users.push(u);d.usage[u.id]={used:[],paid:false};saveDB(d);setSession(u);
      if(window.closeModal)window.closeModal($('#authModal'));else $('#authModal').classList.remove('open');
      toast(`Demo account created. Your login ID is ${email}. Keep your password safe.`);openPortal();return;
    }
    // Deliberate demo credentials; never use this local password store for production.
    if(email==='admin@rishtasutra.demo'&&password==='Admin@123'){
      let admin={id:'demo-admin',name:'RishtaSutra Admin',email,role:'admin'};setSession(admin);
      if(window.closeModal)window.closeModal($('#authModal'));else $('#authModal').classList.remove('open');
      toast('Signed in to demo administrator.');openPortal();return;
    }
    const u=d.users.find(x=>x.email===email&&x.password===password);
    if(!u){toast('Login failed. Check the email and password, or create a demo account.');return;}
    setSession(u);if(window.closeModal)window.closeModal($('#authModal'));else $('#authModal').classList.remove('open');toast('Login successful.');openPortal();
  },true);
  $('#portalOpenBtn')?.addEventListener('click',openPortal);
  $('#portalLogout')?.addEventListener('click',()=>{setSession(null);$('#portalSection').hidden=true;toast('Logged out.');});
  $('#portalWelcome')?.addEventListener('click',e=>{if(e.target.closest('#adminOpen'))openAdmin();});
  $('#biodataForm')?.addEventListener('submit',async e=>{
    e.preventDefault();const u=currentUser();if(!u)return;
    const f=e.currentTarget, fd=new FormData(f);const profile={};
    ['fullName','age','gender','education','city','about'].forEach(k=>profile[k]=fd.get(k));
    const file=f.elements.biodataFile.files[0];
    if(file){if(file.size>800*1024){toast('Please use a biodata file smaller than 800 KB for this demo.');return;}profile.file=await fileData(file);}
    const d=getDB(),idx=d.users.findIndex(x=>x.id===u.id);if(idx>=0){d.users[idx].profile={...(d.users[idx].profile||{}),...profile};saveDB(d);}
    $('#biodataStatus').textContent=profile.file?`Saved biodata and attachment: ${profile.file.name}`:'Biodata saved.';toast('Biodata saved in this browser.');renderPortal();
  });
  $('#memberDirectory')?.addEventListener('click',e=>{const v=e.target.closest('[data-member-view]'),d=e.target.closest('[data-member-download]');if(v)accessMember(v.dataset.memberView,false);if(d)accessMember(d.dataset.memberDownload,true);});
  $('#adminClose')?.addEventListener('click',()=>$('#adminModal').hidden=true);
  $('#adminModal')?.addEventListener('click',e=>{if(e.target===$('#adminModal'))$('#adminModal').hidden=true;});
  $$('[data-admin-tab]').forEach(b=>b.addEventListener('click',()=>switchAdminTab(b.dataset.adminTab)));
  $('#eventForm')?.addEventListener('submit',async e=>{
    e.preventDefault();if(currentUser()?.role!=='admin')return toast('Admin access required.');
    const f=e.currentTarget,fd=new FormData(f),file=f.elements.image.files[0];if(!file)return;
    if(file.size>800*1024)return toast('Image must be smaller than 800 KB in this demo.');
    const image=await fileData(file),event={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),title:fd.get('title'),date:fd.get('date'),status:fd.get('status'),description:fd.get('description'),image,created:Date.now()};
    const db=getDB();db.events.unshift(event);saveDB(db);f.reset();renderPortal();renderPublicEvents();toast('Event published to the demo website.');
  });
  $('#adForm')?.addEventListener('submit',async e=>{
    e.preventDefault();if(currentUser()?.role!=='admin')return toast('Admin access required.');
    const f=e.currentTarget,fd=new FormData(f),file=f.elements.image.files[0];if(!file)return;
    if(file.size>800*1024)return toast('Image must be smaller than 800 KB in this demo.');
    const image=await fileData(file),ad={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),brand:fd.get('brand'),description:fd.get('description'),url:fd.get('url'),placement:fd.get('placement'),image,active:fd.get('active')==='on'};
    const db=getDB();db.ads.unshift(ad);saveDB(db);f.reset();renderPortal();renderAds();renderAdmin();toast('Advertisement saved and displayed in the demo.');
  });
  $('#adminModal')?.addEventListener('click',e=>{
    const delEvent=e.target.closest('[data-event-delete]'),toggle=e.target.closest('[data-ad-toggle]'),delAd=e.target.closest('[data-ad-delete]');
    if(delEvent){const d=getDB();d.events=d.events.filter(x=>x.id!==delEvent.dataset.eventDelete);saveDB(d);renderPortal();renderPublicEvents();renderAdmin();}
    if(toggle){const d=getDB(),a=d.ads.find(x=>x.id===toggle.dataset.adToggle);if(a)a.active=!a.active;saveDB(d);renderPortal();renderAds();renderAdmin();}
    if(delAd){const d=getDB();d.ads=d.ads.filter(x=>x.id!==delAd.dataset.adDelete);saveDB(d);renderPortal();renderAds();renderAdmin();}
  });
  function renderPublicEvents(){const d=getDB();const markup=d.events.slice().sort((a,b)=>b.created-a.created).map(eventCard).join('')||'<p class="event-empty">Events added by the administrator will appear here.</p>';const target=$('#publicEvents');if(target)target.innerHTML=markup;const archive=$('#publicEventsArchive');if(archive)archive.innerHTML=markup;}
  function renderAds(){
    const ads=getDB().ads.filter(a=>a.active),make=a=>`<a class="rail-ad" href="${safe(a.url)}" target="_blank" rel="noopener noreferrer"><img src="${a.image.data}" alt="${safe(a.brand)} advertisement"><span>Sponsored · ${safe(a.brand)}</span></a>`;
    $('#adRailLeft').innerHTML=ads.filter(a=>a.placement==='all'||a.placement==='left').map(make).join('');
    $('#adRailRight').innerHTML=ads.filter(a=>a.placement==='all'||a.placement==='right').map(make).join('');
    const top=ads.filter(a=>a.placement==='all'||a.placement==='top');
    const homeAds=$('#homeTopAds');if(homeAds)homeAds.innerHTML=ads.map(a=>`<a class="home-sponsored-card" href="${safe(a.url)}" target="_blank" rel="noopener noreferrer"><img src="${a.image.data}" alt="${safe(a.brand)} advertisement"><span class="sponsored-label">SPONSORED</span><strong>${safe(a.brand)}</strong><p>${safe(a.description)}</p><small>Visit advertiser ↗</small></a>`).join('')||'<p class="event-empty">Sponsored placements added by the administrator will appear here.</p>';
    let banner=$('#liveAdBanner');if(!banner&&top.length){banner=document.createElement('div');banner.id='liveAdBanner';banner.className='live-ad-banner';$('.announcement').after(banner);}
    if(banner)banner.innerHTML=top.map(make).join('');
  }
  // Public event cards and ads render from local demo content.
  renderPublicEvents();renderAds();
  if(session()){const u=currentUser();if(u){$('#portalSection').hidden=false;renderPortal();}}
  // Add a discreet admin shortcut in the footer for demo setup.
  const footer=$('.site-footer');
  if(footer){const link=document.createElement('button');link.className='admin-shortcut';link.textContent='Admin demo login';link.addEventListener('click',()=>{const email=$('#authEmail'),pass=$('#authPassword');document.querySelector('[data-open-auth="login"]')?.click();setTimeout(()=>{document.querySelector('[data-auth-tab="login"]')?.click();$('#authEmail').value='admin@rishtasutra.demo';$('#authPassword').value='Admin@123';},50);});footer.append(link);}
})();

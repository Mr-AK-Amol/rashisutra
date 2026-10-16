// RishtaSutra front-end demo. All profiles are fictional and all actions are local-only.
const profiles = [
  {id:1,name:"Ananya",age:27,gender:"Bride",city:"Pune",state:"Maharashtra",community:"Hindu",education:"Postgraduate",degree:"MBA, Marketing",occupation:"Marketing Manager",industry:"Technology",height:"5'4\"",marital:"Never married",language:"Marathi, English, Hindi",interests:"Travel, books, classical music",bio:"I value kindness, honest conversations and a sense of humour. I enjoy discovering new cafés, travelling when I can and spending time with family. Hoping to meet someone who values partnership and personal growth.",cover:"rose",initial:"A",joined:6},
  {id:2,name:"Arjun",age:29,gender:"Groom",city:"Mumbai",state:"Maharashtra",community:"Hindu",education:"Professional",degree:"B.Tech, Computer Science",occupation:"Software Engineer",industry:"Technology",height:"5'10\"",marital:"Never married",language:"Hindi, English, Marathi",interests:"Trekking, cooking, photography",bio:"Curious by nature and happiest on a mountain trail or trying a new recipe. I appreciate warmth, independence and people who are comfortable being themselves.",cover:"sage",initial:"A",joined:5},
  {id:3,name:"Meera",age:26,gender:"Bride",city:"Bengaluru",state:"Karnataka",community:"Jain",education:"Postgraduate",degree:"M.Sc, Data Science",occupation:"Data Analyst",industry:"Analytics",height:"5'3\"",marital:"Never married",language:"Kannada, English, Hindi",interests:"Art, yoga, weekend trips",bio:"A calm, optimistic person who enjoys learning new things. Family matters to me, and so do mutual respect, curiosity and building a life as a team.",cover:"blue",initial:"M",joined:4},
  {id:4,name:"Rohan",age:31,gender:"Groom",city:"Delhi",state:"Delhi",community:"Hindu",education:"Postgraduate",degree:"M.Com, Finance",occupation:"Finance Consultant",industry:"Finance",height:"5'11\"",marital:"Never married",language:"Hindi, English",interests:"Badminton, history, food",bio:"I believe the strongest relationships are built on friendship, trust and shared effort. Outside work, you'll find me playing badminton or exploring local food spots.",cover:"peach",initial:"R",joined:3},
  {id:5,name:"Isha",age:28,gender:"Bride",city:"Hyderabad",state:"Telangana",community:"Christian",education:"Graduate",degree:"B.Des, Communication Design",occupation:"UX Designer",industry:"Design",height:"5'5\"",marital:"Never married",language:"Telugu, English, Hindi",interests:"Illustration, films, pets",bio:"Designer by profession, doodler by habit. I value empathy, good conversations and a home where both people feel seen, supported and free to grow.",cover:"lilac",initial:"I",joined:2},
  {id:6,name:"Kabir",age:30,gender:"Groom",city:"Pune",state:"Maharashtra",community:"Sikh",education:"Professional",degree:"B.E., Mechanical Engineering",occupation:"Project Lead",industry:"Manufacturing",height:"6'0\"",marital:"Never married",language:"Punjabi, Hindi, English",interests:"Cycling, music, volunteering",bio:"Grounded, family-oriented and always up for a long cycling route. Looking for a relationship built on respect, laughter and a shared willingness to keep growing.",cover:"gold",initial:"K",joined:1},
  {id:7,name:"Sana",age:25,gender:"Bride",city:"Mumbai",state:"Maharashtra",community:"Muslim",education:"Graduate",degree:"B.Com",occupation:"Business Analyst",industry:"Consulting",height:"5'2\"",marital:"Never married",language:"Urdu, Hindi, English",interests:"Reading, baking, travel",bio:"I enjoy simple things: thoughtful conversations, baking for loved ones and learning about different cultures. I value kindness and emotional maturity.",cover:"rose",initial:"S",joined:7},
  {id:8,name:"Dev",age:32,gender:"Groom",city:"Abroad",state:"United Kingdom",community:"Hindu",education:"Postgraduate",degree:"M.S., Information Systems",occupation:"Product Manager",industry:"Technology",height:"5'9\"",marital:"Never married",language:"Gujarati, English, Hindi",interests:"Running, cinema, cooking",bio:"Based overseas for work but strongly connected to family and home. Hoping to meet someone who values openness, humour and making decisions together.",cover:"blue",initial:"D",joined:8},
  {id:9,name:"Priya",age:29,gender:"Bride",city:"Pune",state:"Maharashtra",community:"Hindu",education:"Professional",degree:"B.Pharm",occupation:"Healthcare Professional",industry:"Healthcare",height:"5'4\"",marital:"Never married",language:"Marathi, Hindi, English",interests:"Gardening, music, walks",bio:"A thoughtful and practical person who loves plants, music and unhurried weekends. I hope to build a supportive partnership rooted in mutual respect.",cover:"sage",initial:"P",joined:9}
];
const state = { visible:6, saved:new Set(), sent:new Set(), blocked:new Set(), reported:new Set(), activeProfile:null };
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
const grid = $("#profileGrid");
let toastTimer;

function toast(message) {
  const el = $("#toast"); el.textContent = message; el.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(()=>el.classList.remove("show"), 2900);
}
function initials(name){ return name.split(/\s+/).map(s=>s[0]).slice(0,2).join("").toUpperCase(); }
function profileCard(p) {
  const saved = state.saved.has(p.id), sent = state.sent.has(p.id);
  return `<article class="profile-card">
    <div class="profile-cover cover-${p.cover}">
      <span class="profile-demo-tag">SAMPLE PROFILE</span>
      <div class="profile-avatar avatar-${p.cover}">${initials(p.name)}</div>
      <div class="profile-card-actions"><button class="icon-btn ${saved?'saved':''}" data-save="${p.id}" aria-label="${saved?'Remove from':'Add to'} shortlist" title="Shortlist">${saved?'♥':'♡'}</button><button class="icon-btn" data-report="${p.id}" aria-label="Report profile" title="Report profile">⚑</button></div>
    </div>
    <div class="profile-info">
      <div class="profile-name-row"><h3 class="profile-name">${p.name} <span class="profile-age">, ${p.age}</span></h3><span title="Sample data" style="color:#c49a52;font-size:13px">✦</span></div>
      <p class="profile-location"><span>⌖</span> ${p.city}, ${p.state}</p>
      <div class="profile-tags"><span class="profile-tag">${p.community}</span><span class="profile-tag">${p.marital}</span><span class="profile-tag">${p.education}</span></div>
      <div class="profile-divider"></div>
      <div class="profile-meta"><div class="meta-item"><span>Profession</span><b>${p.occupation}</b></div><div class="meta-item"><span>Height</span><b>${p.height}</b></div></div>
      <div class="profile-actions"><button class="btn btn-outline" data-view="${p.id}">View profile</button><button class="btn btn-primary" data-interest="${p.id}">${sent?'Interest sent ✓':'Express interest ↗'}</button></div>
    </div>
  </article>`;
}
function getFilteredProfiles() {
  const gender = $("#searchGender").value;
  const min = parseInt($("#ageMin").value,10)||18, max = parseInt($("#ageMax").value,10)||99;
  const location = $("#searchLocation").value;
  const community = $("#communityFilter").value;
  const education = $("#educationFilter").value;
  const sort = $("#sortFilter").value;
  let list = profiles.filter(p => !state.blocked.has(p.id) && (gender==="Any" || p.gender===gender) && p.age>=Math.min(min,max) && p.age<=Math.max(min,max) && (location==="All" || p.city===location) && (community==="All" || p.community===community) && (education==="All" || p.education===education));
  if(sort==="ageAsc") list.sort((a,b)=>a.age-b.age);
  else if(sort==="ageDesc") list.sort((a,b)=>b.age-a.age);
  else list.sort((a,b)=>a.joined-b.joined);
  return list;
}
function renderProfiles() {
  const list = getFilteredProfiles(), shown = list.slice(0,state.visible);
  grid.innerHTML = shown.length ? shown.map(profileCard).join("") : `<div class="empty-state"><b>No sample profiles found</b>Try adjusting your age, location or other filters.</div>`;
  $("#resultsCount").textContent = `${list.length} sample profile${list.length===1?'':'s'} found`;
  $("#showMoreBtn").style.display = list.length>state.visible ? "inline-flex" : "none";
}
function openModal(id){ const el=$("#"+id); if(!el)return; el.classList.add("open");el.setAttribute("aria-hidden","false");document.body.style.overflow="hidden"; }
function closeModal(el){el.classList.remove("open");el.setAttribute("aria-hidden","true");if(!$(".modal-backdrop.open"))document.body.style.overflow="";}
function showInfo(title,text){$("#infoModalTitle").textContent=title;$("#infoModalText").textContent=text;openModal("infoModal");}
function openProfile(id) {
  const p=profiles.find(x=>x.id===Number(id)); if(!p)return;
  state.activeProfile=p.id;
  const saved=state.saved.has(p.id), sent=state.sent.has(p.id);
  $("#profileModalContent").innerHTML=`<div class="profile-cover cover-${p.cover}"><span class="profile-demo-tag">SAMPLE PROFILE · NOT A REAL MEMBER</span><div class="profile-avatar avatar-${p.cover}">${initials(p.name)}</div></div>
  <h2 id="profileModalTitle">${p.name}, ${p.age}</h2><p class="profile-detail-sub">⌖ ${p.city}, ${p.state} · ${p.community} · ${p.marital}</p>
  <div class="profile-tags"><span class="profile-tag">${p.education}</span><span class="profile-tag">${p.height}</span><span class="profile-tag">${p.language.split(",")[0]}</span></div>
  <div class="profile-detail-grid"><div class="profile-detail-cell"><small>Education</small><b>${p.degree}</b></div><div class="profile-detail-cell"><small>Profession</small><b>${p.occupation}</b></div><div class="profile-detail-cell"><small>Languages</small><b>${p.language}</b></div><div class="profile-detail-cell"><small>Interests</small><b>${p.interests}</b></div></div>
  <p class="profile-bio">${p.bio}</p><p class="modal-disclaimer">Fictional sample profile. In a live website, personal information and photos should be shown according to each member's privacy settings.</p>
  <div class="profile-modal-actions"><button class="btn btn-outline" data-save="${p.id}">${saved?'♥ Shortlisted':'♡ Add to shortlist'}</button><button class="btn btn-primary" data-interest="${p.id}">${sent?'Interest sent ✓':'Express interest ↗'}</button></div>`;
  openModal("profileModal");
}
function doInterest(id) {
  const p=profiles.find(x=>x.id===Number(id)); if(!p)return;
  if(state.sent.has(p.id)){toast("Your demo interest has already been recorded.");return;}
  state.sent.add(p.id);renderProfiles();if(state.activeProfile===p.id)openProfile(p.id);
  toast(`Demo interest recorded for ${p.name}. No message was sent.`);
}
function toggleSave(id) {
  id=Number(id);
  if(state.saved.has(id)){state.saved.delete(id);toast("Removed from your demo shortlist.");}
  else {state.saved.add(id);toast("Added to your demo shortlist.");}
  renderProfiles(); if(state.activeProfile===id && $("#profileModal").classList.contains("open"))openProfile(id);
}
function reportProfile(id) {
  const p=profiles.find(x=>x.id===Number(id));if(!p)return;
  showInfo("Report sample profile",`This is fictional demo data for ${p.name}. In a live service, this action would open a report form and send the report to the moderation team. No report was sent.`);
}
function setAuthMode(mode){
  const isRegister=mode==="register";
  $$(".auth-tab").forEach(b=>b.classList.toggle("active",b.dataset.authTab===mode));
  $("#registerFields").style.display=isRegister?"block":"none";
  $("#consentRow").style.display=isRegister?"flex":"none";
  $("#authName").required=isRegister;$("#authConsent").required=isRegister;
  $("#authTitle").textContent=isRegister?"Create your demo profile":"Welcome back";
  $("#authSubmit").innerHTML=isRegister?'Create demo profile <span>↗</span>':'Log in to demo <span>↗</span>';
  $("#authPassword").value="";$("#authEmail").value="";$("#authName").value="";
}
function openAuth(mode="register"){setAuthMode(mode);openModal("authModal");}
function applySearch(){$("#profiles").scrollIntoView({behavior:"smooth"});state.visible=6;renderProfiles();toast("Search filters applied to sample profiles.");}

$("#year").textContent=new Date().getFullYear();
renderProfiles();
$("#heroSearch").addEventListener("submit",e=>{e.preventDefault();applySearch();});
["searchGender","ageMin","ageMax","searchLocation","communityFilter","educationFilter","sortFilter"].forEach(id=>$("#"+id).addEventListener("change",()=>{state.visible=6;renderProfiles();}));
$("#resetFilters").addEventListener("click",()=>{$("#searchGender").value="Bride";$("#ageMin").value="21";$("#ageMax").value="30";$("#searchLocation").value="All";$("#communityFilter").value="All";$("#educationFilter").value="All";$("#sortFilter").value="recent";state.visible=6;renderProfiles();toast("Filters reset.");});
$("#showMoreBtn").addEventListener("click",()=>{state.visible+=3;renderProfiles();});
grid.addEventListener("click",e=>{
  const save=e.target.closest("[data-save]"), view=e.target.closest("[data-view]"), interest=e.target.closest("[data-interest]"), report=e.target.closest("[data-report]");
  if(save){e.preventDefault();toggleSave(save.dataset.save);}
  else if(view){openProfile(view.dataset.view);}
  else if(interest){doInterest(interest.dataset.interest);}
  else if(report){reportProfile(report.dataset.report);}
});
document.addEventListener("click",e=>{
  const auth=e.target.closest("[data-open-auth]");if(auth){openAuth(auth.dataset.openAuth);return;}
  const tab=e.target.closest("[data-auth-tab]");if(tab){setAuthMode(tab.dataset.authTab);return;}
  const close=e.target.closest("[data-close-modal]");if(close){const modal=close.closest(".modal-backdrop");if(modal)closeModal(modal);return;}
  const plan=e.target.closest("[data-plan]");if(plan){if(plan.dataset.plan==="Free")openAuth("register");else showInfo(`${plan.dataset.plan} membership`,`The ${plan.dataset.plan} plan is shown for design demonstration only. Payment processing and membership activation are not connected. A live website requires a backend, verified payment gateway webhooks, invoices, refund workflows and configured plan rules.`);return;}
  const staticLink=e.target.closest("[data-static-page]");if(staticLink){e.preventDefault();showInfo(staticLink.dataset.staticPage,`${staticLink.dataset.staticPage} content is a placeholder in this demo. Publish reviewed, accurate business details and legally reviewed policy text before launch.`);return;}
  const save=e.target.closest("#profileModal [data-save]");if(save){toggleSave(save.dataset.save);return;}
  const interest=e.target.closest("#profileModal [data-interest]");if(interest){doInterest(interest.dataset.interest);return;}
  if(e.target.classList.contains("modal-backdrop"))closeModal(e.target);
});
$("#authForm").addEventListener("submit",e=>{
  e.preventDefault();
  const isRegister=$(".auth-tab.active").dataset.authTab==="register";
  if(isRegister&&!$("#authConsent").checked){toast("Please accept the demo terms to continue.");return;}
  const name=$("#authName").value.trim();
  showInfo(isRegister?"Demo registration preview":"Demo login preview",isRegister?`Thanks${name?`, ${name}`:""}! This form is only a front-end demonstration. It has not created an account, sent a verification email or OTP, or saved your details.`:"Login is not connected to an authentication service. No account was accessed.");
  closeModal($("#authModal"));
});
$("#mobileMenuBtn").addEventListener("click",()=>{const open=$("#mainNav").classList.toggle("open");$("#mobileMenuBtn").setAttribute("aria-expanded",String(open));});
$$(".main-nav a").forEach(a=>a.addEventListener("click",()=>{$("#mainNav").classList.remove("open");$("#mobileMenuBtn").setAttribute("aria-expanded","false");$$(".main-nav a").forEach(n=>n.classList.toggle("active",n===a));}));
document.addEventListener("keydown",e=>{if(e.key==="Escape")$$(".modal-backdrop.open").forEach(closeModal);});

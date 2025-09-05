
/* ---------- Demo data ---------- */
const topDoctors = [
  {id:'DOC-100', name:'Dr. Arjun Singh', spec:'Cardiologist', rating:4.9, city:'Patiala'},
  {id:'DOC-101', name:'Dr. Meera Kapoor', spec:'Dermatologist', rating:4.8, city:'Chandigarh'},
  {id:'DOC-102', name:'Dr. Rohan Gupta', spec:'General Physician', rating:4.7, city:'Nabha'},
  {id:'DOC-103', name:'Dr. Simran Kaur', spec:'Gynecologist', rating:4.6, city:'Ludhiana'}
];

const availableDoctors = [
  {id:'DOC-102', name:'Dr. Rohan Gupta', spec:'General Physician', online:true, phone:'+91-90000-00001', clinic:'Nabha Health Clinic'},
  {id:'DOC-110', name:'Dr. Karan Malhotra', spec:'Endocrinologist', online:true, phone:'+91-90000-00002', clinic:'Sunrise Medical'},
  {id:'DOC-101', name:'Dr. Meera Kapoor', spec:'Dermatologist', online:false, phone:'+91-90000-00003', clinic:'SkinCare Center'},
];

const visitedDoctors = [
  {id:'DOC-14237', name:'Dr. Amanpreet Singh', spec:'General Physician', last:'2025-08-15'},
  {id:'DOC-090', name:'Dr. Jaspreet Kaur', spec:'ENT', last:'2025-06-20'}
];

const pharmacies = [
  {name:'Nabha Pharmacy', lat:0, lng:0, meds:['Paracetamol','Ibuprofen']},
  {name:'HolyMed Pharmacy', lat:0, lng:0, meds:['Omeprazole','Cetirizine']},
];

// Family members data
const familyMembers = {
  harjit: {
    name: 'Harjit Singh',
    relation: 'Husband',
    id: 'PAT-0002',
    age: 35,
    avatar: 'HS',
    medicalSummary: 'No chronic conditions recorded • Allergies: None',
    recentPrescriptions: [
      'Atorvastatin 20mg — 2025-07-15',
      'Metformin 500mg — 2025-06-20'
    ]
  },
  simran: {
    name: 'Simran Kaur',
    relation: 'Daughter',
    id: 'PAT-0003',
    age: 8,
    avatar: 'SK',
    medicalSummary: 'Asthma (mild) • Allergies: Pollen',
    recentPrescriptions: [
      'Salbutamol inhaler — 2025-08-05',
      'Montelukast 5mg — 2025-07-28'
    ]
  }
};

/* ---------- Tab switching ---------- */
const tabNodes = document.querySelectorAll('.navitem');
const sections = document.querySelectorAll('.section');
tabNodes.forEach(node=>{
  node.addEventListener('click', () => {
    tabNodes.forEach(n=>n.classList.remove('active'));
    node.classList.add('active');
    const tab = node.dataset.tab;
    sections.forEach(s=>{ s.classList.remove('active'); s.setAttribute('aria-hidden','true') });
    const target = document.getElementById(tab);
    if(target){ target.classList.add('active'); target.removeAttribute('aria-hidden') }
    // small UX: if switching to doctors, re-render lists
    if(tab === 'doctors') { renderTopDoctors(); renderAvailable(); renderVisited(); }
    if(tab === 'pharmacies') { renderPharmacies(); }
  });
});

/* ---------- Family member panel ---------- */
function openFamilyMemberPanel(memberId) {
  const member = familyMembers[memberId];
  if (!member) return;
  
  const panel = document.getElementById('familyMemberPanel');
  const content = document.getElementById('familyMemberDetails');
  
  content.innerHTML = `
    <div class="family-member-info">
      <div class="family-member-avatar">${member.avatar}</div>
      <div class="family-member-details">
        <div class="family-member-name">${member.name}</div>
        <div class="family-member-relation">${member.relation} • Age ${member.age}</div>
        <div class="family-member-id">${member.id} • Nabha, Punjab</div>
      </div>
    </div>
    
    <div class="family-member-section">
      <div class="family-member-section-title">Medical Summary</div>
      <div class="small">${member.medicalSummary}</div>
    </div>
    
    <div class="family-member-section">
      <div class="family-member-section-title">Recent Prescriptions</div>
      <ul class="small" style="margin:0 0 0 16px">
        ${member.recentPrescriptions.map(p => `<li>${p}</li>`).join('')}
      </ul>
    </div>
    
    <button class="family-member-login-btn" onclick="loginAsFamilyMember('${memberId}')">
      Login to ${member.name}'s Profile
    </button>
  `;
  
  panel.classList.add('open');
  document.body.style.overflow = 'hidden'; // Prevent scrolling when panel is open
}

function closeFamilyMemberPanel() {
  const panel = document.getElementById('familyMemberPanel');
  panel.classList.remove('open');
  document.body.style.overflow = ''; // Re-enable scrolling
}

function loginAsFamilyMember(memberId) {
  const member = familyMembers[memberId];
  toast(`Logging in as ${member.name}...`);
  closeFamilyMemberPanel();
  // In a real app, this would redirect to the family member's profile
}

// Add click handlers to family member items
document.querySelectorAll('.family-member-item').forEach(item => {
  item.addEventListener('click', () => {
    const memberId = item.dataset.member;
    openFamilyMemberPanel(memberId);
  });
});

// Close panel when clicking outside content
document.getElementById('familyMemberPanel').addEventListener('click', (e) => {
  if (e.target === document.getElementById('familyMemberPanel')) {
    closeFamilyMemberPanel();
  }
});

/* ---------- Render hero (top doctors) ---------- */
function renderTopDoctors(){
  const container = document.getElementById('topDoctorsHero');
  container.innerHTML = '';
  topDoctors.forEach(d=>{
    const card = document.createElement('div');
    card.className='hero-card';
    card.innerHTML = `
      <div class="photo">${d.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
      <div style="font-weight:800">${d.name}</div>
      <div class="small muted">${d.spec} • ${d.city}</div>
      <div style="margin-top:10px;display:flex;justify-content:space-between;align-items:center">
        <div class="rating">★ ${d.rating.toFixed(1)}</div>
        <div><button class="btn ghost" onclick="openDoctor('${d.id}')">View</button></div>
      </div>
    `;
    container.appendChild(card);
  });
}

/* ---------- Available doctors ---------- */
let activeDoctorFilter = 'all';
function setDoctorFilter(el){
  document.querySelectorAll('.pill').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
  activeDoctorFilter = el.dataset.filter;
  renderAvailable();
}

function renderAvailable(){
  const q = document.getElementById('docSearch').value.trim().toLowerCase();
  const list = document.getElementById('availableList');
  list.innerHTML = '';
  const filtered = availableDoctors.filter(d=>{
    if(activeDoctorFilter === 'online' && !d.online) return false;
    if(q && !(d.name.toLowerCase().includes(q) || d.spec.toLowerCase().includes(q))) return false;
    return true;
  });
  if(filtered.length === 0){
    list.innerHTML = '<div class="small muted">No doctors match your search.</div>';
    return;
  }
  filtered.forEach(d=>{
    const row = document.createElement('div');
    row.className='doctor-row';
    row.innerHTML = `
      <div class="doctor-avatar">${d.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
      <div class="doctor-info">
        <div style="font-weight:800">${d.name}</div>
        <div class="small muted">${d.spec} • ${d.clinic}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
        <div class="status ${d.online? '' : 'busy'}">${d.online? 'Online' : 'Busy'}</div>
        <div class="actions">
          <button class="btn" onclick="requestConnect('${d.id}')">Connect</button>
          <button class="btn ghost" onclick="openDoctor('${d.id}')">Details</button>
        </div>
      </div>
    `;
    list.appendChild(row);
  });
}

/* ---------- Visited doctors ---------- */
function renderVisited(){
  const container = document.getElementById('visitedList');
  container.innerHTML = '';
  visitedDoctors.forEach(v=>{
    const el = document.createElement('div');
    el.className='visited-item';
    el.innerHTML = `
      <div style="width:48px;height:48px;border-radius:8px;background:#eaf7f0;display:grid;place-items:center;font-weight:700;color:var(--brand)">${v.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
      <div style="flex:1">
        <div style="font-weight:800">${v.name}</div>
        <div class="small muted">${v.spec} • last: ${v.last}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <button class="btn ghost" onclick="openDoctor('${v.id}')">View</button>
        <button class="btn" onclick="toast('Requesting follow-up with ${v.name}...')">Request</button>
      </div>
    `;
    container.appendChild(el);
  });
}

/* ---------- Doctor drawer ---------- */
const drawer = document.getElementById('docDrawer');
function openDoctor(id){
  // find doctor in any list
  const doc = [...topDoctors, ...availableDoctors, ...visitedDoctors].find(x=>x.id === id) || { id, name:'Unknown', spec:'—' };
  const content = document.getElementById('drawerContent');
  content.innerHTML = `
    <div style="display:flex;gap:12px;align-items:center;margin-bottom:10px">
      <div style="width:80px;height:80px;border-radius:12px;background:#eaf7f0;display:grid;place-items:center;font-weight:800;color:var(--brand)">
        ${doc.name ? doc.name.split(' ').map(w=>w[0]).slice(0,2).join('') : 'DR'}
      </div>
      <div>
        <div style="font-weight:900">${doc.name}</div>
        <div class="small muted">${doc.spec || 'Specialist'}</div>
        <div class="small muted">ID: ${doc.id}</div>
      </div>
    </div>
    <div style="margin-bottom:12px"><strong>Clinic</strong><div class="small muted">${doc.clinic || 'Main Clinic, Nabha'}</div></div>
    <div style="margin-bottom:12px"><strong>About</strong><div class="small muted">Experienced ${doc.spec || 'physician'} with patient-first approach. Accepts teleconsults and in-person appointments.</div></div>
    <div style="display:flex;gap:8px">
      <button class="btn" onclick="toast('Initiating chat with ${doc.name}...')">Chat</button>
      <button class="btn ghost" onclick="toast('Calling ${doc.name}...')">Call</button>
      <button class="btn ghost" onclick="toast('Video with ${doc.name}...')">Video</button>
    </div>
    <div style="margin-top:14px">
      <div style="font-weight:800;margin-bottom:8px">Clinic Location</div>
      <div style="height:140px;border-radius:10px;background:#eef8f4;display:grid;place-items:center;color:var(--muted)">Map placeholder</div>
    </div>
  `;
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden','false');
}
function closeDrawer(){ drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); }

/* ---------- Connect / request ---------- */
function requestConnect(docId){
  const doc = availableDoctors.find(d=>d.id===docId) || {name:'Doctor'};
  toast(`Contact request sent to ${doc.name}. They will be notified.`);
}

/* ---------- Symptom analyzer demo & voice ---------- */
function runSymptom(){
  const txt = document.getElementById('symptomText').value.trim();
  if(!txt){ toast('Please describe your symptoms'); return; }
  const res = document.getElementById('symptomResult');
  const outcome = document.getElementById('symptomOutcome');
  // extremely simple demo rules
  const t = txt.toLowerCase();
  if(t.includes('fever')) outcome.textContent = 'Like signs of fever. Suggest paracetamol 500mg, rest & hydrate. If temp > 102°F, book consult.';
  else if(t.includes('cough')) outcome.textContent = 'Cough symptoms—keep hydrated. If shortness of breath, seek immediate care.';
  else outcome.textContent = 'Not enough info — recommend a short consult. You can request a chat or video from the Doctors tab.';
  res.style.display='block';
  res.scrollIntoView({behavior:'smooth'});
}

/* Voice support (optional) */
let recognition;
function startVoice(){
  if(!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)){
    toast('Voice recognition not supported in this browser.');
    return;
  }
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRec();
  recognition.lang = 'en-IN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onresult = (ev) => {
    const spoken = ev.results[0][0].transcript;
    document.getElementById('symptomText').value = spoken;
    runSymptom();
  };
  recognition.onerror = (e)=>{ toast('Voice error: '+ (e.error || e.message)); }
  recognition.start();
}

/* ---------- Pharmacies rendering demo ---------- */
let map, userMarker, pharmacyMarkers = [];

function initPharmacyMap() {
  const box = document.getElementById('pharmMap');
  box.innerHTML = ''; // Clear placeholder

  // Initialize map centered roughly in Nabha
  map = L.map('pharmMap').setView([30.3800, 76.1140], 13); 

  // Add OSM tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  // Ask for user location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      map.setView([lat, lng], 15);

      userMarker = L.marker([lat,lng], {title:"You are here"}).addTo(map)
        .bindPopup("You are here").openPopup();

      // Render pharmacies near user
      renderPharmaciesOnMap(lat, lng);
    }, err => {
      toast("Location permission denied. Showing default view.");
      renderPharmaciesOnMap(30.3800, 76.1140);
    });
  } else {
    toast("Geolocation not supported. Showing default view.");
    renderPharmaciesOnMap(30.3800, 76.1140);
  }
}

function renderPharmaciesOnMap(lat, lng) {
  // Clear previous markers
  pharmacyMarkers.forEach(m => map.removeLayer(m));
  pharmacyMarkers = [];

  const q = document.getElementById('medSearch').value.trim().toLowerCase();

  pharmacies.forEach(p => {
    // Fake randomize lat/lng nearby for demo
    const plat = lat + (Math.random()-0.5)/500;
    const plng = lng + (Math.random()-0.5)/500;

    // Check medicine filter
    const hasMed = !q || p.meds.join(' ').toLowerCase().includes(q);

    const marker = L.marker([plat, plng], {title: p.name}).addTo(map);
    marker.bindPopup(`
      <div style="font-weight:800">${p.name}</div>
      <div class="small">Medicines: ${hasMed ? p.meds.join(', ') : 'Not available'}</div>
    `);
    pharmacyMarkers.push(marker);
  });
}

// Update map when searching for a medicine
document.getElementById('medSearch').addEventListener('input', () => {
  if(map && userMarker){
    const pos = userMarker.getLatLng();
    renderPharmaciesOnMap(pos.lat, pos.lng);
  }
});

// Initialize map on tab open
document.querySelector('.navitem[data-tab="pharmacies"]').addEventListener('click', () => {
  setTimeout(initPharmacyMap, 300); // Delay to ensure tab is visible
});

/* ---------- Toast utility ---------- */
function toast(msg){
  const t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style,{position:'fixed',left:'50%',transform:'translateX(-50%)',bottom:'20px',background:'#223729',color:'#fff',padding:'10px 14px',borderRadius:'10px',boxShadow:'0 8px 20px rgba(0,0,0,.2)',zIndex:120,opacity:0,transition:'250ms'});
  document.body.appendChild(t);
  requestAnimationFrame(()=>t.style.opacity=1);
  setTimeout(()=>{t.style.opacity=0; setTimeout(()=>t.remove(),300)},1600);
}

/* ---------- Init default render ---------- */
renderTopDoctors();
renderAvailable();
renderVisited();
renderPharmacies();

/* small helper to open tab from links */
function openTab(tabId){
  document.querySelectorAll('.navitem').forEach(n=>n.classList.remove('active'));
  const node = document.querySelector(`.navitem[data-tab="${tabId}"]`);
  if(node) node.classList.add('active');
  sections.forEach(s=>s.classList.remove('active'));
  const target = document.getElementById(tabId);
  if(target) target.classList.add('active');
}

let clinicMap, userClinicMarker, clinicMarkers = [];

function initClinicMap() {
  const box = document.getElementById('clinicMap');
  box.innerHTML = ''; // Clear old content

  // Initialize map with rough center
  clinicMap = L.map('clinicMap').setView([30.3800, 76.1140], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(clinicMap);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      clinicMap.setView([lat, lng], 15);

      userClinicMarker = L.marker([lat,lng], {title:"You are here"}).addTo(clinicMap)
        .bindPopup("You are here").openPopup();

      renderClinicsOnMap(lat, lng);
    }, err => {
      toast("Location permission denied. Showing default view.");
      renderClinicsOnMap(30.3800, 76.1140);
    });
  } else {
    toast("Geolocation not supported. Showing default view.");
    renderClinicsOnMap(30.3800, 76.1140);
  }
}

function renderClinicsOnMap(lat, lng) {
  clinicMarkers.forEach(m => clinicMap.removeLayer(m));
  clinicMarkers = [];

  clinics.forEach(c => {
    const clat = lat + (Math.random()-0.5)/500; // demo nearby
    const clng = lng + (Math.random()-0.5)/500;

    const marker = L.marker([clat, clng], {title: c.name}).addTo(clinicMap);

    // Calculate distance & travel time (approx, using straight line for demo)
    const distance = getDistanceFromLatLonInKm(lat, lng, clat, clng).toFixed(2);
    const travelTime = (distance/40*60).toFixed(0); // assuming avg 40 km/h

    marker.bindPopup(`
      <div style="font-weight:800">${c.name}</div>
      <div class="small">Distance: ${distance} km</div>
      <div class="small">Estimated travel time: ${travelTime} min</div>
    `);

    clinicMarkers.push(marker);
  });
}

// Haversine formula for distance calculation
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  const R = 6371; // km
  const dLat = deg2rad(lat2-lat1);
  const dLon = deg2rad(lon2-lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

function deg2rad(deg) { return deg * (Math.PI/180); }

// Initialize map when doctor tab opens
document.querySelector('.navitem[data-tab="doctors"]').addEventListener('click', () => {
  setTimeout(initClinicMap, 300); // wait for tab render
});

function previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById("profile-img").src = e.target.result;
      document.getElementById("profile-img").style.display = "block";
      document.getElementById("profile-initials").style.display = "none";
    };
    reader.readAsDataURL(file);
  }
}

//patient emergency sos
function requestAmbulance() {
  toast("Ambulance request sent. Nearby service alerted.");
  // Call your API: POST /api/sos/ambulance
}

function alertDoctor() {
  toast("Doctor notified of emergency.");
  // API: POST /api/sos/doctor
}

function notifyFamily() {
  toast("Family members have been notified.");
  // API: Notify emergency contacts
}

function shareLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      toast("Live location shared with emergency team.");
      console.log("Lat:", pos.coords.latitude, "Lng:", pos.coords.longitude);
      // Send to backend API
    });
  } else {
    toast("Location not supported on this device.");
  }
}

function openFirstAid() {
  toast("Opening first aid guide...");
}

function emergencyHotline() {
  window.location.href = "tel:108";
}

function uploadEmergencyDocs() {
  toast("Upload reports for emergency team...");
}

function setEmergencyContacts() {
  toast("Manage your emergency contacts...");
}

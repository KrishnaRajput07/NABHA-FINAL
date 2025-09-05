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
            <button class="btn" onclick="openConnectModal('${d.id}', '${d.name}')">Connect</button>
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
          <button class="btn" onclick="openConnectModal('${v.id}', '${v.name}')">Connect</button>
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
        <button class="btn" onclick="openConnectModal('${doc.id}', '${doc.name}')">Connect</button>
      </div>
      
    `;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden','false');
  }
  function closeDrawer(){ drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); }
  
  /* ---------- Connect to doctor modal ---------- */
  let currentLanguage = 'en';
  let currentDoctorId = '';
  let currentDoctorName = '';
  
  function openConnectModal(doctorId, doctorName) {
    currentDoctorId = doctorId;
    currentDoctorName = doctorName;
    
    const modal = document.getElementById('connectModal');
    const doctorInfo = document.getElementById('connectDoctorInfo');
    
    doctorInfo.innerHTML = `
      <div style="display:flex;gap:12px;align-items:center;margin-bottom:15px">
        <div style="width:60px;height:60px;border-radius:10px;background:#eaf7f0;display:grid;place-items:center;font-weight:800;color:var(--brand)">
          ${doctorName.split(' ').map(w=>w[0]).slice(0,2).join('')}
        </div>
        <div>
          <div style="font-weight:800">${doctorName}</div>
          <div class="small muted">ID: ${doctorId}</div>
        </div>
      </div>
    `;
    
    // Reset language and text
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.lang-btn[data-lang="en"]').classList.add('active');
    currentLanguage = 'en';
    document.getElementById('problemDescription').value = '';
    document.getElementById('problemDescription').placeholder = 'Please describe your medical problem in detail...';
    
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  
  function closeConnectModal() {
    const modal = document.getElementById('connectModal');
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
  
  function setLanguage(button) {
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    currentLanguage = button.dataset.lang;
    
    // Update placeholder based on language
    const textarea = document.getElementById('problemDescription');
    if (currentLanguage === 'hi') {
      textarea.placeholder = 'कृपया अपनी चिकित्सा समस्या का विस्तार से वर्णन करें...';
    } else if (currentLanguage === 'pa') {
      textarea.placeholder = 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਮੈਡੀਕਲ ਸਮੱਸਿਆ ਦਾ ਵਿਸਤਾਰ ਨਾਲ ਵਰਣਨ ਕਰੋ...';
    } else {
      textarea.placeholder = 'Please describe your medical problem in detail...';
    }
  }
  
  function submitProblem() {
    const problemText = document.getElementById('problemDescription').value.trim();
    if (!problemText) {
      toast('Please describe your problem before submitting');
      return;
    }
    
    // In a real app, this would send the request to the server
    toast(`Request sent to ${currentDoctorName}. They will contact you soon.`);
    closeConnectModal();
  }
  
  // Close modal when clicking outside content
  document.getElementById('connectModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('connectModal')) {
      closeConnectModal();
    }
  });
  
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
  
  // Add to your demo data section
  const medicalRecords = [
    {
      id: 'REC-001',
      type: 'prescription',
      date: '2025-08-10',
      title: 'Prescription - Dr. Amanpreet Singh',
      doctor: {
        id: 'DOC-14237',
        name: 'Dr. Amanpreet Singh',
        specialization: 'General Physician'
      },
      medications: [
        { name: 'Paracetamol', dosage: '500mg', frequency: '3 times daily', duration: '5 days' },
        { name: 'Ibuprofen', dosage: '400mg', frequency: 'As needed for pain', duration: '' }
      ],
      instructions: 'Take after meals. Complete full course of antibiotics.',
      fileUrl: 'reports/prescription_20250810.pdf',
      fileSize: '1.2MB'
    },
    {
      id: 'REC-002',
      type: 'lab',
      date: '2025-07-15',
      title: 'Blood Test Report',
      doctor: {
        id: 'DOC-14237',
        name: 'Dr. Amanpreet Singh',
        specialization: 'General Physician'
      },
      lab: 'Nabha Diagnostic Center',
      tests: [
        { name: 'Hemoglobin', result: '13.5 g/dL', normalRange: '12.0-15.5 g/dL', status: 'normal' },
        { name: 'Blood Sugar (Fasting)', result: '92 mg/dL', normalRange: '70-100 mg/dL', status: 'normal' },
        { name: 'Total Cholesterol', result: '182 mg/dL', normalRange: '<200 mg/dL', status: 'normal' }
      ],
      summary: 'All parameters within normal limits. Slight vitamin D deficiency noted.',
      fileUrl: 'reports/blood_test_20250715.pdf',
      fileSize: '2.4MB'
    },
    {
      id: 'REC-003',
      type: 'prescription',
      date: '2025-06-18',
      title: 'Prescription - Dr. Jaspreet Kaur',
      doctor: {
        id: 'DOC-090',
        name: 'Dr. Jaspreet Kaur',
        specialization: 'ENT Specialist'
      },
      medications: [
        { name: 'Salbutamol Inhaler', dosage: '100mcg/dose', frequency: '2 puffs as needed', duration: '' },
        { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily', duration: '10 days' }
      ],
      instructions: 'Use inhaler before physical activity. Avoid known allergens.',
      fileUrl: 'reports/prescription_20250618.pdf',
      fileSize: '0.9MB'
    }
  ];
  
  // Add to your initialization function
  function initRecords() {
    renderRecords();
    // Check if offline access is supported
    if ('serviceWorker' in navigator && 'caches' in window) {
      enableOfflineAccess();
    }
  }
  
  // Add to your tab switching logic
  if(tab === 'records') { initRecords(); }
  
  // Render records based on filters
  function renderRecords() {
    const searchTerm = document.getElementById('recordsSearch').value.toLowerCase();
    const typeFilter = document.getElementById('recordTypeFilter').value;
    const dateOrder = document.getElementById('dateFilter').value;
    
    let filteredRecords = medicalRecords.filter(record => {
      // Type filter
      if (typeFilter !== 'all' && record.type !== typeFilter) return false;
      
      // Search filter
      if (searchTerm && !(
        record.title.toLowerCase().includes(searchTerm) ||
        record.doctor.name.toLowerCase().includes(searchTerm) ||
        (record.lab && record.lab.toLowerCase().includes(searchTerm)) ||
        (record.medications && record.medications.some(m => m.name.toLowerCase().includes(searchTerm))) ||
        (record.tests && record.tests.some(t => t.name.toLowerCase().includes(searchTerm)))
      )) return false;
      
      return true;
    });
    
    // Date ordering
    filteredRecords.sort((a, b) => {
      return dateOrder === 'newest' ? 
        new Date(b.date) - new Date(a.date) : 
        new Date(a.date) - new Date(b.date);
    });
    
    const recordsList = document.getElementById('recordsList');
    const noRecords = document.getElementById('noRecords');
    const recordsCount = document.getElementById('recordsCount');
    
    recordsList.innerHTML = '';
    recordsCount.textContent = `${filteredRecords.length} records found`;
    
    if (filteredRecords.length === 0) {
      noRecords.style.display = 'block';
      return;
    }
    
    noRecords.style.display = 'none';
    
    filteredRecords.forEach(record => {
      const recordEl = document.createElement('div');
      recordEl.className = 'doctor-row';
      recordEl.style.cursor = 'pointer';
      recordEl.onclick = () => openRecordDetail(record.id);
      
      // Determine icon based on record type
      let icon = '📄';
      if (record.type === 'prescription') icon = '💊';
      else if (record.type === 'lab') icon = '🧪';
      else if (record.type === 'imaging') icon = '🖼️';
      
      recordEl.innerHTML = `
        <div style="font-size:1.8rem;width:50px">${icon}</div>
        <div style="flex:1">
          <div style="font-weight:800">${record.title}</div>
          <div class="small muted">${formatDate(record.date)} • ${record.doctor.name} (${record.doctor.specialization})</div>
          ${record.lab ? `<div class="small muted">${record.lab}</div>` : ''}
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
          <div class="small muted">${record.fileSize}</div>
          <div class="actions">
            <button class="btn ghost" onclick="event.stopPropagation();downloadRecord('${record.id}')">Download</button>
            <button class="btn" onclick="event.stopPropagation();openRecordDetail('${record.id}')">View</button>
          </div>
        </div>
      `;
      
      recordsList.appendChild(recordEl);
    });
  }
  
  // Format date for display
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
  
  // Filter records based on search and filter criteria
  function filterRecords() {
    renderRecords();
  }
  
  // Open record detail modal
  function openRecordDetail(recordId) {
    const record = medicalRecords.find(r => r.id === recordId);
    if (!record) return;
    
    const modal = document.getElementById('recordDetailModal');
    const content = document.getElementById('recordDetailContent');
    const title = document.getElementById('recordModalTitle');
    
    title.textContent = record.title;
    
    let detailsHtml = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">
        <div>
          <div style="font-weight:700;margin-bottom:4px">Date</div>
          <div class="small">${formatDate(record.date)}</div>
        </div>
        <div>
          <div style="font-weight:700;margin-bottom:4px">Doctor</div>
          <div class="small">${record.doctor.name} (${record.doctor.specialization})</div>
          <div class="small">ID: ${record.doctor.id}</div>
        </div>
      </div>
    `;
    
    if (record.lab) {
      detailsHtml += `
        <div style="margin-bottom:20px">
          <div style="font-weight:700;margin-bottom:4px">Laboratory</div>
          <div class="small">${record.lab}</div>
        </div>
      `;
    }
    
    if (record.medications && record.medications.length > 0) {
      detailsHtml += `
        <div style="margin-bottom:20px">
          <div style="font-weight:700;margin-bottom:8px">Medications</div>
          <div style="background:#f8faf9;border-radius:8px;padding:12px">
            ${record.medications.map(med => `
              <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eef6f2">
                <div style="font-weight:600">${med.name} ${med.dosage}</div>
                <div class="small">${med.frequency} ${med.duration ? 'for ' + med.duration : ''}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    if (record.instructions) {
      detailsHtml += `
        <div style="margin-bottom:20px">
          <div style="font-weight:700;margin-bottom:4px">Instructions</div>
          <div class="small">${record.instructions}</div>
        </div>
      `;
    }
    
    if (record.tests && record.tests.length > 0) {
      detailsHtml += `
        <div style="margin-bottom:20px">
          <div style="font-weight:700;margin-bottom:8px">Test Results</div>
          <div style="background:#f8faf9;border-radius:8px;padding:12px">
            ${record.tests.map(test => `
              <div style="padding:8px 0;border-bottom:1px solid #eef6f2">
                <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                  <div style="font-weight:600">${test.name}</div>
                  <div style="color:${test.status === 'normal' ? 'var(--ok)' : 'var(--danger)'};font-weight:600">
                    ${test.result}
                  </div>
                </div>
                <div class="small muted">Normal range: ${test.normalRange}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    if (record.summary) {
      detailsHtml += `
        <div style="margin-bottom:20px">
          <div style="font-weight:700;margin-bottom:4px">Summary</div>
          <div class="small">${record.summary}</div>
        </div>
      `;
    }
    
    detailsHtml += `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px;padding-top:20px;border-top:1px solid #eef6f2">
        <div class="small muted">File size: ${record.fileSize}</div>
        <div>
          <button class="btn ghost" onclick="downloadRecord('${record.id}')">Download</button>
          <button class="btn" onclick="closeRecordModal()">Close</button>
        </div>
      </div>
    `;
    
    content.innerHTML = detailsHtml;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  
  // Close record detail modal
  function closeRecordModal() {
    const modal = document.getElementById('recordDetailModal');
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
  
  // Download individual record
  function downloadRecord(recordId) {
    const record = medicalRecords.find(r => r.id === recordId);
    if (!record) return;
    
    toast(`Downloading ${record.title}...`);
    // In a real application, this would trigger the actual file download
    // For demo purposes, we'll simulate it
    const a = document.createElement('a');
    a.href = record.fileUrl;
    a.download = `${record.title.replace(/\s+/g, '_')}_${record.date}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
  // Download all records as ZIP
  function downloadAllRecords() {
    toast('Preparing all records for download...');
    // In a real application, this would create a ZIP file with all records
    // For demo purposes, we'll simulate it
    setTimeout(() => {
      toast('Your download will start shortly...');
    }, 1500);
  }
  
  // Enable offline access to records
  function enableOfflineAccess() {
    // In a production app, this would set up service worker and caching
    console.log('Offline access enabled for medical records');
  }
  
  // Close modal when clicking outside content
  document.getElementById('recordDetailModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('recordDetailModal')) {
      closeRecordModal();
    }
  });
  
  
  /* ---------- Demo data for Alerts & Follow-up ---------- */
  const alertsData = {
    refill: [
      {
        id: 'alert-1',
        type: 'refill',
        medicine: 'Paracetamol 500mg',
        remaining: '5 tablets left (3 days supply)',
        date: '2025-09-10',
        status: 'pending',
        urgency: 'high',
        dosage: '1 tablet 3 times daily after meals',
        doctor: {
          id: 'DOC-14237',
          name: 'Dr. Amanpreet Singh',
          contact: '+91-98765-43210'
        },
        pharmacy: {
          name: 'Nabha Medicals',
          address: 'Main Bazaar, Nabha',
          phone: '+91-1652-234567'
        }
      },
      {
        id: 'alert-2',
        type: 'refill',
        medicine: 'Salbutamol Inhaler',
        remaining: 'Less than 10 doses left (5 days supply)',
        date: '2025-09-15',
        status: 'pending',
        urgency: 'medium',
        dosage: '2 puffs every 6 hours as needed',
        doctor: {
          id: 'DOC-090',
          name: 'Dr. Jaspreet Kaur',
          contact: '+91-98765-12345'
        },
        pharmacy: {
          name: 'City Med Pharmacy',
          address: 'Gandhi Road, Nabha',
          phone: '+91-1652-345678'
        }
      },
      {
        id: 'alert-3',
        type: 'refill',
        medicine: 'Atorvastatin 20mg',
        remaining: '10 tablets left (10 days supply)',
        date: '2025-09-18',
        status: 'pending',
        urgency: 'low',
        dosage: '1 tablet at bedtime',
        doctor: {
          id: 'DOC-14237',
          name: 'Dr. Amanpreet Singh',
          contact: '+91-98765-43210'
        },
        pharmacy: {
          name: 'Nabha Medicals',
          address: 'Main Bazaar, Nabha',
          phone: '+91-1652-234567'
        }
      }
    ],
    followup: [
      {
        id: 'alert-4',
        type: 'followup',
        purpose: 'Blood test review - Vitamin D levels',
        date: '2025-09-12',
        time: '11:00 AM',
        status: 'pending',
        doctor: {
          id: 'DOC-14237',
          name: 'Dr. Amanpreet Singh',
          specialization: 'General Physician',
          contact: '+91-98765-43210'
        },
        notes: 'Discuss vitamin D supplementation options based on recent blood report'
      },
      {
        id: 'alert-5',
        type: 'followup',
        purpose: 'Asthma control assessment',
        date: '2025-09-20',
        time: '02:30 PM',
        status: 'pending',
        doctor: {
          id: 'DOC-090',
          name: 'Dr. Jaspreet Kaur',
          specialization: 'ENT Specialist',
          contact: '+91-98765-12345'
        },
        notes: 'Review inhaler technique and asthma control over past month'
      }
    ],
    consultation: [
      {
        id: 'alert-6',
        type: 'consultation',
        purpose: 'Fever and cough follow-up',
        date: '2025-09-05',
        time: '03:00 PM',
        status: 'scheduled',
        duration: 15,
        doctor: {
          id: 'DOC-14237',
          name: 'Dr. Amanpreet Singh',
          specialization: 'General Physician',
          fee: 500,
          contact: '+91-98765-43210',
          rating: 4.7
        },
        paymentStatus: 'pending',
        symptoms: ['Fever', 'Cough', 'Headache'],
        scheduledOn: '2025-09-01'
      },
      {
        id: 'alert-7',
        type: 'consultation',
        purpose: 'Skin allergy consultation',
        date: '2025-09-08',
        time: '10:30 AM',
        status: 'active',
        duration: 20,
        doctor: {
          id: 'DOC-101',
          name: 'Dr. Meera Kapoor',
          specialization: 'Dermatologist',
          fee: 700,
          contact: '+91-98765-67890',
          rating: 4.8
        },
        paymentStatus: 'completed',
        symptoms: ['Skin rash', 'Itching', 'Redness'],
        scheduledOn: '2025-09-03',
        consultationId: 'CONS-7821'
      }
    ]
  };
  
  // Sample chat messages for active consultation
  const chatMessages = {
    'CONS-7821': [
      {
        id: 1,
        sender: 'doctor',
        name: 'Dr. Meera Kapoor',
        message: 'Hello Gurpreet, how can I help you today?',
        time: '10:32 AM'
      },
      {
        id: 2,
        sender: 'patient',
        name: 'Gurpreet Kaur',
        message: 'Hello Doctor, I have developed a skin rash on my arms and neck since yesterday.',
        time: '10:33 AM'
      },
      {
        id: 3,
        sender: 'doctor',
        name: 'Dr. Meera Kapoor',
        message: 'Could you describe the rash? Is it itchy? Any redness or swelling?',
        time: '10:34 AM'
      },
      {
        id: 4,
        sender: 'patient',
        name: 'Gurpreet Kaur',
        message: 'Yes, it\'s very itchy with red patches. No swelling though.',
        time: '10:35 AM'
      }
    ]
  };
  
  // Sample payment methods
  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Pay securely with your card'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: '📱',
      description: 'Pay using any UPI app'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: '🏦',
      description: 'Transfer directly from your bank'
    },
    {
      id: 'wallet',
      name: 'Wallet',
      icon: '📲',
      description: 'Pay using PhonePe, PayTM or other wallets'
    }
  ];
  
  // Track active consultation
  let activeConsultation = null;
  let callTimerInterval = null;
  let callSeconds = 0;
  let isAudioMuted = false;
  let isVideoOff = false;
  
  /* ---------- Alert Section Functions ---------- */
  
  // Initialize alerts section
  function initAlerts() {
    renderAlerts();
    updateAlertCounts();
    checkActiveConsultation();
    
    // Add event listener for sending messages
    const chatInput = document.querySelector('#chatMessages + div input');
    if (chatInput) {
      chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          sendMessage();
        }
      });
    }
  }
  
  // Update alert counts in the summary cards
  function updateAlertCounts() {
    document.getElementById('refillCount').textContent = alertsData.refill.filter(a => a.status === 'pending').length;
    document.getElementById('followupCount').textContent = alertsData.followup.filter(a => a.status === 'pending').length;
    document.getElementById('appointmentCount').textContent = alertsData.consultation.filter(a => a.status === 'scheduled' || a.status === 'active').length;
  }
  
  // Switch between alert tabs
  function switchAlertTab(button) {
    document.querySelectorAll('.pill[data-alert-type]').forEach(pill => pill.classList.remove('active'));
    button.classList.add('active');
    renderAlerts();
  }
  
  // Render alerts based on selected tab
  function renderAlerts() {
    const alertType = document.querySelector('.pill[data-alert-type].active').dataset.alertType;
    const alertsList = document.getElementById('alertsList');
    const noAlerts = document.getElementById('noAlerts');
    
    alertsList.innerHTML = '';
    
    let alertsToShow = [];
    
    if (alertType === 'all') {
      alertsToShow = [
        ...alertsData.refill.filter(a => a.status === 'pending'),
        ...alertsData.followup.filter(a => a.status === 'pending'),
        ...alertsData.consultation.filter(a => a.status === 'scheduled' || a.status === 'active')
      ];
    } else if (alertType === 'refill') {
      alertsToShow = alertsData.refill.filter(a => a.status === 'pending');
    } else if (alertType === 'followup') {
      alertsToShow = alertsData.followup.filter(a => a.status === 'pending');
    } else if (alertType === 'consultation') {
      alertsToShow = alertsData.consultation.filter(a => a.status === 'scheduled' || a.status === 'active');
    }
    
    // Sort by date and urgency
    alertsToShow.sort((a, b) => {
      // First sort by urgency (high first)
      if (a.urgency === 'high' && b.urgency !== 'high') return -1;
      if (a.urgency !== 'high' && b.urgency === 'high') return 1;
      
      // Then by date (soonest first)
      return new Date(a.date) - new Date(b.date);
    });
    
    if (alertsToShow.length === 0) {
      noAlerts.style.display = 'block';
      return;
    }
    
    noAlerts.style.display = 'none';
    
    alertsToShow.forEach(alert => {
      const alertEl = document.createElement('div');
      alertEl.className = 'doctor-row';
      
      // Add urgency class for styling
      if (alert.urgency) {
        alertEl.classList.add(`urgency-${alert.urgency}`);
      }
      
      let icon = '🔔';
      let actionButton = '';
      let statusBadge = '';
      
      if (alert.type === 'refill') {
        icon = '💊';
        actionButton = `
          <button class="btn" onclick="requestRefill('${alert.id}')">Request Refill</button>
          <button class="btn ghost" onclick="contactPharmacy('${alert.id}')">Contact Pharmacy</button>
        `;
        
        // Add urgency indicator
        statusBadge = `<div class="status ${alert.urgency === 'high' ? 'busy' : ''}">${alert.urgency} priority</div>`;
      } else if (alert.type === 'followup') {
        icon = '🔄';
        actionButton = `
          <button class="btn" onclick="scheduleFollowup('${alert.id}')">Schedule</button>
          <button class="btn ghost" onclick="reschedule('${alert.id}')">Reschedule</button>
        `;
      } else if (alert.type === 'consultation') {
        icon = '📅';
        if (alert.status === 'scheduled' && alert.paymentStatus === 'pending') {
          actionButton = `<button class="btn" onclick="openPaymentModal('${alert.id}')">Pay & Confirm</button>`;
          statusBadge = `<div class="status">Payment pending</div>`;
        } else if (alert.status === 'scheduled' && alert.paymentStatus === 'completed') {
          actionButton = `<button class="btn" onclick="viewConsultation('${alert.id}')">View Details</button>`;
          statusBadge = `<div class="status">Confirmed</div>`;
        } else if (alert.status === 'active') {
          actionButton = `<button class="btn" onclick="joinConsultation('${alert.id}')">Join Now</button>`;
          statusBadge = `<div class="status">Active</div>`;
        }
      }
      
      alertEl.innerHTML = `
        <div style="font-size:1.8rem;width:50px">${icon}</div>
        <div style="flex:1">
          <div style="display:flex;align-items:center;gap:8px">
            <div style="font-weight:800">${alert.type === 'refill' ? alert.medicine : alert.purpose}</div>
            ${statusBadge}
          </div>
          <div class="small muted">${formatDate(alert.date)}${alert.time ? ' • ' + alert.time : ''}</div>
          <div class="small">${alert.type === 'refill' ? alert.remaining : alert.doctor.name}</div>
          ${alert.type === 'refill' && alert.dosage ? `<div class="small muted">${alert.dosage}</div>` : ''}
        </div>
        <div class="actions">
          ${actionButton}
          <button class="btn ghost" onclick="dismissAlert('${alert.id}')">Dismiss</button>
        </div>
      `;
      
      alertsList.appendChild(alertEl);
    });
  }
  
  // Check if there's an active consultation to show
  function checkActiveConsultation() {
    const consultationSection = document.getElementById('consultationSection');
    const activeConsult = alertsData.consultation.find(c => c.status === 'active');
    
    if (activeConsult) {
      activeConsultation = activeConsult;
      consultationSection.style.display = 'block';
      
      document.getElementById('consultDoctorAvatar').textContent = 
        activeConsult.doctor.name.split(' ').map(n => n[0]).join('').substring(0, 2);
      document.getElementById('consultDoctorName').textContent = activeConsult.doctor.name;
      document.getElementById('consultDoctorSpec').textContent = 
        `${activeConsult.doctor.specialization} • ${activeConsult.doctor.id}`;
      document.getElementById('consultTime').textContent = 
        `Scheduled: ${formatDate(activeConsult.date)}${activeConsult.time ? ', ' + activeConsult.time : ''}`;
      
      if (activeConsult.paymentStatus === 'completed') {
        document.getElementById('consultationStatus').textContent = 'Ready to join';
        document.getElementById('joinConsultBtn').textContent = 'Join Consultation';
        document.getElementById('consultActions').style.display = 'block';
      } else {
        document.getElementById('consultationStatus').textContent = 'Payment pending';
        document.getElementById('joinConsultBtn').textContent = 'Complete Payment';
        document.getElementById('consultActions').style.display = 'none';
      }
    } else {
      consultationSection.style.display = 'none';
    }
  }
  
  // Request medicine refill
  function requestRefill(alertId) {
    const alert = [...alertsData.refill, ...alertsData.followup, ...alertsData.consultation]
      .find(a => a.id === alertId);
    
    if (alert) {
      toast(`Refill request sent to ${alert.doctor.name}`);
      // In a real app, this would send a request to the doctor/pharmacy
    }
  }
  
  // Contact pharmacy
  function contactPharmacy(alertId) {
    const alert = alertsData.refill.find(a => a.id === alertId);
    if (alert) {
      toast(`Calling ${alert.pharmacy.name} at ${alert.pharmacy.phone}`);
      // In a real app, this would initiate a call or show contact options
    }
  }
  
  // Schedule follow-up
  function scheduleFollowup(alertId) {
    const alert = [...alertsData.refill, ...alertsData.followup, ...alertsData.consultation]
      .find(a => a.id === alertId);
    
    if (alert) {
      // Show calendar interface for scheduling
      showSchedulingModal(alert);
    }
  }
  
  // Reschedule appointment
  function reschedule(alertId) {
    const alert = [...alertsData.followup, ...alertsData.consultation].find(a => a.id === alertId);
    if (alert) {
      // Show calendar interface with available slots
      const availableSlots = [
        '2025-09-13 at 10:00 AM',
        '2025-09-13 at 02:00 PM',
        '2025-09-14 at 11:30 AM',
        '2025-09-15 at 09:00 AM'
      ];
      
      let slotsHtml = availableSlots.map(slot => `
        <div style="padding:8px;border:1px solid #eef6f2;border-radius:8px;margin-bottom:8px;cursor:pointer" onclick="selectTimeSlot('${alertId}', '${slot}')">
          ${slot}
        </div>
      `).join('');
      
      const modal = document.getElementById('recordDetailModal');
      const content = document.getElementById('recordDetailContent');
      const title = document.getElementById('recordModalTitle');
      
      title.textContent = 'Reschedule Appointment';
      content.innerHTML = `
        <div style="margin-bottom:16px">
          <div style="font-weight:700">Current appointment:</div>
          <div>${formatDate(alert.date)}${alert.time ? ' at ' + alert.time : ''} with ${alert.doctor.name}</div>
        </div>
        <div style="margin-bottom:16px">
          <div style="font-weight:700">Available time slots:</div>
          <div style="margin-top:8px">
            ${slotsHtml}
          </div>
        </div>
        <button class="btn" onclick="closeRecordModal()">Cancel</button>
      `;
      
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }
  
  // Select time slot function
  function selectTimeSlot(alertId, slot) {
    toast(`Appointment rescheduled to ${slot}`);
    closeRecordModal();
    
    // Update the alert with new time (in a real app, this would call an API)
    const alert = [...alertsData.followup, ...alertsData.consultation].find(a => a.id === alertId);
    if (alert) {
      const [date, , time] = slot.split(' ');
      alert.date = date;
      alert.time = time + ' ' + (slot.includes('AM') ? 'AM' : 'PM');
      
      // Refresh the UI
      renderAlerts();
    }
  }
  
  // Show scheduling modal
  function showSchedulingModal(alert) {
    const availableSlots = [
      '2025-09-13 at 10:00 AM',
      '2025-09-13 at 02:00 PM',
      '2025-09-14 at 11:30 AM',
      '2025-09-15 at 09:00 AM'
    ];
    
    let slotsHtml = availableSlots.map(slot => `
      <div style="padding:8px;border:1px solid #eef6f2;border-radius:8px;margin-bottom:8px;cursor:pointer" onclick="confirmAppointment('${alert.id}', '${slot}')">
        ${slot}
      </div>
    `).join('');
    
    const modal = document.getElementById('recordDetailModal');
    const content = document.getElementById('recordDetailContent');
    const title = document.getElementById('recordModalTitle');
    
    title.textContent = 'Schedule Appointment';
    content.innerHTML = `
      <div style="margin-bottom:16px">
        <div style="font-weight:700">Schedule with ${alert.doctor.name}:</div>
      </div>
      <div style="margin-bottom:16px">
        <div style="font-weight:700">Available time slots:</div>
        <div style="margin-top:8px">
          ${slotsHtml}
        </div>
      </div>
      <button class="btn" onclick="closeRecordModal()">Cancel</button>
    `;
    
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  
  // Confirm appointment
  function confirmAppointment(alertId, slot) {
    toast(`Appointment scheduled for ${slot}`);
    closeRecordModal();
    
    // Update the alert with new time (in a real app, this would call an API)
    const alert = [...alertsData.followup].find(a => a.id === alertId);
    if (alert) {
      const [date, , time] = slot.split(' ');
      alert.date = date;
      alert.time = time + ' ' + (slot.includes('AM') ? 'AM' : 'PM');
      alert.status = 'scheduled';
      
      // Refresh the UI
      renderAlerts();
      updateAlertCounts();
    }
  }
  
  // Open payment modal for consultation
  function openPaymentModal(alertId) {
    const alert = alertsData.consultation.find(a => a.id === alertId);
    
    if (alert) {
      document.getElementById('consultationFee').textContent = alert.doctor.fee;
      document.getElementById('paymentDoctorName').textContent = alert.doctor.name;
      
      // Populate payment methods
      const paymentMethodsContainer = document.querySelector('.language-selector');
      paymentMethodsContainer.innerHTML = '';
      
      paymentMethods.forEach(method => {
        const button = document.createElement('button');
        button.className = 'lang-btn';
        button.dataset.method = method.id;
        button.innerHTML = `${method.icon} ${method.name}`;
        button.onclick = function() { selectPaymentMethod(this); };
        paymentMethodsContainer.appendChild(button);
      });
      
      // Select first payment method by default
      if (paymentMethodsContainer.firstChild) {
        paymentMethodsContainer.firstChild.classList.add('active');
        selectPaymentMethod(paymentMethodsContainer.firstChild);
      }
      
      const modal = document.getElementById('paymentModal');
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }
  
  // Close payment modal
  function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
  
  // Select payment method
  function selectPaymentMethod(button) {
    document.querySelectorAll('.lang-btn').forEach(pill => pill.classList.remove('active'));
    button.classList.add('active');
    
    const method = button.dataset.method;
    
    // Show appropriate form
    document.getElementById('cardPaymentForm').style.display = method === 'card' ? 'block' : 'none';
    document.getElementById('upiPaymentForm').style.display = method === 'upi' ? 'block' : 'none';
  }
  
  // Process payment
  function processPayment() {
    toast('Processing payment...');
    
    // Simulate payment processing
    setTimeout(() => {
      toast('Payment successful! Consultation confirmed.');
      closePaymentModal();
      
      // Update consultation status
      const consultation = alertsData.consultation[0];
      consultation.paymentStatus = 'completed';
      consultation.status = 'active';
      
      // Refresh UI
      checkActiveConsultation();
      renderAlerts();
      updateAlertCounts();
    }, 2000);
  }
  
  // Join consultation
  function joinConsultation() {
    if (activeConsultation.paymentStatus === 'completed') {
      // Start the consultation
      startConsultation();
    } else {
      // Open payment modal if not paid
      openPaymentModal(activeConsultation.id);
    }
  }
  
  // Start consultation
  function startConsultation() {
    const consultationInterface = document.getElementById('consultationInterface');
    consultationInterface.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    document.getElementById('activeDoctorName').textContent = activeConsultation.doctor.name;
    
    // Load chat messages
    const chatContainer = document.getElementById('chatMessages');
    if (chatMessages[activeConsultation.consultationId]) {
      const messagesHtml = chatMessages[activeConsultation.consultationId].map(msg => `
        <div style="margin-bottom:12px;display:flex;flex-direction:${msg.sender === 'patient' ? 'row-reverse' : 'row'}">
          <div style="max-width:70%;background:${msg.sender === 'patient' ? '#e3f2fd' : '#f5f5f5'};padding:8px 12px;border-radius:12px">
            <div style="font-weight:600;margin-bottom:4px">${msg.name}</div>
            <div>${msg.message}</div>
            <div class="small muted" style="text-align:right">${msg.time}</div>
          </div>
        </div>
      `).join('');
      
      chatContainer.innerHTML = messagesHtml;
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // Start call timer
    callSeconds = 0;
    if (callTimerInterval) clearInterval(callTimerInterval);
    callTimerInterval = setInterval(updateCallTimer, 1000);
    
    // Simulate connecting to doctor
    setTimeout(() => {
      document.getElementById('callStatus').textContent = 'Connected';
      
      // Simulate doctor joining after 3 seconds
      setTimeout(() => {
        // Add a welcome message from doctor
        const newMessage = {
          id: chatMessages[activeConsultation.consultationId].length + 1,
          sender: 'doctor',
          name: activeConsultation.doctor.name,
          message: 'Thank you for joining. How can I help you today?',
          time: 'Now'
        };
        
        chatMessages[activeConsultation.consultationId].push(newMessage);
        
        const messageHtml = `
          <div style="margin-bottom:12px;display:flex;">
            <div style="max-width:70%;background:#f5f5f5;padding:8px 12px;border-radius:12px">
              <div style="font-weight:600;margin-bottom:4px">${newMessage.name}</div>
              <div>${newMessage.message}</div>
              <div class="small muted" style="text-align:right">${newMessage.time}</div>
            </div>
          </div>
        `;
        
        chatContainer.innerHTML += messageHtml;
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }, 3000);
    }, 2000);
  }
  
  // Update call timer
  function updateCallTimer() {
    callSeconds++;
    const minutes = Math.floor(callSeconds / 60);
    const seconds = callSeconds % 60;
    document.getElementById('callTimer').textContent = 
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  // Toggle audio
  function toggleAudio() {
    isAudioMuted = !isAudioMuted;
    document.getElementById('audioBtn').textContent = isAudioMuted ? '🔊' : '🔇';
    toast(isAudioMuted ? 'Audio muted' : 'Audio enabled');
  }
  
  // Toggle video
  function toggleVideo() {
    isVideoOff = !isVideoOff;
    document.getElementById('videoBtn').textContent = isVideoOff ? '📷' : '📹';
    toast(isVideoOff ? 'Video stopped' : 'Video enabled');
  }
  
  // End consultation
  function endConsultation() {
    if (callTimerInterval) clearInterval(callTimerInterval);
    
    const consultationInterface = document.getElementById('consultationInterface');
    consultationInterface.style.display = 'none';
    document.body.style.overflow = '';
    
    // Update consultation status
    activeConsultation.status = 'completed';
    activeConsultation = null;
    
    // Refresh UI
    checkActiveConsultation();
    renderAlerts();
    updateAlertCounts();
    
    toast('Consultation ended successfully');
  }
  
  // Send message in chat
  function sendMessage() {
    const input = document.querySelector('#chatMessages + div input');
    const message = input.value.trim();
    
    if (message) {
      const newMessage = {
        id: chatMessages[activeConsultation.consultationId].length + 1,
        sender: 'patient',
        name: 'Gurpreet Kaur',
        message: message,
        time: 'Now'
      };
      
      chatMessages[activeConsultation.consultationId].push(newMessage);
      
      const chatContainer = document.getElementById('chatMessages');
      const messageHtml = `
        <div style="margin-bottom:12px;display:flex;flex-direction:row-reverse">
          <div style="max-width:70%;background:#e3f2fd;padding:8px 12px;border-radius:12px">
            <div style="font-weight:600;margin-bottom:4px">${newMessage.name}</div>
            <div>${newMessage.message}</div>
            <div class="small muted" style="text-align:right">${newMessage.time}</div>
          </div>
        </div>
      `;
      
      chatContainer.innerHTML += messageHtml;
      chatContainer.scrollTop = chatContainer.scrollHeight;
      
      // Clear input
      input.value = '';
      
      // Simulate doctor response after 1-3 seconds
      setTimeout(() => {
        const responses = [
          "I understand. Can you tell me more about that?",
          "Thank you for that information. How long has this been going on?",
          "I see. Let me note that down for your records.",
          "That's helpful. Is there anything else you'd like to mention?",
          "I appreciate you sharing that. How severe would you rate this on a scale of 1-10?"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const doctorMessage = {
          id: chatMessages[activeConsultation.consultationId].length + 1,
          sender: 'doctor',
          name: activeConsultation.doctor.name,
          message: randomResponse,
          time: 'Now'
        };
        
        chatMessages[activeConsultation.consultationId].push(doctorMessage);
        
        const doctorMessageHtml = `
          <div style="margin-bottom:12px;display:flex;">
            <div style="max-width:70%;background:#f5f5f5;padding:8px 12px;border-radius:12px">
              <div style="font-weight:600;margin-bottom:4px">${doctorMessage.name}</div>
              <div>${doctorMessage.message}</div>
              <div class="small muted" style="text-align:right">${doctorMessage.time}</div>
            </div>
          </div>
        `;
        
        chatContainer.innerHTML += doctorMessageHtml;
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }, 1000 + Math.random() * 2000);
    }
  }
  
  // Start chat
  function startChat() {
    toast('Chat interface opened');
    // In a real app, this would open the chat interface
  }
  
  // Request call
  function requestCall() {
    toast('Voice call requested');
    // In a real app, this would initiate a voice call
  }
  
  // Request video call
  function requestVideoCall() {
    toast('Video call requested');
    // In a real app, this would initiate a video call
  }
  
  // View prescription
  function viewPrescription() {
    toast('Opening prescription');
    // In a real app, this would show the prescription
  }
  
  // Reschedule consultation
  function rescheduleConsultation() {
    toast('Opening calendar to reschedule');
    // In a real app, this would open a scheduling interface
  }
  
  // Dismiss alert
  function dismissAlert(alertId) {
    // Find alert in any category and mark as dismissed
    let alert = alertsData.refill.find(a => a.id === alertId);
    if (alert) {
      alert.status = 'dismissed';
    } else {
      alert = alertsData.followup.find(a => a.id === alertId);
      if (alert) alert.status = 'dismissed';
      else {
        alert = alertsData.consultation.find(a => a.id === alertId);
        if (alert) alert.status = 'dismissed';
      }
    }
    
    toast('Alert dismissed');
    renderAlerts();
    updateAlertCounts();
  }
  
  // View consultation details
  function viewConsultation(alertId) {
    const alert = alertsData.consultation.find(a => a.id === alertId);
    
    if (alert) {
      const modal = document.getElementById('recordDetailModal');
      const content = document.getElementById('recordDetailContent');
      const title = document.getElementById('recordModalTitle');
      
      title.textContent = 'Consultation Details';
      
      content.innerHTML = `
        <div style="margin-bottom:20px">
          <div style="display:flex;gap:16px;align-items:center">
            <div style="width:60px;height:60px;border-radius:10px;background:#eaf7f0;display:grid;place-items:center;font-weight:800;color:var(--brand);font-size:1.2rem">
              ${alert.doctor.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </div>
            <div>
              <div style="font-weight:800">${alert.doctor.name}</div>
              <div class="small muted">${alert.doctor.specialization} • ${alert.doctor.id}</div>
              <div class="small">Rating: ${alert.doctor.rating}/5</div>
            </div>
          </div>
        </div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
          <div>
            <div style="font-weight:700;margin-bottom:4px">Date & Time</div>
            <div class="small">${formatDate(alert.date)} at ${alert.time}</div>
          </div>
          <div>
            <div style="font-weight:700;margin-bottom:4px">Duration</div>
            <div class="small">${alert.duration} minutes</div>
          </div>
          <div>
            <div style="font-weight:700;margin-bottom:4px">Purpose</div>
            <div class="small">${alert.purpose}</div>
          </div>
          <div>
            <div style="font-weight:700;margin-bottom:4px">Fee</div>
            <div class="small">₹${alert.doctor.fee}</div>
          </div>
        </div>
        
        <div style="margin-bottom:20px">
          <div style="font-weight:700;margin-bottom:4px">Symptoms</div>
          <div class="small">${alert.symptoms.join(', ')}</div>
        </div>
        
        <div style="margin-bottom:20px">
          <div style="font-weight:700;margin-bottom:4px">Status</div>
          <div class="status">${alert.status} • ${alert.paymentStatus}</div>
        </div>
        
        <div style="display:flex;gap:8px">
          <button class="btn" onclick="joinConsultation()">Join Consultation</button>
          <button class="btn ghost" onclick="rescheduleConsultation()">Reschedule</button>
          <button class="btn ghost" onclick="closeRecordModal()">Close</button>
        </div>
      `;
      
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }
  
  // Close record modal
  function closeRecordModal() {
    const modal = document.getElementById('recordDetailModal');
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
  
  // Close modals when clicking outside
  document.getElementById('paymentModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('paymentModal')) {
      closePaymentModal();
    }
  });
  
  document.getElementById('consultationInterface').addEventListener('click', (e) => {
    if (e.target === document.getElementById('consultationInterface')) {
      // Don't close on outside click for consultation interface
    }
  });
  
  document.getElementById('recordDetailModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('recordDetailModal')) {
      closeRecordModal();
    }
  });
  
  // Add to your tab switching logic
  tabNodes.forEach(node=>{
    node.addEventListener('click', () => {
      const tab = node.dataset.tab;
      if(tab === 'alerts') { initAlerts(); }
    });
  });
  
  // Add CSS styles for urgency indicators
  const additionalStyles = `
    .urgency-high {
      border-left: 4px solid var(--danger);
    }
    .urgency-medium {
      border-left: 4px solid #fa8c16;
    }
    .urgency-low {
      border-left: 4px solid #52c41a;
    }
    
    #chatMessages {
      max-height: 300px;
      overflow-y: auto;
      padding: 8px;
      background: white;
      border-radius: 8px;
      border: 1px solid #eef6f2;
    }
    
    .consultation-tool {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 12px;
      border: 1px solid #eef6f2;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .consultation-tool:hover {
      background: #f7fff9;
      transform: translateY(-2px);
    }
  `;
  
  // Toggle between view and edit modes
  function toggleEditMode(editMode) {
      const editBtn = document.getElementById('editProfileBtn');
      const saveBtn = document.getElementById('saveProfileBtn');
      const cancelBtn = document.getElementById('cancelEditBtn');
      const addFamilyBtn = document.getElementById('addFamilyMemberBtn');
      const editIcon = document.getElementById('profileImageEditIcon');
      
      if (editMode) {
        // Switch to edit mode
        editBtn.style.display = 'none';
        saveBtn.style.display = 'block';
        cancelBtn.style.display = 'block';
        addFamilyBtn.style.display = 'block';
        editIcon.style.display = 'block';
        
        // Show all edit fields
        document.querySelectorAll('.editable-field').forEach(field => {
          const display = field.querySelector('[id$="-display"]');
          const edit = field.querySelector('[id$="-edit"]');
          
          if (display && edit) {
            display.style.display = 'none';
            edit.style.display = 'block';
          }
        });
        
        // Show family member actions
        document.querySelectorAll('.member-actions').forEach(action => {
          action.style.display = 'flex';
        });
      } else {
        // Switch to view mode
        editBtn.style.display = 'block';
        saveBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
        addFamilyBtn.style.display = 'none';
        editIcon.style.display = 'none';
        
        // Hide all edit fields
        document.querySelectorAll('.editable-field').forEach(field => {
          const display = field.querySelector('[id$="-display"]');
          const edit = field.querySelector('[id$="-edit"]');
          
          if (display && edit) {
            display.style.display = 'block';
            edit.style.display = 'none';
          }
        });
        
        // Hide family member actions and add form
        document.querySelectorAll('.member-actions').forEach(action => {
          action.style.display = 'none';
        });
        document.getElementById('add-family-form').style.display = 'none';
      }
    }
    
    // Save profile changes
    function saveProfileChanges() {
      // Update name
      const newName = document.getElementById('profile-name-edit').value;
      document.getElementById('profile-name-display').textContent = newName;
      
      // Update details
      const patientId = document.getElementById('patient-id-edit').value;
      const age = document.getElementById('age-edit').value;
      const gender = document.getElementById('gender-edit').value;
      const location = document.getElementById('location-edit').value;
      document.getElementById('profile-details-display').textContent = 
        `${patientId} • Age ${age} • ${gender} • ${location}`;
      
      // Update medical history
      const conditions = document.getElementById('conditions-edit').value;
      const allergies = document.getElementById('allergies-edit').value;
      document.getElementById('medical-history-display').textContent = 
        `${conditions} • Allergies: ${allergies}`;
      
      // Exit edit mode
      toggleEditMode(false);
      
      // Show success message
      toast('Profile updated successfully');
    }
    
    // Family member functions
    function addFamilyMember() {
      document.getElementById('add-family-form').style.display = 'block';
    }
    
    function cancelAddFamilyMember() {
      document.getElementById('add-family-form').style.display = 'none';
      document.getElementById('new-member-name').value = '';
      document.getElementById('new-member-relation').value = '';
    }
    
    function saveNewFamilyMember() {
      const name = document.getElementById('new-member-name').value;
      const relation = document.getElementById('new-member-relation').value;
      
      if (name && relation) {
        const newMember = document.createElement('div');
        newMember.className = 'family-member-item';
        newMember.innerHTML = `
          <span>${name} (${relation})</span>
          <div class="member-actions" style="display: flex;">
            <button class="icon-btn" onclick="editFamilyMember(this.parentElement.parentElement)">✏️</button>
            <button class="icon-btn" onclick="removeFamilyMember(this.parentElement.parentElement)">🗑️</button>
          </div>
        `;
        
        document.getElementById('family-members-list').appendChild(newMember);
        cancelAddFamilyMember();
        toast('Family member added');
      }
    }
    
    function editFamilyMember(memberElement) {
      const text = memberElement.querySelector('span').textContent;
      const regex = /(.+) \((.+)\)/;
      const match = text.match(regex);
      
      if (match) {
        const name = match[1];
        const relation = match[2];
        
        memberElement.innerHTML = `
          <div style="display: flex; gap: 8px; flex: 1;">
            <input type="text" value="${name}" style="flex: 1; border: 1px solid var(--border); padding: 4px 8px; border-radius: 4px;">
            <input type="text" value="${relation}" style="flex: 1; border: 1px solid var(--border); padding: 4px 8px; border-radius: 4px;">
          </div>
          <div class="member-actions" style="display: flex;">
            <button class="icon-btn" onclick="saveFamilyMemberEdit(this.parentElement.parentElement)">💾</button>
            <button class="icon-btn" onclick="cancelFamilyMemberEdit(this.parentElement.parentElement, '${name}', '${relation}')">❌</button>
          </div>
        `;
      }
    }
    
    function saveFamilyMemberEdit(memberElement) {
      const inputs = memberElement.querySelectorAll('input');
      const name = inputs[0].value;
      const relation = inputs[1].value;
      
      if (name && relation) {
        memberElement.innerHTML = `
          <span>${name} (${relation})</span>
          <div class="member-actions" style="display: flex;">
            <button class="icon-btn" onclick="editFamilyMember(this.parentElement.parentElement)">✏️</button>
            <button class="icon-btn" onclick="removeFamilyMember(this.parentElement.parentElement)">🗑️</button>
          </div>
        `;
        toast('Family member updated');
      }
    }
    
    function cancelFamilyMemberEdit(memberElement, originalName, originalRelation) {
      memberElement.innerHTML = `
        <span>${originalName} (${originalRelation})</span>
        <div class="member-actions" style="display: flex;">
          <button class="icon-btn" onclick="editFamilyMember(this.parentElement.parentElement)">✏️</button>
          <button class="icon-btn" onclick="removeFamilyMember(this.parentElement.parentElement)">🗑️</button>
        </div>
      `;
    }
    
    function removeFamilyMember(memberElement) {
      if (confirm('Are you sure you want to remove this family member?')) {
        memberElement.remove();
        toast('Family member removed');
      }
    }
    
    // Image upload function
    function previewImage(event) {
      const reader = new FileReader();
      reader.onload = function() {
        const output = document.getElementById('profile-img');
        output.src = reader.result;
        output.style.display = 'block';
        document.getElementById('profile-initials').style.display = 'none';
      };
      reader.readAsDataURL(event.target.files[0]);
    }
    
    // Utility functions (assuming these exist in your main code)
    function toast(message) {
      // Your existing toast implementation
      console.log(message);
    }
    
    function openTab(tabId) {
      // Your existing tab switching implementation
      console.log('Opening tab:', tabId);
    }
  
  // Add the styles to the document
  const styleSheet = document.createElement("style");
  styleSheet.innerText = additionalStyles;
  document.head.appendChild(styleSheet);
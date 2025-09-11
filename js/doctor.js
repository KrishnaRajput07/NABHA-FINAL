 /* --- Demo Data (replace with API) --- */
 let patientsData = [
    { 
      id:"PA-001", 
      name:"Gurpreet Kaur", 
      age:32, 
      gender: "female",
      phone: "+91 9876543210",
      status:"waiting", 
      cc:"Fever and body ache", 
      complaint: "Fever and body ache",
      prescription: "Paracetamol 500mg - 1 tablet every 6 hours for 3 days",
      vitals:{pulse:88, spo2:98, temp:"99.1°F"}, 
      hx:["No DM/HTN","Allergy: None"], 
      meds:["Paracetamol 500mg"],
      lastVisit: "2023-05-12",
      reports: [
        { type: "Consultation Notes", date: "2023-05-12", status: "completed" }
      ],
      blockchain: { verified: true, hash: "0x4A7D1ED1" }
    },
    { 
      id:"PA-002", 
      name:"Harjit Singh", 
      age:47, 
      gender: "male",
      phone: "+91 9876543211",
      status:"in-consult", 
      cc:"Type 2 Diabetes follow-up", 
      complaint: "Type 2 Diabetes follow-up",
      prescription: "Metformin 500mg - 1 tablet twice daily",
      vitals:{pulse:76, spo2:97, temp:"98.4°F"}, 
      hx:["DM since 2016"], 
      meds:["Metformin 500mg"],
      lastVisit: "2023-05-10",
      reports: [
        { type: "Lab Report - Blood Test", date: "2023-05-10", status: "pending" }
      ],
      blockchain: { verified: true, hash: "0x8B3F2A9C" }
    },
    { 
      id:"PA-003", 
      name:"Navdeep Sharma", 
      age:22, 
      gender: "male",
      phone: "+91 9876543212",
      status:"completed", 
      cc:"Ankle sprain", 
      complaint: "Ankle sprain",
      prescription: "Ibuprofen 200mg - as needed for pain",
      vitals:{pulse:82, spo2:99, temp:"98.6°F"}, 
      hx:["No prior surgery"], 
      meds:["Ibuprofen 200mg prn"],
      lastVisit: "2023-05-08",
      reports: [
        { type: "Prescription", date: "2023-05-08", status: "completed" },
        { type: "X-Ray Report", date: "2023-05-08", status: "completed" }
      ],
      blockchain: { verified: true, hash: "0x2D5E7F1A" }
    },
    { 
      id:"PA-004", 
      name:"Simranjeet Singh", 
      age:64, 
      gender: "male",
      phone: "+91 9876543213",
      status:"waiting", 
      cc:"Breathlessness", 
      complaint: "Breathlessness",
      prescription: "Salbutamol inhaler - 2 puffs as needed",
      vitals:{pulse:94, spo2:95, temp:"99.0°F"}, 
      hx:["Ex-Smoker"], 
      meds:["Salbutamol inhaler"],
      lastVisit: "2023-05-05",
      reports: [
        { type: "X-Ray Report", date: "2023-05-05", status: "completed" },
        { type: "Consultation Notes", date: "2023-05-05", status: "completed" }
      ],
      blockchain: { verified: true, hash: "0x9A3C5E2F" }
    },
    { 
      id:"PA-005", 
      name:"Kiran Bala", 
      age:39, 
      gender: "female",
      phone: "+91 9876543214",
      status:"completed", 
      cc:"Migraine", 
      complaint: "Migraine",
      prescription: "Sumatriptan 50mg - at onset of migraine",
      vitals:{pulse:78, spo2:99, temp:"98.6°F"}, 
      hx:["Migraine since 2018"], 
      meds:["Sumatriptan 50mg"],
      lastVisit: "2023-05-03",
      reports: [
        { type: "Consultation Notes", date: "2023-05-03", status: "completed" }
      ],
      blockchain: { verified: true, hash: "0x7B1D3F8E" }
    },
  ];

  const stockData = [
    { name:"Paracetamol 500mg", salt:"Acetaminophen", qty:120, expiry:"2026-05", status:"ok" },
    { name:"Amoxicillin 500mg", salt:"Amoxicillin", qty:35, expiry:"2025-02", status:"low" },
    { name:"Ibuprofen 200mg", salt:"Ibuprofen", qty:0, expiry:"2025-10", status:"out" },
    { name:"Cetirizine 10mg", salt:"Cetirizine", qty:86, expiry:"2026-01", status:"ok" },
    { name:"Omeprazole 20mg", salt:"Omeprazole", qty:15, expiry:"2025-03", status:"low" },
  ];

  /* --- Tabs --- */
  const tabs = document.querySelectorAll('.navitem');
  const sections = document.querySelectorAll('.section');
  tabs.forEach(t=>t.addEventListener('click', (e)=>{
    e.preventDefault();
    tabs.forEach(x=>x.classList.remove('active'));
    t.classList.add('active');
    openTab(t.dataset.tab);
  }));
  function openTab(id){
    sections.forEach(s=>s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    if(id==='patients') renderPatients();
    if(id==='stock') renderStock();
  }

  
  /* --- Availability --- */
  const toggleAvail = document.getElementById('toggleAvail');
  const availText = document.getElementById('availText');
  toggleAvail.addEventListener('change', ()=>{
    availText.textContent = toggleAvail.checked ? 'Available for Consults' : 'Away';
    availText.className = 'badge ' + (toggleAvail.checked ? 'ok' : 'warn');
  });

  /* --- Patients List + Filters --- */
  const grid = document.getElementById('patientsGrid');
  const search = document.getElementById('search');
  const filterStatus = document.getElementById('filterStatus');
  const filterAge = document.getElementById('filterAge');

  [search, filterStatus, filterAge].forEach(el=>el.addEventListener('input', renderPatients));

  function ageBucket(a){
    if(a<=18) return '0-18';
    if(a<=40) return '19-40';
    if(a<=60) return '41-60';
    return '60+';
  }
  function renderPatients(){
    const q = search.value.trim().toLowerCase();
    const fs = filterStatus.value;
    const fa = filterAge.value;
    const list = patientsData.filter(p=>{
      const okQ = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
      const okS = fs==='all' || p.status===fs;
      const okA = fa==='any' || ageBucket(p.age)===fa;
      return okQ && okS && okA;
    });
    grid.innerHTML = list.map(p=>`
      <article class="patient" onclick="openDrawer('${p.id}')">
        <div style="display:flex; align-items:center; gap:10px">
          <div class="avatar" aria-hidden="true">${p.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
          <div>
            <h4>${p.name}</h4>
            <div class="sub">ID ${p.id} • ${p.age} yrs</div>
          </div>
          <span class="right status">${labelStatus(p.status)}</span>
        </div>
        <div class="sep"></div>
        <div class="sub">CC: ${p.cc}</div>
      </article>
    `).join('') || `<div class="card">No patients found.</div>`;
  }
  function labelStatus(s){
    if(s==='waiting') return 'Waiting';
    if(s==='in-consult') return 'In Consult';
    return 'Completed';
  }

  /* --- Drawer (Patient details) --- */
  const drawer = document.getElementById('drawer');
  function openDrawer(id){
const p = patientsData.find(x=>x.id===id);
if(!p) return;

drawer.setAttribute('aria-hidden','false');
document.getElementById('drawerTitle').textContent = p.name;
document.getElementById('drawerSub').textContent = `${p.id} • ${p.age} yrs`;
document.getElementById('drawerAvatar').textContent = p.name.split(' ').map(w=>w[0]).slice(0,2).join('');

// New fields - removed vitals, added basic info
document.getElementById('kpiId').textContent = p.id;
document.getElementById('kpiAge').textContent = p.age + ' yrs';
document.getElementById('kpiGender').textContent = p.gender;
document.getElementById('ccText').textContent = p.cc;

// Set key information
const allergies = p.hx.find(item => item.toLowerCase().includes('allergy')) || 'None reported';
const conditions = p.hx.find(item => !item.toLowerCase().includes('allergy')) || 'None reported';
document.getElementById('infoAllergies').textContent = allergies;
document.getElementById('infoConditions').textContent = conditions;
document.getElementById('infoLastConsult').textContent = formatDate(p.lastVisit);

// Reset and populate medical history (filter out allergy info as it's already shown)
document.getElementById('hxList').innerHTML = p.hx
  .filter(h => !h.toLowerCase().includes('allergy'))
  .map(h=>`<li>${h}</li>`).join('');

drawer.classList.add('open');
}
// Format date for display
function formatDate(dateString) {
const options = { year: 'numeric', month: 'short', day: 'numeric' };
return new Date(dateString).toLocaleDateString(undefined, options);
}

function viewFullProfile() {
// This would open the complete patient profile modal
closeDrawer();
// In a real implementation, this would open the patient details modal
toast('Opening complete patient profile...');
}

  function closeDrawer(){
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden','true');
  }
  window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeDrawer(); });

  /* --- Export patients (demo) --- */
  function exportPatients(){
    const csv = ['ID,Name,Age,Status,Chief Complaint'].concat(
      patientsData.map(p=>[p.id,p.name,p.age,p.status,p.cc.replace(/,/g,';')].join(','))
    ).join('\n');
    const blob = new Blob([csv],{type:'text/csv'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'patients.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  /* --- Stock Rendering + Filters --- */
  const stockBody = document.getElementById('stockBody');
  const stockSearch = document.getElementById('stockSearch');
  const stockPills = document.querySelectorAll('.pill');

  stockSearch.addEventListener('input', renderStock);
  stockPills.forEach(p=>p.addEventListener('click', ()=>{
    stockPills.forEach(x=>x.classList.remove('active'));
    p.classList.add('active');
    renderStock();
  }));

  function renderStock(){
    const q = stockSearch.value.trim().toLowerCase();
    const view = document.querySelector('.pill.active').dataset.stock;
    const list = stockData.filter(m=>{
      const okQ = !q || m.name.toLowerCase().includes(q) || m.salt.toLowerCase().includes(q);
      const okV = view==='all' || m.status===view;
      return okQ && okV;
    });
    stockBody.innerHTML = list.map(m=>{
      const st = m.status==='ok' ? '<span class="badge ok">Available</span>' :
                m.status==='low' ? '<span class="badge warn">Low</span>' :
                '<span class="badge danger">Out</span>';
      const qtyCls = m.status==='ok' ? 'qty' : m.status==='low' ? 'qty low' : 'qty out';
      return `<tr>
        <td>${m.name}</td>
        <td class="muted">${m.salt}</td>
        <td class="${qtyCls}">${m.qty}</td>
        <td>${m.expiry}</td>
        <td>${st}</td>
      </tr>`;
    }).join('') || `<tr><td colspan="5" class="muted" style="text-align:center">No items found.</td></tr>`;
  }

  /* --- Toast --- */
  function toast(msg){
    const t = document.createElement('div');
    t.textContent = msg;
    Object.assign(t.style,{
      position:'fixed', bottom:'20px', left:'50%', transform:'translateX(-50%)',
      background:'#223729', color:'#fff', padding:'10px 14px', borderRadius:'10px',
      boxShadow:'0 8px 20px rgba(0,0,0,.2)', zIndex:9999, opacity:'0', transition:'.2s'
    });
    document.body.appendChild(t);
    requestAnimationFrame(()=>{ t.style.opacity='1' });
    setTimeout(()=>{ t.style.opacity='0'; setTimeout(()=>t.remove(),200) }, 1700);
  }

  /* Init */
  renderPatients();
  renderStock();

/*Image*/
  const uploadInput = document.getElementById("uploadPhoto");
const doctorPhoto = document.getElementById("doctorPhoto");

uploadInput.addEventListener("change", function() {
  if (this.files && this.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      doctorPhoto.src = e.target.result; // update preview
    };
    reader.readAsDataURL(this.files[0]);
  }
  
});

// Add these functions to your script section
function viewReport(type, id) {
toast(`Opening ${type} report: ${id}`);
// In a real application, this would open a modal or redirect to the report view
}

function downloadReport(type, id) {
toast(`Downloading ${type} report: ${id}`);
// In a real application, this would trigger a file download
}

function generateReport() {
toast('Generating comprehensive report...');
// In a real application, this would open a report generation dialog
}

// Add event listeners for the report filters
document.getElementById('reportSearch').addEventListener('input', filterReports);
document.getElementById('filterReportType').addEventListener('change', filterReports);
document.getElementById('filterDate').addEventListener('change', filterReports);

function filterReports() {
// This would filter the reports based on the selected criteria
const searchTerm = document.getElementById('reportSearch').value.toLowerCase();
const reportType = document.getElementById('filterReportType').value;
const dateFilter = document.getElementById('filterDate').value;

// Simple demo filtering - in a real app, this would be more comprehensive
const rows = document.getElementById('reportBody').getElementsByTagName('tr');

for (let i = 0; i < rows.length; i++) {
  const patientText = rows[i].getElementsByTagName('td')[0].textContent.toLowerCase();
  const typeText = rows[i].getElementsByTagName('td')[1].textContent.toLowerCase();
  
  const matchesSearch = !searchTerm || patientText.includes(searchTerm);
  const matchesType = reportType === 'all' || typeText.includes(reportType);
  
  rows[i].style.display = (matchesSearch && matchesType) ? '' : 'none';
}
}

// Enhanced patient data with more details - using the consolidated data above

// Initialize the report table


// Format date for display
function formatDate(dateString) {
const options = { year: 'numeric', month: 'short', day: 'numeric' };
return new Date(dateString).toLocaleDateString(undefined, options);
}

// Open add patient modal
function openAddPatientModal() {
document.getElementById('addPatientModal').classList.add('open');
}

// Close modal
function closeModal(modalId) {
document.getElementById(modalId).classList.remove('open');
}

// Add new patient
function addPatient(event) {
event.preventDefault();
const formData = new FormData(event.target);
const formProps = Object.fromEntries(formData);

// Generate a new patient ID if not provided
const patientId = formProps.patientId || `PA-${String(patientsData.length + 1).padStart(3, '0')}`;

const newPatient = {
  id: patientId,
  name: formProps.name,
  age: parseInt(formProps.age),
  gender: formProps.gender,
  phone: formProps.phone,
  status: "completed",
  complaint: formProps.complaint,
  prescription: formProps.prescription,
  history: formProps.history ? formProps.history.split(',').map(item => item.trim()) : [],
  lastVisit: new Date().toISOString().split('T')[0],
  reports: [
    { type: "Consultation Notes", date: new Date().toISOString().split('T')[0], status: "completed" }
  ],
  blockchain: { verified: true, hash: generateBlockchainHash() }
};

patientsData.push(newPatient);
initReportTable();
closeModal('addPatientModal');
event.target.reset();
toast('Patient added successfully and recorded on blockchain!');
}

// View patient details
function viewPatient(patientId) {
const patient = patientsData.find(p => p.id === patientId);
if (!patient) return;

// Populate modal with patient data
document.getElementById('detailsModalTitle').textContent = `Patient Details - ${patient.name}`;
document.getElementById('detailName').textContent = patient.name;
document.getElementById('detailAge').textContent = patient.age;
document.getElementById('detailGender').textContent = patient.gender;
document.getElementById('detailPhone').textContent = patient.phone;
document.getElementById('detailPatientId').textContent = patient.id;
document.getElementById('detailComplaint').textContent = patient.complaint;
document.getElementById('detailLastVisit').textContent = formatDate(patient.lastVisit);
document.getElementById('detailStatus').textContent = patient.status;
document.getElementById('detailPrescription').textContent = patient.prescription;

// Populate medical history
const historyList = document.getElementById('detailHistory');
historyList.innerHTML = '';
patient.history.forEach(item => {
  const li = document.createElement('li');
  li.textContent = item;
  historyList.appendChild(li);
});

// Generate AI insights
generateAIInsights(patient);

// Update blockchain status
const blockchainStatus = document.getElementById('blockchainStatus');
if (patient.blockchain.verified) {
  blockchainStatus.innerHTML = `🔗 Record Verified on Blockchain (Hash: ${patient.blockchain.hash})`;
} else {
  blockchainStatus.innerHTML = '⚠️ Record Not Verified';
}

// Open modal
document.getElementById('patientDetailsModal').classList.add('open');
}

// Delete patient
function deletePatient(patientId) {
if (confirm('Are you sure you want to delete this patient record? This action cannot be undone.')) {
  const index = patientsData.findIndex(p => p.id === patientId);
  if (index !== -1) {
    patientsData.splice(index, 1);
    initReportTable();
    toast('Patient record deleted successfully');
  }
}
}

// Download individual report
function downloadReport(patientId, reportType) {
const patient = patientsData.find(p => p.id === patientId);
if (!patient) return;

const report = patient.reports.find(r => r.type === reportType);
if (!report) return;

const content = `
  PATIENT MEDICAL REPORT
  ======================
  
  Patient Information:
  --------------------
  Name: ${patient.name}
  ID: ${patient.id}
  Age: ${patient.age}
  Gender: ${patient.gender}
  Phone: ${patient.phone}
  
  Report Details:
  ---------------
  Type: ${report.type}
  Date: ${formatDate(report.date)}
  Status: ${report.status}
  
  Clinical Information:
  ---------------------
  Chief Complaint: ${patient.complaint}
  Prescription: ${patient.prescription}
  
  Medical History:
  -----------------
  ${patient.history.map(item => `- ${item}`).join('\n')}
  
  Blockchain Verification:
  ------------------------
  Verified: ${patient.blockchain.verified ? 'Yes' : 'No'}
  Hash: ${patient.blockchain.hash}
  
  Generated on: ${new Date().toLocaleString()}
  Doctor: Dr. Amanpreet Singh (DOC-14237)
  Clinic: NabhaCare Clinic, Nabha, Punjab
`;

downloadFile(content, `${patient.id}_${report.type.replace(/\s+/g, '_')}_${report.date}.txt`);
toast('Report downloaded successfully');
}

// Download full patient record
function downloadPatientRecord() {
const patientId = document.getElementById('detailPatientId').textContent;
const patient = patientsData.find(p => p.id === patientId);
if (!patient) return;

const content = `
  COMPLETE PATIENT MEDICAL RECORD
  ===============================
  
  Patient Information:
  --------------------
  Name: ${patient.name}
  ID: ${patient.id}
  Age: ${patient.age}
  Gender: ${patient.gender}
  Phone: ${patient.phone}
  Last Visit: ${formatDate(patient.lastVisit)}
  Status: ${patient.status}
  
  Clinical Information:
  ---------------------
  Chief Complaint: ${patient.complaint}
  Current Prescription: ${patient.prescription}
  
  Medical History:
  -----------------
  ${patient.history.map(item => `- ${item}`).join('\n')}
  
  Visit History:
  --------------
  ${patient.reports.map(report => `- ${report.type} on ${formatDate(report.date)} (${report.status})`).join('\n')}
  
  Blockchain Verification:
  ------------------------
  Verified: ${patient.blockchain.verified ? 'Yes' : 'No'}
  Hash: ${patient.blockchain.hash}
  Timestamp: ${new Date().toISOString()}
  
  AI Health Insights:
  -------------------
  ${document.getElementById('aiInsightsText').textContent}
  
  Generated on: ${new Date().toLocaleString()}
  Doctor: Dr. Amanpreet Singh (DOC-14237)
  Clinic: NabhaCare Clinic, Nabha, Punjab
  
  🔗 This record has been verified on the blockchain network
`;

downloadFile(content, `${patient.id}_${patient.name}_Complete_Medical_Record.txt`);
toast('Complete patient record downloaded');
}

// Export all patients
function exportAllPatients() {
const csvContent = [
  ['ID', 'Name', 'Age', 'Gender', 'Phone', 'Complaint', 'Prescription', 'Last Visit', 'Status', 'Blockchain Hash'],
  ...patientsData.map(p => [
    p.id,
    p.name,
    p.age,
    p.gender,
    p.phone,
    p.complaint,
    p.prescription,
    p.lastVisit,
    p.status,
    p.blockchain.hash
  ])
].map(row => row.join(',')).join('\n');

downloadFile(csvContent, `all_patients_export_${new Date().toISOString().split('T')[0]}.csv`);
toast('All patients exported successfully');
}

// Generate AI insights
function generateAIInsights(patient) {
const insightsElement = document.getElementById('aiInsightsText');

// Show loading state
insightsElement.innerHTML = '<div class="spinner"></div> Analyzing patient data...';

// Simulate AI processing
setTimeout(() => {
  let insights = [];
  
  // Generate insights based on patient data
  if (patient.age > 60) {
    insights.push("Patient is in senior age group. Recommend preventive health screening.");
  }
  
  if (patient.history.some(h => h.toLowerCase().includes('diabet'))) {
    insights.push("Diabetes detected in history. Suggest HbA1c test and dietary consultation.");
  }
  
  if (patient.complaint.toLowerCase().includes('fever')) {
    insights.push("Patient presents with fever. Consider viral infection or other causes.");
  }
  
  if (patient.prescription.toLowerCase().includes('metformin')) {
    insights.push("Patient on Metformin. Check renal function and vitamin B12 levels.");
  }
  
  if (patient.history.some(h => h.toLowerCase().includes('smok'))) {
    insights.push("History of smoking. Recommend cessation counseling and lung health assessment.");
  }
  
  if (insights.length === 0) {
    insights.push("No significant patterns detected. Patient appears to be in generally good health.");
  }
  
  insightsElement.innerHTML = insights.map(i => `• ${i}`).join('<br>');
}, 1500);
}

// Generate blockchain hash (simulated)
function generateBlockchainHash() {
return '0x' + Math.floor(Math.random() * 1000000000).toString(16).toUpperCase();
}

// Download file utility
function downloadFile(content, fileName) {
const blob = new Blob([content], { type: 'text/plain' });
const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = fileName;
a.click();
URL.revokeObjectURL(a.href);
}

// Toast notification
function toast(msg) {
const t = document.createElement('div');
t.textContent = msg;
Object.assign(t.style, {
  position: 'fixed', 
  bottom: '20px', 
  left: '50%', 
  transform: 'translateX(-50%)',
  background: '#223729', 
  color: '#fff', 
  padding: '10px 14px', 
  borderRadius: '10px',
  boxShadow: '0 8px 20px rgba(0,0,0,.2)', 
  zIndex: 9999, 
  opacity: '0', 
  transition: '.2s'
});
document.body.appendChild(t);
requestAnimationFrame(() => { t.style.opacity = '1' });
setTimeout(() => { 
  t.style.opacity = '0'; 
  setTimeout(() => t.remove(), 200); 
}, 3000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
initReportTable();

// Add event listeners for filters
document.getElementById('reportSearch').addEventListener('input', filterReports);
document.getElementById('filterReportType').addEventListener('change', filterReports);
document.getElementById('filterDate').addEventListener('change', filterReports);
});

// Filter reports
function filterReports() {
const searchTerm = document.getElementById('reportSearch').value.toLowerCase();
const reportType = document.getElementById('filterReportType').value;
const dateFilter = document.getElementById('filterDate').value;
const rows = document.getElementById('reportBody').getElementsByTagName('tr');

for (let i = 0; i < rows.length; i++) {
  const patientText = rows[i].getElementsByTagName('td')[0].textContent.toLowerCase();
  const typeText = rows[i].getElementsByTagName('td')[1].textContent.toLowerCase();
  const dateText = rows[i].getElementsByTagName('td')[2].textContent;
  
  const matchesSearch = !searchTerm || patientText.includes(searchTerm);
  const matchesType = reportType === 'all' || typeText.includes(reportType.toLowerCase());
  const matchesDate = dateFilter === 'all' || checkDateFilter(dateText, dateFilter);
  
  rows[i].style.display = (matchesSearch && matchesType && matchesDate) ? '' : 'none';
}
}

// Check date filter
function checkDateFilter(dateString, filter) {
const date = new Date(dateString);
const today = new Date();

switch(filter) {
  case 'today':
    return date.toDateString() === today.toDateString();
  case 'week':
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    return date >= startOfWeek;
  case 'month':
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  default:
    return true;
}
}

//new add patient file upload
// File upload functionality
document.addEventListener('DOMContentLoaded', function() {
const fileInput = document.getElementById('medicalFiles');
const fileList = document.getElementById('fileList');

fileInput.addEventListener('change', function(e) {
  updateFileList(e.target.files);
});

// Drag and drop functionality
const dropArea = document.querySelector('.file-upload-container');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight() {
  dropArea.style.borderColor = '#53b89a';
  dropArea.style.backgroundColor = '#f1f9f6';
}

function unhighlight() {
  dropArea.style.borderColor = '#d7e6dd';
  dropArea.style.backgroundColor = '#f9fbfa';
}

dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  fileInput.files = files;
  updateFileList(files);
}

function updateFileList(files) {
  fileList.innerHTML = '';
  
  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      fileItem.innerHTML = `
        <span class="file-item-name">${file.name}</span>
        <button type="button" class="file-item-remove" onclick="removeFile(${i})">×</button>
      `;
      fileList.appendChild(fileItem);
    }
  }
}

window.removeFile = function(index) {
  const dt = new DataTransfer();
  const files = fileInput.files;
  
  for (let i = 0; i < files.length; i++) {
    if (i !== index) {
      dt.items.add(files[i]);
    }
  }
  
  fileInput.files = dt.files;
  updateFileList(dt.files);
};
});

// Modified addPatient function to handle file uploads
function addPatient(event) {
event.preventDefault();
const formData = new FormData(event.target);
const fileInput = document.getElementById('medicalFiles');
const files = fileInput.files;

// Append files to formData
for (let i = 0; i < files.length; i++) {
  formData.append('medicalFiles', files[i]);
}

const formProps = Object.fromEntries(formData);

// Generate a new patient ID if not provided
const patientId = formProps.patientId || `PA-${String(patientsData.length + 1).padStart(3, '0')}`;

// Process uploaded files
const uploadedFiles = [];
for (let i = 0; i < files.length; i++) {
  uploadedFiles.push({
    name: files[i].name,
    type: files[i].type,
    size: files[i].size,
    lastModified: files[i].lastModified
  });
}

const newPatient = {
  id: patientId,
  name: formProps.name,
  age: parseInt(formProps.age),
  gender: formProps.gender,
  phone: formProps.phone,
  status: "completed",
  lastVisit: new Date().toISOString().split('T')[0],
  documents: uploadedFiles,
  reports: [
    { type: "Medical Documents", date: new Date().toISOString().split('T')[0], status: "completed" }
  ],
  blockchain: { verified: true, hash: generateBlockchainHash() }
};

patientsData.push(newPatient);
initReportTable();
closeModal('addPatientModal');
event.target.reset();

// Clear file list
document.getElementById('fileList').innerHTML = '';
document.getElementById('medicalFiles').value = '';

toast('Patient added successfully with uploaded documents!');
}

// Modified viewPatient function to show uploaded documents
function viewPatient(patientId) {
const patient = patientsData.find(p => p.id === patientId);
if (!patient) return;

// Populate modal with patient data
document.getElementById('detailsModalTitle').textContent = `Patient Details - ${patient.name}`;
document.getElementById('detailName').textContent = patient.name;
document.getElementById('detailAge').textContent = patient.age;
document.getElementById('detailGender').textContent = patient.gender;
document.getElementById('detailPhone').textContent = patient.phone;
document.getElementById('detailPatientId').textContent = patient.id;
document.getElementById('detailLastVisit').textContent = formatDate(patient.lastVisit);
document.getElementById('detailStatus').textContent = patient.status;
document.getElementById('detailDocumentsCount').textContent = patient.documents ? patient.documents.length : 0;

// Populate uploaded documents
const documentsContainer = document.getElementById('uploadedDocuments');
documentsContainer.innerHTML = '';

if (patient.documents && patient.documents.length > 0) {
  patient.documents.forEach((doc, index) => {
    const docElement = document.createElement('div');
    docElement.className = 'document-card';
    
    // Determine icon based on file type
    let icon = '📄';
    if (doc.type.includes('image')) icon = '🖼️';
    else if (doc.type.includes('pdf')) icon = '📕';
    else if (doc.type.includes('word')) icon = '📘';
    
    docElement.innerHTML = `
      <div class="document-icon">${icon}</div>
      <div class="document-name">${doc.name}</div>
      <div class="document-actions">
        <button class="btn line small">View</button>
        <button class="btn line small">Download</button>
      </div>
    `;
    
    documentsContainer.appendChild(docElement);
  });
} else {
  documentsContainer.innerHTML = '<p class="muted">No documents uploaded</p>';
}

// Generate AI insights
generateAIInsights(patient);

// Update blockchain status
const blockchainStatus = document.getElementById('blockchainStatus');
if (patient.blockchain.verified) {
  blockchainStatus.innerHTML = `🔗 Record Verified on Blockchain (Hash: ${patient.blockchain.hash})`;
} else {
  blockchainStatus.innerHTML = '⚠️ Record Not Verified';
}

// Open modal
document.getElementById('patientDetailsModal').classList.add('open');
}

// Function to change patient status
function changePatientStatus(patientId, currentStatus) {
const statusOptions = [
  { value: 'waiting', label: 'Waiting', class: 'warn' },
  { value: 'in-consult', label: 'In Consult', class: 'accent' },
  { value: 'completed', label: 'Completed', class: 'ok' },
  { value: 'cancelled', label: 'Cancelled', class: 'danger' }
];

// Create dropdown menu
const dropdown = document.createElement('div');
dropdown.className = 'status-dropdown';

// Add options to dropdown
statusOptions.forEach(option => {
  const optionElement = document.createElement('div');
  optionElement.className = `status-option ${option.value === currentStatus ? 'active' : ''}`;
  optionElement.innerHTML = option.label;
  optionElement.style.color = `var(--${option.class})`;
  optionElement.onclick = () => {
    updatePatientStatus(patientId, option.value);
    dropdown.remove();
  };
  dropdown.appendChild(optionElement);
});

// Add click outside to close
setTimeout(() => {
  const closeDropdown = (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.remove();
      document.removeEventListener('click', closeDropdown);
    }
  };
  document.addEventListener('click', closeDropdown);
}, 0);

return dropdown;
}

// Function to update patient status
function updatePatientStatus(patientId, newStatus) {
const patient = patientsData.find(p => p.id === patientId);
if (patient) {
  patient.status = newStatus;
  
  // Update blockchain verification with new timestamp
  patient.blockchain = { 
    verified: true, 
    hash: generateBlockchainHash(),
    lastUpdated: new Date().toISOString()
  };
  
  // Update the UI
  initReportTable();
  toast(`Status updated to ${newStatus} for patient ${patientId}`);
}
}
// status
// Add this function to make status badges clickable
function makeStatusClickable() {
const statusBadges = document.querySelectorAll('.badge.ok, .badge.warn, .badge.danger');

statusBadges.forEach(badge => {
  badge.style.cursor = 'pointer';
  badge.title = 'Click to change status';
  
  badge.addEventListener('click', function(e) {
    e.stopPropagation();
    const patientId = this.closest('tr').querySelector('td:first-child').textContent.match(/\(([^)]+)\)/)[1];
    showStatusOptions(this, patientId);
  });
});
}

// Add this function to show status options
function showStatusOptions(element, patientId) {
// Remove any existing dropdown
const existingDropdown = document.querySelector('.status-dropdown');
if (existingDropdown) {
  existingDropdown.remove();
}

// Create dropdown menu
const dropdown = document.createElement('div');
dropdown.className = 'status-dropdown';
dropdown.style.position = 'absolute';
dropdown.style.background = 'white';
dropdown.style.border = '1px solid #e7efe9';
dropdown.style.borderRadius = '8px';
dropdown.style.padding = '8px';
dropdown.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
dropdown.style.zIndex = '1000';

// Position dropdown near the clicked element
const rect = element.getBoundingClientRect();
dropdown.style.top = `${rect.bottom + window.scrollY}px`;
dropdown.style.left = `${rect.left + window.scrollX}px`;

// Add status options
const statusOptions = [
  { value: 'waiting', label: 'Waiting', class: 'warn' },
  { value: 'in-consult', label: 'In Consult', class: 'accent' },
  { value: 'completed', label: 'Completed', class: 'ok' },
  { value: 'cancelled', label: 'Cancelled', class: 'danger' }
];

statusOptions.forEach(option => {
  const optionElement = document.createElement('div');
  optionElement.className = 'status-option';
  optionElement.textContent = option.label;
  optionElement.style.padding = '6px 12px';
  optionElement.style.cursor = 'pointer';
  optionElement.style.borderRadius = '4px';
  optionElement.style.marginBottom = '2px';
  
  optionElement.addEventListener('mouseenter', () => {
    optionElement.style.background = '#f6fbf8';
  });
  
  optionElement.addEventListener('mouseleave', () => {
    optionElement.style.background = 'transparent';
  });
  
  optionElement.addEventListener('click', () => {
    updatePatientStatus(patientId, option.value);
    dropdown.remove();
  });
  
  dropdown.appendChild(optionElement);
});

document.body.appendChild(dropdown);

// Close dropdown when clicking outside
setTimeout(() => {
  const closeHandler = (e) => {
    if (!dropdown.contains(e.target) && e.target !== element) {
      dropdown.remove();
      document.removeEventListener('click', closeHandler);
    }
  };
  document.addEventListener('click', closeHandler);
}, 0);
}

// Add this function to update patient status
function updatePatientStatus(patientId, newStatus) {
const patient = patientsData.find(p => p.id === patientId);
if (patient) {
  patient.status = newStatus;
  
  // Update the UI
  initReportTable();
  toast(`Status updated to ${newStatus} for patient ${patientId}`);
}
}

// Call this function after initReportTable()
// Add this at the end of your initReportTable function:
// makeStatusClickable();


// Function to change patient status
function changePatientStatus(patientId, currentStatus) {
const statusOptions = [
  { value: 'waiting', label: 'Waiting', class: 'warn' },
  { value: 'in-consult', label: 'In Consult', class: 'accent' },
  { value: 'completed', label: 'Completed', class: 'ok' },
  { value: 'cancelled', label: 'Cancelled', class: 'danger' }
];

// Create dropdown menu
const dropdown = document.createElement('div');
dropdown.className = 'status-dropdown';

// Add options to dropdown
statusOptions.forEach(option => {
  const optionElement = document.createElement('div');
  optionElement.className = `status-option ${option.value === currentStatus ? 'active' : ''}`;
  optionElement.innerHTML = option.label;
  optionElement.style.color = `var(--${option.class})`;
  optionElement.onclick = () => {
    updatePatientStatus(patientId, option.value);
    dropdown.remove();
  };
  dropdown.appendChild(optionElement);
});

// Add click outside to close
setTimeout(() => {
  const closeDropdown = (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.remove();
      document.removeEventListener('click', closeDropdown);
    }
  };
  document.addEventListener('click', closeDropdown);
}, 0);

return dropdown;
}

// Function to update patient status
function updatePatientStatus(patientId, newStatus) {
const patient = patientsData.find(p => p.id === patientId);
if (patient) {
  patient.status = newStatus;
  
  // Update blockchain verification with new timestamp
  patient.blockchain = { 
    verified: true, 
    hash: generateBlockchainHash(),
    lastUpdated: new Date().toISOString()
  };
  
  // Update the UI
  initReportTable();
  toast(`Status updated to ${newStatus} for patient ${patientId}`);
}
}

// Modify the initReportTable function to make status clickable
function initReportTable() {
const reportBody = document.getElementById('reportBody');
reportBody.innerHTML = '';

patientsData.forEach(patient => {
  patient.reports.forEach(report => {
    const row = document.createElement('tr');
    
    const statusClass = patient.status === 'completed' ? 'ok' : 
                       patient.status === 'in-consult' ? 'accent' :
                       patient.status === 'waiting' ? 'warn' : 'danger';
    
    const statusText = patient.status === 'in-consult' ? 'In Consult' :
                      patient.status === 'completed' ? 'Completed' :
                      patient.status === 'cancelled' ? 'Cancelled' : 'Waiting';
    
    const blockchainIcon = patient.blockchain.verified ? 
      '<span class="blockchain-badge" title="Blockchain Verified">🔗</span>' : '';
    
    // Create clickable status container
    const statusContainer = document.createElement('div');
    statusContainer.className = 'status-container';
    statusContainer.innerHTML = `
      <span class="badge ${statusClass}" onclick="event.stopPropagation(); 
        this.parentNode.appendChild(changePatientStatus('${patient.id}', '${patient.status}'))">
        ${statusText}
      </span>
    `;
    
    row.innerHTML = `
      <td>${patient.name} (${patient.id})</td>
      <td>${report.type}</td>
      <td>${formatDate(report.date)}</td>
      <td>${statusContainer.outerHTML}</td>
      <td>${blockchainIcon}</td>
      <td>
        <button class="btn line small" onclick="viewPatient('${patient.id}')">View</button>
        <button class="btn line small" onclick="downloadReport('${patient.id}', '${report.type}')">Download</button>
        <button class="btn line small" style="color: var(--danger); border-color: var(--danger);" 
                onclick="deletePatient('${patient.id}')">Delete</button>
      </td>
    `;
    
    reportBody.appendChild(row);
  });
});
setTimeout(makeStatusClickable, 0);
} 

// call
// Communication state management
let currentCall = null;
 let localStream = null;
 let remoteStream = null;
 let peerConnection = null;
 let isMuted = false;
 let isVideoEnabled = true;
 let chatMessages = [];
 let currentPatientId = null;

// Tab switching
document.querySelectorAll('.comms-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.comms-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.comms-content').forEach(c => c.classList.remove('active'));
    
    tab.classList.add('active');
    document.getElementById(`${tab.dataset.tab}-content`).classList.add('active');
  });
});

// Chat functionality
function sendMessage() {
  const input = document.getElementById('messageInput');
  const message = input.value.trim();
  
  if (!message) return;
  
  // Add message to UI
  addMessageToChat(message, 'sent', new Date());
  
  // In a real implementation, you would send this to your backend
  // and then to the patient's device
  simulatePatientResponse(message);
  
  // Clear input
  input.value = '';
}

function addMessageToChat(text, type, timestamp) {
  const messagesContainer = document.getElementById('chatMessages');
  const messageEl = document.createElement('div');
  messageEl.className = `message ${type}`;
  
  const timeString = timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  
  messageEl.innerHTML = `
    <div>${text}</div>
    <div class="message-time">${timeString}</div>
  `;
  
  messagesContainer.appendChild(messageEl);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  // Store message
  chatMessages.push({
    text,
    type,
    timestamp,
    patientId: currentPatientId
  });
}

function simulatePatientResponse(doctorMessage) {
  // This is a simulation - in a real app, you'd receive actual responses from the patient
  setTimeout(() => {
    // Simple response logic based on doctor's message
    let response = "Thank you for your message.";
    
    if (doctorMessage.toLowerCase().includes('how are you') || 
        doctorMessage.toLowerCase().includes('how do you feel')) {
      response = "I'm feeling better today, thank you for asking.";
    } else if (doctorMessage.toLowerCase().includes('symptom')) {
      response = "The symptoms have improved since yesterday.";
    } else if (doctorMessage.toLowerCase().includes('medicine') || 
               doctorMessage.toLowerCase().includes('medication')) {
      response = "I've been taking the medication as prescribed.";
    }
    
    addMessageToChat(response, 'received', new Date());
  }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
}

// Call functionality
async function startVoiceCall() {
  try {
    updateCallStatus("Starting voice call...");
    
    // Get audio stream
    localStream = await navigator.mediaDevices.getUserMedia({ 
      audio: true, 
      video: false 
    });
    
    // In a real implementation, you would initialize a WebRTC connection here
    // This is a simplified simulation
    simulateCallConnection();
    
    // Update UI
    document.getElementById('startCallBtn').style.display = 'none';
    document.getElementById('endCallBtn').style.display = 'block';
    updateCallStatus("Call in progress...");
    
  } catch (error) {
    console.error("Error starting call:", error);
    updateCallStatus("Failed to start call. Please check your microphone permissions.");
  }
}

async function startVideoCall() {
  try {
    updateVideoStatus("Starting video call...");
    
    // Get audio and video stream
    localStream = await navigator.mediaDevices.getUserMedia({ 
      audio: true, 
      video: true 
    });
    
    // Display local video
    const localVideo = document.getElementById('localVideo');
    localVideo.srcObject = localStream;
    
    // In a real implementation, you would initialize a WebRTC connection here
    // This is a simplified simulation
    simulateVideoConnection();
    
    // Update UI
    document.getElementById('startVideoBtn').style.display = 'none';
    document.getElementById('endVideoBtn').style.display = 'block';
    updateVideoStatus("Video call in progress...");
    
  } catch (error) {
    console.error("Error starting video call:", error);
    updateVideoStatus("Failed to start video call. Please check your camera and microphone permissions.");
  }
}

function endCall() {
  // Stop all tracks
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
  }
  
  // Reset UI
  document.getElementById('startCallBtn').style.display = 'block';
  document.getElementById('endCallBtn').style.display = 'none';
  document.getElementById('startVideoBtn').style.display = 'block';
  document.getElementById('endVideoBtn').style.display = 'none';
  
  // Clear video elements
  document.getElementById('localVideo').srcObject = null;
  document.getElementById('remoteVideo').srcObject = null;
  
  updateCallStatus("Call ended");
  updateVideoStatus("Video call ended");
  
  // In a real implementation, you would close the WebRTC connection here
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  
  currentCall = null;
  localStream = null;
}

function toggleMute() {
  if (!localStream) return;
  
  const audioTracks = localStream.getAudioTracks();
  if (audioTracks.length > 0) {
    isMuted = !isMuted;
    audioTracks[0].enabled = !isMuted;
    
    const muteBtn = document.getElementById('muteBtn');
    const videoMuteBtn = document.getElementById('videoMuteBtn');
    
    if (isMuted) {
      muteBtn.innerHTML = '🔇';
      videoMuteBtn.innerHTML = '🔇';
      muteBtn.style.background = 'var(--warn)';
      videoMuteBtn.style.background = 'var(--warn)';
    } else {
      muteBtn.innerHTML = '🔊';
      videoMuteBtn.innerHTML = '🔊';
      muteBtn.style.background = 'white';
      videoMuteBtn.style.background = 'white';
    }
  }
}

function toggleVideo() {
  if (!localStream) return;
  
  const videoTracks = localStream.getVideoTracks();
  if (videoTracks.length > 0) {
    isVideoEnabled = !isVideoEnabled;
    videoTracks[0].enabled = isVideoEnabled;
    
    // UI feedback could be added here
  }
}

function switchToVideo() {
  // Switch to video tab
  document.querySelectorAll('.comms-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.comms-content').forEach(c => c.classList.remove('active'));
  
  document.querySelector('.comms-tab[data-tab="video"]').classList.add('active');
  document.getElementById('video-content').classList.add('active');
  
  // If in a call, upgrade to video
  if (currentCall) {
    startVideoCall();
  }
}

function updateCallStatus(status) {
  document.getElementById('callStatus').textContent = status;
}

function updateVideoStatus(status) {
  document.getElementById('videoStatus').textContent = status;
}

// Simulation functions (replace with actual WebRTC implementation)
function simulateCallConnection() {
  currentCall = {
    type: 'voice',
    startTime: new Date(),
    patientId: currentPatientId
  };
  
  // Simulate patient answering after a delay
  setTimeout(() => {
    updateCallStatus("Connected - 00:05");
    
    // Start a timer to show call duration
    let seconds = 5;
    const timer = setInterval(() => {
      if (!currentCall) {
        clearInterval(timer);
        return;
      }
      
      seconds++;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      updateCallStatus(`Connected - ${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`);
    }, 1000);
  }, 2000);
}

function simulateVideoConnection() {
  currentCall = {
    type: 'video',
    startTime: new Date(),
    patientId: currentPatientId
  };
  
  // Simulate patient answering after a delay
  setTimeout(() => {
    updateVideoStatus("Connected - 00:05");
    
    // In a real implementation, you would receive the remote video stream
    // For simulation, we'll use a placeholder
    document.getElementById('remoteVideo').style.background = '#3a4a42';
    
    // Start a timer to show call duration
    let seconds = 5;
    const timer = setInterval(() => {
      if (!currentCall) {
        clearInterval(timer);
        return;
      }
      
      seconds++;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      updateVideoStatus(`Connected - ${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`);
    }, 1000);
  }, 2000);
}

// Initialize communication when drawer opens
const originalOpenDrawer = openDrawer;
openDrawer = function(id) {
  originalOpenDrawer(id);
  currentPatientId = id;
  
  // Load previous chat messages for this patient
  loadChatHistory(id);
};

function loadChatHistory(patientId) {
  // In a real implementation, you would fetch chat history from your backend
  // This is a simulation with some sample messages
  const chatMessagesContainer = document.getElementById('chatMessages');
  chatMessagesContainer.innerHTML = '';
  
  // Sample initial messages
  addMessageToChat("Hello Doctor, thank you for seeing me today.", 'received', new Date(Date.now() - 600000));
  addMessageToChat("Hello, how can I help you today?", 'sent', new Date(Date.now() - 300000));
}
 

/* Add to your JavaScript */
function toggleMobileMenu() {
  document.querySelector('.mobile-sidebar').classList.toggle('open');
  document.querySelector('.sidebar-overlay').classList.toggle('open');
}

function closeMobileMenu() {
  document.querySelector('.mobile-sidebar').classList.remove('open');
  document.querySelector('.sidebar-overlay').classList.remove('open');
}

// Add click event to overlay to close sidebar
document.querySelector('.sidebar-overlay').addEventListener('click', closeMobileMenu);

// Add navigation items to mobile footer
function initMobileFooter() {
  const footerNav = document.querySelector('.mobile-footer-nav');
  const navItems = [
    { icon: '👤', text: 'Profile', tab: 'profile' },
    { icon: '🧑‍🤝‍🧑', text: 'Patients', tab: 'patients' },
    { icon: '💊', text: 'Stock', tab: 'stock' },
    { icon: '🗂️', text: 'Log', tab: 'Report' },
    { icon: '⚙️', text: 'Settings', tab: 'settings' }
  ];
  
  footerNav.innerHTML = navItems.map(item => `
    <a class="mobile-footer-item" data-tab="${item.tab}" onclick="openTab('${item.tab}'); closeMobileMenu();">
      <div>${item.icon}</div>
      <span>${item.text}</span>
    </a>
  `).join('');
}

// Update active state on mobile footer
function updateMobileFooterActive(tab) {
  document.querySelectorAll('.mobile-footer-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.tab === tab) {
      item.classList.add('active');
    }
  });
}

// Modify openTab function to update mobile footer
function openTab(id) {
  sections.forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  if (id === 'patients') renderPatients();
  if (id === 'stock') renderStock();
  
  // Update mobile footer active state
  if (typeof updateMobileFooterActive === 'function') {
    updateMobileFooterActive(id);
  }
}


// Initialize mobile footer when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // ... existing code ...
  
  // Initialize mobile navigation
  if (typeof initMobileFooter === 'function') {
    initMobileFooter();
  }
  
  // Set initial active tab on mobile footer
  if (typeof updateMobileFooterActive === 'function') {
    updateMobileFooterActive(currentTab);
  }
});
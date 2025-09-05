 /* Demo data with batch-wise tracking */
 const stockData = [
    {id: 1, name:"Paracetamol 500mg", salt:"Acetaminophen", batch:"BATCH001", qty:10, expiry:"2025-09-30", status:"low"},
    {id: 2, name:"Paracetamol 500mg", salt:"Acetaminophen", batch:"BATCH002", qty:25, expiry:"2026-02-15", status:"ok"},
    {id: 3, name:"Paracetamol 500mg", salt:"Acetaminophen", batch:"BATCH003", qty:0, expiry:"2025-07-01", status:"out"},
    {id: 4, name:"Amoxicillin 500mg", salt:"Amoxicillin", batch:"BATCH045", qty:15, expiry:"2024-12-15", status:"ok"},
    {id: 5, name:"Ibuprofen 200mg", salt:"Ibuprofen", batch:"BATCH128", qty:5, expiry:"2025-03-20", status:"low"},
    {id: 6, name:"Cetirizine 10mg", salt:"Cetirizine", batch:"BATCH201", qty:86, expiry:"2026-01-10", status:"ok"},
    {id: 7, name:"Omeprazole 20mg", salt:"Omeprazole", batch:"BATCH078", qty:15, expiry:"2025-03-05", status:"low"},
    {id: 8, name:"Atorvastatin 10mg", salt:"Atorvastatin", batch:"BATCH332", qty:42, expiry:"2025-08-22", status:"ok"},
    {id: 9, name:"Metformin 500mg", salt:"Metformin", batch:"BATCH115", qty:28, expiry:"2025-05-18", status:"low"},
    {id: 10, name:"Losartan 50mg", salt:"Losartan", batch:"BATCH299", qty:64, expiry:"2026-03-14", status:"ok"},
  ];

  const purchaseRequests = [
    {id:"PR-001", requester:"Clinic - Dr. Aman", items:[{name:"Amoxicillin 500mg", qty:20}], note:"Urgent", status:"pending", date:"2023-05-15"},
    {id:"PR-002", requester:"Patient - Kiran Bala", items:[{name:"Ibuprofen 200mg", qty:10}], note:"Home delivery", status:"pending", date:"2023-05-14"},
    {id:"PR-003", requester:"Ward 4 - Nurse Station", items:[{name:"Paracetamol 500mg", qty:50}, {name:"Cetirizine 10mg", qty:30}], note:"Monthly restock", status:"approved", date:"2023-05-10"},
  ];

  const researchDocs = [
    {id:"R-001", title:"Comparative efficacy of Paracetamol", body:"Abstract: This study compares the efficacy of paracetamol across different patient demographics. Results show consistent pain relief in 89% of cases with minimal side effects."},
    {id:"R-002", title:"Amoxicillin – dosage guidelines", body:"Abstract: Updated guidelines for antibiotic stewardship recommend reduced duration of amoxicillin courses for uncomplicated infections to combat antimicrobial resistance."},
    {id:"R-003", title:"Drug interactions with Omeprazole", body:"Abstract: Review of PPI interactions with common cardiovascular and psychiatric medications. Notable interactions found with clopidogrel and diazepam requiring dosage adjustments."},
    {id:"R-004", title:"Storage stability of insulin analogs", body:"Abstract: Study on the stability of various insulin formulations under different storage conditions. Recommendations provided for optimal pharmacy storage practices."},
  ];

  /* Sidebar tabs */
  const navitems = document.querySelectorAll('.navitem');
  const sections = document.querySelectorAll('.section');
  navitems.forEach(n => n.addEventListener('click', (e)=>{
    e.preventDefault();
    navitems.forEach(x=>x.classList.remove('active'));
    n.classList.add('active');
    openTab(n.dataset.tab);
    if(window.innerWidth <= 820) closeSide();
  }));

  function openTab(id){
    sections.forEach(s=>s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    if(id === 'stock') renderStock();
    if(id === 'expiry') checkExpiryAlerts();
    if(id === 'purchase') renderPurchase();
    if(id === 'research') renderResearch();
    if(id === 'prescriptions') { document.getElementById('prescResult').innerHTML=''; }
  }

  // initial
  document.addEventListener('DOMContentLoaded', ()=>{ 
    openTab('profile'); 
    renderStock(); 
    renderPurchase(); 
    renderResearch(); 
    checkExpiryAlerts();
    updateExpiringCount();
  });

  /* Side toggle for mobile */
  function toggleSide(){
    const side = document.getElementById('side');
    side.classList.toggle('open');
  }
  function closeSide(){ document.getElementById('side').classList.remove('open') }

  /* STOCK with batch-wise tracking */
  const stockBody = document.getElementById('stockBody');
  function renderStock(){
    const q = (document.getElementById('stockSearch') || {}).value || '';
    const view = document.querySelector('.pill.active')?.dataset?.stock || 'all';
    
    const list = stockData.filter(m => {
      const okQ = !q || 
        m.name.toLowerCase().includes(q.toLowerCase()) || 
        m.salt.toLowerCase().includes(q.toLowerCase()) ||
        m.batch.toLowerCase().includes(q.toLowerCase());
      
      // Determine status based on quantity and expiry
      const today = new Date();
      const expiryDate = new Date(m.expiry);
      let status = m.status;
      
      // Check if expired
      if (expiryDate < today) {
        status = 'expired';
      }
      
      const okV = view === 'all' || 
                 (view === 'low' && status === 'low') ||
                 (view === 'out' && status === 'out') ||
                 (view === 'expiring' && isExpiringSoon(expiryDate));
      
      return okQ && okV;
    });
    
    stockBody.innerHTML = list.map(m => {
      const today = new Date();
      const expiryDate = new Date(m.expiry);
      let status = m.status;
      let statusClass = status;
      
      // Check if expired
      if (expiryDate < today) {
        status = 'expired';
        statusClass = 'expired';
      }
      
      const st = status === 'ok' ? '<span class="badge ok">Available</span>' :
               status === 'low' ? '<span class="badge warn">Low</span>' :
               status === 'out' ? '<span class="badge danger">Out</span>' :
               '<span class="badge expired">Expired</span>';
               
      const qtyCls = status === 'ok' ? 'qty' : status === 'low' ? 'low' : 'out';
      
      return `<tr>
        <td>${m.name}</td>
        <td class="muted">${m.salt}</td>
        <td>${m.batch}</td>
        <td class="${qtyCls}">${m.qty}</td>
        <td>${formatDate(m.expiry)}</td>
        <td>${st}</td>
        <td>
          <button class="btn line" onclick="editBatch(${m.id})">Edit</button>
          <button class="btn line" onclick="deleteBatch(${m.id})" style="color: #c5221f;">Delete</button>
        </td>
      </tr>`;
    }).join('') || `<tr><td colspan="7" class="muted" style="text-align:center">No items found.</td></tr>`;
  }

  document.getElementById('stockSearch')?.addEventListener('input', renderStock);
  function filterStock(btn){
    document.querySelectorAll('.pill').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    renderStock();
  }

  /* Add batch drawer */
  const batchDrawer = document.getElementById('batchDrawer');
  function openAddBatch(){
    batchDrawer.classList.add('open');
    batchDrawer.setAttribute('aria-hidden','false');
    document.getElementById('batchForm').reset();
    document.getElementById('expiryWarning').textContent = '';
  }
  
  function closeBatchDrawer(){
    batchDrawer.classList.remove('open');
    batchDrawer.setAttribute('aria-hidden','true');
  }
  
  // Validate expiry date
  document.getElementById('batchExpiry')?.addEventListener('change', function() {
    const expiryDate = new Date(this.value);
    const today = new Date();
    const warningEl = document.getElementById('expiryWarning');
    
    if (this.value && expiryDate < today) {
      warningEl.textContent = 'Warning: This expiry date has already passed!';
    } else {
      warningEl.textContent = '';
    }
  });
  
  function handleBatchSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('batchName').value.trim();
    const salt = document.getElementById('batchSalt').value.trim();
    const batch = document.getElementById('batchNumber').value.trim();
    const quantity = parseInt(document.getElementById('batchQty').value);
    const expiry = document.getElementById('batchExpiry').value;
    
    if (!name || !salt || !batch || isNaN(quantity) || quantity < 0 || !expiry) {
      toast('Please fill all required fields correctly');
      return;
    }
    
    // Determine status based on quantity
    let status = 'ok';
    if (quantity === 0) {
      status = 'out';
    } else if (quantity < 10) {
      status = 'low';
    }
    
    // Check if batch already exists
    const existingIndex = stockData.findIndex(item => item.batch === batch);
    
    if (existingIndex !== -1) {
      // Update existing batch
      stockData[existingIndex] = {
        ...stockData[existingIndex],
        name,
        salt,
        quantity,
        expiry,
        status
      };
      document.getElementById('recentAdds').textContent = `${name} (${batch}) updated`;
    } else {
      // Add new batch
      const newId = Math.max(...stockData.map(item => item.id), 0) + 1;
      stockData.unshift({
        id: newId,
        name,
        salt,
        batch,
        qty: quantity,
        expiry,
        status
      });
      document.getElementById('recentAdds').textContent = `${name} (${batch}) x${quantity} added`;
    }
    
    closeBatchDrawer();
    renderStock();
    checkExpiryAlerts();
    updateExpiringCount();
    toast('Batch saved successfully');
  }
  
  function editBatch(id) {
    const item = stockData.find(item => item.id === id);
    if (item) {
      document.getElementById('batchName').value = item.name;
      document.getElementById('batchSalt').value = item.salt;
      document.getElementById('batchNumber').value = item.batch;
      document.getElementById('batchQty').value = item.qty;
      document.getElementById('batchExpiry').value = item.expiry;
      
      batchDrawer.classList.add('open');
      batchDrawer.setAttribute('aria-hidden','false');
    }
  }
  
  function deleteBatch(id) {
    if (confirm('Are you sure you want to delete this batch?')) {
      const index = stockData.findIndex(item => item.id === id);
      if (index !== -1) {
        stockData.splice(index, 1);
        renderStock();
        checkExpiryAlerts();
        updateExpiringCount();
        toast('Batch deleted successfully');
      }
    }
  }
  
  function isExpiringSoon(expiryDate) {
    const today = new Date();
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(today.getDate() + 90);
    return expiryDate > today && expiryDate <= ninetyDaysFromNow;
  }
  
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
  
  function updateExpiringCount() {
    const today = new Date();
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(today.getDate() + 90);
    
    const expiringCount = stockData.filter(item => {
      const expiryDate = new Date(item.expiry);
      return expiryDate > today && expiryDate <= ninetyDaysFromNow;
    }).length;
    
    document.getElementById('expiringCount').textContent = expiringCount;
  }
  
  /* Check for expiry alerts */
  function checkExpiryAlerts() {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    const expiringSoon = stockData.filter(item => {
      const expiryDate = new Date(item.expiry);
      return expiryDate > today && expiryDate <= thirtyDaysFromNow;
    });
    
    const expired = stockData.filter(item => {
      const expiryDate = new Date(item.expiry);
      return expiryDate < today;
    });
    
    const alertsContainer = document.getElementById('expiryAlerts');
    alertsContainer.innerHTML = '';
    
    if (expiringSoon.length === 0 && expired.length === 0) {
      alertsContainer.innerHTML = '<p>No expiry alerts at this time.</p>';
      return;
    }
    
    if (expired.length > 0) {
      const expiredHeader = document.createElement('h3');
      expiredHeader.textContent = 'Expired Batches';
      expiredHeader.style.color = '#c5221f';
      alertsContainer.appendChild(expiredHeader);
      
      expired.forEach(item => {
        const alert = document.createElement('div');
        alert.className = 'expiry-alert expired';
        alert.innerHTML = `
          <p><strong>${item.name} (Batch: ${item.batch})</strong> expired on ${formatDate(item.expiry)}</p>
          <p class="warning">Please remove from stock immediately.</p>
        `;
        alertsContainer.appendChild(alert);
      });
    }
    
    if (expiringSoon.length > 0) {
      const expiringHeader = document.createElement('h3');
      expiringHeader.textContent = 'Batches Expiring Soon (within 30 days)';
      expiringHeader.style.color = '#b06000';
      alertsContainer.appendChild(expiringHeader);
      
      expiringSoon.forEach(item => {
        const alert = document.createElement('div');
        alert.className = 'expiry-alert';
        alert.innerHTML = `
          <p><strong>${item.name} (Batch: ${item.batch})</strong> expires on ${formatDate(item.expiry)}</p>
          <p>Current quantity: ${item.qty}</p>
        `;
        alertsContainer.appendChild(alert);
      });
    }
  }
  
  function exportStock() {
    // In a real application, this would generate a CSV file
    toast('Exporting stock data to CSV...');
    console.log('Stock data exported:', stockData);
  }

  /* PURCHASE requests */
  function renderPurchase(){
    const el = document.getElementById('purchaseList');
    const searchTerm = (document.getElementById('purchaseSearch') || {}).value || '';
    
    const filteredRequests = purchaseRequests.filter(r => 
      !searchTerm || 
      r.requester.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.items.some(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    el.innerHTML = filteredRequests.map(r => {
      const items = r.items.map(i => `${i.name} ×${i.qty}`).join(', ');
      const statusClass = r.status === 'approved' ? 'ok' : r.status === 'rejected' ? 'danger' : 'warn';
      const statusText = r.status === 'approved' ? 'Approved' : r.status === 'rejected' ? 'Rejected' : 'Pending';
      
      return `<div class="card request fade-in">
        <div style="display:flex;gap:12px;align-items:center;margin-bottom:8px">
          <div style="font-weight:800">${r.requester}</div>
          <div class="muted">${r.id}</div>
          <div class="badge ${statusClass}">${statusText}</div>
        </div>
        <div class="muted" style="margin-bottom:8px">${items}</div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div class="muted">${r.note} • ${r.date}</div>
          <div class="actions">
            ${r.status === 'pending' ? `
              <button class="btn" onclick="approveRequest('${r.id}')">Approve</button>
              <button class="btn line" onclick="rejectRequest('${r.id}')">Reject</button>
            ` : ''}
          </div>
        </div>
      </div>`;
    }).join('') || '<div class="card muted">No requests found</div>';
  }
  
  document.getElementById('purchaseSearch')?.addEventListener('input', renderPurchase);
  
  function approveRequest(id){
    const idx = purchaseRequests.findIndex(r=>r.id===id);
    if(idx===-1) return;
    purchaseRequests[idx].status='approved';
    toast('Request approved — pushed to supplier');
    renderPurchase();
  }
  
  function rejectRequest(id){
    const idx = purchaseRequests.findIndex(r=>r.id===id);
    if(idx===-1) return;
    purchaseRequests[idx].status='rejected';
    toast('Request rejected');
    renderPurchase();
  }
  
  function openPurchaseForm(){ 
    document.getElementById('purchaseModal').classList.add('show');
  }
  
  function closePurchaseModal() {
    document.getElementById('purchaseModal').classList.remove('show');
  }
  
  function submitPurchaseRequest() {
    const name = document.getElementById('purchaseName').value.trim();
    const qty = document.getElementById('purchaseQty').value;
    const requester = document.getElementById('purchaseRequester').value.trim();
    const notes = document.getElementById('purchaseNotes').value.trim();
    
    if(!name || !qty || !requester) {
      toast('Please fill required fields');
      return;
    }
    
    const newRequest = {
      id: `PR-${String(purchaseRequests.length + 1).padStart(3, '0')}`,
      requester: requester,
      items: [{name: name, qty: parseInt(qty)}],
      note: notes || 'No additional notes',
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    
    purchaseRequests.unshift(newRequest);
    closePurchaseModal();
    renderPurchase();
    toast('Purchase request submitted');
  }

  /* RESEARCH */
  function renderResearch(){
    const list = researchDocs;
    const searchTerm = (document.getElementById('researchSearch') || {}).value || '';
    
    const filteredDocs = researchDocs.filter(d => 
      !searchTerm || 
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      d.body.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const el = document.getElementById('researchList');
    el.innerHTML = filteredDocs.map(d => `
      <div class="card fade-in">
        <div style="font-weight:800;margin-bottom:8px">${d.title}</div>
        <div class="muted" style="margin-bottom:12px;font-size:0.9rem">${d.body.substring(0, 100)}...</div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div class="muted">Document ID: ${d.id}</div>
          <button class="btn line" onclick="previewResearch('${d.id}')">Read More</button>
        </div>
      </div>`).join('') || '<div class="card muted">No research documents found</div>';
  }
  
  document.getElementById('researchSearch')?.addEventListener('input', renderResearch);
  
  function previewResearch(id){
    const doc = researchDocs.find(d=>d.id===id);
    if(!doc) return;
    document.getElementById('researchTitle').textContent = doc.title;
    document.getElementById('researchBody').textContent = doc.body;
    document.getElementById('researchModal').classList.add('show');
  }
  
  function closeResearchModal(){ 
    document.getElementById('researchModal').classList.remove('show'); 
  }

  /* PRESCRIPTION lookup + AI example */
  function searchPrescription(){
    const q = document.getElementById('prescSearch').value.trim();
    if(!q){ toast('Enter an ID to search'); return; }
    // demo: if q matches PA-001 show patient
    if(q.toLowerCase().includes('pa-001') || q.toLowerCase().includes('rx-demo')){
      renderPrescModal({
        pid:'PA-001',
        patient:'Gurpreet Kaur',
        age:32,
        meds:[
          {name:'Paracetamol 500mg', dose:'1 tab', freq:'8 hourly', days:3},
          {name:'Cetirizine 10mg', dose:'1 tab', freq:'once daily', days:5}
        ],
        notes:'Take with food. Return if fever persists.'
      });
    } else {
      document.getElementById('prescResult').innerHTML = `
        <div class="card muted" style="text-align:center">
          No prescription found for "${q}". Try searching for "PA-001" or "RX-DEMO" for a demo.
        </div>
      `;
    }
  }

  function demoAIPresc(){
    // Demo of AI-generated prescription card
    renderPrescModal({
      pid:'AI-RX-2025-07',
      patient:'Sample Patient',
      age:45,
      meds:[
        {name:'Amoxicillin 500mg', dose:'1 cap', freq:'8 hourly', days:5},
        {name:'Paracetamol 500mg', dose:'1 tab', freq:'6 hourly', days:3}
      ],
      notes:'AI-suggested: check allergy history before dispensing.'
    });
  }

  function renderPrescModal(p){
    document.getElementById('prescTitle').textContent = `Prescription • ${p.pid}`;
    const body = document.getElementById('prescBody');
    body.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <div><strong>${p.patient}</strong> • ${p.age} yrs</div>
        <div class="muted">ID: ${p.pid}</div>
      </div>
      <div style="border-radius:10px;padding:12px;background:#fbfff9">
        ${p.meds.map(m=>`<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px dashed #eef6ef">
          <div><strong>${m.name}</strong><div class="muted">${m.dose} • ${m.freq}</div></div>
          <div class="muted">${m.days} days</div>
        </div>`).join('')}
      </div>
      <div style="margin-top:12px" class="muted"><strong>Notes:</strong> ${p.notes}</div>
      <div style="margin-top:8px">
        <label style="display:block;margin-bottom:6px">Adjust quantities / mark as ready</label>
        <textarea id="fulfillNotes" class="textarea" rows="3" placeholder="Add packing notes or instructions"></textarea>
      </div>
    `;
    document.getElementById('prescModal').classList.add('show');
  }

  function closePrescModal(){ document.getElementById('prescModal').classList.remove('show') }

  function fulfillPrescription(){
    const notes = document.getElementById('fulfillNotes')?.value || '';
    toast('Prescription fulfilled. ' + (notes ? 'Notes saved.' : ''));
    closePrescModal();
  }

  /* Toast helper */
  function toast(msg){
    const t = document.createElement('div');
    t.textContent = msg;
    Object.assign(t.style,{
      position:'fixed',
      left:'50%',
      transform:'translateX(-50%)',
      bottom:'24px',
      background:'#223729',
      color:'#fff',
      padding:'10px 14px',
      borderRadius:'10px',
      zIndex:9999,
      opacity:0,
      transition:'opacity .18s',
      fontSize: '14px',
      fontWeight: '500'
    });
    document.body.appendChild(t);
    requestAnimationFrame(()=>t.style.opacity='1');
    setTimeout(()=>{ t.style.opacity='0'; setTimeout(()=>t.remove(),220) },1700);
  }

  /* Utility: open specific tab (mobile quick) */
  function openTab(id){
    document.querySelectorAll('.navitem').forEach(n=>n.classList.remove('active'));
    document.querySelector(`.navitem[data-tab="${id}"]`)?.classList.add('active');
    openTabOnly(id);
  }
  
  function openTabOnly(id){
    sections.forEach(s=>s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    if(id === 'stock') renderStock();
    if(id === 'expiry') checkExpiryAlerts();
    if(id === 'purchase') renderPurchase();
    if(id === 'research') renderResearch();
  }

  // init render
  renderStock();
  renderPurchase();
  renderResearch();
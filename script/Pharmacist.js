
    /* Demo data */
    const stockData = [
      {name:"Paracetamol 500mg", salt:"Acetaminophen", qty:120, expiry:"2026-05", status:"ok"},
      {name:"Amoxicillin 500mg", salt:"Amoxicillin", qty:35, expiry:"2025-02", status:"low"},
      {name:"Ibuprofen 200mg", salt:"Ibuprofen", qty:0, expiry:"2025-10", status:"out"},
      {name:"Cetirizine 10mg", salt:"Cetirizine", qty:86, expiry:"2026-01", status:"ok"},
      {name:"Omeprazole 20mg", salt:"Omeprazole", qty:15, expiry:"2025-03", status:"low"},
    ];

    const purchaseRequests = [
      {id:"PR-001", requester:"Clinic - Dr. Aman", items:[{name:"Amoxicillin 500mg", qty:20}], note:"Urgent", status:"pending"},
      {id:"PR-002", requester:"Patient - Kiran Bala", items:[{name:"Ibuprofen 200mg", qty:10}], note:"Home delivery", status:"pending"},
    ];

    const researchDocs = [
      {id:"R-001", title:"Comparative efficacy of Paracetamol", body:"Abstract: This study compares..."},
      {id:"R-002", title:"Amoxicillin – dosage guidelines", body:"Abstract: Guidelines for antibiotic stewardship..."},
      {id:"R-003", title:"Drug interactions with Omeprazole", body:"Abstract: Review of PPI interactions..."},
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
      if(id === 'purchase') renderPurchase();
      if(id === 'research') renderResearch();
      if(id === 'prescriptions') { document.getElementById('prescResult').innerHTML=''; }
    }

    // initial
    document.addEventListener('DOMContentLoaded', ()=>{ openTab('profile'); renderStock(); renderPurchase(); renderResearch(); });

    /* Side toggle for mobile */
    function toggleSide(){
      const side = document.getElementById('side');
      side.classList.toggle('open');
    }
    function closeSide(){ document.getElementById('side').classList.remove('open') }

    /* STOCK */
    const stockBody = document.getElementById('stockBody');
    function renderStock(){
      const q = (document.getElementById('stockSearch') || {}).value || '';
      const view = document.querySelector('.pill.active')?.dataset?.stock || 'all';
      const list = stockData.filter(m=>{
        const okQ = !q || m.name.toLowerCase().includes(q.toLowerCase()) || m.salt.toLowerCase().includes(q.toLowerCase());
        const okV = view==='all' || m.status===view;
        return okQ && okV;
      });
      stockBody.innerHTML = list.map(m=>{
        const st = m.status==='ok' ? '<span class="badge ok">Available</span>' :
                 m.status==='low' ? '<span class="badge warn">Low</span>' :
                 '<span class="badge danger">Out</span>';
        const qtyCls = m.status==='ok' ? 'qty' : m.status==='low' ? 'low' : 'out';
        return `<tr>
          <td>${m.name}</td>
          <td class="muted">${m.salt}</td>
          <td class="${qtyCls}">${m.qty}</td>
          <td>${m.expiry}</td>
          <td>${st}</td>
        </tr>`;
      }).join('') || `<tr><td colspan="5" class="muted" style="text-align:center">No items found.</td></tr>`;
    }

    document.getElementById('stockSearch')?.addEventListener('input', renderStock);
    function filterStock(btn){
      document.querySelectorAll('.pill').forEach(p=>p.classList.remove('active'));
      btn.classList.add('active');
      renderStock();
    }

    /* Add stock drawer */
    const stockDrawer = document.getElementById('stockDrawer');
    function openAddStock(){
      stockDrawer.classList.add('open');
      stockDrawer.setAttribute('aria-hidden','false');
    }
    function closeStockDrawer(){
      stockDrawer.classList.remove('open');
      stockDrawer.setAttribute('aria-hidden','true');
    }
    function submitAddStock(){
      const name = document.getElementById('addName').value.trim();
      const salt = document.getElementById('addSalt').value.trim();
      const qty = Number(document.getElementById('addQty').value || 0);
      const expiry = document.getElementById('addExpiry').value || '';
      const status = document.getElementById('addStatus').value || 'ok';
      if(!name || !salt || qty<=0){ toast('Please fill name, salt and qty'); return; }
      stockData.unshift({name,salt,qty,expiry,status});
      document.getElementById('recentAdds').textContent = `${name} x${qty} added`;
      closeStockDrawer();
      renderStock();
      toast('Stock added');
    }

    /* PURCHASE requests */
    function renderPurchase(){
      const el = document.getElementById('purchaseList');
      el.innerHTML = purchaseRequests.map(r=>{
        const items = r.items.map(i=>`${i.name} ×${i.qty}`).join(', ');
        return `<div class="card request fade-in">
          <div style="display:flex;gap:12px;align-items:center">
            <div style="font-weight:800">${r.requester}</div>
            <div class="muted">${r.id}</div>
            <div class="muted" style="margin-left:8px">${r.note}</div>
          </div>
          <div style="display:flex;gap:12px;align-items:center">
            <div class="muted">${items}</div>
            <div class="right actions">
              <button class="btn" onclick="approveRequest('${r.id}')">Approve</button>
              <button class="btn line" onclick="rejectRequest('${r.id}')">Reject</button>
            </div>
          </div>
        </div>`;
      }).join('') || '<div class="card muted">No requests</div>';
    }
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
      purchaseRequests.splice(idx,1);
      toast('Request rejected');
      renderPurchase();
    }
    function openPurchaseForm(){ toast('Open purchase form (demo)') }

    /* RESEARCH */
    function renderResearch(){
      const list = researchDocs;
      const el = document.getElementById('researchList');
      el.innerHTML = list.map(d=>`
        <div class="card fade-in">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div style="font-weight:800">${d.title}</div>
            <div>
              <button class="btn line" onclick="previewResearch('${d.id}')">Preview</button>
            </div>
          </div>
          <div class="muted" style="margin-top:8px">Document ID: ${d.id}</div>
        </div>`).join('');
    }
    function previewResearch(id){
      const doc = researchDocs.find(d=>d.id===id);
      if(!doc) return;
      document.getElementById('researchTitle').textContent = doc.title;
      document.getElementById('researchBody').textContent = doc.body;
      document.getElementById('researchModal').classList.add('show');
    }
    function closeResearchModal(){ document.getElementById('researchModal').classList.remove('show') }

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
        toast('No prescription found (demo)');
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
      Object.assign(t.style,{position:'fixed',left:'50%',transform:'translateX(-50%)',bottom:'24px',background:'#223729',color:'#fff',padding:'10px 14px',borderRadius:'10px',zIndex:9999,opacity:0,transition:'opacity .18s'});
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
      if(id === 'purchase') renderPurchase();
      if(id === 'research') renderResearch();
    }

    // init render
    renderStock();
    renderPurchase();
    renderResearch();

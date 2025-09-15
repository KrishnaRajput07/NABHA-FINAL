// Tab navigation
const navitems = document.querySelectorAll('.navitem');
const sections = document.querySelectorAll('.section');

navitems.forEach(item => {
  item.addEventListener('click', function() {
    // Remove active class from all items
    navitems.forEach(navItem => {
      navItem.classList.remove('active');
    });
    
    // Add active class to clicked item
    this.classList.add('active');
    
    // Hide all sections
    sections.forEach(section => {
      section.classList.remove('active');
    });
    
    // Show the target section
    const targetId = this.getAttribute('data-target');
    if (targetId) {
      document.getElementById(targetId).classList.add('active');
    }
  });
});

// Side toggle for mobile
function toggleSide(){
  const side = document.getElementById('side');
  side.classList.toggle('open');
}

// Modal functionality
const modal = document.getElementById('verificationModal');
const closeModalBtn = document.querySelector('.close-modal');

// Open modal when Review button is clicked
document.querySelectorAll('.btn-view').forEach(button => {
  button.addEventListener('click', function() {
    const applicantId = this.getAttribute('data-id');
    // In a real app, you would fetch applicant data based on ID
    modal.classList.add('active');
  });
});

// Close modal when X is clicked
closeModalBtn.addEventListener('click', function() {
  modal.classList.remove('active');
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
  if (event.target === modal) {
    modal.classList.remove('active');
  }
});

// Verification actions
document.querySelector('.btn-verify').addEventListener('click', function() {
  toast('Applicant verified successfully!');
  modal.classList.remove('active');
});

document.querySelector('.btn-reject').addEventListener('click', function() {
  const reason = prompt('Please specify reason for rejection:');
  if (reason) {
    toast('Application rejected. Reason: ' + reason);
    modal.classList.remove('active');
  }
});

// Toast helper from patient portal
function toast(msg){
  const t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style,{
    position:'fixed',
    left:'50%',
    transform:'translateX(-50%)',
    bottom:'20px',
    background:'#223729',
    color:'#fff',
    padding:'10px 14px',
    borderRadius:'10px',
    boxShadow:'0 8px 20px rgba(0,0,0,.2)',
    zIndex:120,
    opacity:0,
    transition:'250ms',
    fontSize: '14px',
    fontWeight: '500'
  });
  document.body.appendChild(t);
  requestAnimationFrame(()=>t.style.opacity=1);
  setTimeout(()=>{t.style.opacity=0; setTimeout(()=>t.remove(),300)},1600);
}
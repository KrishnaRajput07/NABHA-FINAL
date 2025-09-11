const form = document.getElementById("loginForm");
const roleButtons = document.querySelectorAll(".role-btn");
const indicator = document.querySelector(".role-indicator");
const requestOtpBtn = document.getElementById("requestOtpBtn");
const phoneInput = document.getElementById("phone");
const otpInput = document.getElementById("otp");
const otpTimer = document.getElementById("otpTimer");

let activeRole = "patient";
let otpCountdown = null;
let countdownTime = 60;

// Role switching with improved animation
roleButtons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    document.querySelector(".role-btn.active").classList.remove("active");
    btn.classList.add("active");
    activeRole = btn.dataset.role;

    // Four roles: Patient, Doctor, Pharmacist, Admin
    indicator.style.transform = `translateX(${index * 100}%)`;
    
    // Add a subtle scaling effect for better visual feedback
    btn.style.transform = "scale(0.95)";
    setTimeout(() => {
      btn.style.transform = "scale(1)";
    }, 150);
  });
});

// OTP request functionality
requestOtpBtn.addEventListener("click", () => {
  const phone = phoneInput.value.trim();
  
  if (!phone || !/^[0-9]{10}$/.test(phone)) {
    alert("Please enter a valid 10-digit phone number");
    return;
  }
  
  // Disable button and start countdown
  requestOtpBtn.disabled = true;
  otpInput.disabled = false;
  otpInput.focus();
  
  // Simulate OTP sending (in production, this would call your backend)
  alert(`OTP sent to ${phone}. In production, this would be sent via SMS.`);
  
  // Start countdown timer
  startOtpCountdown();
});

// OTP countdown timer
function startOtpCountdown() {
  clearInterval(otpCountdown);
  countdownTime = 60;
  
  otpCountdown = setInterval(() => {
    countdownTime--;
    otpTimer.textContent = `00:${countdownTime.toString().padStart(2, '0')}`;
    
    if (countdownTime <= 0) {
      clearInterval(otpCountdown);
      requestOtpBtn.disabled = false;
      otpTimer.textContent = "";
    }
  }, 1000);
}

// Form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const phone = phoneInput.value;
  const otp = otpInput.value;

  if (!phone || !otp) {
    alert("Please fill in all fields!");
    return;
  }

  alert(`✅ Logged in as ${activeRole} with ${phone}`);
  // TODO: Redirect based on role
  // For example:
  // if (activeRole === "admin") { window.location.href = "admin-dashboard.html"; }
});

// Input validation
phoneInput.addEventListener("input", (e) => {
  // Allow only numbers and limit to 10 digits
  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
  
  // Enable/disable OTP button based on input
  requestOtpBtn.disabled = e.target.value.length !== 10;
});

// Add subtle animation to form elements on focus
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('focus', () => {
    input.parentElement.style.transform = 'translateY(-2px)';
    input.parentElement.style.transition = 'transform 0.2s ease';
  });
  
  input.addEventListener('blur', () => {
    input.parentElement.style.transform = 'translateY(0)';
  });
});


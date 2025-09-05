const form = document.getElementById("loginForm");
const roleButtons = document.querySelectorAll(".role-btn");
const indicator = document.querySelector(".role-indicator");

let activeRole = "patient";

roleButtons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    document.querySelector(".role-btn.active").classList.remove("active");
    btn.classList.add("active");
    activeRole = btn.dataset.role;

    // Four roles: Patient, Doctor, Pharmacist, Admin
    indicator.style.transform = `translateX(${index * 100}%)`;
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const phone = document.getElementById("phone").value;
  const otp = document.getElementById("otp").value;

  if (!phone || !otp) {
    alert("Please fill in all fields!");
    return;
  }

  alert(`✅ Logged in as ${activeRole} with ${phone}`);
  // TODO: Redirect based on role
  // For example:
  // if (activeRole === "admin") { window.location.href = "admin-dashboard.html"; }
});
const form = document.getElementById("registerForm");
    const roleButtons = document.querySelectorAll(".role-btn");
    let selectedRole = "patient"; // default
    roleButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        roleButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedRole = btn.dataset.role;
      });
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const age = document.getElementById("age").value;
      const phone = document.getElementById("phone").value;
      const otp = document.getElementById("otp").value;
      if(!selectedRole || !name || !age || !phone || !otp) {
        alert("Please fill in all fields!");
        return;
      }
      alert(`✅ Registered as ${selectedRole} - ${name}`);
      // TODO: Save data & redirect to dashboard
    });
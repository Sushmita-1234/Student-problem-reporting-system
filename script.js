
document.addEventListener("DOMContentLoaded", function () {
  // ===== Mobile Navbar =====
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      navLinks.classList.toggle("open");
    });
  }

  // ===== Local Storage Helpers =====
  const STORAGE_KEY = "campusCareComplaints";

  function getComplaints() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  }

  function saveComplaints(complaints) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  }

  function makeId() {
    return "CMP-" + Date.now().toString().slice(-8);
  }

  // ===== Complaint Submission =====
  const reportForm = document.getElementById("reportForm");

  if (reportForm) {
    reportForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("studentName").value.trim();
      const email = document.getElementById("studentEmail").value.trim();
      const category = document.getElementById("category").value;
      const title = document.getElementById("problemTitle").value.trim();
      const description = document.getElementById("problemDetails").value.trim();
      const location = document.getElementById("location").value.trim();
      const message = document.getElementById("formMessage");

      if (!name || !email || !category || !title || !description || !location) {
        message.textContent = "Please fill in all the fields.";
        message.className = "form-message error";
        return;
      }

      const complaint = {
        id: makeId(),
        name: name,
        email: email,
        category: category,
        title: title,
        description: description,
        location: location,
        status: "Pending",
        createdAt: new Date().toLocaleString()
      };

      try {
        const complaints = getComplaints();
        complaints.unshift(complaint);
        saveComplaints(complaints);

        message.textContent =
          "Complaint submitted successfully! Your ID is " + complaint.id;
        message.className = "form-message success";

        reportForm.reset();
      } catch (error) {
        message.textContent =
          "Unable to save your complaint. Please check browser storage.";
        message.className = "form-message error";
      }
    });
  }

  // ===== Display Complaints =====
  const complaintsList = document.getElementById("complaintsList");
  const emptyState = document.getElementById("emptyState");

  if (complaintsList && emptyState) {
    const complaints = getComplaints();

    const totalCount = document.getElementById("totalCount");
    const pendingCount = document.getElementById("pendingCount");
    const resolvedCount = document.getElementById("resolvedCount");

    if (totalCount) {
      totalCount.textContent = complaints.length;
    }

    if (pendingCount) {
      pendingCount.textContent = complaints.filter(function (item) {
        return item.status === "Pending";
      }).length;
    }

    if (resolvedCount) {
      resolvedCount.textContent = complaints.filter(function (item) {
        return item.status === "Resolved";
      }).length;
    }

    if (complaints.length === 0) {
      emptyState.hidden = false;
    } else {
      emptyState.hidden = true;

      complaints.forEach(function (item) {
        const card = document.createElement("article");
        card.className = "complaint-card";

        const top = document.createElement("div");
        top.className = "complaint-top";

        const details = document.createElement("div");

        const title = document.createElement("h3");
        title.textContent = item.title;

        const meta = document.createElement("p");
        meta.className = "complaint-meta";
        meta.textContent =
          item.category + " • " + item.location + " • " + item.createdAt;

        details.appendChild(title);
        details.appendChild(meta);

        const status = document.createElement("span");
        status.className = "status";

        if (item.status === "Resolved") {
          status.classList.add("resolved");
        } else if (item.status === "In Progress") {
          status.classList.add("in-progress");
        }

        status.textContent = item.status || "Pending";

        top.appendChild(details);
        top.appendChild(status);

        const description = document.createElement("p");
        description.className = "complaint-description";
        description.textContent = item.description;

        const student = document.createElement("p");
        student.className = "complaint-meta";
        student.textContent = "Submitted by: " + item.name;

        const id = document.createElement("span");
        id.className = "complaint-id";
        id.textContent = "Reference ID: " + item.id;

        card.appendChild(top);
        card.appendChild(description);
        card.appendChild(student);
        card.appendChild(id);

        complaintsList.appendChild(card);
      });
    }
  }

  // ===== Demo Login Form =====
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;
      const message = document.getElementById("loginMessage");

      if (!email || !password) {
        message.textContent = "Please enter your email and password.";
        message.className = "form-message error";
        return;
      }

      message.textContent =
        "This is a frontend demo. Real login requires a secure backend.";
      message.className = "form-message success";
    });
  }
});

const isLoginPage = window.location.pathname.includes("login.html");
const token = localStorage.getItem("asaav_admin_token");

if (!isLoginPage && !token) {
  window.location.href = "login.html";
}


let editingEventId = null;
let currentEventImage = "";
let editingRegistrationId = null;

const menuBtn = document.querySelector(".menu-btn");
const sidebar = document.querySelector(".sidebar");

if (menuBtn && sidebar) {
  menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    menuBtn.classList.toggle("active");
  });
}

document.addEventListener("click", (e) => {
  const clickInsideSidebar = sidebar.contains(e.target);
  const clickOnButton = menuBtn.contains(e.target);

  if (!clickInsideSidebar && !clickOnButton) {
    sidebar.classList.remove("active");
    menuBtn.classList.remove("active");
  }
});

async function loadDashboardStats() {
  const eventsCount = document.getElementById("events-count");

  if (!eventsCount) return;

  try {

    const [
      eventsRes,
      registrationsRes,
      membersRes,
      partnersRes,
      messagesRes
    ] = await Promise.all([
      fetch("http://localhost:3000/events"),
      fetch("http://localhost:3000/registrations"),
      fetch("http://localhost:3000/members"),
      fetch("http://localhost:3000/partners"),
      fetch("http://localhost:3000/contact")
    ]);

    const events = await eventsRes.json();
    const registrations = await registrationsRes.json();
    const members = await membersRes.json();
    const partners = await partnersRes.json();
    const messages = await messagesRes.json();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingEvents = events.filter(
      event => new Date(event.event_date) >= today
    );

document.getElementById("events-count").textContent =
  upcomingEvents.length;

    document.getElementById("registrations-count").textContent =
      registrations.length;

    document.getElementById("members-count").textContent =
      members.length;

    document.getElementById("partners-count").textContent =
      partners.length;

    document.getElementById("messages-count").textContent =
      messages.length;
 
  } catch (error) {
    console.error("Erreur dashboard :", error);
  }
}

loadDashboardStats();







async function loadAdminEvents() {

  const container = document.getElementById("admin-events-list");

  if (!container) return;

  try {

    const response = await fetch("http://localhost:3000/events");
    const events = await response.json();

    const sortedEvents = events.sort(
      (a, b) => new Date(b.event_date) - new Date(a.event_date)
    );

    container.innerHTML = sortedEvents.map(event => `
      <tr>

        <td>
          <img
            src="../client/${event.image || 'images/events/default.jpg'}"
            alt="${event.title}"
            >
        </td>

        <td>
          <div class="admin-event-title">
            ${event.title}
          </div>
        </td>

        <td>${event.event_date}</td>

        <td>${event.location}</td>

        <td>
          <div class="admin-actions">

            <button
                class="admin-edit-btn"
                onclick="editEvent(${event.id})"
                >
                Modifier
            </button>

            <button
              class="admin-delete-btn"
              onclick="deleteEvent(${event.id})"
            >
              Supprimer
            </button>

          </div>
        </td>

      </tr>
    `).join("");

  } catch (error) {

    console.error("Erreur chargement événements :", error);

  }
}

loadAdminEvents();







async function deleteEvent(id) {

  const confirmDelete = confirm(
    "Supprimer cet événement ?"
  );

  if (!confirmDelete) return;

  try {

    const response = await fetch(
      `http://localhost:3000/events/${id}`,
      {
        method: "DELETE"
      }
    );

    if (!response.ok) {
      alert("Erreur suppression");
      return;
    }

    loadAdminEvents();
    loadDashboardStats();

  } catch (error) {

    alert("Erreur serveur");

  }
}







const createEventForm = document.getElementById("create-event-form");

if (createEventForm) {
  createEventForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const imageFile =
  document.getElementById("event-image-input").files[0];

let imagePath = currentEventImage;
if (imageFile) {

  const uploadData = new FormData();
  uploadData.append("image", imageFile);

  const uploadResponse = await fetch(
    "http://localhost:3000/upload",
    {
      method: "POST",
      body: uploadData
    }
  );

  const uploadResult = await uploadResponse.json();

  imagePath = uploadResult.imagePath;
}

const eventData = {
  title: document.getElementById("event-title-input").value,
  event_date: document.getElementById("event-date-input").value,
  location: document.getElementById("event-location-input").value,
  image: imagePath,
  description: document.getElementById("event-description-input").value
};

    const url = editingEventId
  ? `http://localhost:3000/events/${editingEventId}`
  : "http://localhost:3000/events";

const method = editingEventId ? "PUT" : "POST";

const response = await fetch(url, {
  method,
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(eventData)
});

    if (!response.ok) {
      alert("Erreur lors de la création");
      return;
    }

    createEventForm.reset();
editingEventId = null;
currentEventImage = "";

document.querySelector("#create-event-form button").textContent =
  "Créer la sortie";

document.getElementById("event-form-title").textContent =
  "Créer une sortie";

eventFormCard.classList.add("hidden");

toggleEventFormBtn.textContent = "+ Créer une sortie";

loadAdminEvents();
  });
}



const toggleEventFormBtn = document.getElementById("toggle-event-form");
const eventFormCard = document.getElementById("event-form-card");

if (toggleEventFormBtn && eventFormCard) {

  toggleEventFormBtn.addEventListener("click", () => {

    eventFormCard.classList.toggle("hidden");

    toggleEventFormBtn.textContent =
      eventFormCard.classList.contains("hidden")
        ? "+ Créer une sortie"
        : "Fermer";

  });

}






async function editEvent(id) {
  const response = await fetch(`http://localhost:3000/events/${id}`);
  const event = await response.json();
  currentEventImage = event.image || "";

  editingEventId = id;

  document.getElementById("event-title-input").value = event.title;
  document.getElementById("event-date-input").value = event.event_date;
  document.getElementById("event-location-input").value = event.location;
  document.getElementById("event-description-input").value = event.description || "";

  const eventFormCard = document.getElementById("event-form-card");
  const toggleEventFormBtn = document.getElementById("toggle-event-form");

  eventFormCard.classList.remove("hidden");
  toggleEventFormBtn.textContent = "Fermer";

  document.querySelector("#create-event-form button").textContent =
    "Modifier la sortie";
    document.getElementById("event-form-title").textContent =
  "Modifier la sortie";
}






async function loadRegistrationEvents() {

  const select = document.getElementById(
    "registration-event-select"
  );

  if (!select) return;

  try {

    const response = await fetch(
      "http://localhost:3000/events"
    );

    const events = await response.json();

    select.innerHTML = `
      <option value="">
        Sélectionner un événement
      </option>
    `;

    events.forEach(event => {

      select.innerHTML += `
        <option value="${event.id}">
          ${event.title}
        </option>
      `;

    });

  } catch (error) {

    console.error(error);

  }
}

loadRegistrationEvents();




async function loadRegistrations(eventId) {

  const container = document.getElementById(
    "admin-registrations-list"
  );

  if (!container) return;

  try {

    const response = await fetch(
      `http://localhost:3000/registrations/${eventId}`
    );

    const registrations = await response.json();

    container.innerHTML = registrations.map(registration => `
      <tr>

        <td>${registration.firstname}</td>

        <td>${registration.lastname}</td>

        <td>${registration.email}</td>

        <td>${registration.phone || "-"}</td>

        <td>
          <div class="admin-actions">

            <button
                class="admin-edit-btn"
                onclick="editRegistration(${registration.id}, ${eventId})"
              >
                Modifier
            </button>

            <button
              class="admin-delete-btn"
              onclick="deleteRegistration(${registration.id}, ${eventId})"
            >
              Supprimer
            </button>

          </div>
        </td>

      </tr>
    `).join("");

  } catch (error) {

    console.error(error);

  }
}




const registrationSelect = document.getElementById(
  "registration-event-select"
);

if (registrationSelect) {

  registrationSelect.addEventListener("change", (e) => {

    const eventId = e.target.value;

    if (!eventId) return;

    const selectedText =
      e.target.options[e.target.selectedIndex].text;

    document.getElementById("print-event-title").textContent =
      selectedText;

    loadRegistrations(eventId);

  });


}





async function deleteRegistration(id, eventId) {

  const confirmDelete = confirm(
    "Supprimer cette inscription ?"
  );

  if (!confirmDelete) return;

  try {

    const response = await fetch(
      `http://localhost:3000/registrations/${id}`,
      {
        method: "DELETE"
      }
    );

    if (!response.ok) {
      alert("Erreur suppression");
      return;
    }

    loadRegistrations(eventId);
    loadDashboardStats();

  } catch (error) {

    alert("Erreur serveur");

  }
}





const toggleRegistrationFormBtn = document.getElementById("toggle-registration-form");
const registrationFormCard = document.getElementById("registration-form-card");
const createRegistrationForm = document.getElementById("create-registration-form");

if (toggleRegistrationFormBtn && registrationFormCard) {
  toggleRegistrationFormBtn.addEventListener("click", () => {
    registrationFormCard.classList.toggle("hidden");

    toggleRegistrationFormBtn.textContent =
      registrationFormCard.classList.contains("hidden")
        ? "+ Ajouter une inscription"
        : "Fermer";
  });
}

if (createRegistrationForm) {
  createRegistrationForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const eventId = document.getElementById("registration-event-select").value;

    if (!eventId) {
      alert("Sélectionne d’abord une sortie.");
      return;
    }

    const registrationData = {
      event_id: eventId,
      firstname: document.getElementById("registration-firstname").value,
      lastname: document.getElementById("registration-lastname").value,
      email: document.getElementById("registration-email").value,
      phone: document.getElementById("registration-phone").value
    };

    const url = editingRegistrationId
  ? `http://localhost:3000/registrations/${editingRegistrationId}`
  : "http://localhost:3000/registrations";

const method = editingRegistrationId ? "PUT" : "POST";

const response = await fetch(url, {
  method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(registrationData)
    });

    if (!response.ok) {
      alert("Erreur lors de l’ajout");
      return;
    }

    createRegistrationForm.reset();
    editingRegistrationId = null;

document.querySelector("#create-registration-form button").textContent =
  "Ajouter l’inscription";
    registrationFormCard.classList.add("hidden");
    toggleRegistrationFormBtn.textContent = "+ Ajouter une inscription";

    loadRegistrations(eventId);
    loadDashboardStats();
  });
}






async function editRegistration(id, eventId) {
  editingRegistrationId = id;

  const response = await fetch(`http://localhost:3000/registrations/${eventId}`);
  const registrations = await response.json();

  const registration = registrations.find(item => item.id === id);

  if (!registration) {
    alert("Inscription introuvable");
    return;
  }

  document.getElementById("registration-firstname").value = registration.firstname;
  document.getElementById("registration-lastname").value = registration.lastname;
  document.getElementById("registration-email").value = registration.email;
  document.getElementById("registration-phone").value = registration.phone || "";

  registrationFormCard.classList.remove("hidden");
  toggleRegistrationFormBtn.textContent = "Fermer";

  document.querySelector("#create-registration-form button").textContent =
    "Modifier l’inscription";
}







let editingMemberId = null;

async function loadAdminMembers() {
  const container = document.getElementById("admin-members-list");

  if (!container) return;

  const response = await fetch("http://localhost:3000/members");
  const members = await response.json();

  container.innerHTML = members.map(member => `
    <tr>
      <td>${member.firstname}</td>
      <td>${member.lastname}</td>
      <td>${member.email}</td>
      <td>${member.phone || "-"}</td>
      <td>${member.member_type}</td>

      <td>
        <div class="admin-actions">
          <button
            class="admin-edit-btn"
            onclick="editMember(${member.id})"
          >
            Modifier
          </button>

          <button
            class="admin-delete-btn"
            onclick="deleteMember(${member.id})"
          >
            Supprimer
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

loadAdminMembers();

const toggleMemberFormBtn = document.getElementById("toggle-member-form");
const memberFormCard = document.getElementById("member-form-card");
const createMemberForm = document.getElementById("create-member-form");

if (toggleMemberFormBtn && memberFormCard) {
  toggleMemberFormBtn.addEventListener("click", () => {
    memberFormCard.classList.toggle("hidden");

    toggleMemberFormBtn.textContent =
      memberFormCard.classList.contains("hidden")
        ? "+ Ajouter un membre"
        : "Fermer";
  });
}

if (createMemberForm) {
  createMemberForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const memberData = {
      firstname: document.getElementById("member-firstname").value,
      lastname: document.getElementById("member-lastname").value,
      email: document.getElementById("member-email").value,
      phone: document.getElementById("member-phone").value,
      member_type: document.getElementById("member-type").value
    };

    const url = editingMemberId
      ? `http://localhost:3000/members/${editingMemberId}`
      : "http://localhost:3000/members";

    const method = editingMemberId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(memberData)
    });

    if (!response.ok) {
      alert("Erreur lors de l’enregistrement");
      return;
    }

    createMemberForm.reset();
    editingMemberId = null;

    document.getElementById("member-form-title").textContent =
      "Ajouter un membre";

    document.querySelector("#create-member-form button").textContent =
      "Ajouter le membre";

    memberFormCard.classList.add("hidden");
    toggleMemberFormBtn.textContent = "+ Ajouter un membre";

    loadAdminMembers();
    loadDashboardStats();
  });
}

async function editMember(id) {
  const response = await fetch("http://localhost:3000/members");
  const members = await response.json();

  const member = members.find(item => item.id === id);

  if (!member) {
    alert("Membre introuvable");
    return;
  }

  editingMemberId = id;

  document.getElementById("member-firstname").value = member.firstname;
  document.getElementById("member-lastname").value = member.lastname;
  document.getElementById("member-email").value = member.email;
  document.getElementById("member-phone").value = member.phone || "";
  document.getElementById("member-type").value = member.member_type;

  memberFormCard.classList.remove("hidden");
  toggleMemberFormBtn.textContent = "Fermer";

  document.getElementById("member-form-title").textContent =
    "Modifier le membre";

  document.querySelector("#create-member-form button").textContent =
    "Modifier le membre";
}

async function deleteMember(id) {
  const confirmDelete = confirm("Supprimer ce membre ?");

  if (!confirmDelete) return;

  const response = await fetch(`http://localhost:3000/members/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    alert("Erreur suppression");
    return;
  }

  loadAdminMembers();
  loadDashboardStats();
}





let editingPartnerId = null;
let currentPartnerLogo = "";

async function loadAdminPartners() {
  const container = document.getElementById("admin-partners-list");

  if (!container) return;

  const response = await fetch("http://localhost:3000/partners");
  const partners = await response.json();

  container.innerHTML = partners.map(partner => `
    <tr>
      <td>
        <img src="../client/${partner.logo || 'images/events/default.jpg'}" alt="${partner.name}">
      </td>

      <td>${partner.name}</td>

      <td>
        ${partner.website ? `<a href="${partner.website}" target="_blank">${partner.website}</a>` : "-"}
      </td>

      <td>
        <div class="admin-actions">
          <button class="admin-edit-btn" onclick="editPartner(${partner.id})">
            Modifier
          </button>

          <button class="admin-delete-btn" onclick="deletePartner(${partner.id})">
            Supprimer
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

loadAdminPartners();

const togglePartnerFormBtn = document.getElementById("toggle-partner-form");
const partnerFormCard = document.getElementById("partner-form-card");
const createPartnerForm = document.getElementById("create-partner-form");

if (togglePartnerFormBtn && partnerFormCard) {
  togglePartnerFormBtn.addEventListener("click", () => {
    partnerFormCard.classList.toggle("hidden");

    togglePartnerFormBtn.textContent =
      partnerFormCard.classList.contains("hidden")
        ? "+ Ajouter un partenaire"
        : "Fermer";
  });
}

if (createPartnerForm) {
  createPartnerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const imageFile = document.getElementById("partner-image").files[0];

    let logoPath = currentPartnerLogo;

    if (imageFile) {
      const uploadData = new FormData();
      uploadData.append("image", imageFile);

      const uploadResponse = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: uploadData
      });

      const uploadResult = await uploadResponse.json();
      logoPath = uploadResult.imagePath;
    }

    const partnerData = {
      name: document.getElementById("partner-name").value,
      website: document.getElementById("partner-website").value,
      logo: logoPath,
      description: document.getElementById("partner-description").value
    };

    const url = editingPartnerId
      ? `http://localhost:3000/partners/${editingPartnerId}`
      : "http://localhost:3000/partners";

    const method = editingPartnerId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(partnerData)
    });

    if (!response.ok) {
      alert("Erreur lors de l’enregistrement");
      return;
    }

    createPartnerForm.reset();
    editingPartnerId = null;
    currentPartnerLogo = "";

    document.getElementById("partner-form-title").textContent =
      "Ajouter un partenaire";

    document.querySelector("#create-partner-form button").textContent =
      "Ajouter le partenaire";

    partnerFormCard.classList.add("hidden");
    togglePartnerFormBtn.textContent = "+ Ajouter un partenaire";

    loadAdminPartners();
    loadDashboardStats();
  });
}

async function editPartner(id) {
  const response = await fetch("http://localhost:3000/partners");
  const partners = await response.json();

  const partner = partners.find(item => item.id === id);

  if (!partner) {
    alert("Partenaire introuvable");
    return;
  }

  editingPartnerId = id;
  currentPartnerLogo = partner.logo || "";

  document.getElementById("partner-name").value = partner.name;
  document.getElementById("partner-website").value = partner.website || "";
  document.getElementById("partner-description").value = partner.description || "";

  partnerFormCard.classList.remove("hidden");
  togglePartnerFormBtn.textContent = "Fermer";

  document.getElementById("partner-form-title").textContent =
    "Modifier le partenaire";

  document.querySelector("#create-partner-form button").textContent =
    "Modifier le partenaire";
}

async function deletePartner(id) {
  const confirmDelete = confirm("Supprimer ce partenaire ?");

  if (!confirmDelete) return;

  const response = await fetch(`http://localhost:3000/partners/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    alert("Erreur suppression");
    return;
  }

  loadAdminPartners();
  loadDashboardStats();
}







const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const loginData = {
      email: document.getElementById("login-email").value,
      password: document.getElementById("login-password").value
    };

    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(loginData)
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Erreur de connexion");
      return;
    }

    localStorage.setItem("asaav_admin_token", data.token);
    localStorage.setItem("asaav_admin_user", JSON.stringify(data.admin));

    window.location.href = "index.html";
  });
}



const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("asaav_admin_token");
    localStorage.removeItem("asaav_admin_user");
    window.location.href = "login.html";
  });
}




async function loadAdmins() {

  const container = document.getElementById(
    "admin-admins-list"
  );

  if (!container) return;

  try {

    const response = await fetch(
      "http://localhost:3000/auth/admins"
    );

    const admins = await response.json();

    container.innerHTML = admins.map(admin => `
      <tr>

        <td>${admin.firstname}</td>

        <td>${admin.lastname}</td>

        <td>${admin.email}</td>

        <td>${admin.role}</td>

        <td>
          <div class="admin-actions">

            <button
              class="admin-delete-btn"
              onclick="deleteAdmin(${admin.id})"
            >
              Supprimer
            </button>

          </div>
        </td>

      </tr>
    `).join("");

  } catch (error) {

    console.error(error);

  }
}

loadAdmins();





const toggleAdminFormBtn = document.getElementById(
  "toggle-admin-form"
);

const adminFormCard = document.getElementById(
  "admin-form-card"
);

const createAdminForm = document.getElementById(
  "create-admin-form"
);

if (toggleAdminFormBtn && adminFormCard) {

  toggleAdminFormBtn.addEventListener("click", () => {

    adminFormCard.classList.toggle("hidden");

    toggleAdminFormBtn.textContent =
      adminFormCard.classList.contains("hidden")
        ? "+ Ajouter un admin"
        : "Fermer";

  });

}





if (createAdminForm) {

  createAdminForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const adminData = {

      firstname:
        document.getElementById("admin-firstname").value,

      lastname:
        document.getElementById("admin-lastname").value,

      email:
        document.getElementById("admin-email").value,

      password:
        document.getElementById("admin-password").value,

      role:
        document.getElementById("admin-role").value

    };

    try {

      const response = await fetch(
        "http://localhost:3000/auth/admins",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(adminData)
        }
      );

      if (!response.ok) {
        alert("Erreur création admin");
        return;
      }

      createAdminForm.reset();

      adminFormCard.classList.add("hidden");

      toggleAdminFormBtn.textContent =
        "+ Ajouter un admin";

      loadAdmins();

    } catch (error) {

      console.error(error);

    }

  });

}





async function deleteAdmin(id) {

  const confirmDelete = confirm(
    "Supprimer cet admin ?"
  );

  if (!confirmDelete) return;

  try {

    const response = await fetch(
      `http://localhost:3000/auth/admins/${id}`,
      {
        method: "DELETE"
      }
    );

    if (!response.ok) {
      alert("Erreur suppression");
      return;
    }

    loadAdmins();

  } catch (error) {

    console.error(error);

  }
}





async function loadContactMessages() {

  const container = document.getElementById(
    "admin-messages-list"
  );

  if (!container) return;

  try {

    const response = await fetch(
      "http://localhost:3000/contact"
    );

    const messages = await response.json();

    if (messages.length === 0) {

      container.innerHTML = `
        <p>Aucun message pour le moment.</p>
      `;

      return;
    }

    container.innerHTML = messages.map(message => `
      <article class="message-card">

        <div class="message-card-top">

          <div>

            <h3>${message.subject}</h3>

            <div class="message-meta">
              <span>${message.name}</span>
              <span>${message.email}</span>
              <span>${message.created_at}</span>
            </div>

          </div>

          <button
            class="message-delete-btn"
            onclick="deleteMessage(${message.id})"
          >
            Supprimer
          </button>

        </div>

        <div class="message-content">
          ${message.message}
        </div>

      </article>
    `).join("");

  } catch (error) {

    console.error(error);

  }
}

loadContactMessages();





async function deleteMessage(id) {

  const confirmDelete = confirm(
    "Supprimer ce message ?"
  );

  if (!confirmDelete) return;

  try {

    const response = await fetch(
      `http://localhost:3000/contact/${id}`,
      {
        method: "DELETE"
      }
    );

    if (!response.ok) {
      alert("Erreur suppression");
      return;
    }

    loadContactMessages();

  } catch (error) {

    console.error(error);

  }
}





async function loadGalleryEvents() {

  const select = document.getElementById(
    "gallery-event-select"
  );

  if (!select) return;

  try {

    const response = await fetch(
      "http://localhost:3000/events"
    );

    const events = await response.json();

    select.innerHTML = `
      <option value="">
        Sélectionner une sortie
      </option>
    `;

    events.forEach(event => {

      select.innerHTML += `
        <option value="${event.id}">
          ${event.title}
        </option>
      `;

    });

  } catch (error) {

    console.error(error);

  }
}

loadGalleryEvents();




async function loadGalleryPhotos(eventId = "") {
  const container = document.getElementById("admin-gallery-grid");

  if (!container) return;

  if (!eventId) {
    container.innerHTML = "<p>Sélectionnez une sortie pour voir ses photos.</p>";
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/gallery/${eventId}`
    );

    const photos = await response.json();

    if (photos.length === 0) {
      container.innerHTML = "<p>Aucune photo pour cette sortie.</p>";
      return;
    }

    container.innerHTML = photos.map(photo => `
      <article class="admin-gallery-card">

        <img
          src="http://localhost:3000/${photo.image}"
          alt="Photo galerie"
        >

        <div class="admin-gallery-content">

          <button onclick="deleteGalleryPhoto(${photo.id})">
            Supprimer
          </button>

        </div>

      </article>
    `).join("");

  } catch (error) {
    console.error(error);
  }
}
const galleryEventSelect = document.getElementById("gallery-event-select");

if (galleryEventSelect) {
  galleryEventSelect.addEventListener("change", (e) => {
    loadGalleryPhotos(e.target.value);
  });
}


const galleryUploadForm = document.getElementById("gallery-upload-form");

if (galleryUploadForm) {
  galleryUploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const eventId = document.getElementById("gallery-event-select").value;
    const files = document.getElementById("gallery-images").files;
    const archiveFile = document.getElementById("gallery-archive").files[0];

    if (!eventId || (files.length === 0 && !archiveFile)) {
      alert("Sélectionnez une sortie et au moins une image ou une archive ZIP.");
      return;
    }

    try {
      for (const file of files) {
        const uploadData = new FormData();
        uploadData.append("image", file);

        const uploadResponse = await fetch("http://localhost:3000/upload", {
          method: "POST",
          body: uploadData
        });

        const uploadResult = await uploadResponse.json();

        await fetch("http://localhost:3000/gallery", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            event_id: eventId,
            image: uploadResult.imagePath
          })
        });
      }

      if (archiveFile) {

  console.log("Archive détectée :", archiveFile);

  const archiveData = new FormData();
  archiveData.append("image", archiveFile);

  const archiveUploadResponse = await fetch(
    "http://localhost:3000/upload",
    {
      method: "POST",
      body: archiveData
    }
  );

  const archiveUploadResult = await archiveUploadResponse.json();

  console.log("Archive uploadée :", archiveUploadResult);

  await fetch("http://localhost:3000/gallery/archives", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            event_id: eventId,
            archive_file: archiveUploadResult.imagePath
          })
        });
      }

      alert("Photos / archive ajoutées avec succès");

      galleryUploadForm.reset();

      document.getElementById("gallery-event-select").value = eventId;

      loadGalleryPhotos(eventId);

    } catch (error) {
      console.error(error);
      alert("Erreur upload galerie");
    }
  });
}



async function deleteGalleryPhoto(id) {

  const confirmDelete = confirm(
    "Supprimer cette photo ?"
  );

  if (!confirmDelete) return;

  try {

    const response = await fetch(
      `http://localhost:3000/gallery/${id}`,
      {
        method: "DELETE"
      }
    );

    if (!response.ok) {
      alert("Erreur suppression");
      return;
    }

    loadGalleryPhotos();

  } catch (error) {

    console.error(error);

  }
}










const deleteGalleryPhotosBtn = document.getElementById(
  "delete-gallery-photos-btn"
);

if (deleteGalleryPhotosBtn) {
  deleteGalleryPhotosBtn.addEventListener("click", async () => {
    const eventId = document.getElementById("gallery-event-select").value;

    if (!eventId) {
      alert("Sélectionnez d’abord une sortie.");
      return;
    }

    const confirmDelete = confirm(
      "Supprimer toutes les photos de cette sortie ?"
    );

    if (!confirmDelete) return;

    const response = await fetch(
      `http://localhost:3000/gallery/archive-photos/${eventId}`,
      {
        method: "DELETE"
      }
    );

    if (!response.ok) {
      alert("Erreur lors de la suppression");
      return;
    }

    alert("Toutes les photos de cette sortie ont été supprimées.");

    loadGalleryPhotos(eventId);
  });
}
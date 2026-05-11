let editingEventId = null;
let currentEventImage = "";
const menuBtn = document.querySelector(".menu-btn");
const sidebar = document.querySelector(".sidebar");

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  menuBtn.classList.toggle("active");
});

document.addEventListener("click", (e) => {
  const clickInsideSidebar = sidebar.contains(e.target);
  const clickOnButton = menuBtn.contains(e.target);

  if (!clickInsideSidebar && !clickOnButton) {
    sidebar.classList.remove("active");
    menuBtn.classList.remove("active");
  }
});

async function loadDashboardStats() {

  try {

    const [
      eventsRes,
      registrationsRes,
      membersRes,
      partnersRes
    ] = await Promise.all([
      fetch("http://localhost:3000/events"),
      fetch("http://localhost:3000/registrations"),
      fetch("http://localhost:3000/members"),
      fetch("http://localhost:3000/partners")
    ]);

    const events = await eventsRes.json();
    const registrations = await registrationsRes.json();
    const members = await membersRes.json();
    const partners = await partnersRes.json();

    document.getElementById("events-count").textContent =
      events.length;

    document.getElementById("registrations-count").textContent =
      registrations.length;

    document.getElementById("members-count").textContent =
      members.length;

    document.getElementById("partners-count").textContent =
      partners.length;

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
      (a, b) => new Date(a.event_date) - new Date(b.event_date)
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

    const response = await fetch("http://localhost:3000/registrations", {
      method: "POST",
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
    registrationFormCard.classList.add("hidden");
    toggleRegistrationFormBtn.textContent = "+ Ajouter une inscription";

    loadRegistrations(eventId);
    loadDashboardStats();
  });
}
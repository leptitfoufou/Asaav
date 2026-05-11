const burger = document.querySelector(".burger");
const mobileMenu = document.querySelector(".mobile-menu");

burger.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
});

async function loadHomeEvents() {
  const container = document.getElementById("home-events-list");

  if (!container) return;

  try {
    const response = await fetch("http://localhost:3000/events");
    const events = await response.json();

    const nextEvents = events
      .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
      .slice(0, 2);

    container.innerHTML = nextEvents.map(event => `
  <article class="event-card">
    <div class="event-card-image">
      <img src="${event.image || 'images/events/default.jpg'}" alt="${event.title}">
    </div>

    <div class="event-card-content">
      <h3>${event.title}</h3>
      <p>${event.description || "Plus d’informations à venir."}</p>

      <div class="event-meta">
        <span><i class="fa-regular fa-calendar"></i> ${event.event_date}</span>
        <span><i class="fa-solid fa-location-dot"></i> ${event.location}</span>
      </div>
    </div>
  </article>
`).join("");

  } catch (error) {
    container.innerHTML = "<p>Impossible de charger les événements.</p>";
  }
}

loadHomeEvents();


async function loadHomePartners() {
  const container = document.getElementById("home-partners-list");

  if (!container) return;

  try {
    const response = await fetch("http://localhost:3000/partners");
    const partners = await response.json();

    const partnerItems = partners.map(partner => `
      <a class="partner-logo" href="${partner.website || '#'}" target="_blank">

  <div class="partner-logo-image">
    ${partner.logo
      ? `<img src="${partner.logo}" alt="${partner.name}">`
      : `<span>${partner.name}</span>`
    }
  </div>

  <h3>${partner.name}</h3>

</a>
    `).join("");

    container.innerHTML = `
      <div class="partners-track">
        ${partnerItems}
        ${partnerItems}
      </div>
    `;

  } catch (error) {
    container.innerHTML = "<p>Impossible de charger les partenaires.</p>";
  }
}

loadHomePartners();




async function loadEventsPage() {
  const container = document.getElementById("events-page-list");

  if (!container) return;

  try {
    const response = await fetch("http://localhost:3000/events");
    const events = await response.json();

    const today = new Date();
today.setHours(0, 0, 0, 0);

const sortedEvents = events
  .filter(event => new Date(event.event_date) >= today)
  .sort((a, b) => new Date(a.event_date) - new Date(b.event_date));

    container.innerHTML = sortedEvents.map(event => `
      <article class="event-card">
        <div class="event-card-image">
          <img src="${event.image || 'images/events/default.jpg'}" alt="${event.title}">
        </div>

        <div class="event-card-content">
          <h3>${event.title}</h3>
          <p>${event.description || "Plus d’informations à venir."}</p>

          <div class="event-meta">
            <span><i class="fa-regular fa-calendar"></i> ${event.event_date}</span>
            <span><i class="fa-solid fa-location-dot"></i> ${event.location}</span>
          </div>

<a href="event.html?id=${event.id}" class="event-btn">
  Voir l’événement
</a>
        </div>
      </article>
    `).join("");

  } catch (error) {
    container.innerHTML = "<p>Impossible de charger les événements.</p>";
  }
}

loadEventsPage();
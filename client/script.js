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
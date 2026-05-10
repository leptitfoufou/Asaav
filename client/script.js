async function loadEvents() {
  try {
    const response = await fetch("http://localhost:3000/events");

    const events = await response.json();

    const container = document.getElementById("events-container");

    events.forEach(event => {
      const div = document.createElement("div");

      div.classList.add("event");

      div.innerHTML = `
        <h2>${event.title}</h2>
        <p>${event.description}</p>
        <p><strong>Date :</strong> ${event.event_date}</p>
        <p><strong>Lieu :</strong> ${event.location}</p>
      `;

      container.appendChild(div);
    });

  } catch (error) {
    console.error(error);
  }
}

loadEvents();
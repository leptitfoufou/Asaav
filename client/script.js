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




async function loadEventDetail() {
  const title = document.getElementById("event-title");

  if (!title) return;

  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");

  if (!eventId) {
    title.textContent = "Événement introuvable";
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/events/${eventId}`);
    const event = await response.json();

    document.getElementById("event-title").textContent = event.title;
    document.getElementById("event-description").textContent = event.description;
    document.getElementById("event-date").textContent = event.event_date;
    document.getElementById("event-location").textContent = event.location;

    const image = document.getElementById("event-image");
    image.src = event.image || "images/events/default.jpg";
    image.alt = event.title;

  } catch (error) {
    title.textContent = "Impossible de charger l’événement";
  }
}

loadEventDetail();






const registrationForm = document.getElementById("registration-form");

if (registrationForm) {
  registrationForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("id");

    const registrationData = {
      event_id: eventId,
      firstname: document.getElementById("firstname").value,
      lastname: document.getElementById("lastname").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value
    };

    try {
      const response = await fetch("http://localhost:3000/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(registrationData)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Erreur lors de l’inscription");
        return;
      }

      alert("Inscription envoyée avec succès !");
      registrationForm.reset();

    } catch (error) {
      alert("Impossible d’envoyer l’inscription.");
    }
  });
}


async function loadMembersCount() {

  const membersCount = document.getElementById(
    "members-total-count"
  );

  if (!membersCount) return;

  try {

    const response = await fetch(
      "http://localhost:3000/members"
    );

    const members = await response.json();

    membersCount.textContent =
      `${members.length}`;

  } catch (error) {

    console.error(error);

  }
}

loadMembersCount();





const memberRequestForm = document.getElementById(
  "member-request-form"
);

if (memberRequestForm) {

  memberRequestForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const memberData = {
      firstname:
        document.getElementById("member-firstname").value,

      lastname:
        document.getElementById("member-lastname").value,

      email:
        document.getElementById("member-email").value,

      phone:
        document.getElementById("member-phone").value,

      member_type:
        document.getElementById("member-type").value
    };

    try {

      const response = await fetch(
        "http://localhost:3000/members",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(memberData)
        }
      );

      if (!response.ok) {
        alert("Erreur lors de l’envoi");
        return;
      }

      alert("Demande envoyée avec succès !");

      memberRequestForm.reset();

      loadMembersCount();

    } catch (error) {

      console.error(error);

      alert("Erreur serveur");

    }

  });

}



async function loadPartnersPage() {
  const container = document.getElementById("partners-page-grid");

  if (!container) return;

  try {
    const response = await fetch("http://localhost:3000/partners");
    const partners = await response.json();

    container.innerHTML = partners.map(partner => `
      <article class="partner-page-card">
        ${partner.logo ? `<img src="${partner.logo}" alt="${partner.name}">` : ""}

        <h3>${partner.name}</h3>


        ${partner.website ? `
          <a href="${partner.website}" target="_blank">
            Voir le site
          </a>
        ` : ""}
      </article>
    `).join("");

  } catch (error) {
    container.innerHTML = "<p>Impossible de charger les partenaires.</p>";
  }
}

loadPartnersPage();





const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const contactData = {
      name: document.getElementById("contact-name").value,
      email: document.getElementById("contact-email").value,
      subject: document.getElementById("contact-subject").value,
      message: document.getElementById("contact-message").value
    };

    const response = await fetch("http://localhost:3000/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(contactData)
    });

    if (!response.ok) {
      alert("Erreur lors de l’envoi du message");
      return;
    }

    alert("Message envoyé avec succès !");
    contactForm.reset();
  });
}































async function loadGalleryEvents() {
  const recentContainer = document.getElementById("gallery-recent-grid");
  const archiveContainer = document.getElementById("gallery-archive-list");

  if (!recentContainer || !archiveContainer) return;

  try {
    const photosResponse = await fetch("http://localhost:3000/gallery");
    const photos = await photosResponse.json();

    const archivesResponse = await fetch("http://localhost:3000/gallery/archives");
    const archives = await archivesResponse.json();

    const galleries = {};

    photos.forEach(photo => {
      if (!galleries[photo.event_id]) {
        galleries[photo.event_id] = {
          event_id: photo.event_id,
          title: photo.title,
          event_date: photo.event_date,
          image: photo.image,
          count: 1
        };
      } else {
        galleries[photo.event_id].count++;
      }
    });

    const galleryList = Object.values(galleries);
      archives.forEach(archive => {
    if (!galleries[archive.event_id]) {
      galleryList.push({
        event_id: archive.event_id,
        title: archive.title,
        event_date: archive.event_date,
        image: null,
        count: 0,
        archive_file: archive.archive_file
      });
    } else {
      galleries[archive.event_id].archive_file = archive.archive_file;
    }
  });

    const today = new Date();
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(today.getFullYear() - 2);

    const recentGalleries = galleryList.filter(gallery =>
      new Date(gallery.event_date) >= twoYearsAgo
    );

    const archiveGalleries = galleryList.filter(gallery =>
      new Date(gallery.event_date) < twoYearsAgo
    );

    recentContainer.innerHTML = recentGalleries.map(gallery => `
      <article class="gallery-event-card">
        <img src="http://localhost:3000/${gallery.image}" alt="${gallery.title}">

        <div class="gallery-event-content">
          <h3>${gallery.title}</h3>
          <p>${gallery.event_date} · ${gallery.count} photo(s)</p>

          <a href="gallery-event.html?id=${gallery.event_id}">
            Voir les photos
          </a>
        </div>
      </article>
    `).join("");

    archiveContainer.innerHTML = archiveGalleries.map(gallery => `
      <div class="gallery-archive-item">
        <div>
          <h3>${gallery.title}</h3>
          <p>${gallery.event_date}</p>
        </div>

            ${gallery.archive_file ? `
      <a href="http://localhost:3000/${gallery.archive_file}" download>
        Télécharger l’archive
      </a>
    ` : `
      <a href="gallery-event.html?id=${gallery.event_id}">
        Voir les photos
      </a>
    `}
      </div>
    `).join("");

    if (recentGalleries.length === 0) {
      recentContainer.innerHTML = "<p>Aucune galerie récente pour le moment.</p>";
    }

    if (archiveGalleries.length === 0) {
      archiveContainer.innerHTML = "<p>Aucune ancienne sortie pour le moment.</p>";
    }

  } catch (error) {
    recentContainer.innerHTML = "<p>Impossible de charger les galeries.</p>";
  }
}

loadGalleryEvents();




async function loadGalleryEventDetail() {
  const container = document.getElementById("gallery-detail-grid");

  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");

  if (!eventId) {
    container.innerHTML = "<p>Galerie introuvable.</p>";
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/gallery/${eventId}`);
    const photos = await response.json();

    if (photos.length === 0) {
      container.innerHTML = "<p>Aucune photo disponible pour cette sortie.</p>";
      return;
    }

    document.getElementById("gallery-event-title").textContent =
      photos[0].title || "Photos de la sortie";

    document.getElementById("gallery-event-date").textContent =
      photos[0].event_date || "";

        galleryImages = photos.map(
    photo => `http://localhost:3000/${photo.image}`
  );

    container.innerHTML = photos.map(photo => `
      <img
        src="http://localhost:3000/${photo.image}"
        alt="Photo ASAAV"
        onclick="openLightbox('http://localhost:3000/${photo.image}')"
      >
    `).join("");

  } catch (error) {
    container.innerHTML = "<p>Impossible de charger les photos.</p>";
  }
}

loadGalleryEventDetail();



let galleryImages = [];
let currentImageIndex = 0;

function openLightbox(imageSrc) {

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  if (!lightbox || !lightboxImg) return;

  currentImageIndex = galleryImages.indexOf(imageSrc);

  lightboxImg.src = imageSrc;

  lightbox.classList.add("active");
}

function showNextImage() {

  if (galleryImages.length === 0) return;

  currentImageIndex++;

  if (currentImageIndex >= galleryImages.length) {
    currentImageIndex = 0;
  }

  document.getElementById("lightbox-img").src =
    galleryImages[currentImageIndex];
}

function showPrevImage() {

  if (galleryImages.length === 0) return;

  currentImageIndex--;

  if (currentImageIndex < 0) {
    currentImageIndex = galleryImages.length - 1;
  }

  document.getElementById("lightbox-img").src =
    galleryImages[currentImageIndex];
}

const lightbox = document.getElementById("lightbox");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxNext = document.getElementById("lightbox-next");
const lightboxPrev = document.getElementById("lightbox-prev");

if (lightbox && lightboxClose) {

  lightboxClose.addEventListener("click", () => {
    lightbox.classList.remove("active");
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove("active");
    }
  });

  if (lightboxNext) {
    lightboxNext.addEventListener("click", showNextImage);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", showPrevImage);
  }

  document.addEventListener("keydown", (e) => {

    if (!lightbox.classList.contains("active")) return;

    if (e.key === "ArrowRight") {
      showNextImage();
    }

    if (e.key === "ArrowLeft") {
      showPrevImage();
    }

    if (e.key === "Escape") {
      lightbox.classList.remove("active");
    }

  });

}
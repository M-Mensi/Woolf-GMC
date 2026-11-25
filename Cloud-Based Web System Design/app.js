const CATEGORY_LABELS = {
  produce: "Produce",
  bakery: "Bakery",
  prepared: "Prepared",
  pantry: "Pantry",
};

const CATEGORY_EMOJI = {
  produce: "🥬",
  bakery: "🥖",
  prepared: "🥗",
  pantry: "🫙",
};

const state = { listings: [], category: "all", query: "", selectedListing: null };
const grid = document.querySelector("#listings-grid");
const emptyState = document.querySelector("#empty-state");
const loadError = document.querySelector("#load-error");
const claimDialog = document.querySelector("#claim-dialog");
const claimForm = document.querySelector("#claim-form");

function escapeText(value) {
  const element = document.createElement("span");
  element.textContent = value;
  return element.innerHTML;
}

function formatPickup(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Pickup time to confirm";
  return new Intl.DateTimeFormat(undefined, { weekday: "short", hour: "numeric", minute: "2-digit" }).format(date);
}

function matchesFilters(listing) {
  const categoryMatches = state.category === "all" || listing.category === state.category;
  const searchText = `${listing.title} ${listing.neighborhood} ${listing.notes || ""}`.toLowerCase();
  return categoryMatches && searchText.includes(state.query.toLowerCase());
}

function renderListings() {
  const listings = state.listings.filter(matchesFilters);
  document.querySelector("#listing-count").textContent = String(listings.length).padStart(2, "0");
  grid.innerHTML = listings.map((listing) => {
    const category = CATEGORY_LABELS[listing.category] ? listing.category : "pantry";
    const portions = Number(listing.portions_remaining);
    const notes = listing.notes ? `<p class="card-location">${escapeText(listing.notes)}</p>` : "";
    return `<article class="listing-card">
      <div class="card-visual ${category}">
        <span class="card-tag">${CATEGORY_LABELS[category]}</span>
        <span class="food-emoji" aria-hidden="true">${CATEGORY_EMOJI[category]}</span>
      </div>
      <div class="card-content">
        <div class="card-title-row"><h3>${escapeText(listing.title)}</h3><span class="card-portions">${portions} left</span></div>
        <p class="card-location">${escapeText(listing.neighborhood)}</p>
        ${notes}
        <div class="card-meta"><time datetime="${escapeText(listing.pickup_at)}">By ${escapeText(formatPickup(listing.pickup_at))}</time>
          <button class="claim-button" type="button" data-claim="${escapeText(listing.id)}" ${portions < 1 ? "disabled" : ""}>${portions < 1 ? "Claimed" : "Claim"}</button>
        </div>
      </div>
    </article>`;
  }).join("");
  emptyState.hidden = listings.length !== 0;
  grid.setAttribute("aria-busy", "false");
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { "content-type": "application/json", ...options.headers },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || `Request failed (${response.status})`);
  return result;
}

async function loadListings() {
  loadError.hidden = true;
  grid.setAttribute("aria-busy", "true");
  try {
    const result = await request("/api/listings");
    if (!Array.isArray(result.listings)) throw new Error("The server returned an invalid listings response.");
    state.listings = result.listings;
    renderListings();
  } catch (error) {
    grid.setAttribute("aria-busy", "false");
    loadError.textContent = `${error.message} Check the deployment and database setup, then try again.`;
    loadError.hidden = false;
  }
}

function announce(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

document.querySelectorAll(".filter-chip").forEach((button) => {
  button.addEventListener("click", () => {
    state.category = button.dataset.category;
    document.querySelectorAll(".filter-chip").forEach((chip) => {
      const active = chip === button;
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-pressed", String(active));
    });
    renderListings();
  });
});

document.querySelector("#search-input").addEventListener("input", (event) => {
  state.query = event.target.value.trim();
  renderListings();
});

grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-claim]");
  if (!button) return;
  state.selectedListing = state.listings.find((listing) => listing.id === button.dataset.claim);
  if (!state.selectedListing) return;
  document.querySelector("#claim-title").textContent = state.selectedListing.title;
  document.querySelector("#claim-details").textContent =
    `${state.selectedListing.portions_remaining} portions available · ${state.selectedListing.neighborhood} · pickup by ${formatPickup(state.selectedListing.pickup_at)}`;
  const quantity = claimForm.elements.portions;
  quantity.max = String(state.selectedListing.portions_remaining);
  quantity.value = "1";
  document.querySelector(".claim-message").textContent = "";
  claimDialog.showModal();
});

claimForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.selectedListing) return;
  const submitButton = claimForm.querySelector("button[type=submit]");
  const message = document.querySelector(".claim-message");
  submitButton.disabled = true;
  message.textContent = "";
  message.classList.remove("is-error");
  try {
    await request(`/api/listings/${encodeURIComponent(state.selectedListing.id)}/claim`, {
      method: "POST",
      body: JSON.stringify({ portions: Number(claimForm.elements.portions.value) }),
    });
    claimDialog.close();
    announce("Claim confirmed. Please collect before the pickup time.");
    await loadListings();
  } catch (error) {
    message.textContent = error.message;
    message.classList.add("is-error");
  } finally {
    submitButton.disabled = false;
  }
});

document.querySelector("#listing-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const submitButton = form.querySelector("button[type=submit]");
  const message = form.querySelector(".form-message");
  const data = new FormData(form);
  const pickupDate = new Date(String(data.get("pickupAt")));
  submitButton.disabled = true;
  message.textContent = "";
  message.classList.remove("is-error");
  try {
    await request("/api/listings", {
      method: "POST",
      headers: { "x-admin-key": String(data.get("adminKey")) },
      body: JSON.stringify({
        title: String(data.get("title")),
        category: String(data.get("category")),
        portions: Number(data.get("portions")),
        neighborhood: String(data.get("neighborhood")),
        pickup_at: pickupDate.toISOString(),
        notes: String(data.get("notes")),
      }),
    });
    form.reset();
    message.textContent = "Offer published.";
    await loadListings();
    announce("Your offer is now on the community table.");
  } catch (error) {
    message.textContent = error.message;
    message.classList.add("is-error");
  } finally {
    submitButton.disabled = false;
  }
});

const pickupInput = document.querySelector('[name="pickupAt"]');
const pickupMinimum = new Date(Date.now() + 60 * 60 * 1000);
pickupInput.min = new Date(pickupMinimum.getTime() - pickupMinimum.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

loadListings();

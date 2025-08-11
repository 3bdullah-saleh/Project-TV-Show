const state = {
  episodes: [],
  shows: {}, // This will hold the shows data if needed in the future
  selectedShow: null, // This will hold the currently selected show if needed
  selectedEpisode: null, // This will hold the currently selected episode if needed
  searchTerm: "", // This will hold the current search term for filtering episodes
};

function renderAllShows(shows) {
  const root = document.getElementById("root");
  root.textContent = "";
  const showSelect = document.getElementById("show-select");
  showSelect.options[0].textContent = "Select a show...";
  const container = document.createElement("div");
  container.className = "shows-container";

  shows.forEach((show) => {
    const card = document.createElement("div");
    card.className = "show-card";
    card.innerHTML = `
      <h3>${show.name}</h3>
      <img src="${show.image ? show.image.medium : ""}" alt="${show.name}">
      <p>${show.summary || ""}</p>
    `;
    // Optional: clicking a card selects the show
    card.addEventListener("click", () => {
      document.getElementById("show-select").value = show.id;
      handleShowChange(show.id);
    });
    container.appendChild(card);
  });

  root.appendChild(container);
  // update count for shows
  updateMatchCount(shows, "shows");
}

// Get all shows from TVMaze using a web URL
function fetchAllShows() {
  return fetch("https://api.tvmaze.com/shows")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch shows");
      return res.json();
    }) // Convert the server response into real JSON data (JavaScript objects)
    .then((shows) => {
      shows.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      setupShowSelect(shows);
      renderAllShows(shows); //<-- show all shows by default
      setupSearch(); // pass the array to the search
    });
}

// Populate the show dropdown

function setupShowSelect(shows) {
  const select = document.getElementById("show-select");
  select.innerHTML = `<option value="all">Select a show...</option>`;

  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    select.appendChild(option);

    state.shows[show.id] = {
      ...show,
      episodes: null,
    };
  });
  // cache the shows in the state
  select.addEventListener("change", (e) => {
    const showId = e.target.value;
    if (showId === "all") {
      state.selectedShow = null;
      state.episodes = []; // clear episodes since no show selected
      renderAllShows(Object.values(state.shows));
      // Reset episode dropdown and search input
      document.getElementById(
        "episode-select"
      ).innerHTML = `<option value="all">All Episodes</option>`;
      document.getElementById("search-input").value = "";
    } else {
      state.selectedShow = showId;
      handleShowChange(showId);
    }
  });
}

// Handle the change event when a show is selected
function handleShowChange(showId) {
  const root = document.getElementById("root");
  root.textContent = "Loading episodes, please wait...";

  const cached = state.shows[showId];

  if (cached.episodes) {
    state.episodes = cached.episodes;
    setup();
  } else {
    fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch episodes");
        return res.json();
      })
      .then((episodes) => {
        state.shows[showId].episodes = episodes;
        state.episodes = episodes;
        state.selectedShow = showId;
        setup();
      })
      .catch((err) => {
        root.textContent = "Failed to load episodes.";
        console.error(err);
      });
  }
  // Reset search and episode dropdown
  state.searchTerm = "";
  document.getElementById("search-input").value = "";
  document.getElementById(
    "episode-select"
  ).innerHTML = `<option value="all">All episodes</option>`;
  const showSelect = document.getElementById("show-select");
  showSelect.options[0].textContent = "All shows";
}

/**
 * get all episodes then map through each episode
 */
function setup() {
  render(state.episodes);
  // setupSearch();
  setupSelect();
}
/**
 * create episode's title, season number, episode number, image, summary
 */
function createEpisodeCard(episode) {
  const template = document
    .getElementById("episode-card-template")
    .content.cloneNode(true);
  const { name, season, number, image, summary } = episode;

  template.querySelector("h3").textContent = `${name} - S${String(
    season
  ).padStart(2, "0")}E${String(number).padStart(2, "0")}`;
  const img = template.querySelector("img");
  img.src = image?.medium || "";
  img.alt = `Image for episode ${name}`;
  template.querySelector("p").innerHTML = summary ?? "";

  return template;
}

/**
 * Renders the list of episodes on the page.
 *
 * Clears the current episode display, then creates and appends
 * episode cards for each episode in the provided array.
 * Also adds a footer and updates the displayed match count.
 */
function render(episodes) {
  const root = document.getElementById("root");
  root.textContent = "";

  const container = document.createElement("div");
  container.className = "episodes-container";

  episodes
    .map(createEpisodeCard)
    .forEach((card) => container.appendChild(card));
  root.appendChild(container);
  root.appendChild(renderFooter());

  updateMatchCount(episodes, "episodes");
}

/**
 * Create and update the match count display element.
 */
function updateMatchCount(filteredItems, type = "episodes") {
  console.log(type);
  const countElem = document.getElementById("match-count");
  if (type == "episodes") {
    countElem.textContent = `Displaying ${filteredItems.length} / ${state.episodes.length} episodes`;
  } else {
    countElem.textContent = `Displaying ${filteredItems.length} / ${
      Object.keys(state.shows).length
    } shows`;
  }
}
/**
 * Sets up the search input event listener.
 *
 * Listens for user input in the search box, filters the episodes and shows
 * based on their name or summary includes the search term (case-insensitive),
 */
function setupSearch() {
  const input = document.getElementById("search-input");
  input.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();
    state.searchTerm = searchTerm;
    if (state.selectedShow !== null && state.selectedShow !== "all") {
      // Search inside episodes
      const episodeFiltered = state.episodes.filter(
        (episode) =>
          episode.name.toLowerCase().includes(searchTerm) ||
          (episode.summary?.toLowerCase() || "").includes(searchTerm)
      );
      render(episodeFiltered);
    } else {
      // Search inside shows
      const showArray = Object.values(state.shows);
      const showFiltered = showArray.filter(
        (show) =>
          show.name.toLowerCase().includes(searchTerm) ||
          (show.summary?.toLowerCase() || "").includes(searchTerm)
      );
      renderAllShows(showFiltered);
    }
  });
}
/**
 * Sets up the episode selection dropdown.
 *
 * Populates the dropdown with all episodes formatted as "SxxExx - Episode Name".
 * Adds a change event listener to:
 *  - Render all episodes when "all" is selected.
 *  - Render only the selected episode when a specific episode is chosen.
 */
function setupSelect() {
  const select = document.getElementById("episode-select");
  select.innerHTML = `<option value="all">All Episodes</option>`;

  // Populate dropdown
  state.episodes.forEach((ep) => {
    const option = document.createElement("option");
    option.value = ep.id;
    option.textContent = `S${String(ep.season).padStart(2, "0")}E${String(
      ep.number
    ).padStart(2, "0")} - ${ep.name}`;
    select.appendChild(option);
  });

  select.addEventListener("change", (e) => {
    const selectedId = e.target.value;

    if (selectedId === "all") {
      render(state.episodes);
    } else {
      const selectedEpisode = state.episodes.find(
        (ep) => ep.id.toString() === selectedId
      );
      render([selectedEpisode]);
    }
  });
}
/*
 * Create footer
 */
function renderFooter() {
  const footer = document.createElement("footer");
  const link = document.createElement("a");
  link.href = "https://www.tvmaze.com/";
  link.target = "_blank";
  link.textContent = "Data originally from TVMaze.com";
  footer.appendChild(link);
  return footer;
}

// On load call the fetchFilms function, and when the data is ready,
// save the episodes into our app's state so we can use it later

// shows are fetched and displayed in a dropdown
// when a show is selected, its episodes are fetched and displayed
window.onload = function () {
  fetchAllShows().catch((error) => {
    const root = document.getElementById("root");
    root.textContent = "Sorry, failed to lead shows.";
    console.error(error);
  });
};

const state = {
  episodes: [],
};

/**
 * Gets all episodes from TVMaze using a web URL
 */

function fetchFilms() {
  const root = document.getElementById("root");
  root.textContent = "Loading episodes, please wait...";
  // Fetch the data from the given URL (returns a promise)
  return fetch("https://api.tvmaze.com/shows/82/episodes").then(function (
    data
  ) {
    if (!data.ok) {
      throw new Error("Failed to load the data");
    }
    // Convert the server response into real JSON data (JavaScript objects)
    return data.json();
  });
}

/**
 * get all episodes then map through each episode
 */
function setup() {
  render(state.episodes);
  setupSearch();
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

  updateMatchCount(episodes);
}

/**
 * Create and update the match count display element.
 */
function updateMatchCount(filteredEpisodes) {
  const countElem = document.getElementById("match-count");
  countElem.textContent = `Displaying ${filteredEpisodes.length} / ${state.episodes.length} episodes`;
}
/**
 * Sets up the search input event listener.
 *
 * Listens for user input in the search box, filters the episodes
 * based on whether the episode name or summary includes the search term (case-insensitive),
 */
function setupSearch() {
  const input = document.getElementById("search-input");

  input.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();

    const filtered = state.episodes.filter(
      (ep) =>
        ep.name.toLowerCase().includes(searchTerm) ||
        ep.summary.toLowerCase().includes(searchTerm)
    );
    render(filtered);
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
window.onload = fetchFilms()
  .then(function (episodes) {
    if (!episodes) throw new Error("No episodes loaded");
    state.episodes = episodes; // Store the fetched episodes from the API into the state.episodes array
    setup(); // Run setup after data is ready
  })
  .catch((error) => {
    const root = document.getElementById("root");
    root.textContent = "Sorry, there was a problem loading episodes.";
    console.error(error);
  });

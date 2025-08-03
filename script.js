
const state = {
  episodes: [],
  
}
/**
 * get all episodes then map through each episode
 */
function setup() {
  state.episodes = getAllEpisodes();
  render(state.episodes);
  setupSearch();
  setupSelect();
}
/**
 * create episode's title, season number, episode number, image, summary
 */
function createEpisodeCard(episode) {
  const template = document.getElementById("episode-card-template").content.cloneNode(true);
  const { name, season, number, image, summary } = episode;

  template.querySelector("h3").textContent = `${name} - S${String(season).padStart(2, '0')}E${String(number).padStart(2, '0')}`;
  const img = template.querySelector("img");
  img.src = image?.medium || '';
  img.alt = `Image for episode ${name}`;
  template.querySelector("p").innerHTML = summary ?? '';

  return template;
}

function render(episodes) {
  const root = document.getElementById("root");
  root.textContent = "";

  const container = document.createElement("div");
  container.className = "episodes-container";

  episodes.map(createEpisodeCard).forEach(card => container.appendChild(card));
  root.appendChild(container);
  root.appendChild(renderFooter());
}

/*
 * create footer
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

function setupSearch() {
  const input = document.getElementById("search-input");

  input.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();

    const filtered = state.episodes.filter(ep =>
      ep.name.toLowerCase().includes(searchTerm) ||
      ep.summary.toLowerCase().includes(searchTerm)
    );

    // Reset dropdown to "all"
    document.getElementById("episode-select").value = "all";

    render(filtered);
  });
}

function setupSelect() {
  const select = document.getElementById("episode-select");

  // Populate dropdown
  state.episodes.forEach(ep => {
    const option = document.createElement("option");
    option.value = ep.id;
    option.textContent = `S${String(ep.season).padStart(2, '0')}E${String(ep.number).padStart(2, '0')} - ${ep.name}`;
    select.appendChild(option);
  });

  select.addEventListener("change", (e) => {
    const selectedId = e.target.value;

    if (selectedId === "all") {
      render(state.episodes);
    } else {
      const selectedEpisode = state.episodes.find(ep => ep.id.toString() === selectedId);
      render([selectedEpisode]);
      document.getElementById("search-input").value = ""; // Clear search
    }
  });
}


window.onload = setup;

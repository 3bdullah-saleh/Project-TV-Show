/**
 * get all episodes then map through each episode
 */
function setup() {
  const allEpisodes = getAllEpisodes();
  allEpisodes.map(makePageForEpisodes);
  renderFooter();
}
/**
 * create episode's title, season number, episode number, image, summary
 */
function makePageForEpisodes(episodeList) {
  // cloned the template from the HTML file
  const episodeCard = document
    .getElementById("episode-card-template")
    .content.cloneNode(true);
  // get the key-value pair using array destructuring
  const { name, season, number, image: {medium}, summary } = episodeList;
  // add episode header
  episodeCard.querySelector("h3").textContent = `${name} - S${season
    .toString()
    .padStart(2, "0")}E${number.toString().padStart(2, "0")}`;
  // add episode image
  episodeCard.querySelector("img").src = medium;
  // add episode summary
  episodeCard.querySelector("p").innerHTML = summary;
  // append the template to the body
  document.body.appendChild(episodeCard);
}
/**
 * create footer
 */
function renderFooter() {
  const footer = document.createElement("footer");
  const link = document.createElement("a");
  link.href = "https://www.tvmaze.com/";
  link.target = "_blank";
  link.textContent = "Data originally from TVMaze.com";
  footer.appendChild(link);
  document.body.appendChild(footer);
}

window.onload = setup;

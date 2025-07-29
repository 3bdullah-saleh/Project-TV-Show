// Godal: render one episode in the user interface


function setup() {
  const oneEpisodes = getOneEpisode();
  makePageForEpisodes(oneEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const {name, season, number} = episodeList;
  const header = document.createElement("h3");
  header.textContent = `${name} - S${season.toString().padStart(2, "0")}E${number.toString().padStart(2, "0")}`;
  rootElem.appendChild(header);
}

window.onload = setup;


/*
1. All episodes must be shown 
2. For each episode, _at least_ following must be displayed:
   1. The name of the episode
   2. The season number
   3. The episode number
   4. The medium-sized image for the episode
*/

// create an element 
// append title to that element 
// append it to the body
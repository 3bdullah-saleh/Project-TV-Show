// Godal: render one episode in the user interface


function setup() {
  const oneEpisodes = getOneEpisode();
  makePageForEpisodes(oneEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  console.log("🚀 ~ makePageForEpisodes ~ rootElem:", episodeList);
  // render the title including name, season, and episode number
  const { name, season, number } = episodeList;
  const header = document.createElement("h3");
  header.textContent = `${ name } - S${ season.toString().padStart(2, "0") }E${ number.toString().padStart(2, "0") }`;
  rootElem.appendChild(header);
  // render image of the episode
  const { image: {medium} } =  episodeList;
  const image = document.createElement("img");
  image.src = medium;
  rootElem.appendChild(image);
  // render the summary text of the episode
  const { summary } = episodeList;
  const episodeSummary = document.createElement("p");
  episodeSummary.innerHTML = summary;
  rootElem.appendChild(episodeSummary);
}

window.onload = setup;


/*
1. All episodes must be shown 
2. For each episode, _at least_ following must be displayed:
   1. The name of the episode
   2. The season number
   3. The episode number
   4. The medium-sized image for the episode
   5. The summary text of the episode
*/

// create an element 
// append title to that element 
// append it to the body
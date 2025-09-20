// Get Json
let scriptJSON
fetch("./script.json").then(response => response.json()).then(json => { 
	scriptJSON = json
	loadPage(getUrlParam("episode")) 
});

// Load Episode
const getUrlParam = param => {
  const urlParams = new URLSearchParams(window.location.search);
  const p = urlParams.get(param)
  return p ? p : "home"
}

const main = document.getElementById("main")
const episode = document.getElementById("episode")

const loadPage = async (epNumber) => {
	episode.innerHTML = ""

	// If it's home, show home div and return
	if (epNumber == "home") {
		main.className = ""
		episode.className = "inactive"
		episode.innerHTML = ""
		return
	} 
	
	// Else it's an episode
	main.className = "inactive"
	episode.className = ""

	episodeHtml = ""
	let pageNumber = /^\d+$/.test(getUrlParam("page")) ? getUrlParam("page") : 1
	let pageList = /^\d+$/.test(epNumber) ? scriptJSON.episodes[epNumber - 1] : scriptJSON[epNumber]

	if (!pageList[pageNumber - 1]) {
		clickLink(null, "/")
		return
	}

	let pageLink = `/deltritus/?episode=${epNumber}&page=${parseInt(pageNumber) + 1}`
	let page = pageList[pageNumber - 1]

	let topImage = `/deltritus/assets/${page.topImage}`
	let mainImage = `/deltritus/assets/${page.mainImage}`

	if (window.location.href.includes("flaringk")) {
		pageLink = "/slicesite" + pageLink
		topImage = "/slicesite" + topImage
		mainImage = "/slicesite" + mainImage
	}

	episode.innerHTML = `
	<div class="page pageText">
		${page.topImage ? `<img src="${topImage}">` : ""}
		<img ${page.mainImage.includes("epimain") ? `class="teaser"` : ""} src="${mainImage}">
		<div class="dirk">${page.dirkText}</div>
		<a class="link" href="${pageLink}">==></a>
	</div>
	`

	episode.querySelector(".link").addEventListener("click", evt => clickLink(evt, episode.querySelector(".link").href))
}

const clickLink = (event, link) => {
	if (event) event.preventDefault()

	if (window.location.href.includes("flaringk")) {
		link = link.replace("/deltritus/", "/slicesite/deltritus/")
	}

	history.pushState(null, '', link)

	loadPage(getUrlParam("episode"))
}

// Clickable episodes
document.querySelectorAll(".episodeLink").forEach(a => {
	a.addEventListener("click", evt => clickLink(evt, a.href))
})

// Set CSS values
document.querySelectorAll(".episodeLink").forEach((el, i) => {
	el.style.setProperty("--position", i + "")
})

// Reload on back button
window.addEventListener("popstate", function () {
	location.reload();
});
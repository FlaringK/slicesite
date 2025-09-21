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
		if (window.location.href.includes("flaringk")) {
			clickLink(null, "/slicesite/deltritus/")
			return
		}
		clickLink(null, "/deltritus/")
		return
	}

	let pageLink = `/deltritus/?episode=${epNumber}&page=${parseInt(pageNumber) + 1}`
	let backLink = `/deltritus/?episode=${epNumber}&page=${parseInt(pageNumber) - 1}`
	let page = pageList[pageNumber - 1]

	let topImage = `/deltritus/assets/${page.topImage}`
	let mainImage = `/deltritus/assets/${page.mainImage}`

	if (window.location.href.includes("flaringk")) {
		topImage = "/slicesite" + topImage
		mainImage = "/slicesite" + mainImage
	}

	episode.innerHTML = `
	<div class="page pageText">
		${page.topImage ? `<img src="${topImage}">` : ""}
		${page.topText ? `<div class="topText ${page.revealText ? "reveal" : ""}">${page.topText}</div>` : ""}
		<img class="mainImage ${page.mainImage.includes("epimain") ? `teaser` : ""}" src="${mainImage}">
		<div class="dirk">${page.dirkText}</div>
		<a class="link back" href="${backLink}"><==</a>
		<a class="link next" href="${pageLink}">==></a>
	</div>
	`

	// If next page preload image
	if (pageList[pageNumber]) {
		let nextPage = pageList[pageNumber]
		let nextTopImage = `/deltritus/assets/${nextPage.topImage}`
		let nextMainImage = `/deltritus/assets/${nextPage.mainImage}`
		if (window.location.href.includes("flaringk")) {
			nextTopImage = "/slicesite" + nextTopImage
			nextMainImage = "/slicesite" + nextMainImage
		}
		episode.innerHTML += `
		<div class="hidden">
			<img ${page.mainImage.includes("epimain") ? `class="teaser"` : ""} src="${nextMainImage}">
			<img ${page.mainImage.includes("epimain") ? `class="teaser"` : ""} src="${nextTopImage}">
		</div>
		`
	}

	episode.querySelectorAll(".link").forEach(a => {
		a.addEventListener("click", evt => clickLink(evt, a.href))
	})
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

// Manage Left and right clicks
document.addEventListener('keydown', (event) => {
	switch (event.key) {
		case "ArrowLeft":
			if (document.querySelector(".back")) {
				clickLink(null, document.querySelector(".back").href)
			}
			break;
		case "ArrowRight":
			if (document.querySelector(".next")) {
				clickLink(null, document.querySelector(".next").href)
			}
			break;
	}
});
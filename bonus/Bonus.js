// Get Json
let scriptJSON
fetch("./Bonuses.json").then(response => response.json()).then(json => { 
	scriptJSON = json
	loadPage(getUrlParam("episode")) 
});

const main = document.getElementById("main")
const episode = document.getElementById("episode")

const getUrlParam = param => {
  const urlParams = new URLSearchParams(window.location.search);
  const p = urlParams.get(param)
  return p ? p : "home"
}

const loadIntoElement = (id, element) => {
  console.log(id, element)
  document.getElementById(id).innerHTML = ""
  document.getElementById(id).append(element)
}

const loadPage = async (epNumber) => {
	// If it's home, show home div and return
	if (epNumber == "home") {
		main.className = ""
		episode.className = "inactive"
		return
	} 
	
	// Else it's an episode
	main.className = "inactive"
	episode.className = ""

	episodeHtml = ""
	let pageNumber = /^\d+$/.test(getUrlParam("page")) ? getUrlParam("page") : 1
	let pageList = /^\d+$/.test(epNumber) ? scriptJSON.episodes[epNumber - 1] : scriptJSON[epNumber]

	if (!pageList[pageNumber - 1]) {
		
		// REMOVE THIS ON UPLOAD
		if (window.location.href.includes("flaringk")) {
			clickLink(null, "/slicesite/bonus/")
			return
		}
		
		clickLink(null, "/bonus/")
		return
	}

	let pageLink = `/bonus/?episode=${epNumber}&page=${parseInt(pageNumber) + 1}`
	let backLink = `/bonus/?episode=${epNumber}&page=${parseInt(pageNumber) - 1}`
	let pageData = pageList[pageNumber - 1]
	
	// REMOVE THIS ON UPLOAD
	if (window.location.href.includes("flaringk")) {
		pageLink = "/slicesite" + pageLink
		backLink = "/slicesite" + backLink
	}
	
	loadIntoElement("command", MSPFA.parseBBCode(pageData.command))
	loadIntoElement("content", MSPFA.parseBBCode(pageData.body))

	document.getElementById("goback").href = backLink

	// If next page preload image
	if (pageList[pageNumber]) {
		document.getElementById("nextLink").href = pageLink
		document.getElementById("nextLink").innerText = pageList[pageNumber].command
		loadIntoElement("prelaod", MSPFA.parseBBCode(pageList[pageNumber].body))
	} else {
		document.getElementById("nextLink").href = "/bonus"
		document.getElementById("nextLink").innerText = "Episode Complete!"

		
		// REMOVE THIS ON UPLOAD
		if (window.location.href.includes("flaringk")) {
			document.getElementById("nextLink").href = "/slicesite/bonus"
		}
	}
}

const clickLink = (event, link) => {
	if (event) event.preventDefault()

	// REMOVE THIS ON UPLOAD
	if (window.location.href.includes("flaringk")) {
		link = link.replace("/deltritus/", "/slicesite/bonus/")
	}

	history.pushState(null, '', link)
	loadPage(getUrlParam("episode"))
	window.scrollTo(0, 0)
}

episode.querySelectorAll("a").forEach(a => {
	a.addEventListener("click", evt => clickLink(evt, a.href))
	// REMOVE THIS ON UPLOAD
	if (window.location.href.includes("flaringk")) {
		a.href = "/slicesite" + a.href
	}
})

main.querySelectorAll("a").forEach(a => {
	a.addEventListener("click", evt => clickLink(evt, a.href))
	// REMOVE THIS ON UPLOAD
	if (window.location.href.includes("flaringk")) {
		a.href = "/slicesite" + a.href
	}
})

window.addEventListener("keydown", function(evt) {
  if (getUrlParam("episode") == "home") {
    return
  }

  if (evt.key == "ArrowRight") {
    clickLink(evt, this.document.querySelector("#links a").href)
  }

  if (evt.key == "ArrowLeft") {
    clickLink(evt, this.document.querySelector("#goback").href)
  }

  if (evt.key == " ") {
    evt.preventDefault()
    this.document.querySelectorAll(".spoiler input").forEach(e => {
      e.click()
    })
  }
})

window.addEventListener("popstate", function () {
	location.reload();
});
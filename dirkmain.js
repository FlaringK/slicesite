const getUrlPage = () => {
	const urlParams = new URLSearchParams(window.location.search);
	const p = urlParams.get("page")
	return p ? p : "intro"
}

let pageHistory = [window.location.toString()]
let pageIndex = 0
let rss = ""

const loadPage = async () => {
	let pageName = getUrlPage()
	document.body.className = pageName
	document.getElementById("loading").className = ""
	pageHtml = await fetch(`./pages/${pageName}.html`).then(e => e.text())
	document.getElementById("loading").className = "hidden"

	document.getElementById("content").innerHTML = pageHtml
	window.scrollTo(0, 0);

	// Activate links
	document.querySelectorAll("#content .pageLink").forEach(a => { a.addEventListener("click", evt => clickLink(evt, a.href)) })

	// Set tab active
	document.querySelectorAll("#tabs > *").forEach(e => { e.className = "" })
	let isOwnTab = document.getElementById("tab" + pageName)
	if (isOwnTab) {
		document.getElementById("tab" + pageName).className = "active"
	} else {
		document.getElementById("tabhome").className = "active"
	}

	// Set fake url
	if (pageHtml.includes("iframe")) {
		document.getElementById("urlbar").innerText = pageName + ".com"
	} else {
		document.getElementById("urlbar").innerText = "dirk.com" + (pageName == "home" ? "" : "/" + pageName)
	}


	pageFunctions(pageName)
}

const clickLink = (event, link) => {
	event.preventDefault()

	// Add fake page history
	pageIndex += 1;
	pageHistory[pageIndex] = link
	pageHistory = pageHistory.slice(0, pageIndex + 1)

	loadLink(pageHistory[pageIndex])
}

document.getElementById("browser-back").onclick = () => {
	if (pageIndex > 0) {
		pageIndex -= 1
		loadLink(pageHistory[pageIndex])
	}
}

document.getElementById("browser-forward").onclick = () => {
	if (pageHistory.length > pageIndex + 1) {
		pageIndex += 1
		loadLink(pageHistory[pageIndex])
	}
}

let loadLink = link => {

	// // REMOVE THIS ON UPLOAD
	// if (window.location.href.includes("flaringk")) {
	// 	link = link.replace("https://flaringk.github.io", "https://flaringk.github.io/slicesite/")
	// }

	history.pushState(null, '', link)
	loadPage()
}

const pageFunctions = async pageName => {

	// For intro
	if (pageName == "intro") {
		document.getElementById("intro-button-1").onclick = () => { document.getElementById("introwrapper").className = "phase2" }
		document.getElementById("intro-button-2").onclick = () => { document.getElementById("introwrapper").className = "phase3" }
		// document.getElementById("intro-button-3").onclick = () => { document.getElementById("introwrapper").className = "phase4" }
	}

	// For homepage
	if (document.getElementById("updates")) {
		// Load RSS
		if (!rss) {
			rss = await fetch(`https://mspfa.com/rss/?s=37041`).then(e => e.text())
		}

		// Parse RSS
		let latestItem = rss.match(/<item>(.|\n)*?<\/item>/g)[0]
		let date = latestItem.match(/<pubDate>.*?<\/pubDate>/g)[0].replace(/<\/?pubDate>/g, "").replace("+0000", "")
		let url = latestItem.match(/https:\/\/mspfa\.com\/\?s=\d+&amp;amp;p=\d+/g)[0].replace("&amp;amp;", "&")
		let name = latestItem.match(/&gt;(.)*?&lt;/g)[0].replace(/&gt;|&lt;/g, "")

		if (document.getElementById("update-time")) document.getElementById("update-time").innerText = date
		if (document.getElementById("update-link")) {
			document.getElementById("update-link").innerText = name
			document.getElementById("update-link").href = url
		}
	}

}


// Load page
document.querySelectorAll(".pageLink").forEach(a => { a.addEventListener("click", evt => clickLink(evt, a.href)) })
loadPage()
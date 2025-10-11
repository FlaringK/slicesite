let pageRanges = [
	[77, 90],
	[91, 133],
	[177, 196],
	[197, 263],
	[264, 273]
]

let names = [
	"knife",
	"halloween",
	"christmas",
	"birthday",
	"outrun"
]

fetch("Homeslice.json")
.then(response => response.json())
.then(json => {
	console.log(json)

	let bonusStories = {}

	pageRanges.forEach((range, index) => {
		let story = []
		for (let i = range[0]; i < range[1] + 1; i++) {
			story.push({
				"command": json.p[i - 1].c,
				"body": json.p[i - 1].b,
				"date": json.p[i - 1].d
			})
		}
		bonusStories[names[index]] = story
	})

	console.log(bonusStories)
	console.log(JSON.stringify(bonusStories))
});
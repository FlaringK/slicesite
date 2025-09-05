document.querySelectorAll(".next").forEach(el => {
	el.onclick = () => {
		el.parentElement.remove()
	}
})
document.addEventListener("DOMContentLoaded", function(event) {
	var selection = document.querySelectorAll(".selection-each")
	
	for(let i = 0; i < selection.length; i++) {
		var child = selection[i].querySelectorAll(":scope > input");
		for(let j = 0; j < child.length; j++) {
			child[j].addEventListener("click", function() {
				temp = this.getAttribute("pos")
				var gap = 0;
				if (temp != 0) { gap = 6 }
				document.querySelector(".selection-1[name='" + this.getAttribute("name") + "']").style.setProperty("--left", (parseInt(temp) * (130)) + gap + "px")
			});
			if (child[j].checked) {
				temp = child[j].getAttribute("pos")
				var gap = 0;
				if (temp != 0) { gap = 6 }
				document.querySelector(".selection-1[name='" + child[j].getAttribute("name") + "']").style.setProperty("--left", (parseInt(temp) * (130)) + gap + "px")
			}
		}
	}
});
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header .navbar a');

window.onscroll = () => {
	sections.forEach(sec => {
		let top = window.scrollY;
		let offset = sec.offsetTop -150;
		let height = sec.offsetHeight;
		let id = sec.getAttribute('id');

		if (top >= offset && top < offset + height) {
			navLinks.forEach(link => {
				link.classList.remove('active');
				document.querySelector('header .navbar a[href*=' + id + ']').classList.add('active');
			});
		};
	});
};


document.getElementsByClassName("user")[0].addEventListener("click",function(){
	document.querySelector(".popup").style.display="flex";
})

document.getElementsByClassName("btn-close")[0].addEventListener("click",function(){
	console.log("hej");
	document.querySelector(".popup").style.display = "none";
		
})
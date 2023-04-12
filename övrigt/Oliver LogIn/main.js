document.getElementsByClassName("LoggaInButton")[0].addEventListener("click",function(){
	document.querySelector(".popup").style.display="flex";
})

document.getElementsByClassName("btn-close")[0].addEventListener("click",function(){
	console.log("hej");
	document.querySelector(".popup").style.display = "none";
		
})
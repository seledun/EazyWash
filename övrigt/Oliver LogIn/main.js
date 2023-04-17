
document.getElementsByClassName("LoggaInButton")[0].addEventListener("click",function(){
	document.querySelector(".popup").style.display="flex";
})

document.getElementsByClassName("btn-close")[0].addEventListener("click",function(){
	console.log("hej");
	document.querySelector(".popup").style.display = "none";
		
})

const loginButton = document.querySelector('.button');
loginButton.addEventListener('click', function() {

	const usernameInput = document.querySelector('input[type="text"]');
  const passwordInput = document.querySelector('input[type="password"]');

  const username = usernameInput.value;
  const password = passwordInput.value;

  fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },    
    body: new URLSearchParams({
        'id': username,
        'pin': password
    })
});
  
  console.log(`Username: ${username}, Password: ${password}`);
});

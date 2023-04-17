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
        const element = document.querySelector('header .navbar a[href*=' + id + ']');
        if (element !== null) {
          element.classList.add('active');
        }
      });
    }
  });
};

document.getElementsByClassName("user")[0].addEventListener("click",function(){
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
  
  fetch('/api/login', {
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
  
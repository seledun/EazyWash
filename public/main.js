let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header .navbar a');
/**
 * @author Oliver Jönsson, Sebastian Ledung
 */
window.onscroll = () => {
  sections.forEach(sec => {
    let top = window.scrollY;
    let offset = sec.offsetTop -150;
    let height = sec.offsetHeight;
    let id = sec.getAttribute('id');

    if (top >= offset && top < offset + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        const ELEMENT = document.querySelector('header .navbar a[href*=' + id + ']');
        if (ELEMENT !== null) {
          ELEMENT.classList.add('active');
        }
      });
    }
  });
};
/**
 * @author Oliver Jönsson
 * @author Sebastian Ledung
 */
document.getElementsByClassName("user")[0].addEventListener("click",function(){
  const USER_STATUS = document.getElementsByClassName("user")[0].classList[1];

  if (USER_STATUS === "log-in-field") {
    document.querySelector(".popup").style.display="flex";
  } else {
    console.log("Clicked log out button");
  }
});
/**
 * @author Oliver Jönsson
 */
document.getElementsByClassName("btn-close")[0].addEventListener("click",function(){
  document.querySelector(".popup").style.display = "none";	
});
/**
 * @author Sebastian Ledung
 * @author Teo Gefors
 * @author Petter Carlsson
 */  
const LOGINBUTTON = document.querySelector('.button');

LOGINBUTTON.addEventListener('click', async function() {
  
  const USERNAMEINPUT = document.querySelector('input[type="text"]');
  const PASSWORDINPUT = document.querySelector('input[type="password"]');
  
  const USERNAME = USERNAMEINPUT.value;
  const PASSWORD = PASSWORDINPUT.value;
  
  document.getElementsByClassName("popup-content")[0].style.display="none";

  fetch('/api/login', {
    method: 'POST',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },    
    body: new URLSearchParams({
      'id': USERNAME,
      'pin': PASSWORD
    })
  })
    // Checks the status code if the authentication was successful,
    // else, raises authentication error.
    .then(response => {
      if (!response.ok) {
        const API_RESPONSE = response.status;
        throw new Error("Authentication failed, StatusCode: " + response.status);
      }
      return response.json();
    })

    // Outputs the JSON-response to console.
    .then(json => {
      console.log(json);
      document.querySelector(".popup").style.display = "none";
      document.querySelector(".user").innerHTML = "<i class='bx bx-log-out'></i>Logga ut " + json.username;
      document.getElementsByClassName("user")[0].classList.remove("log-in-field");
      document.getElementsByClassName("user")[0].classList.remove("log-out-field");
    })

    // Catch-all for authentication errors.
    .catch(function() {
      console.log("Authentication failed");
    })
    
    .finally(function() {
      document.getElementsByClassName("popup-content")[0].style.display="flex";
    });
});
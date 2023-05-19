// oliver
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header .navbar a');
// oliver
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
// oliver
document.getElementsByClassName("user")[0].addEventListener("click",function(){
  // document.querySelector(".popup").style.display="flex";
})
// Oliver 
/**
 * @author Oliver Jönsson
 */
document.getElementsByClassName("user")[0].addEventListener("click",function(){
  // document.querySelector(".popup").style.display="flex";
});
/**
 * @author Oliver Jönsson
 */
document.getElementsByClassName("btn-close")[0].addEventListener("click",function(){
  console.log("hej");
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
    })

    // Catch-all for authentication errors.
    .catch(function() {
      console.log("Authentication failed");
    });
});
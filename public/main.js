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

// Skapa en instans av ScrollReveal
const sr = ScrollReveal();

// Definiera effekten och inställningarna för ScrollReveal
sr.reveal('.BigDivToClassHome', {
  duration: 1700,   // Varaktighet i millisekunder
  origin: 'bottom', // Ursprung för animationen (top, right, bottom, left)
  distance: '400px', // Avståndet som elementet förflyttas
  delay: 400,       // Fördröjning före animationen startar
  opacity: 3,     // Genomskinlighet för elementet
  easing: 'ease-in-out', // Easing-funktionen för animationen
});

// Kör ScrollReveal för att tillämpa effekten på alla div-boxar
sr.reveal('.BigDivToClassHome');



const sr1 = ScrollReveal();

// Definiera effekten och inställningarna för ScrollReveal
sr.reveal('.contentsectionHome', {
  duration: 1900,   // Varaktighet i millisekunder
  origin: 'left', // Ursprung för animationen (top, right, bottom, left)
  distance: '100px', // Avståndet som elementet förflyttas
  delay: 1000,       // Fördröjning före animationen startar
  opacity: 3,     // Genomskinlighet för elementet
  easing: 'ease-in-out', // Easing-funktionen för animationen
});

// Kör ScrollReveal för att tillämpa effekten på alla div-boxar
sr.reveal('.contentsectionHome');


const sr2 = ScrollReveal();

// Definiera effekten och inställningarna för ScrollReveal
sr.reveal('.box', {
  duration: 1700,   // Varaktighet i millisekunder
  origin: 'bottom', // Ursprung för animationen (top, right, bottom, left)
  distance: '400px', // Avståndet som elementet förflyttas
  delay: 400,       // Fördröjning före animationen startar
  opacity: 3,     // Genomskinlighet för elementet
  easing: 'ease-in-out', // Easing-funktionen för animationen
});

// Kör ScrollReveal för att tillämpa effekten på alla div-boxar
sr.reveal('.box');



setInterval(changeScrollbarColor, 2000);

function changeScrollbarColor() {
  var randomColor = getRandomRainbowColor();
  var style = `
                   ::-webkit-scrollbar-thumb {
                       background: ${randomColor};
                   }
               `;
  var css = document.createElement('style');
  css.appendChild(document.createTextNode(style));
  document.head.appendChild(css);
}

function getRandomRainbowColor() {
  var hue = Math.floor(Math.random() * 360);
  return 'hsl(' + hue + ', 100%, 50%)';
}



 


// Skapa bubblor när sidan har laddats
window.addEventListener('load', function () {
  createBubbles();
});

// Skapa bubblor och lägg till klickhändelse
function createBubbles() {
  var bubbleCount = 10; // Antal bubblor att skapa

  for (var i = 0; i < bubbleCount; i++) {
    createBubble();
  }

  // Lägg till klickhändelse för bubblor
  document.addEventListener('click', function (event) {
    if (event.target.classList.contains('bubble')) {
      event.target.remove();
    }
  });
}

// Skapa en enskild bubbla
function createBubble() {
  var bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.style.left = getRandomPosition(0, window.innerWidth - 100) + 'px';
  bubble.style.top = window.innerHeight + 'px';

  document.body.appendChild(bubble);

  // Animera bubblorna
  animateBubble(bubble);
}

// Hjälpfunktion för att generera slumpmässig position
function getRandomPosition(min, max) {
  return Math.random() * (max - min) + min;
}

// Animera bubblorna
function animateBubble(bubble) {
  var startX = parseFloat(bubble.style.left);
  var startY = parseFloat(bubble.style.top);
  var endX = startX; // Bubblan flyter inte horisontellt
  var endY = -100; // Bubblan flyter uppåt och samlas längst uppe
  var duration = getRandomPosition(8000, 14000); // Slumpmässig animationsvaraktighet

  var startTime = null;

  function step(currentTime) {
    if (startTime === null) {
      startTime = currentTime;
    }

    var elapsedTime = currentTime - startTime;
    var progress = Math.min(elapsedTime / duration, 1); // Beräkna animationsframsteg (0 till 1)

    var deltaY = (endY - startY) * progress;

    bubble.style.top = startY + deltaY + 'px';

    if (progress < 1) {
      requestAnimationFrame(step); // Uppdatera nästa frame
    } else {
      bubble.remove(); // Ta bort bubblan när den når toppen
      createBubble(); // Skapa en ny bubbla när en bubbla har försvunnit
    }
  }

  requestAnimationFrame(step); // Starta animationsloopen
}


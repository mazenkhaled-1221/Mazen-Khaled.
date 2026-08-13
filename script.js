// ================= MOBILE MENU =================

const menuIcon = document.querySelector(".menu-btn");
const navbar = document.querySelector(".navbar");

if(menuIcon){

    menuIcon.addEventListener("click",()=>{

        navbar.classList.toggle("active");

    });

}


// ================= DARK MODE =================

const themeBtn = document.querySelector("#theme-toggle");

if(themeBtn){

    themeBtn.addEventListener("click",()=>{

        document.body.classList.toggle("light-mode");

        themeBtn.innerHTML =
        document.body.classList.contains("light-mode")
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';

    });

}



// ================= BACK TO TOP =================

const backTop = document.querySelector("#back-top");


window.addEventListener("scroll",()=>{


    if(window.scrollY > 400){

        backTop.classList.add("show");

    }else{

        backTop.classList.remove("show");

    }


});


if(backTop){

    backTop.addEventListener("click",()=>{

        window.scrollTo({

            top:0,
            behavior:"smooth"

        });

    });

}


// ================= SCROLL REVEAL =================


const sections = document.querySelectorAll(".section");


const reveal = ()=>{


    sections.forEach(section=>{


        const position = section.getBoundingClientRect().top;


        if(position < window.innerHeight - 100){

            section.classList.add("show");

        }


    });


};


window.addEventListener("scroll",reveal);

reveal();


// ================= PROJECT IMAGE HOVER =================

const cards = document.querySelectorAll(".project-card");


cards.forEach(card=>{


    card.addEventListener("mousemove",(e)=>{


        const x =
        e.offsetX / card.offsetWidth * 10;


        const y =
        e.offsetY / card.offsetHeight * 10;


        card.style.transform =
        `rotateX(${y - 5}deg) rotateY(${x - 5}deg)`;


    });


    card.addEventListener("mouseleave",()=>{

        card.style.transform="";

    });


});

// ================= LOADER =================

window.addEventListener("load", () => {

    const loader = document.querySelector(".loader");

    if(loader){

        setTimeout(() => {

            loader.classList.add("hide");

        }, 1200);

    }

});

const words = [
"Front-End Developer",
"Web Designer",
"JavaScript Developer"
];

let wordIndex = 0;
let charIndex = 0;
let typing = true;

const typingText = document.getElementById("typing");

function typeEffect(){

if(!typingText) return;

if(typing){

typingText.textContent =
words[wordIndex].substring(0,charIndex++);

if(charIndex > words[wordIndex].length){

typing = false;

setTimeout(typeEffect,1200);

return;

}

}else{

typingText.textContent =
words[wordIndex].substring(0,charIndex--);

if(charIndex < 0){

typing = true;

wordIndex = (wordIndex + 1) % words.length;

}

}

setTimeout(typeEffect, typing ? 100 : 50);

}

typeEffect();

const title = document.querySelector(".hero-title");

function splitLetters(element) {
    const nodes = [...element.childNodes];

    nodes.forEach(node => {

        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            const fragment = document.createDocumentFragment();

            [...text].forEach(char => {
                if (char === " ") {
                    fragment.appendChild(document.createTextNode(" "));
                } else {
                    const span = document.createElement("span");
                    span.className = "letter";
                    span.textContent = char;
                    fragment.appendChild(span);
                }
            });

            node.replaceWith(fragment);

        } else if (node.nodeType === Node.ELEMENT_NODE) {
            splitLetters(node);
        }
    });
}

splitLetters(title);

document.querySelectorAll(".hero-title .letter").forEach(letter => {

    letter.addEventListener("mouseenter", () => {

        letter.classList.remove("wave");

        void letter.offsetWidth;

        letter.classList.add("wave");

        setTimeout(() => {
            letter.classList.remove("wave");
        }, 450);
    });

});
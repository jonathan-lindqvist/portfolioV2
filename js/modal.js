//GGHub

// Open the Modal
function openModalGG() {
  document.getElementById("myModalGG").style.display = "block";
}

// Close the Modal
function closeModalGG() {
  document.getElementById("myModalGG").style.display = "none";
}

var slideIndex = 1;
showSlidesGG(slideIndex);

// Next/previous controls
function plusSlidesGG(n) {
  showSlidesGG(slideIndex += n);
}

// Thumbnail image controls
function currentSlideGG(n) {
  showSlidesGG(slideIndex = n);
}

function showSlidesGG(n) {
  var i;
  var slides = document.getElementsByClassName("mySlidesGG");
  var dots = document.getElementsByClassName("demoGG");
  var captionText = document.getElementById("captionGG");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
  captionText.innerHTML = dots[slideIndex-1].alt;
}


//Rails react

// Open the Modal
function openModalRR() {
  document.getElementById("myModalRR").style.display = "block";
}

// Close the Modal
function closeModalRR() {
  document.getElementById("myModalRR").style.display = "none";
}

var slideIndexRR = 1;
showSlidesRR(slideIndexRR);

// Next/previous controls
function plusSlidesRR(n) {
  showSlidesRR(slideIndexRR += n);
}

// Thumbnail image controls
function currentSlideRR(n) {
  showSlidesRR(slideIndexRR = n);
}

function showSlidesRR(n) {
  var i;
  var slides = document.getElementsByClassName("mySlidesRR");
  var dots = document.getElementsByClassName("demoRR");
  var captionText = document.getElementById("captionRR");
  if (n > slides.length) {slideIndexRR = 1}
  if (n < 1) {slideIndexRR = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndexRR-1].style.display = "block";
  dots[slideIndexRR-1].className += " active";
  captionText.innerHTML = dots[slideIndexRR-1].alt;
}
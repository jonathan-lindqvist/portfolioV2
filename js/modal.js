// Generic modal
let slideIndex = 1

const openModal = (project) => {
  document.getElementById("myModal" + project).style.display = "block"
}

const closeModal = (project) => {
  document.getElementById("myModal" + project).style.display = "none"
}

const plusSlides = (project, index) => {
  showSlides(project, slideIndex += index)
}

const currentSlide = (project, index) => {
  showSlides(project, slideIndex = index)
}

const showSlides = (project, index) => {
  const slides = document.getElementsByClassName("mySlides"  + project)
  const dots = document.getElementsByClassName("demo" + project)
  let captionText = document.getElementById("caption"  + project)
  
  if (index > slides.length) {
    slideIndex = 1
  }
  
  if (index < 1) {
    slideIndex = slides.length
  }
  
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none"
  }
  
  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "")
  }
  
  slides[slideIndex-1].style.display = "block"
  dots[slideIndex-1].className += " active"
  captionText.innerHTML = dots[slideIndex-1].alt
}

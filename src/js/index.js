import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

import axios from 'axios';

const searchContainer = document.querySelector('.search__container');
const searchBox = document.querySelector('.search__box');
const searchButton = document.querySelector('.search__button');
const contentBox = document.querySelector('.content');
const gallery = document.querySelector('.gallery');

searchBox.addEventListener('input', () => {
  if (searchBox.value && searchContainer.classList.contains('noclear')) {
    searchContainer.classList.remove('noclear');
  } else if (
    !searchBox.value &&
    !searchContainer.classList.contains('noclear')
  ) {
    searchContainer.classList.add('noclear');
  }
});

searchContainer.addEventListener('click', event => {
  if (event.target == event.currentTarget) {
    searchBox.value = '';
    searchContainer.classList.add('noclear');
  }
});

searchBox.addEventListener('keydown', event => {
  if (event.key == 'Enter') {
    console.log('Initiate search');
  }
});

searchButton.addEventListener('click', event => {
  console.log('Initiate search');
});

window.addEventListener('scroll', () => {
  let difference = document.body.offsetHeight - window.innerHeight;
  if (
    difference === window.pageYOffset &&
    document.body.offsetHeight > window.innerHeight
  ) {
    console.log('End of page!');
  }
});

// LazyLoad execution:
const galleryImgRef = document.querySelectorAll('.gallery__image');

const onEntry = observerEntries => {
  observerEntries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting) {
      let source = target.parentNode.href;
      target.src = source;
    }
  });
};

const observer = new IntersectionObserver(onEntry);

galleryImgRef.forEach(element => observer.observe(element));

// Lightbox generation:
let galleryLink = new SimpleLightbox('.gallery__link', {
  captionsData: 'alt',
  captionDelay: 250,
  overlayOpacity: 0.6,
});
galleryLink.on('show.simplelightbox');

galleryLink.on('error.simplelightbox', error => {
  console.log(error);
});

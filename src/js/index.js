import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

import axios from 'axios';

const searchBox = document.querySelector('.search__box');
const searchButton = document.querySelector('.search__button');
const contentBox = document.querySelector('.content');
const gallery = document.querySelector('.gallery');

searchBox.addEventListener('keydown', event => {
  console.log(event);
});

searchButton.addEventListener('click', event => {
  //   console.log('Window height: ' + window.innerHeight);
  //   console.log('Body Height: ' + document.body.offsetHeight);
  //   console.log('Distance Scrolled: ' + window.pageYOffset);
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
let galleryLink = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  overlayOpacity: 0.6,
});
galleryLink.on('show.simplelightbox');

galleryLink.on('error.simplelightbox', error => {
  console.log(error);
});

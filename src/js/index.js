import Notiflix from 'notiflix';

import {
  searchContainer,
  searchBox,
  searchButton,
  gallery,
  contentEnd,
} from './refs';

import { vars } from './vars';

import { getImages } from './getImages';

searchBox.focus();

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
    searchInit();
  }
});

searchButton.addEventListener('click', () => {
  searchInit();
});

infiniteScroll();

function searchInit() {
  if (searchBox.value.trim()) {
    vars.searchQuerry = searchBox.value.toLowerCase().trim();
    if (!document.body.classList.contains('insearch')) {
      document.body.classList.add('insearch');
    }
    gallery.innerHTML = '';
    contentEnd.innerHTML = 'Scroll down for more';
    if (contentEnd.classList.contains('hidden')) {
      contentEnd.classList.remove('hidden');
    }
    getImages(vars.searchQuerry, 1);
  } else {
    Notiflix.Notify.failure(`Search field must not be empty!`);
    searchBox.value = '';
  }
}

function infiniteScroll() {
  const onEntry = observerEntries => {
    observerEntries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        if (vars.pageCounter && vars.pageCounter <= vars.maxPage) {
          console.log('Getting page: ' + vars.pageCounter);
          getImages(vars.searchQuerry, vars.pageCounter);
        }
      }
    });
  };

  const observerOptions = { root: null, rootMargin: '250px' };

  const scroller = new IntersectionObserver(onEntry, observerOptions);

  scroller.observe(contentEnd);
}

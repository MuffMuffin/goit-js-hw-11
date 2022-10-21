import Notiflix from 'notiflix';

import {
  searchContainer,
  searchBox,
  searchButton,
  gallery,
  contentEnd,
} from './refs';

import { getImages } from './getImages';

global.searchQuerry = null;
global.pageCounter = null;
global.maxPage = null;

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

function searchInit() {
  if (searchBox.value.trim()) {
    searchQuerry = searchBox.value.toLowerCase().trim();
    if (!document.body.classList.contains('insearch')) {
      document.body.classList.add('insearch');
    }
    gallery.innerHTML = '';
    contentEnd.innerHTML = 'Scroll down for more';
    if (contentEnd.classList.contains('hidden')) {
      contentEnd.classList.remove('hidden');
    }
    getImages(searchQuerry, 1);
  } else {
    Notiflix.Notify.failure(`Search field must not be empty!`);
    searchBox.value = '';
  }
}

const infiniteScroll = () => {
  let difference = document.body.offsetHeight - window.innerHeight;
  if (
    difference >= window.pageYOffset - 10 &&
    difference <= window.pageYOffset + 10 &&
    document.body.offsetHeight > window.innerHeight
  ) {
    if (pageCounter && pageCounter <= maxPage) {
      getImages(searchQuerry, pageCounter);
    }
  }
};

window.addEventListener('scroll', infiniteScroll);

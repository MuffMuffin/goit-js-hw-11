import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import axios from 'axios';
import debounce from 'lodash.debounce';

import {
  searchContainer,
  searchBox,
  searchButton,
  notFound,
  gallery,
  contentEnd,
} from './refs';

searchBox.focus();

var galleryLightBox = new SimpleLightbox('.gallery__link', {
  captionsData: 'alt',
  captionDelay: 250,
  overlayOpacity: 0.6,
});

var searchQuerry = null;
var pageCounter = null;
var maxPage = null;
var onPixabayUrl = null;

const PIXABAY_URL = 'https://pixabay.com/api/?';

async function getImages(search, page) {
  try {
    const response = await axios.get(PIXABAY_URL, {
      params: {
        key: '30622537-bddfe7de85b74c076d91ec316',
        q: search,
        image_type: 'photo',
        per_page: '32',
        page: page,
      },
    });
    if (pageCounter > 1) {
      pageCounter += 1;
    }
    if (page === 1) {
      pageCounter = 2;
    }
    maxPage = Math.ceil(response.data.totalHits / 32);
    onPixabayUrl = encodeURI(
      `https://pixabay.com/photos/search/${search}/?manual_search=1`
    );
    markup(response.data);
  } catch (error) {
    console.error(error);
  }
}

function markup(data) {
  // Top text and empty generator
  const resultNumber = document.querySelector('.search__found');

  if (data.totalHits === 500 && data.total > data.totalHits) {
    let dataDiff = data.total - data.totalHits;
    if (dataDiff > 12) {
      resultNumber.textContent = `Received ${512} results out of ${data.total}`;
    } else {
      resultNumber.textContent = `Received ${
        data.totalHits + dataDiff
      } results out of ${data.total}`;
    }
    resultNumber.textContent = `Received ${512} results out of ${data.total}`;
  } else if (data.totalHits > 0) {
    resultNumber.textContent = `Received ${data.totalHits} results out of ${data.total}`;
  } else {
    resultNumber.textContent = ``;
    if (notFound.classList.contains('hidden')) {
      notFound.classList.remove('hidden');
    }
    if (!contentEnd.classList.contains('hidden')) {
      contentEnd.classList.add('hidden');
    }
  }

  // Gallery population
  const galleryArray = data.hits.map(
    ({
      pageURL,
      tags,
      webformatURL,
      largeImageURL,
      views,
      downloads,
      likes,
      comments,
    }) => {
      return `<li class="gallery__card">
          <a class="gallery__link" href="${largeImageURL}">
            <img
              src="img/clear.svg"
              data-source="${webformatURL}"
              alt="Tags: ${tags}"
              class="gallery__image"
          /></a>
          <a target="_blank" rel="noopener noreferrer" href="${pageURL}">
            <div class="gallery__stats">
            <div class="gallery__data likes">${numberText(likes)}</div>
            <div class="gallery__data views">${numberText(views)}</div>
            <div class="gallery__data comments">${numberText(comments)}</div>
            <div class="gallery__data downloads">${numberText(downloads)}</div>
          </div>
          </a>
        </li>`;
    }
  );
  gallery.insertAdjacentHTML('beforeend', galleryArray.join(''));

  // Bottom text generator
  const loadedImages = [...document.querySelectorAll('.gallery__card')].length;

  if (loadedImages >= data.totalHits && loadedImages >= data.total) {
    contentEnd.innerHTML = `No more results available`;
  }
  if (loadedImages >= data.totalHits && loadedImages < data.total) {
    onPixabayUrl =
      onPixabayUrl + `&pagi=${Math.floor(data.totalHits / 100) + 1}`;
    contentEnd.innerHTML = `
        <a target="_blank" rel="noopener noreferrer" href="${onPixabayUrl}">Click to continue on Pixabay</a>`;
  }

  // LazyLoad execution:
  const galleryImage = document.querySelectorAll('.gallery__image');

  var firstItem = document.querySelector('.gallery__card');
  var itemSize = `${
    Math.ceil(firstItem.getBoundingClientRect().height) + 10
  }px`;

  const onEntry = observerEntries => {
    observerEntries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        let source = target.dataset.source;
        target.src = source;
      }
    });
  };

  const observerOptions = { root: gallery, rootMargin: itemSize };

  const observer = new IntersectionObserver(onEntry, observerOptions);

  galleryImage.forEach(element => {
    observer.unobserve(element);
    observer.observe(element);
  });

  // Lightbox generation:
  galleryLightBox.refresh();
}

function numberText(number) {
  let outputNumber = null;
  switch (true) {
    case number >= 100000000:
      outputNumber = Math.round(number / 1000000);
      return `${outputNumber}M`;
      break;
    case number >= 1000000:
      outputNumber = Math.round(number / 100000) / 10;
      return `${outputNumber}M`;
      break;
    case number >= 100000:
      outputNumber = Math.round(number / 1000);
      return `${outputNumber}k`;
      break;
    case number >= 1000:
      outputNumber = Math.round(number / 100) / 10;
      return `${outputNumber}k`;
      break;
    default:
      return number;
      break;
  }
}

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
    difference === window.pageYOffset &&
    document.body.offsetHeight > window.innerHeight
  ) {
    if (pageCounter && pageCounter <= maxPage) {
      getImages(searchQuerry, pageCounter);
    }
  }
};

window.addEventListener('scroll', debounce(infiniteScroll, 250));

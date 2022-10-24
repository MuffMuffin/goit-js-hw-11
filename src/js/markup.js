import SimpleLightbox from 'simplelightbox';

import { notFound, gallery, contentEnd } from './refs';

var galleryLightBox = new SimpleLightbox('.gallery__link', {
  captionsData: 'alt',
  captionDelay: 250,
  overlayOpacity: 0.6,
});

export function markup(data, pixabayUrl) {
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

  labelsTopBottom(data, pixabayUrl);

  lazyLoad();

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

function labelsTopBottom(data, pixabayUrl) {
  // Top label text
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

  // Bottom label text
  const loadedImages = [...document.querySelectorAll('.gallery__card')].length;

  if (loadedImages >= data.totalHits && loadedImages >= data.total) {
    contentEnd.innerHTML = `No more results available`;
  }
  if (loadedImages >= data.totalHits && loadedImages < data.total) {
    pixabayUrl = pixabayUrl + `&pagi=${Math.floor(data.totalHits / 100) + 1}`;
    contentEnd.innerHTML = `
        <a target="_blank" rel="noopener noreferrer" href="${pixabayUrl}">Click to continue on Pixabay</a>`;
  }
}

function lazyLoad() {
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

  const observerOptions = { root: null, rootMargin: itemSize };

  const observer = new IntersectionObserver(onEntry, observerOptions);

  galleryImage.forEach(element => {
    observer.unobserve(element);
    observer.observe(element);
  });
}

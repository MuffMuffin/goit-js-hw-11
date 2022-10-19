import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import axios from 'axios';

const searchContainer = document.querySelector('.search__container');
const searchBox = document.querySelector('.search__box');
const searchButton = document.querySelector('.search__button');
const contentBox = document.querySelector('.content');
const gallery = document.querySelector('.gallery');

var searchQuerry = null;
var pageCounter = null;
var maxPage = null;

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
    markup(response.data);
  } catch (error) {
    console.error(error);
  }
}

function markup(data) {
  function numberText(number) {
    let outputNumber = null;
    switch (true) {
      case number > 100000000:
        outputNumber = Math.round(number / 1000000);
        return `${outputNumber}M`;
        break;

      default:
        return number;
        break;
    }
  }

  const resultNumber = document.querySelector('.search__found');
  if (data.totalHits >= 500) {
    resultNumber.textContent = `Found >${data.totalHits} results`;
  } else {
    resultNumber.textContent = `Found ${data.totalHits} results`;
  }

  const galleryArray = data.hits.map(
    ({
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
          <div class="gallery__stats">
            <div class="gallery__data likes">20.5M</div>
            <div class="gallery__data views">123M</div>
            <div class="gallery__data comments">7653</div>
            <div class="gallery__data downloads">36.7k</div>
          </div>
        </li>`;
    }
  );
  gallery.insertAdjacentHTML('beforeend', galleryArray.join(''));

  // LazyLoad execution:
  const galleryImage = document.querySelectorAll('.gallery__image');

  const onEntry = observerEntries => {
    observerEntries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        let source = target.dataset.source;
        target.src = source;
      }
    });
  };

  const observer = new IntersectionObserver(onEntry);

  if (pageCounter === 1) {
    galleryImage.forEach(element => observer.observe(element));
  } else {
    galleryImage.forEach(element => {
      observer.unobserve(element);
      observer.observe(element);
    });
  }

  // Lightbox generation:
  let galleryLink = new SimpleLightbox('.gallery__link', {
    captionsData: 'alt',
    captionDelay: 250,
    overlayOpacity: 0.6,
    docClose: false,
  });
  if (pageCounter === 1) {
    galleryLink.on('show.simplelightbox');
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
    if (searchBox.value.trim()) {
      searchQuerry = searchBox.value.toLowerCase().trim();
      if (!document.body.classList.contains('insearch')) {
        document.body.classList.add('insearch');
      }
      gallery.innerHTML = '';
      getImages(searchQuerry, 1);
    } else {
      console.warn('Fillout the field, bitch!');
    }
  }
});

searchButton.addEventListener('click', () => {
  if (searchBox.value.trim()) {
    searchQuerry = searchBox.value.toLowerCase().trim();
    if (!document.body.classList.contains('insearch')) {
      document.body.classList.add('insearch');
    }
    gallery.innerHTML = '';
    getImages(searchQuerry, 1);
  } else {
    console.warn('Fillout the field, bitch!');
  }
});

window.addEventListener('scroll', () => {
  let difference = document.body.offsetHeight - window.innerHeight;
  if (
    difference === window.pageYOffset &&
    document.body.offsetHeight > window.innerHeight
  ) {
    if (pageCounter && pageCounter <= maxPage) {
      getImages(searchQuerry, pageCounter);
    } else if (!pageCounter) {
      console.log('No search yet');
    } else {
      console.log('Out of images');
    }
  }
});

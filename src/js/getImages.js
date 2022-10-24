import axios from 'axios';
import { markup } from './markup';
import { vars } from './vars';

const PIXABAY_URL = 'https://pixabay.com/api/?';

export async function getImages(search, page) {
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
    if (vars.pageCounter > 1) {
      vars.pageCounter += 1;
    }
    if (page === 1) {
      vars.pageCounter = 2;
    }
    vars.maxPage = Math.ceil(response.data.totalHits / 32);
    var onPixabayUrl = encodeURI(
      `https://pixabay.com/photos/search/${search}/?manual_search=1`
    );
    markup(response.data, onPixabayUrl);
  } catch (error) {
    console.error(error);
  }
}

import axios from 'axios';

const KEY = '29133730-ff48db7824e8d0937789cb566';
const API_URL = 'https://pixabay.com/api/';

export default async function fetchImages(query, page) {
  const FILTER_OPTIONS = {
    key: KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page,
    q: query,
  };
  const response = await axios.get(API_URL, {
    params: FILTER_OPTIONS,
  });
  console.log(response.data);
  return response.data;
}

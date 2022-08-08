import './css/style.css';
import fetchImages from './js/serviceApi';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { generateContentList } from './js/markupList';

let page;
let totalPage;
let searchQueryValue;
const formEl = document.querySelector('.search-form');
const wrapperEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');
loadMoreBtnEl.style.display = 'none';

loadMoreBtnEl.addEventListener('click', onLoadMore);
formEl.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();
  page = 1;
  loadMoreBtnEl.style.display = 'block';
  searchQueryValue = e.currentTarget.elements.searchQuery.value.trim();
  if (!searchQueryValue) {
    return;
  }
  wrapperEl.innerHTML = '';
  renderContains(searchQueryValue, page);
}

function onLoadMore() {
  page += 1;
  renderContains(searchQueryValue, page);
}

async function renderContains(value, page) {
  const { hits, totalHits } = await fetchImages(value, page);
  checkTotalPages(totalHits);

  try {
    if (totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    if (page >= totalPage) {
      loadMoreBtnEl.style.display = 'none';
      Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    } else if (page === 1) {
      Notify.info(`Hooray! We found ${totalHits} images.`);
    }
    wrapperEl.insertAdjacentHTML('beforeend', generateContentList(hits));
  } catch (error) {
    console.log(error);
  }
}

function checkTotalPages(totalHits) {
  totalPage = Math.ceil(totalHits / 40);
}

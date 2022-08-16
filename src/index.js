import './css/style.css';
import fetchImages from './js/serviceApi';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { generateContentList } from './js/markupList';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

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
  searchQueryValue = e.currentTarget.elements.searchQuery.value.trim();
  if (!searchQueryValue) {
    return;
  }
  page = 1;
  loadMoreBtnEl.style.display = 'block';
  wrapperEl.innerHTML = '';
  renderContainer(searchQueryValue, page);
}

function onLoadMore() {
  page += 1;
  renderContainer(searchQueryValue, page);
}

async function renderContainer(value, page) {
  const { hits, totalHits } = await fetchImages(value, page);
  checkTotalPages(totalHits);
  addEventListener('scroll', scroll);
  try {
    wrapperEl.insertAdjacentHTML('beforeend', generateContentList(hits));
    lightbox.refresh();
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
  } catch (error) {
    console.log(error);
  }
}

function checkTotalPages(totalHits) {
  totalPage = Math.ceil(totalHits / 40);
}

function scroll() {
  const contentHeight = wrapperEl.offsetHeight - 500;
  const yOffset = window.pageYOffset;
  const intViewportHeight = window.innerHeight;
  const yEl = yOffset + intViewportHeight;

  if (yEl >= contentHeight) {
    page += 1;

    // if (page >= totalPage) {
    //   Notify.warning(
    //     "We're sorry, but you've reached the end of search results."
    //   );
    //   return;
    // }

    removeEventListener('scroll', scroll);
    renderContainer(searchQueryValue, page);
  }
}

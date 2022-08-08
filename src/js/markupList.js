function createList(acc, imageCard) {
  return (
    acc +
    `<div class="photo-card">
  <img src="${imageCard.webformatURL}" alt="${imageCard.tags}" loading="lazy" class="img"/>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${imageCard.likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${imageCard.views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${imageCard.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${imageCard.downloads}
    </p>
  </div>
</div>`
  );
}

function generateContentList(array) {
  return array.reduce(createList, '');
}

export { generateContentList };

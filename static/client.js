const currentUrl = window.location.pathname;
const errorBlockElement = document.getElementById('error-block');
const url = `/api${currentUrl}`;
generateBtn.addEventListener('click', () => {
  const body = {
    data: Array.from(state.imageData.data),
  };

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      imageDataToImg(data);
    })
    .catch(() => {
      errorBlockElement.innerHTML = 'Error happened';
    });
});

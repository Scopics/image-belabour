const currentUrl = window.location.pathname;
const errorBlockElement = document.getElementById('error-block');
const url = `/api${currentUrl}`;
generateBtn.addEventListener('click', async () => {
  const body = {
    data: Array.from(state.imageData.data),
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const imageData = await response.json();
    imageDataToImg(imageData);
  } catch (e) {
    errorBlockElement.innerHTML = 'Error happened';
  }
});

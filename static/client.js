const currentUrl = window.location.pathname;
const url = `/api${currentUrl}`;
generateBtn.addEventListener('click', (e) => {
  console.log(url);
  console.log(imageData);
  const data = { imageData };
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => {
    console.log(res);
  });
})

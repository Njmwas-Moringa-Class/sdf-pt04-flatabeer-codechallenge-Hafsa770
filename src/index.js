let status = false;

function beerRender(beer) {
  console.log("render beer " + beer.id);
  console.log('---------------------------------');

  const beerName = document.querySelector('#beer-name');
  const beerImage = document.querySelector('#beer-image');
  const beerDescription = document.querySelector('#beer-description');
  const beerDescriptionForm = document.querySelector('#description-form');
  const beerEditDescription = document.querySelector('#description');
  beerDescriptionForm.reset();

  const beerReviewList = document.querySelector('#review-list');
  while (beerReviewList.firstElementChild) {
    beerReviewList.removeChild(beerReviewList.lastElementChild);
  };

  const beerReviewForm = document.querySelector('#review-form');
  const beerReviewText = document.querySelector('#review');

  beerName.textContent = beer.name;
  beerImage.src = beer.image_url;
  beerDescription.textContent = beer.description;
  beerEditDescription.value = beer.description;

  for (let review of beer.reviews) {
    let beerReview = document.createElement('li');
    beerReview.textContent = review;
    beerReviewList.appendChild(beerReview);
  }

  if (status) {
    beerDescriptionForm.removeEventListener('submit', updateDescription, false);
    status = !status;
  } else {
    beerDescriptionForm.addEventListener('submit', updateDescription, false);
    status = !status;
  }

  function updateDescription(env) {
    env.preventDefault();
    beer.description = beerEditDescription.value;
    patchBeer(beer);
  }

  beerReviewForm.addEventListener('submit', (env) => {
    env.preventDefault();
    if (beerReviewText.value !== '') {
      beer.reviews.push(beerReviewText.value);
      patchBeer(beer);
    } else {
      alert('Please add a review!');
    }
  });
}

function patchBeer(beer) {
  console.log(beer, beer.id);
  fetch(`http://localhost:3000/beers/${beer.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(beer)
  })
    .then(response => response.json())
    .then(data => beerRender(data))
    .catch(err => console.log(`Error: ${err}`));
}

function postBeer(beer) {
  fetch('http://localhost:3000/beers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(beer)
  })
    .then(reponse => response.json())
    .then(data => beerRender(data))
    .catch(err => console.log(`Error: ${err}`));
}

function fetchData(beer = null) {
  let baseURL = 'http://localhost:3000/beers/';
  return new Promise((resolve, reject) => {
    let url = beer == null ? baseURL : `${baseURL + beer}`;
    fetch(url)
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(err => console.log(`Error: ${err}`));
  });
}

function navRender(beers) {
  const navBeerList = document.querySelector('#beer-list');
  while (navBeerList.firstElementChild) {
    navBeerList.removeChild(navBeerList.lastElementChild);
  }

  beers.forEach(beer => {
    const navElement = document.createElement('li');
    navElement.textContent = beer.name;
    navElement.setAttribute('index', beer.id);
    navBeerList.append(navElement);

    navElement.addEventListener('click', (env) => {
      fetchData(env.target.getAttribute('index'))
        .then(beer => {
          console.log("from fetch-> beer id " + beer.id);
          beerRender(beer);
        });
    }, false);
  });
}

function init() {
  fetchData()
    .then(beers => navRender(beers));

  fetchData(1)
    .then(beers => beerRender(beers));
}

init();

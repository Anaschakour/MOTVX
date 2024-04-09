const global = {
  API_URL: "https://api.themoviedb.org/3/",
  LANG_URL: "?language=en-US&page=1",
  BASEIMAGE_URL: {
    poster: "https://image.tmdb.org/t/p/w500",
    original: "https://image.tmdb.org/t/p/original",
  },
  GETpopularEndPoint: "movie/popular?language=en-US&page=1",
  GETMovieIdEndpPoint: "movie/",
  GetTvShowPopularEndPoint: "tv/popular?language=en-US&page=1",
  GetTvShowIdEndPoint: "tv/",
  GetResultsEndPoint: "search/",
  GetNowPlayingMoviesEndpoint: "movie/now_playing",
  GetAUth: {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZWNkYTM4MWI0MzkwYTU1NzQyODY3Nzc0ZmI4MWJlMSIsInN1YiI6IjY2MGU3ZTA1MzNhMzc2MDE2NDgyNjYzOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KdUUH2C_7xi_1r3k3YkhleojOEKZoRyRgNIuun18fJg",
    },
  },
  actualPath: location.pathname,
  searchType: "",
  searchTerm: "",
  actualSearchPage: "",
  numberSearchPages: "",
};
const containers = {
  popularMovieContainer: document.getElementById("popularMoviesSection"),
  movieDetailsContainer: document.getElementById("movieDetailsContainer"),
  popularTvSection: document.getElementById("popularTvSection"),
  TvDetailsContainer: document.getElementById("TvDetailsContainer"),
  menu: document.querySelectorAll(".menu"),
  searchForm: document.querySelector(".searchForm"),
  searchedSection: document.querySelector("#searchedSection"),
  swiperWrapper: document.querySelector(".swiper-wrapper"),
};

// FUNCTIONS
function menuSetBackground(menu) {
  menu.forEach((link) => {
    if (global.actualPath === "/index.html" || global.actualPath === "/") {
      document.querySelector(".moviesLink").style.color = "yellow";
      document.querySelector(".tvShowLink").style.color = "#fff";
    } else if (global.actualPath === "/tvShow.html") {
      document.querySelector(".tvShowLink").style.color = "yellow";
      document.querySelector(".moviesLink").style.color = "#fff";
    }
  });
}
//global function to get any query from web api
async function getApiQuery(api_url, endpoint, auth) {
  console.log(api_url + endpoint);
  const res = await fetch(api_url + endpoint, auth);
  const data = await res.json();
  return data;
}

//get movie or tv show by id
async function getResultById(api_url, endpoint, auth) {
  try {
    const MovieId = new URLSearchParams(location.search).get("data_id");
    const results = await getApiQuery(api_url, `${endpoint}${MovieId}`, auth);
    if (getApiQuery.ok) {
      throw new Error("netwrok error");
    }
    if ("title" in results) {
      addSearchedMovieDOM(results);
    } else {
      addSearchedTvDOM(results);
    }
  } catch (error) {
    console.log(error);
  }
}

//get popular movies
async function getPopularMovies(api_url, endpoint, auth) {
  getApiQuery(api_url, endpoint, auth).then((data) => {
    data.results.forEach((movie) => {
      addPopularMoviesDOM(movie);
    });
  });
}

//get popular tv shows
async function getPopulartvShow(api_url, endpoint, auth) {
  getApiQuery(api_url, endpoint, auth).then((data) => {
    data.results.forEach((tv) => {
      addPopularTvDOM(tv);
    });
  });
}

//add popular movies to the DOM
function addPopularMoviesDOM(movie) {
  const div = document.createElement("DIV");
  div.setAttribute("data-id", movie.id);
  div.innerHTML = `<a class="popularMovie" href="/movieDetails.html?data_id=${
    movie.id
  }">
    <div class="imgContainer">
          <img class="posterImg" src="${
            global.BASEIMAGE_URL.poster + movie.poster_path
          }" alt="${movie.title}" />
     </div>
        <div class="movieInfoWrapper">
        <p class="movieTitle">${movie.title}</p>
        <small class="movieRelease">${movie.release_date}</small>
        </div>
         </a>`;
  containers.popularMovieContainer.appendChild(div);
}

// add popular tv show to the DOM
function addPopularTvDOM(tvShow) {
  const div = document.createElement("DIV");
  div.setAttribute("data-id", tvShow.id);
  div.innerHTML = `<a class="popularMovie" href="/showDetails.html?data_id=${
    tvShow.id
  }">
    <div class="imgContainer">
          <img class="posterImg" src="${
            global.BASEIMAGE_URL.poster + tvShow.poster_path
          }" alt="${tvShow.name}" />
     </div>
        <div class="movieInfoWrapper">
        <p class="movieTitle">${tvShow.name}</p>
        <small class="movieRelease">${tvShow.first_air_date}</small>
        </div>
         </a>`;
  containers.popularTvSection.appendChild(div);
}

//add searched movie by id to the DOM
function addSearchedMovieDOM(movie) {
  //background for the movie
  const overlayBackground = document.createElement("DIV");
  overlayBackground.classList.add("detailsBackgroundOverlay");
  overlayBackground.style.backgroundImage = `url(${
    global.BASEIMAGE_URL.original + movie.backdrop_path
  })`;
  containers.movieDetailsContainer.appendChild(overlayBackground);
  const div = document.createElement("DIV");
  div.classList.add("InfoAnadImage");
  div.innerHTML = `
  <a class="backBtn" href="index.html">Back to Movies</a>
      <div class="initialDetailsWrapper">
        <img src="${global.BASEIMAGE_URL.poster + movie.poster_path}" alt="${
    movie.title
  }" />
        <div class="initialInfo">
  <h2 class="movieTiltle">${movie.title}</h2>
          <span>&#x2B50; ${movie.vote_average.toFixed(1)}/10</span>
          <small>release date: ${movie.release_date}</small>
          <p class="overview">
          ${movie.overview}
          </p>
          <ul class="genres">
            <strong class="genresTitle">Genre:</strong>
          ${movie.genres.map((genre) => `<li>${genre.name}<li/>`).join("")}
          </ul>
           <div class="moreDetailsWrapper">
        <h3 class="moreInfo">MORE INFO</h3>
        <small class="moreInfoDescription"><span class="moreInfoTitles">Budget:</span> $${
          movie.budget
        }</small>
        <small class="moreInfoDescription"><span class="moreInfoTitles">Revenue:</span> $${
          movie.revenue
        }</small>
        <small class="moreInfoDescription"><span class="moreInfoTitles">Runtime:</span> ${
          movie.runtime
        } minutes</small>
        <small class="moreInfoDescription"><span class="moreInfoTitles">Status:</span> ${
          movie.status
        }</small>
      </div>
        </div>
      </div>
     
  `;
  containers.movieDetailsContainer.appendChild(div);

  /*  <div class="movieDetailsContainer">
      
    </div>*/
}
//279*419
//add searched tv show by id to the DOM
function addSearchedTvDOM(tvShow) {
  //background for the movie
  const overlayBackground = document.createElement("DIV");
  overlayBackground.classList.add("detailsBackgroundOverlay");
  overlayBackground.style.backgroundImage = `url(${
    global.BASEIMAGE_URL.original + tvShow.backdrop_path
  })`;
  containers.TvDetailsContainer.appendChild(overlayBackground);
  const div = document.createElement("DIV");
  div.classList.add("InfoAnadImage");
  div.innerHTML = `
  <a class="backBtn" href="tvShow.html">Back to Tv Show</a>
      <div class="initialDetailsWrapper">
        <img src="${global.BASEIMAGE_URL.poster + tvShow.poster_path}" alt="${
    tvShow.name
  }" />
        <div class="initialInfo">
  <h2 class="movieTiltle">${tvShow.name}</h2>
          <span>&#x2B50; ${tvShow.vote_average.toFixed(1)}/10</span>
          <small>release date: ${tvShow.first_air_date}</small>
          <p class="overview">
          ${tvShow.overview}
          </p>
          <ul class="genres">
            <strong class="genresTitle">Genre:</strong>
          ${tvShow.genres.map((genre) => `<li>${genre.name}<li/>`).join("")}
          </ul>
           <div class="moreDetailsWrapper">
        <h3 class="moreInfo">MORE INFO</h3>
        <small class="moreInfoDescription"><span class="moreInfoTitles">Number of Episodes:</span> ${
          tvShow.episode_run_time
        }</small>
        <small class="moreInfoDescription"><span class="moreInfoTitles">Last episode to Air:</span> ${
          tvShow.last_episode_to_air.name
        }</small>
        <small class="moreInfoDescription"><span class="moreInfoTitles">Status:</span> ${
          tvShow.status
        }</small>
      </div>
        </div>
      </div>
     
  `;
  containers.TvDetailsContainer.appendChild(div);

  /*  <div class="movieDetailsContainer">
      
    </div>*/
}

//search function

async function search() {
  global.searchType = new URLSearchParams(location.search).get("type");
  global.searchTerm = new URLSearchParams(location.search).get("search_term");
  const apiKey = global.API_URL;
  const endpoint =
    global.GetResultsEndPoint +
    global.searchType +
    "?query=" +
    global.searchTerm +
    "&language=en-US&page=1";
  console.log(apiKey + endpoint);
  fetch(apiKey + endpoint, global.GetAUth)
    .then((res) => res.json())
    .then((data) => console.log(data));
  const data = await getApiQuery(global.API_URL, endpoint, global.GetAUth);
  console.log(data.results);
  addSearchedToDOM(data.results);
}

//add searched movies or tv shows on the DOM
function addSearchedToDOM(results) {
  results.forEach((result) => {
    const div = document.createElement("DIV");
    div.setAttribute("data-id", result.id);
    div.innerHTML = `<a class="searchedItem" href="/${
      global.searchType === "movie" ? "movie" : "show"
    }Details.html?data_id=${result.id}">
    <div class="imgContainer">
          <img class="posterImg" src="${
            global.BASEIMAGE_URL.poster + result.poster_path
          }" alt="${
      global.searchType === "movie" ? result.title : result.name
    }" />
     </div>
        <div class="resultsInfoWrapper">
        <p class="movieTitle">${
          global.searchType === "movie" ? result.title : result.name
        }</p>
        <small class="movieRelease">${
          global.searchType === "tv"
            ? result.first_air_date
            : result.release_date
        }</small>
        </div>
         </a>`;
    document.getElementById("searchedSection").appendChild(div);
  });
}

// get now playing movies
async function getNowPlyingMovies(apiUrl, endpoint, auth) {
  const { results } = await getApiQuery(apiUrl, endpoint, auth);
  console.log(results);
  results.forEach((movie) => addnowPlyingMoviesDOM(movie));
  swiperInit();
}

//swiper init()
function swiperInit() {
  const swiper = new Swiper(".swiper", {
    effect: "creative",
    creativeEffect: {
      prev: {
        // will set `translateZ(-400px)` on previous slides
        translate: [0, 0, -400],
      },
      next: {
        // will set `translateX(100%)` on next slides
        translate: ["100%", 0, 0],
      },
    },
    // Default parameters
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    speed: 200,

    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    // Responsive breakpoints
    breakpoints: {
      // when window width is >= 400px
      400: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      // when window width is >= 700px
      700: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      // when window width is >= 1200px
      1200: {
        slidesPerView: 5,
        spaceBetween: 20,
      },
    },
    // Optional parameters
  });
  setInterval(() => {
    swiper.slideNext();
  }, 2000);
}
//add now plying movies to the DOM
function addnowPlyingMoviesDOM(movie) {
  const div = document.createElement("DIV");
  div.className = "swiper-slide";

  div.innerHTML = `<a class="nowPlyingMovie" href="/movieDetails.html?data_id=${
    movie.id
  }">
    <div class="ImgContainer">
          <img class="posterImg" src="${
            global.BASEIMAGE_URL.poster + movie.poster_path
          }" alt="${movie.title}" />
     </div>
        <div class="movieInfoWrapper">
        <p class="movieTitle average-centered">&#x2B50; ${movie.vote_average.toFixed(
          1
        )}/10</p>
        </div>
         </a>`;
  containers.swiperWrapper.appendChild(div);
}

// website router
function router() {
  menuSetBackground(containers.menu);
  switch (global.actualPath) {
    case "/index.html":
    case "/#":
      getPopularMovies(
        global.API_URL,
        global.GETpopularEndPoint,
        global.GetAUth
      );
      getNowPlyingMovies(
        global.API_URL,
        global.GetNowPlayingMoviesEndpoint,
        global.GetAUth
      );
      break;
    case "/movieDetails.html":
      getResultById(global.API_URL, global.GETMovieIdEndpPoint, global.GetAUth);
      break;
    case "/tvShow.html":
      getPopulartvShow(
        global.API_URL,
        global.GetTvShowPopularEndPoint,
        global.GetAUth
      );

      break;
    case "/showDetails.html":
      getResultById(global.API_URL, global.GetTvShowIdEndPoint, global.GetAUth);
      break;
    case "/search.html":
      search();
      break;
  }
}
function submitFormOnClick() {
  containers.searchForm.submit(global.searchType, global.searchTerm);
}
//EventListeners
document.addEventListener("DOMContentLoaded", router());
document.getElementById("searchBtn").addEventListener("click", () => {
  const inputField = document.getElementById("search_input");
  if (inputField.value.trim() === "") {
  } else {
    submitFormOnClick();
  }
});

// c37e1619
const movieList = document.getElementById("movie-list")
const searchValue = document.getElementById("movie-input")
const searchBtn = document.getElementById("search-button")
const addMovieBtn = document.getElementById("add-movie-btn")
const watchListBtn = document.getElementById("your-watchlist")

let watchList = JSON.parse(localStorage.getItem("watchlist")) || [];


let movieTitles = []
let onWatchList = false

searchBtn.addEventListener("click", async function() {
    await fetch(`https://www.omdbapi.com/?s=${searchValue.value}&page=1&apikey=c37e1619`)
    .then(res => res.json())
    .then(data => {
        data.Search.forEach(movie => {
            if (!movieTitles.includes(movie.Title) && movie.Poster !== "N/A") {
                movieTitles.push(movie.Title);
            }
        });
        console.log(movieTitles)
    });

    onWatchList = false
    movieList.innerHTML = ""

    for (const title of movieTitles) {
        await fetch(`https://www.omdbapi.com/?apikey=c37e1619&t=${title}&type=movie`)
            .then(res => res.json())
            .then(data => {
                if (data.Poster && data.Poster !== "N/A") { // Only show movies with valid posters
                    if (watchList.includes(data.imdbID)) {
                        movieList.innerHTML += `
                            <div class="movie-item">
                                <div class="movie-poster">
                                    <img src="${data.Poster}" alt="Movie Poster">
                                </div>
                                <div class="movie-details">
                                    <h2>${data.Title} <span class="rating-text">⭐ ${data.imdbRating}</span></h2>
                                    <p class="runtime">${data.Runtime} <span class="genres">${data.Genre}</span> <img src="images/remove.png" class="remove-movie-btn" role="button" data-id="${data.imdbID}"></p>
                                    <p class="plot">${data.Plot}</p>
                                </div>
                            </div>`                        
                    } else {
                        movieList.innerHTML += `
                            <div class="movie-item">
                                <div class="movie-poster">
                                    <img src="${data.Poster}" alt="Movie Poster">
                                </div>
                                <div class="movie-details">
                                    <h2>${data.Title} <span class="rating-text">⭐ ${data.imdbRating}</span></h2>
                                    <p class="runtime">${data.Runtime} <span class="genres">${data.Genre}</span> <img src="images/add.png" class="add-movie-btn" role="button" data-id="${data.imdbID}"></p>
                                    <p class="plot">${data.Plot}</p>
                                </div>
                            </div>`
                    }

                }
            })
    }

    searchValue.value = ""
    movieTitles = []
})

let runClick = false

if (!runClick) {
    document.addEventListener("click", (e) => {
    // Only fire if the clicked element has the .add-movie-btn class
    if (e.target.classList.contains("remove-movie-btn")) {
        e.stopImmediatePropagation();
        const imdbID = e.target.dataset.id;
        console.log("Clicked movie ID:", imdbID);
        watchList = watchList.filter(id => id !== imdbID); // Remove the movie ID from the watchlist
        e.target.classList.remove("remove-movie-btn");
        e.target.classList.add("add-movie-btn");
        e.target.src = "images/add.png"; // Change icon to remove

        if (onWatchList) {
            displayWatchlist();
        }
        localStorage.setItem("watchlist", JSON.stringify(watchList));
        return;
    }
    });

    document.addEventListener("click", (e) => {
    // Only fire if the clicked element has the .add-movie-btn class
    if (e.target.classList.contains("add-movie-btn")) {
        e.stopImmediatePropagation();
        const imdbID = e.target.dataset.id;
        console.log("Clicked movie ID:", imdbID);
        watchList.push(imdbID);
        localStorage.setItem("watchlist", JSON.stringify(watchList));
        e.target.classList.remove("add-movie-btn");
        e.target.classList.add("remove-movie-btn");
        e.target.src = "images/remove.png"; // Change icon to remove
        return;
    }
    });

    document.addEventListener("click", async (e) => {
        if (e.target.id === "your-watchlist") {
            e.stopImmediatePropagation();
            onWatchList = true
            await displayWatchlist()
            return;
        }
    })
}

async function displayWatchlist() {
        movieList.innerHTML = ""
        
        for (let movieId of watchList) {
            await fetch (`https://www.omdbapi.com/?apikey=c37e1619&i=${movieId}`)
            .then (res => res.json())
            .then (data => {
                movieList.innerHTML += `
                            <div class="movie-item">
                                <div class="movie-poster">
                                    <img src="${data.Poster}" alt="Movie Poster">
                                </div>
                                <div class="movie-details">
                                    <h2>${data.Title} <span class="rating-text">⭐ ${data.imdbRating}</span></h2>
                                    <p class="runtime">${data.Runtime} <span class="genres">${data.Genre}</span> <img src="images/remove.png" class="remove-movie-btn" role="button" data-id="${data.imdbID}"></p>
                                    <p class="plot">${data.Plot}</p>
                                </div>
                            </div>`
            })
        }
}










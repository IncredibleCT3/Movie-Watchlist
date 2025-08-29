    let movieTitles = []
    
    fetch(`http://www.omdbapi.com/?t=Crossing Jordan&apikey=c37e1619`)
    .then(res => res.json())
    .then(data => {
        console.log(data)
    }); 
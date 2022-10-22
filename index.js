async function fetchDataJSON() {
    const response = await fetch('streamingHistory.json')
    const spotifyData = await response.json();
    return spotifyData;
}

let groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

function sumTimePlayed(arr) {
    return arr.reduce((accumulator, songData) => {
        return accumulator + songData.msPlayed;
      }, 0);
}

function pageOnload() {
    fetchDataJSON()
    .then(jsonDataArray=>{
        return groupBy(jsonDataArray,'artistName')
    })
    .then((groupedData=>{
        const spotifyArtistByTime = [];
        Object.entries(groupedData).forEach(keyValuePair => {
            spotifyArtistByTime.push({
                artistName: keyValuePair[0],
                songQuantity: keyValuePair[1].length,
                msPlayed: sumTimePlayed(keyValuePair[1])  
            })
        });
        spotifyArtistByTime.sort((artistData1, artistData2) => (artistData1.msPlayed < artistData2.msPlayed) ? 1 : -1)
        console.log(spotifyArtistByTime);
    }));
}


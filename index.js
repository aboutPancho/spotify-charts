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

function millisToMinutes(millis) {
    var minutes = Math.floor(millis / 60000);
    //TODO: Find a way to incorporate seconds as decimal part of the minute (?)
    //var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes;
}

/*PUNTO DE ENTRADA*/
function pageOnload() {
    fetchDataJSON()
    .then(jsonDataArray=>{
        return groupBy(jsonDataArray,'artistName')
    })  
    .then((groupedData=>{
        const spotifyArtistByTime = [];
        Object.entries(groupedData).forEach(keyValuePair => {
            let tempSumTimePlayed = sumTimePlayed(keyValuePair[1]);
            spotifyArtistByTime.push({
                artistName: keyValuePair[0],
                songQty: keyValuePair[1].length,
                msPlayed: tempSumTimePlayed,
                minsPlayed: millisToMinutes(tempSumTimePlayed)  
            })
        });
        spotifyArtistByTime.sort((artistData1, artistData2) => (artistData1.msPlayed < artistData2.msPlayed) ? 1 : -1)
        console.log(spotifyArtistByTime);
        generateFirstChart('firstGraphicContainer','Time played',spotifyArtistByTime.slice(0,10));
    }));
}

function getAttributesFromArray(arrayData, attributeName) {
    let labelArray = [];
    arrayData.forEach(element=>labelArray.push(element[attributeName]))
    return labelArray;
}

function getDataFromArray(arrayData) {
    let labelArray = [];
    arrayData.forEach(element=>labelArray.push({
        x: element['minsPlayed'],
        y: element['songQty'],
    }))
    return labelArray;
}

function generateFirstChart(elementId,chartLable,topFiveSpotifyData) {
    const labels = getAttributesFromArray(topFiveSpotifyData,'artistName');
    const data = {
        labels: labels,
        datasets: [{ 
          label: chartLable,
          backgroundColor: [
            '#F79256',
            '#7D98A1',
            '#EEF1EF'
        ],
          data: getDataFromArray(topFiveSpotifyData),
        }]
      };
    
      const config = {
        type: 'bar',
        data: data,
        options: {
            indexAxis: 'y',
            plugins: {
            legend: {
                display:false,
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        console.log(context);
                        label = `${context.parsed.x} mins over ${context.raw.y} songs.`;
                        return label;
                    }
                }
            }
        }
        
        }
      };

      const myChart = new Chart(
        document.getElementById(elementId),
        config
      );
}
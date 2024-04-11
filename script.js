let url = 'https://api-us-west-2.hygraph.com/v2/cltnjyce406ze07v0wktr3jh3/master';
    let logosData = []; // To store all logos data
    
    document.addEventListener("DOMContentLoaded", function () {
        // Fetch logos data
        fetchLogosData();

        // Add event listener to search button
        document.getElementById('searchBtn').addEventListener('click', searchLogos);
    });

    function fetchLogosData() {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `query LogosItems {
                assets(first: 100) {
                    id
                    size
                    fileName
                    mimeType
                    locale
                    url
                    }
                }
                `
            })
        })
        .then(res => res.json())
        .then(data => {
            logosData = data.data.assets;
            displayLogos(logosData);
        })
        .catch(error => {
            console.error('Error fetching logos:', error);
        });
    }

    function searchLogos() {
        const searchInput = document.getElementById('searchInput').value.toLowerCase();
        const filteredLogos = logosData.filter(logo => logo.fileName.toLowerCase().includes(searchInput));
        displayLogos(filteredLogos);
    }

    function displayLogos(logos) {
        const app = document.getElementById('app');
        app.innerHTML = ''; // Clear previous logos
        
        logos.forEach(logo => {
            app.innerHTML += `<div class="col-md-2">
                <div class="cards-logo">
                    <div class="col-img"><img src="${logo.url}" alt="${logo.fileName}"/></div>
                    <a href="#" onclick="downloadFunction('${logo.url}', '${logo.fileName}')"><div class="button-download">download</div></a>
                </div>
                </div>`;
        });
    }

    function downloadFunction(url, fileName) {
        fetch(url)
            .then(res => res.blob())
            .then(blob => {
                const a = document.createElement('a');
                const objectURL = URL.createObjectURL(blob);
                a.href = objectURL;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

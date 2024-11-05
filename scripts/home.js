function getQueryParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const regex = /([^&=]+)=([^&]*)/g;
    let match;

    while (match = regex.exec(queryString)) {
        params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
    }
    return params;
}

function loadPosts() {
    // Extract the username from the URL
    const params = getQueryParams();
    const username = params.username; // Use the username from the URL

    // Check if username is available
    if (!username) {
        console.error("No username found in URL");
        return; // Exit the function if username is not found
    }

    fetch(`https://higap.onrender.com/your_posts?username=${username}&page=${currentPage}`)
        .then(response => {
            console.log('Posts response:', response);
            return response.json();
        })
        .then(posts => {
            console.log('Parsed posts:', posts); // Debugging output
            if (posts.length) {
                posts.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.className = 'post';

                    const titleElement = document.createElement('h3');
                    titleElement.innerText = post.Title; // Assuming post.Title is correct
                    titleElement.classList.add('post-title');
                    postElement.appendChild(titleElement);

                    // Create a container for date and poster
                    const infoContainer = document.createElement('p');
                    infoContainer.classList.add('post-info');

                    const userElement = document.createElement('span');
                    userElement.innerText = `Posted by: ${post.poster}`;
                    userElement.classList.add('post-user');

                    const dateElement = document.createElement('span');
                    dateElement.innerText = ` | Date: ${post.date}`;
                    dateElement.classList.add('post-date');

                    infoContainer.appendChild(userElement);
                    infoContainer.appendChild(dateElement);
                    postElement.appendChild(infoContainer);

                    const contentElement = document.createElement('p');
                    contentElement.innerText = post.post; // Assuming post.post is correct
                    contentElement.classList.add('post-content');
                    contentElement.style.display = 'none';
                    postElement.appendChild(contentElement);

                    titleElement.addEventListener('click', () => {
                        contentElement.style.display = contentElement.style.display === 'none' ? 'block' : 'none';
                    });

                    document.getElementById('posts-container').appendChild(postElement);
                });

                currentPage++;
                document.getElementById('load-more').style.display = 'block';
            } else {
                document.getElementById('load-more').style.display = 'none';
            }
        })
        .catch(error => console.error("Error loading posts:", error));
}

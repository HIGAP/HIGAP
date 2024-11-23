document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username'); // Get the username from the URL
    const navButtonsContainer = document.getElementById('nav-buttons');

    if (username) {
        // If the username exists in the URL, display the username and "Post Your Problem" button
        navButtonsContainer.innerHTML = `
            <span class="username">${username}</span>
            <button class="post-problem-btn" onclick="postProblem()">Post Your Problem</button>
        `;
    } else {
        // Otherwise, show the Login and Sign In buttons
        navButtonsContainer.innerHTML = `
            <button onclick="callLogRoute()">Login</button>
            <button onclick="callSignRoute()">Sign In</button>
        `;
    }
});

async function postProblem() {
    const username = new URLSearchParams(window.location.search).get('username');
    if (username) {
        window.location.href = `https://higap.onrender.com/post_problem.html?username=${username}`;
    } else {
        console.error("No username found.");
    }
}
function loadPosts() {
    const username = loggedInUsername; // Use the logged-in username variable

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
                    titleElement.innerText = post.Title; // Change to post.Title
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
                    contentElement.innerText = post.post; // Change to post.post
                    contentElement.classList.add('post-content');
                    contentElement.style.display = 'none';
                    postElement.appendChild(contentElement);

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






async function callLogRoute() {
    try {
        console.log("callLogRoute function triggered"); 
        const response = await fetch('https://higap.onrender.com/log', {
            method: 'GET',
            headers: {
                'Content-Type': 'text/html'
            },
            credentials: 'include'  // Include credentials if needed for authentication
        });

        if (response.ok) {
            // If the response is successful, redirect the user to the login page
            window.location.href = response.url;
        } else {
            console.error('Failed to load the log route.');
        }
    } catch (error) {
        console.error('Error calling /log route:', error);
    }
}
async function callSignRoute() {
    try {
        console.log("callSignRoute function triggered"); 
        const response = await fetch('https://higap.onrender.com/sign', {
            method: 'GET',
            headers: {
                'Content-Type': 'text/html'
            },
            credentials: 'include'  // Include credentials if needed for authentication
        });

        if (response.ok) {
            // If the response is successful, redirect the user to the login page
            window.location.href = response.url;
        } else {
            console.error('Failed to load the sign route.');
        }
    } catch (error) {
        console.error('Error calling /sign route:', error);
    }
}

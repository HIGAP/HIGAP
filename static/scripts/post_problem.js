function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Get username from URL query parameter and set it in the username display
const username = getQueryParam('username') || 'guest';
document.querySelector('.username-display').textContent = username;

let loggedInUsername = username; // Set the logged in username from the URL parameter
// Toggle dropdown visibility
function toggleDropdown() {
    const dropdown = document.getElementById('dropdown');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
}

// Close dropdown if user clicks outside of it
window.addEventListener('click', (event) => {
    if (!event.target.closest('.username-display')) {
        const dropdown = document.getElementById('dropdown');
        if (dropdown) dropdown.style.display = 'none';
    }
});

// Theme toggle function
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
}

let currentPage = 1;

function loadPosts() {
    const username = loggedInUsername; // Use the logged-in username variable

    fetch(`https://higap.onrender.com/your_posts?username=${username}&page=${currentPage}`)
        .then(response => response.json())
        .then(posts => {
            if (posts.length) {
                posts.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.className = 'post';

                    // Add post title, user info, and content
                    const titleElement = document.createElement('h3');
                    titleElement.innerText = post.Title;
                    postElement.appendChild(titleElement);

                    const userElement = document.createElement('p');
                    userElement.innerText = `Posted by: ${post.poster} on ${post.date}`;
                    postElement.appendChild(userElement);

                    const contentElement = document.createElement('p');
                    contentElement.innerText = post.post;
                    postElement.appendChild(contentElement);

                    // Options button (three dots) with dropdown menu
                    const optionsButton = document.createElement('button');
                    optionsButton.className = 'options-button';
                    optionsButton.innerHTML = '⋮';

                    // Dropdown menu
                    const dropdownMenu = document.createElement('div');
                    dropdownMenu.className = 'dropdown-menu';
                    dropdownMenu.style.display = 'none';

                    const viewButton = document.createElement('button');
                    viewButton.className = 'view-button';
                    viewButton.innerText = 'View Post';
                    viewButton.addEventListener('click', () => window.open(`view_post.html?id=${post.id}`, '_blank'));
                    dropdownMenu.appendChild(viewButton);


                    // Edit button in dropdown
                    const editButton = document.createElement('button');
                    editButton.className = 'edit-button';
                    editButton.innerText = 'Edit Post';
                    editButton.addEventListener('click', () => editPost(post.id, post.Title, post.post));
                    dropdownMenu.appendChild(editButton);

                    // Delete button in dropdown
                    const deleteButton = document.createElement('button');
                    deleteButton.className = 'delete-button';
                    deleteButton.innerText = 'Delete Post';
                    deleteButton.addEventListener('click', () => deletePost(post.id));
                    dropdownMenu.appendChild(deleteButton);


                    // Append options button and dropdown to post element
                    postElement.appendChild(optionsButton);
                    postElement.appendChild(dropdownMenu);

                    // Toggle dropdown visibility on button click
                    optionsButton.addEventListener('click', () => {
                        dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
                    });

                    document.getElementById('posts-container').appendChild(postElement);
                });

                currentPage++;
            }
        })
        .catch(error => console.error("Error loading posts:", error));
}
// Toggle dropdown menu
function toggleOptions(postElement) {
    const dropdown = postElement.querySelector('.dropdown-menu');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// Form submission for creating posts
document.getElementById('postForm')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    fetch('https://higap.onrender.com/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ title: title, username: loggedInUsername, content: content }) // Use loggedInUsername
    })
    .then(response => {
        console.log('Post submission response:', response);
        return response.json();
    })
    .then(data => {
        console.log('Post submission data:', data);
        if (data.status === 'success') {
            alert('Post submitted successfully!');
            document.getElementById('postForm').reset();
            loadPosts(); // Fixed the casing here
        } else {
            alert('Error submitting post: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error submitting post:', error);
        alert('An error occurred. Please try again.');
    });
});


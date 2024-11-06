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

    fetch(`http://127.0.0.1:5000/your_posts?username=${username}&page=${currentPage}`)
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

    fetch('http://127.0.0.1:5000/post', {
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

// Logout function
function logout() {
    fetch('http://127.0.0.1:5000/logout', {
        method: 'POST',
        credentials: 'include', // Include session cookies in the request
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('Logout response:', response);
        return response.json();
    })
    .then(data => {
        console.log('Logout data:', data);
        if (data.message === "Logged out successfully") {
            alert('Logged out successfully!');
            window.location.href = '/login'; // Redirect to login page after logout
        } else {
            alert('Error logging out: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error during logout:', error);
        alert('An error occurred during logout. Please try again.');
    });
}

// Initialize post loading and load more button
document.getElementById('load-more')?.addEventListener('click', loadPosts);
loadPosts();
document.getElementById('share-button').addEventListener('click', function () {
    const url = "http://localhost:63342/sharet/post_problem.html?username=guest";

    // Copy URL to clipboard
    navigator.clipboard.writeText(url).then(() => {
        // Show the message
        const messageElement = document.getElementById('share-message');
        messageElement.style.display = 'block';
        messageElement.style.opacity = 1; // Ensure it's visible

        // Fade out the message after 2 seconds
        setTimeout(() => {
            messageElement.style.opacity = 0; // Start fading
            setTimeout(() => {
                messageElement.style.display = 'none'; // Hide after fade
            }, 2000); // Time for fade effect
        }, 2000); // Show message for 2 seconds
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
});
function deletePost(postId) {
    fetch(`http://127.0.0.1:5000/delete_post`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: postId })
    })
    .then(response => {
        if (response.ok) {
            alert("Post deleted successfully!");
            location.reload(); // Reload page to update the posts
        } else {
            alert("Failed to delete post.");
        }
    })
    .catch(error => console.error("Error deleting post:", error));
}
function editPost(postId, title, content) {
    const newTitle = prompt("Edit Title:", title);
    const newContent = prompt("Edit Content:", content);

    if (newTitle !== null && newContent !== null) {
        fetch(`http://127.0.0.1:5000/edit_post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: postId, title: newTitle, content: newContent })
        })
        .then(response => {
            if (response.ok) {
                alert("Post updated successfully!");
                location.reload();
            } else {
                alert("Failed to update post.");
            }
        })
        .catch(error => console.error("Error editing post:", error));
    }
}
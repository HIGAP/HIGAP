document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const loginResponse = await fetch('https://higap.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',  // Include credentials in the request
            body: JSON.stringify({ username, password })
        });

        if (loginResponse.ok) {
            const loginData = await loginResponse.json();

            if (loginData.success) {
    // Login successful, proceed to post_prob request
    const postProbResponse = await fetch('https://higap.onrender.com/post_prob', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',  // Include credentials in the request
        body: JSON.stringify({ username })
    });

    if (postProbResponse.ok) {
        // Get the URL from the response
        const postProbData = await postProbResponse.json();

        if (postProbData.url) {
            // Redirect to the URL returned by Flask
            window.location.href = postProbData.url;
        } else {
            document.getElementById('error').innerText = 'Invalid response from server.';
            document.getElementById('error').style.display = 'block';
        }
    } else {
        // Handle error if post_prob request fails
        document.getElementById('error').innerText = 'Failed to post problem. Please try again.';
        document.getElementById('error').style.display = 'block';
    }
}

            } else {
                // Show error if login fails
                document.getElementById('error').innerText = loginData.message || 'Login failed. Please try again.';
                document.getElementById('error').style.display = 'block';
            }
        } else {
            document.getElementById('error').innerText = 'An error occurred during login. Please try again later.';
            document.getElementById('error').style.display = 'block';
        }
    } catch (error) {
        console.error('Login request failed', error);
        document.getElementById('error').innerText = 'An error occurred. Please try again later.';
        document.getElementById('error').style.display = 'block';
    }
});

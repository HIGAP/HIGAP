
        document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://higap.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',  // Include credentials in the request
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();

            if (data.success) {
  window.location.href = `post_problem.html?username=${encodeURIComponent(username)}`;

}
           else {
                document.getElementById('error').innerText = data.message || 'Login failed. Please try again.';
                document.getElementById('error').style.display = 'block';
            }
        } else {
            document.getElementById('error').innerText = 'An error occurred. Please try again later.';
            document.getElementById('error').style.display = 'block';
        }
    } catch (error) {
        console.error('Login request failed', error);
        document.getElementById('error').innerText = 'An error occurred. Please try again later.';
        document.getElementById('error').style.display = 'block';
    }
})



document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById('signupForm');
    const errorMessage = document.getElementById('error-message');

    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = signupForm.username.value.trim();
        const email = signupForm.email.value.trim();
        const password = signupForm.password.value;
        const confirmPassword = signupForm.confirmPassword.value;

        // Clear any previous error message
        errorMessage.style.display = 'none';

        // Basic validation
        if (!username || !email || !password || !confirmPassword) {
            errorMessage.textContent = "Please fill in all fields.";
            errorMessage.style.display = 'block';
            return;
        }

        // Password match validation
        if (password !== confirmPassword) {
            errorMessage.textContent = "Passwords do not match.";
            errorMessage.style.display = 'block';
            return;
        }

        // Additional validations can be added here, such as email format check or password strength

        // If all validations pass, simulate a successful submission
        const formData = {
            username: username,
            email: email,
            password: password,
        };

        console.log("Form data to submit:", formData); // To see data being submitted


        fetch('https://higap.onrender.com/sign_up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status == 'success') {
                alert("Account created successfully!");
                console.log (data.success, data.message, "Success!","redirecting to login page...");
                window.location.href = 'https://higap.onrender.com/log';

            } else {
                errorMessage.textContent = data.message;
                errorMessage.style.display = 'block';
            }
        })
        .catch(error => {
            console.error("Error:", error);
            errorMessage.textContent = "An error occurred. Please try again.";
            errorMessage.style.display = 'block';
        });

    });
});

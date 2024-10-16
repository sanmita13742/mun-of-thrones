document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const enteredPassword = document.getElementById('password').value;
    const correctPassword = "munofthrones2024"; // Set your desired password here

    if (enteredPassword === correctPassword) {
        // If the password is correct, redirect to update.html
        window.location.href = "update.html";
    } else {
        // Show error message if password is incorrect
        document.getElementById('errorMessage').style.display = 'block';
    }
});

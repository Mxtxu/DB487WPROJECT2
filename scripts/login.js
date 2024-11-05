document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get the entered username and password
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Define hardcoded credentials for each role
    const users = {
        tenant: { username: 'tenantUser', password: 'tenantPass' },
        staff: { username: 'staffUser', password: 'staffPass' },
        manager: { username: 'managerUser', password: 'managerPass' }
    };

    // Check credentials and redirect to the corresponding portal
    if (username === users.tenant.username && password === users.tenant.password) {
        window.location.href = 'tenant.html';
    } else if (username === users.staff.username && password === users.staff.password) {
        window.location.href = 'staff.html';
    } else if (username === users.manager.username && password === users.manager.password) {
        window.location.href = 'manager.html';
    } else {
        // Show error message if credentials are incorrect
        document.getElementById('errorMessage').textContent = 'Invalid username or password. Please try again.';
    }
});

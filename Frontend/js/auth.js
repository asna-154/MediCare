/* =========================
   AUTH UI UPDATE
========================= */

async function updateAuthUI() {
    console.log("Checking auth status...");
    
    const authButtons = document.querySelector(".auth-buttons") || document.getElementById("authButtons");
    if (!authButtons) {
        console.log("No authButtons element found on this page");
        return;
    }

    try {
        const res = await fetch('/api/users/status', {
            credentials: 'include'
        });

        const data = await res.json();
        console.log('Auth status:', data);

        if (!data.loggedIn || !data.user) {
            // Not logged in
            authButtons.innerHTML = `
                <a href="login.html" class="btn btn-outline">Login</a>
                <a href="register.html" class="btn">Register</a>
            `;
        } else {
            // Logged in
            authButtons.innerHTML = `
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span style="font-weight: 600;">Hi, ${data.user.name}</span>
                    <a href="profile.html" class="btn btn-outline">
                        <i class="fas fa-user"></i> Profile
                    </a>
                    <button class="btn btn-outline" id="logoutBtn">Logout</button>
                </div>
            `;

            // IMPORTANT: Use event delegation OR add listener properly
            setupLogoutListener();
        }

    } catch (error) {
        console.error('Failed to check auth status:', error);
        // Default to login/register on error
        authButtons.innerHTML = `
            <a href="login.html" class="btn btn-outline">Login</a>
            <a href="register.html" class="btn">Register</a>
        `;
    }
}

/* =========================
   LOGOUT FUNCTION
========================= */
function setupLogoutListener() {
    // Remove existing listener first (cleanup)
    const oldBtn = document.getElementById('logoutBtn');
    if (oldBtn) {
        const newBtn = oldBtn.cloneNode(true);
        oldBtn.parentNode.replaceChild(newBtn, oldBtn);
    }
    
    // Add fresh listener
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log("Logout clicked");
            
            try {
                const logoutRes = await fetch('/api/users/logout', {
                    method: 'POST',
                    credentials: 'include'
                });
                
                const data = await logoutRes.json();
                console.log("Logout response:", data);
                
                if (logoutRes.ok) {
                    // Clear any localStorage/sessionStorage
                    localStorage.clear();
                    sessionStorage.clear();
                    
                    // Force a complete page reload
                    window.location.href = 'index.html';
                } else {
                    console.error('Logout failed:', data.message);
                    window.location.href = 'index.html';
                }
            } catch (error) {
                console.error('Logout error:', error);
                window.location.href = 'index.html';
            }
        });
    }
}

// Use event delegation as a safer alternative
document.addEventListener('click', function(e) {
    if (e.target && (e.target.id === 'logoutBtn' || e.target.closest('#logoutBtn'))) {
        e.preventDefault();
        console.log("Logout clicked via delegation");
        
        fetch('/api/users/logout', {
            method: 'POST',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
            console.log("Logout response:", data);
            // Clear storage and redirect
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = 'index.html';
        })
        .catch(error => {
            console.error('Logout error:', error);
            window.location.href = 'index.html';
        });
    }
});

// Call when page loads
document.addEventListener('DOMContentLoaded', updateAuthUI);

// Also update when navigating between pages
window.addEventListener('pageshow', updateAuthUI);

// Export for manual triggering if needed
window.updateAuthUI = updateAuthUI;

// Debug: Check if auth.js is loaded
console.log("✅ auth.js loaded successfully");
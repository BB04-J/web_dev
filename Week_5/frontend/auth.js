document.addEventListener('DOMContentLoaded', () => {
	const loginTab = document.getElementById('loginTab');
	const signupTab = document.getElementById('signupTab');
	const loginForm = document.getElementById('loginForm');
	const signupForm = document.getElementById('signupForm');
	const authError = document.getElementById('authError');
	const authErrorMsg = document.getElementById('authErrorMsg');

	// Helper to display error messages
	function showError(msg) {
		authErrorMsg.textContent = msg;
		authError.classList.remove('hidden');
	}

	// Helper to hide error messages
	function hideError() {
		authError.classList.add('hidden');
	}

	// Tab Switching Logic
	function setTab(tab) {
		hideError();
		if (tab === 'signup') {
			loginTab.classList.remove('active');
			signupTab.classList.add('active');
			loginForm.classList.add('hidden');
			signupForm.classList.remove('hidden');
		} else {
			signupTab.classList.remove('active');
			loginTab.classList.add('active');
			signupForm.classList.add('hidden');
			loginForm.classList.remove('hidden');
		}
	}

	loginTab.addEventListener('click', () => setTab('login'));
	signupTab.addEventListener('click', () => setTab('signup'));

	// Set initial tab based on query param ?mode=signup or ?mode=login
	const params = new URLSearchParams(window.location.search);
	const mode = params.get('mode');
	if (mode === 'signup') {
		setTab('signup');
	} else {
		setTab('login');
	}

	// API base URL
	const API_BASE = ''; // Since the files are served from the same server, we can use relative paths!

	// Handle Login Submit
	loginForm.addEventListener('submit', async (e) => {
		e.preventDefault();
		hideError();

		const email = document.getElementById('loginEmail').value.trim();
		const password = document.getElementById('loginPassword').value.trim();

		try {
			const res = await fetch(`${API_BASE}/user/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message || 'Login failed. Please verify credentials.');
			}

			// Store token and redirect
			localStorage.setItem('token', data.token);
			window.location.href = 'dashboard.html';
		} catch (error) {
			console.error('Login error:', error);
			if (error.message.includes('Failed to fetch')) {
				showError('Database or API server is offline. Please start the server.');
			} else {
				showError(error.message);
			}
		}
	});

	// Handle Signup Submit
	signupForm.addEventListener('submit', async (e) => {
		e.preventDefault();
		hideError();

		const username = document.getElementById('signupUsername').value.trim();
		const email = document.getElementById('signupEmail').value.trim();
		const password = document.getElementById('signupPassword').value.trim();

		if (password.length < 6) {
			showError('Password must be at least 6 characters long.');
			return;
		}

		try {
			const res = await fetch(`${API_BASE}/user/signup`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, email, password })
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message || 'Sign up failed.');
			}

			// Automatic login after successful signup
			const loginRes = await fetch(`${API_BASE}/user/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});

			const loginData = await loginRes.json();

			if (!loginRes.ok) {
				// Fallback to login screen with success notice if auto-login fails
				showError('Account created! Please sign in using the Login tab.');
				setTab('login');
				return;
			}

			localStorage.setItem('token', loginData.token);
			window.location.href = 'dashboard.html';

		} catch (error) {
			console.error('Signup error:', error);
			if (error.message.includes('Failed to fetch')) {
				showError('Database or API server is offline. Please start the server.');
			} else {
				showError(error.message);
			}
		}
	});
});

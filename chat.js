// Supabase Initialization
const SUPABASE_URL = 'https://sudchtocfhhwctctqdfk.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1ZGNodG9jZmhod2N0Y3RxZGZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NjY3NDUsImV4cCI6MjA2MDE0Mjc0NX0.S7iBl3zuUJyQ1zbjmOqaWtcaADJpKepxnAvn5xyiv64'; 
  const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  // DOM Elements
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const loginBtn = document.getElementById('login-btn');
  const signupBtn = document.getElementById('signup-btn');
  const loginTab = document.getElementById('login-tab');
  const signupTab = document.getElementById('signup-tab');
  const loginSection = document.getElementById('login');
  const signupSection = document.getElementById('signup');
  const forgotPasswordLink = document.getElementById('forgot-password');

  function switchToTab(tabName) {
    if (tabName === 'login') {
      loginSection.classList.add('active');
      signupSection.classList.remove('active');
      loginTab.classList.add('active');
      signupTab.classList.remove('active');
    } else {
      signupSection.classList.add('active');
      loginSection.classList.remove('active');
      signupTab.classList.add('active');
      loginTab.classList.remove('active');
    }
    clearAllErrors();
  }

  function showError(id, message) {
    const errorElement = document.getElementById(id);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      const inputField = document.getElementById(id.replace('-error', ''));
      if (inputField) inputField.classList.add('error');
    }
  }

  function clearAllErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });
    document.querySelectorAll('input').forEach(input => input.classList.remove('error'));
  }

  function setLoading(button, isLoading) {
    if (!button) return;
    button.disabled = isLoading;
    button.innerHTML = isLoading ? 'Processing...' : button.dataset.originalText;
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePassword(password) {
    return password.length >= 8;
  }

  // Login Handler
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAllErrors();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!validateEmail(email)) {
      showError('login-email-error', 'Enter a valid email');
      return;
    }
    if (!validatePassword(password)) {
      showError('login-password-error', 'Password must be at least 8 characters');
      return;
    }

    setLoading(loginBtn, true);
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

      if (error) {
        showError('login-password-error', error.message);
        return;
      }

      localStorage.setItem('supabase_user', JSON.stringify(data.user));
      document.getElementById('login-success').textContent = 'Login successful! Redirecting...';
      document.getElementById('login-success').style.display = 'block';

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
    } catch (err) {
      console.error(err);
      showError('login-email-error', 'Unexpected error occurred');
    } finally {
      setLoading(loginBtn, false);
    }
  });

  // Signup Handler
  signupForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAllErrors();

    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm-password').value;

    if (name.length < 2) {
      showError('signup-name-error', 'Name too short');
      return;
    }
    if (!validateEmail(email)) {
      showError('signup-email-error', 'Invalid email');
      return;
    }
    if (!validatePassword(password)) {
      showError('signup-password-error', 'Password must be 8+ characters');
      return;
    }
    if (password !== confirm) {
      showError('signup-confirm-error', 'Passwords do not match');
      return;
    }

    setLoading(signupBtn, true);
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: window.location.origin + '/dashboard.html',
        },
      });

      if (error) {
        showError('signup-email-error', error.message);
        return;
      }

      document.getElementById('signup-success').textContent = 'Signup successful. Please verify your email.';
      document.getElementById('signup-success').style.display = 'block';
      signupForm.reset();
      setTimeout(() => switchToTab('login'), 3000);
    } catch (err) {
      console.error(err);
      showError('signup-email-error', 'Unexpected error occurred');
    } finally {
      setLoading(signupBtn, false);
    }
  });

  // Reset password
  forgotPasswordLink?.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = prompt('Enter your email to reset password:');
    if (!validateEmail(email)) return alert('Invalid email');

    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password.html'
      });

      if (error) throw error;
      alert('Password reset link sent!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });

  async function checkSession() {
    const { data } = await supabaseClient.auth.getSession();
    if (data?.session) {
      window.location.href = 'dashboard.html';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (loginBtn) loginBtn.dataset.originalText = loginBtn.innerHTML;
    if (signupBtn) signupBtn.dataset.originalText = signupBtn.innerHTML;
    checkSession();
  });

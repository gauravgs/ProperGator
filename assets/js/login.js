let loginForm = document.querySelector('#login-form');
if (loginForm != null) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let email = loginForm.email.value;
        let pass = loginForm.pass.value;
        auth.signInWithEmailAndPassword(email, pass).then((cred) => {
            localStorage.setItem('user-name', 'Nikhil Sahu');
            localStorage.setItem('user-mail', cred.user.email);
            window.location.href = "./dashboard.html";
            loginForm.reset();
        }).catch((e) => {
            alert(e.message);
        });
    });
}
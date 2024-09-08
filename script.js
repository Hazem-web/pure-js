class UserRegistration {
    constructor() {
        if(sessionStorage.getItem('user')!=null){
            location.assign('exam.html')
        }
        this.newUser = new User();
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
        });
    }

    setupEventListeners() {
        const nxt1Button = document.getElementById('nxt1');
        nxt1Button.addEventListener('click', (event) => this.handleNext1(event));

        const nxt2Button = document.getElementById('nxt2');
        nxt2Button.addEventListener('click', (event) => this.handleNext2(event));

        const registerButton = document.getElementById('registerbtn');
        registerButton.addEventListener('click', (event) => this.handleRegister(event));

        const redirectLoginButton = document.querySelector('.redirectLogin');
        redirectLoginButton.addEventListener('click', (event) => this.handleRedirectLogin(event));

        const loginButton = document.getElementById('loginBtn2');
        loginButton.addEventListener('click', (event) => this.handleLogin(event));
    }

    handleNext1(event) {
        event.preventDefault();
        const firstNameInput = document.getElementsByName('firstName')[0];
        const lastNameInput = document.getElementsByName('lastName')[0];
        const firstName = firstNameInput.value;
        const lastName = lastNameInput.value;
        let ret = false;

        this.removeErrorMessages(firstNameInput);
        this.removeErrorMessages(lastNameInput);

        if (firstName === '') {
            this.showError(firstNameInput, 'Your first name is required.');
            ret = true;
        }

        if (lastName === '') {
            this.showError(lastNameInput, 'Your last name is required.');
            ret = true;
        }

        if (ret) return;

        this.newUser.firstName = firstName;
        this.newUser.lastName = lastName;
        this.currentState = 1;
        this.updateProgress('#p1');
        this.toggleForms('.nameForm', '.emailForm');
    }

    handleNext2(event) {
        event.preventDefault();
        const emailInput = document.getElementsByName('email')[0];
        const email = emailInput.value;
        let ret = false;

        this.removeErrorMessages(emailInput);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showError(emailInput, 'Please enter a valid email address.');
            ret = true;
        }

        if (ret) return;

        this.newUser.email = email;
        this.currentState = 2;
        this.updateProgress('#p2');
        this.toggleForms('.emailForm', '.passwordForm');
    }

    handleRegister(event) {
        event.preventDefault();
        const passwordInput = document.getElementsByName('password')[0];
        const confirmPasswordInput = document.getElementsByName('password2')[0];
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        let ret = false;

        this.removeErrorMessages(confirmPasswordInput);
        this.removeErrorMessages(passwordInput);

        if (password !== confirmPassword) {
            this.showError(confirmPasswordInput, 'Passwords do not match.');
            ret = true;
        }

        const lowercaseRegex = /[a-z]/;
        const uppercaseRegex = /[A-Z]/;
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

        if (!lowercaseRegex.test(password) || !uppercaseRegex.test(password) || !specialCharRegex.test(password)) {
            this.showError(passwordInput, 'Password must contain at least one lowercase letter, one uppercase letter, and one special character.');
            ret = true;
        }

        if (ret) return;

        this.newUser.password = password;
        if(localStorage.getItem('newUsers')==null){
        localStorage.setItem('newUsers', JSON.stringify([this.newUser]));
        }
        else{
            const users=JSON.parse(localStorage.getItem('newUsers'))
            users.push(this.newUser)
            localStorage.setItem('newUsers', JSON.stringify(users));
        }
        this.currentState = 3;
        this.updateProgress('#p3');
        // this.toggleForms('.passwordForm', '.register');
        document.querySelector('.redirectLogin').classList.toggle('hide');
        this.loginSwitch();
    }

    handleRedirectLogin(event) {
        event.preventDefault();
        document.querySelector('.progress').classList.add('hide');
        this.loginSwitch();
    }

    handleLogin(event){
        event.preventDefault();
        const emailInput = document.getElementsByName('email2')[0];
        const passwordInput = document.getElementsByName('password3')[0];
        const email = emailInput.value;
        const password = passwordInput.value;
        let ret = false;
        const a=[]

        this.removeErrorMessages(emailInput);
        this.removeErrorMessages(passwordInput);
        const users=JSON.parse(localStorage.getItem('newUsers'))
        const checker= users.find((value)=>value.email==email)

        if(checker==undefined) {
            this.showError(emailInput, 'This email is not registered.');
            ret = true;
            return;
        } 

        
        if(checker.password !== password) {
            this.showError(passwordInput, 'Incorrect password.');
            ret = true;
        }

        if(ret)
            return;

        alert('Login successful!');
        sessionStorage.setItem('user',JSON.stringify(checker))
        location.assign('exam.html');
    }

    removeErrorMessages(inputElement) {
        if (inputElement.nextElementSibling && inputElement.nextElementSibling.classList.contains('error')) {
            inputElement.nextElementSibling.remove();
        }
    }

    showError(inputElement, message) {
        const error = document.createElement('p');
        error.classList.add('error');
        error.textContent = '*' + message;
        error.style.fontSize = '12px';
        error.style.color = 'red';
        error.style.paddingLeft = '15px';
        error.style.paddingRight = '10px';
        error.style.margin = '1px';
        inputElement.insertAdjacentElement('afterend', error);
    }

    updateProgress(selector) {
        const point = document.querySelector(selector);
        point.style.backgroundColor = 'green';
        point.style.color = 'white';
        point.textContent = '✔';
        point.style.border = 'none';
    }

    toggleForms(hideSelector, showSelector) {
        document.querySelector(hideSelector).classList.toggle('hide');
        document.querySelector(showSelector).classList.toggle('hide');
    }

    loginSwitch() {
        document.querySelector('.register').classList.toggle('swap');
        document.querySelector('.nameForm').classList.add('hide');
        document.querySelector('.emailForm').classList.add('hide');
        document.querySelector('.passwordForm').classList.add('hide');
        document.querySelector('.redirectLogin').classList.add('hide');
        document.querySelector('.loginForm').classList.remove('hide');
        document.querySelector('.instructions').textContent = 'Welcome!';
        document.querySelector('.instructions').style.fontSize = '40px';
    }
}

class User {
    constructor(firstName, lastName, email, password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }
}

// Initialize the UserRegistration class
new UserRegistration();
let cart = [];
let slideIndex = 0;
let slideshowInterval;

document.addEventListener('DOMContentLoaded', () => {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    if (document.querySelector('.slideshow-container')) {
        showSlides();
        startSlideshow();
    }

    if (document.getElementById('cart-items')) {
        displayCartItems();
    }

    setupSearchAndFilter();
});

/*function plusSlides(n) {
    clearInterval(slideshowInterval);
    slideIndex += n;
    showSlides();
    startSlideshow();
}

function showSlides() {
    const slides = document.getElementsByClassName("slides");
    if (slideIndex >= slides.length) {
        slideIndex = 0;
    } 
    if (slideIndex < 0) {
        slideIndex = slides.length - 1;
    }

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex].style.display = "block";
}

function startSlideshow() {
    slideshowInterval = setInterval(() => {
        slideIndex++;
        showSlides();
    }, 1000);  // Change slide every 1 second

    const slides = document.getElementsByClassName('slides');
    for (let slide of slides) {
        slide.addEventListener('click', () => {
            clearInterval(slideshowInterval);
        });
    }
}*/
// JavaScript to pause and resume the scrolling on hover
document.addEventListener('DOMContentLoaded', () => {
    const slidesTrack = document.querySelector('.slides-track');
    
    slidesTrack.addEventListener('mouseover', () => {
        slidesTrack.style.animationPlayState = 'paused';
    });

    slidesTrack.addEventListener('mouseout', () => {
        slidesTrack.style.animationPlayState = 'running';
    });
});


function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.innerText = cart.length;
    }
}

function addToCart(event) {
    const productElement = event.target.closest('.product');
    const productName = productElement.querySelector('p').innerText;
    const productPrice = productElement.querySelector('.price').innerText.split(':')[1].trim();
    const productImgSrc = productElement.querySelector('img').src;

    const product = {
        name: productName,
        price: productPrice,
        imgSrc: productImgSrc,
    };

    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${productName} has been added to your cart.`);
}

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty</p>";
    } else {
        cartItemsContainer.innerHTML = "";
        cart.forEach(item => {
            let itemElement = document.createElement('div');
            itemElement.className = "cart-item";
            itemElement.innerHTML = `
                <img src="${item.imgSrc}" alt="${item.name}">
                <p>${item.name}</p>
                <p>${item.price}</p>
                <button onclick="removeFromCart('${item.name}')">Remove</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }
}

function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
}

function checkout() {
    alert('Proceed to checkout');
}

function setupSearchAndFilter() {
    const searchBar = document.getElementById('search-bar');
    const categoryFilter = document.getElementById('category-filter');

    if (searchBar) {
        searchBar.addEventListener('keyup', filterProducts);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
}

function filterProducts() {
    const searchQuery = document.getElementById('search-bar').value.toLowerCase();
    const selectedCategory = document.getElementById('category-filter').value;
    const products = document.querySelectorAll('.product');

    products.forEach(product => {
        const productName = product.querySelector('p').innerText.toLowerCase();
        const productCategory = product.getAttribute('data-category');
        const matchesSearch = productName.includes(searchQuery);
        const matchesCategory = selectedCategory === "" || productCategory === selectedCategory;

        if (matchesSearch && matchesCategory) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}


// Authentication Modal
// ... (keep your existing code for cart, slideshow, etc.)

let isLoginMode = true;

function toggleAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.style.display = modal.style.display === "none" ? "block" : "none";
    }
}

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const title = document.getElementById('auth-title');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const toggleLink = document.querySelector('#auth-modal p a');

    if (isLoginMode) {
        title.textContent = 'Login';
        loginBtn.style.display = 'inline-block';
        registerBtn.style.display = 'none';
        toggleLink.textContent = 'Register';
    } else {
        title.textContent = 'Register';
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'inline-block';
        toggleLink.textContent = 'Login';
    }
}

function register() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            sendEmailVerification(user).then(() => {
                alert('Registration successful! Please check your email to verify your account.');
                toggleAuthMode(); // Switch to login mode
            });
        })
        .catch((error) => {
            document.getElementById('auth-message').textContent = `Registration error: ${error.message}`;
        });
}

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            if (user.emailVerified) {
                alert('Login successful!');
                toggleAuthModal();
                updateUIForUser(user);
            } else {
                alert('Please verify your email before logging in.');
                signOut(auth);
            }
        })
        .catch((error) => {
            document.getElementById('auth-message').textContent = `Login error: ${error.message}`;
        });
}

function logout() {
    signOut(auth).then(() => {
        alert('Logged out successfully');
        updateUIForUser(null);
    }).catch((error) => {
        console.error('Logout error:', error);
    });
}

function updateUIForUser(user) {
    const profileIcon = document.getElementById('profile-icon');
    const authButton = document.querySelector('nav ul li:last-child a');
    if (user) {
        profileIcon.src = 'images/logged-in-icon.png'; // Change this to your logged-in icon
        authButton.onclick = logout;
    } else {
        profileIcon.src = 'images/profile-icon.png';
        authButton.onclick = toggleAuthModal;
    }
}

// Check auth state on page load
onAuthStateChanged(auth, (user) => {
    updateUIForUser(user);
});

// Expose functions to window object
window.toggleAuthModal = toggleAuthModal;
window.toggleAuthMode = toggleAuthMode;
window.register = register;
window.login = login;
window.logout = logout;
// PayPal Integration
paypal.Buttons({
    createOrder: function(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: '100' // Replace with dynamic value based on cart total
                }
            }]
        });
    },
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            alert('Transaction completed by ' + details.payer.name.given_name);
            // Clear cart or other actions after successful payment
        });
    }
}).render('#paypal-button-container'); // This will display the PayPal button on your page


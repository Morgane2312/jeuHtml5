document.addEventListener('DOMContentLoaded', function () {
    const menuIcon = document.querySelector('.menu-icon');
    const navBurger = document.querySelector('.nav-burger');

    menuIcon.addEventListener('click', function () {
        navBurger.classList.toggle('hidden');
    });

    document.addEventListener('click', function (event) {
        if (!navBurger.contains(event.target) && !menuIcon.contains(event.target)) {
            navBurger.classList.add('hidden');
        }
    });
});

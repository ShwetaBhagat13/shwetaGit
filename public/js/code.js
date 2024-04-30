//------------Main JS File ----------------------//
//------------Index Page ----------------------//

document.addEventListener('DOMContentLoaded', function () {

    // NavBar
    function addRequiredClass() {
        if (window.innerWidth < 1020) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }

    window.addEventListener('resize', addRequiredClass);
    window.addEventListener('load', addRequiredClass);

    let hamburger = document.querySelector('.hamburger');
    let mobileNav = document.querySelector('.nav-list');
    let bars = document.querySelectorAll('.hamburger span');
    let isActive = false;

    hamburger.addEventListener('click', function () {
        mobileNav.classList.toggle('open');
        isActive = !isActive;
        bars.forEach(function (bar) {
            if (isActive) {
                bar.style.transform = 'rotate(45deg)';
            } else {
                bar.style.transform = 'rotate(0deg)';
            }
        });
        bars[1].style.opacity = isActive ? '0' : '1';
        bars[2].style.transform = isActive ? 'rotate(-45deg)' : 'rotate(0deg)';
    });

    // Hide hamburger menu when a menu item is clicked
    let navLinks = document.querySelectorAll('.nav-list li a');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            mobileNav.classList.remove('open');
            isActive = false;
            bars.forEach(function (bar) {
                bar.style.transform = 'rotate(0deg)';
            });
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'rotate(0deg)';
        });
    });

    //Tabs
    function openTabs(evt, tabName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";
    }

    // Modal 
    $('#exampleModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget)
        var recipient = button.data('whatever')
        var modal = $(this)
        modal.find('.modal-title').text('New message to ' + recipient)
        modal.find('.modal-body input').val(recipient)
    });

    //--------------------Current year copyright-----------------------
    document.getElementById("currentYear").textContent = new Date().getFullYear();

    //--------------------Recruit Page--------------------------------

    /*===== LOGIN SHOW and HIDDEN =====*/
    const signUp = document.getElementById('sign-up');
    const signIn = document.getElementById('sign-in');
    const loginIn = document.getElementById('login-in');
    const loginUp = document.getElementById('login-up');

    signUp.addEventListener('click', () => {
        loginIn.classList.remove('block');
        loginUp.classList.remove('none');
        loginIn.classList.toggle('none');
        loginUp.classList.toggle('block');
    });

    signIn.addEventListener('click', () => {
        loginIn.classList.remove('none');
        loginUp.classList.remove('block');
        loginIn.classList.toggle('block');
        loginUp.classList.toggle('none');
    });

    //-----------------------Chat Popup------------------------------------
    const openChatBtn = document.querySelector(".openChatBtn");
    const closeChatBtn = document.querySelector(".close");
    const openChat = document.querySelector(".openChat");

    openChatBtn.addEventListener("click", function () {
        openChat.style.display = "block";
    });

    closeChatBtn.addEventListener("click", function () {
        openChat.style.display = "none";
    });
});
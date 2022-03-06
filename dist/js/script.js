window.addEventListener('DOMContentLoaded', function() {

    const slides = document.querySelectorAll('.carousel__slide'),
            prev = document.querySelector('.carousel__slide-prev'),
            next = document.querySelector('.carousel__slide-next'),
            tabs = [...document.querySelectorAll('.catalog__tab')],
            cards = [...document.querySelectorAll('.catalog__cards')],
            contentDescr = [...document.querySelectorAll('.catalog__content .catalog__link')],
            content = [...document.querySelectorAll('.catalog__content')],
            catalogSubtitle = document.querySelectorAll('.catalog__subtitle'),
            listDescr = [...document.querySelectorAll('.catalog__list .catalog__link')],
            consult = document.querySelectorAll('[data-modal="consultation"]'),
            purchase = document.querySelectorAll('.button_mini'),
            overlay = document.querySelector('.overlay'),
            consultModal = document.getElementById('consultation'),
            close = document.querySelectorAll('.modal__close'),
            order = document.getElementById('order'),
            thanks = document.getElementById('thanks'),
            form = document.querySelectorAll('form'),
            pageUp = document.querySelector('.pageup');

    //слайдер

    let slideIndex = 1;

    function showSlides(n = 0) {

        slideIndex += n;

        if (slideIndex > slides.length) {
            slideIndex = 1;
        }

        if (slideIndex < 1) {
            slideIndex = slides.length;
        }

        slides.forEach(item => {
            item.classList.remove('carousel__slide_active');
        });

        slides[slideIndex - 1].classList.add('carousel__slide_active');
    }

    prev.addEventListener('click', () => {
        showSlides(-1);
    });

    next.addEventListener('click', () => {
        showSlides(1);
    });

    // табы

    function tabActiveRemove() {
        tabs.forEach(item => {
            item.classList.remove('catalog__tab_active');
        });
        cards.forEach(item => {
            item.classList.remove('catalog__cards_active');
        });
        contentDescr.forEach(item => {
            item.parentElement.classList.add('catalog__content_active');
        });
        listDescr.forEach(item => {
            item.parentElement.classList.remove('catalog__list_active');
        });
    }

    tabs.forEach((item, i) => {
        item.addEventListener('click', () => {
            tabActiveRemove();
            item.classList.add('catalog__tab_active');
            cards[i].classList.add('catalog__cards_active');
        });
    });

    // карточки

    function showCardsDescr(el) {
        el.forEach((item, i) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                contentDescr[i].parentElement.classList.toggle('catalog__content_active');
                listDescr[i].parentElement.classList.toggle('catalog__list_active');
            });
        });
    }

    showCardsDescr(contentDescr);
    showCardsDescr(listDescr);

    // модальные окна

    function closeModal() {
        overlay.style = 'display: none';
        consultModal.style = 'display: none';
        order.style = 'display: none';
        thanks.style = 'display: none';
    }

    function showModal(modal) {
        overlay.style = 'display: block';
        modal.style = 'display: block';
    }

    close.forEach(item => {
        item.addEventListener('click', () => {
        closeModal();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape") {
            closeModal();
        }
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });

    consult.forEach(item => {
        item.addEventListener('click', () => {
            showModal(consultModal);
        });
    });

    purchase.forEach((item, i) => {
        item.addEventListener('click', () => {
            showModal(order);
            order.querySelector('.modal__descr').textContent = catalogSubtitle[i].textContent;
        });
        
    });

    //отправка формы

    form.forEach (item => {
        bindpostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });
    
        return await res.json();
    };

    function bindpostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            console.log(json);
            
            postData('mailer/smart.php', json)
            .then(data => {
                console.log(data);
                // showThanksModal(message.success);
                // statusMessage.remove();
            }).catch(() => {
                console.log('ERROR');
                // showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
                closeModal();
                showModal(thanks);
                setTimeout(closeModal, 5000);
            });

        });
    }

    // document.querySelectorAll('form').forEach(item => {
    //     item.addEventListener('submit', async (e) => {
    //         e.preventDefault();
    //         const formData = new FormData(item);
    //         const json = JSON.stringify(Object.fromEntries(formData.entries()));
    //         let response = await fetch('mailer/smart.php', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json;charset=utf-8'
    //               },
    //             body: json
    //         });
          
    //         let result = await response.json();
          
    //         console.log(json);
    //     });
    // });

    // scroll pageup

    window.addEventListener("scroll", () => {
        if (window.scrollY > 1600) {
            pageUp.style = 'display: block';
        } else {
            pageUp.style = 'display: none';
        }
    });

});
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('service-worker.js')
        .then((reg) => console.log('Service worker registered'))
        .catch((err) => console.log('Service worker not registered. This happened: ', err));
}

let fontSize = 2;

const fontSizeUp = () => {
    document.getElementById('title').classList.remove(`is-size-${fontSize + 1}-mobile`);
    document.getElementById('subtitle').classList.remove(`is-size-${fontSize + 3}-mobile`);
    document.getElementById('content').classList.remove(`is-size-${fontSize + 2}-mobile`);

    document.getElementById('title').classList.add(`is-size-${fontSize - 0}-mobile`);
    document.getElementById('subtitle').classList.add(`is-size-${fontSize + 2}-mobile`);
    document.getElementById('content').classList.add(`is-size-${fontSize + 1}-mobile`);

    fontSize--;
};
const fontSizeDown = () => {
    document.getElementById('title').classList.remove(`is-size-${fontSize + 1}-mobile`);
    document.getElementById('subtitle').classList.remove(`is-size-${fontSize + 3}-mobile`);
    document.getElementById('content').classList.remove(`is-size-${fontSize + 2}-mobile`);

    document.getElementById('title').classList.add(`is-size-${fontSize + 2}-mobile`);
    document.getElementById('subtitle').classList.add(`is-size-${fontSize + 4}-mobile`);
    document.getElementById('content').classList.add(`is-size-${fontSize + 3}-mobile`);

    fontSize++;
};

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
    document.getElementById('goToTopBtn').style.display =
        document.body.scrollTop > 20 || document.documentElement.scrollTop > 20 ? 'block' : 'none';
};

// When the user clicks on the button, scroll to the top of the document
const topFunction = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
};

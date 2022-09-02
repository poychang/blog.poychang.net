/*===== Service Worker =====*/
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('service-worker.js')
        .then((reg) => console.log('Service worker registered'))
        .catch((err) => console.log('Service worker not registered. This happened: ', err));
}

/*===== Resize content font size =====*/
let fontSize = 4;
const fontSizeUp = () => {
    if (fontSize <= 1) return;

    document.getElementById('content').classList.remove(`is-size-${fontSize}-mobile`);
    document.getElementById('content').classList.add(`is-size-${fontSize - 1}-mobile`);

    fontSize--;
};
const fontSizeDown = () => {
    if (fontSize >= 7) return;

    document.getElementById('content').classList.remove(`is-size-${fontSize}-mobile`);
    document.getElementById('content').classList.add(`is-size-${fontSize + 1}-mobile`);

    fontSize++;
};

/*===== Go To Top =====*/
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

const cards = document.querySelectorAll('.card');
const loader = document.getElementById('loader');
loader.style.display='none';
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        entry.target.classList.toggle('show', entry.isIntersecting);
        if (entry.isIntersecting) observer.unobserve(entry.target);
    });
}, {
    threshold: 1,
});

const lastobserver = new IntersectionObserver(entries => {
    const lastentry = entries[0];
    if (!lastentry.isIntersecting) return addNewCards();
    lastobserver.unobserve(lastentry.target);
    lastobserver.observe(document.querySelector(".card:last-child"));
}, {
    threshold: 1,
})

lastobserver.observe(document.querySelector('.card:last-child'));

cards.forEach(card => {
    observer.observe(card);
})


function addNewCards() {
    
    loader.style.display='block';
    setTimeout(() => {
        newCards();
        loader.style.display='none';
    }, 3000);
}

function newCards() {
    const cont = document.getElementsByClassName('container')[0];
    for (let i = 0; i < 10; i++) {
        const card = document.createElement('div');
        card.textContent = "This is additional card";
        card.classList = "card";
        observer.observe(card);
        cont.appendChild(card);
    }
}
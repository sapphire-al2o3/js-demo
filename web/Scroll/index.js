
document.querySelectorAll('.container').forEach(elm => {
    elm.addEventListener('click', e => {
        console.log(e.target);
        if (e.target.classList.contains('item')) {
            e.target.classList.toggle('active');
        }
    });
});

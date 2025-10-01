document.addEventListener('DOMContentLoaded', function() {
    const changeColorBtn = document.getElementById('changeColorBtn');
    const colorBox = document.getElementById('color-box');

    changeColorBtn.addEventListener('click', function() {
        const randomColor = getRandomColor();
        console.log("New color:", randomColor);
        colorBox.style.backgroundColor = randomColor;
    });

});

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
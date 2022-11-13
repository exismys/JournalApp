const elements = document.getElementsByClassName("box");
const colors = ["#97cfa6", "#8bb6c9", "#8f8bc9", "#b167b5", "#ba6689", "#b88876", "#a6b876"]


for (element of elements) {
    const color = colors[Math.floor(Math.random() * 7)];
    console.log(color);
    element.style.backgroundColor = color;
}
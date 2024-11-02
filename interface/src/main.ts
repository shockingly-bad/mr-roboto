import './style.css'

const arms = document.querySelector("#arms");
const legs = document.querySelector("#legs");
const robot = document.querySelector("#robot");

let armsSelected = true;

const toggle = () => {
  arms?.classList.toggle("selected");
  legs?.classList.toggle("selected");
  armsSelected = !armsSelected;

  if (armsSelected) {
    robot?.setAttribute("src", "/armless.png");
  } else {
    robot?.setAttribute("src", "/legless.png");
  }
}

arms?.addEventListener("click", toggle);
legs?.addEventListener("click", toggle);
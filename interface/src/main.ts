import './style.css';

// Select the buttons and initialize variables for robot state
const arms = document.querySelector<HTMLButtonElement>("#arms");
const legs = document.querySelector<HTMLButtonElement>("#legs");
const limbs = document.querySelector<HTMLDivElement>("#limbs");

let armsSelected = true;

// Toggle function to switch images and reset position
const toggle = () => {
  arms?.classList.toggle("selected");
  legs?.classList.toggle("selected");
  armsSelected = !armsSelected;
};

const addArms = () => {
  const leftArm = createArm();
  // const rightArm = createArm();
}

function createArm() {
  const arm = document.createElement("div");
  let moving = false;
  let y = 0;

  arm.classList.add("arm");
  limbs?.appendChild(arm);

  arm?.addEventListener("mousedown", (event) => {  
    event.preventDefault();

    arm.style.cursor = "grabbing";
    moving = true;
    y = event.clientY;

    console.log(moving);
  });

  document.addEventListener("mousemove", (event) => {
    event.preventDefault();

    if (moving) {
      console.log(event.clientY - y);
    }
  });

  document.addEventListener("mouseup", (event) => {  
    event.preventDefault();

    arm.style.cursor = "grab";
    moving = false;
  });

  return arm;
}

// Add event listeners for the buttons
arms?.addEventListener("click", toggle);
legs?.addEventListener("click", toggle);
addArms();
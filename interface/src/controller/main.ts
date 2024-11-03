import "./styles.css";

const API_KEY = "bobthekiller!";
const URL = "https://abde-131-111-5-193.ngrok-free.app/";
const MAX_ARM_INTENSITY = 14;
const MAX_LEG_INTENSITY = 14;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function mapValue(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number {
  return toMin + ((value - fromMin) * (toMax - toMin)) / (fromMax - fromMin);
}

function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: number;

  return function (this: any, ...args: any[]) {
      const context = this;

      if (timeout) {
          clearTimeout(timeout);
      }
      timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

let requestInProgress = false;
async function sendRequest(value: any, channel: any) {
  if (requestInProgress) return; // Prevent sending if a request is already in progress
  requestInProgress = true; // Set flag to indicate a request is in progress

  // Simulate an API request (using a timeout to mimic network delay)
  return new Promise<void>(async (resolve) => {
      await fetch(`${URL}big_unit_${channel}?intensity=${value}`, {headers: {"Authorization": API_KEY}});
      requestInProgress = false;
      resolve();
  });
}

// const debouncedLog = debounce(console.log, 500);
const debouncedSend = debounce((value, channel) => sendRequest(value, channel), 500);

// Select the buttons and initialize variables for robot state
const arms = document.querySelector<HTMLButtonElement>("#arms");
const legs = document.querySelector<HTMLButtonElement>("#legs");
const limbs = document.querySelector<HTMLDivElement>("#limbs");
const robot = document.querySelector<HTMLImageElement>("#robot");

let armsSelected = true;

// Toggle function to switch images and reset position
const toggle = () => {
  arms?.classList.toggle("selected");
  legs?.classList.toggle("selected");

  removeLimbs();
  armsSelected ? addLegs() : addArms();

  robot?.setAttribute("src", armsSelected ? "legless.png" : "armless.png");

  armsSelected = !armsSelected;
};

const addArms = () => {
  const leftArm = createArm(true);
  leftArm.classList.add("left-arm");

  const rightArm = createArm(false);
  rightArm.classList.add("right-arm");
}

const addLegs = () => {
  const leftLeg = createLeg(true);
  leftLeg.classList.add("left-leg");

  const rightLeg = createLeg(false);
  rightLeg.classList.add("right-leg");
}

const removeLimbs = () => 
  document.querySelector("#limbs")!.innerHTML = "";


function createArm(isLeftArm: boolean) {
  const arm = document.createElement("div");
  let moving = false;
  let initialMouseY = 0;
  let initialRotation = isLeftArm ? -45 : 45; // Left arm starts at -45, right arm at 45
  let currentRotation = initialRotation; // Set the initial rotation

  // Configure the initial rotation and pivot point
  arm.classList.add("limb");
  arm.style.transform = `rotate(${currentRotation}deg)`;
  limbs?.appendChild(arm);

  arm.addEventListener("mousedown", (event) => {  
      event.preventDefault();
      arm.classList.add("limb-active");
      arm.style.cursor = "grabbing";
      moving = true;
      initialMouseY = event.clientY;

      currentRotation = parseFloat(arm.style.transform.replace('rotate(', '').replace('deg)', '')) * (isLeftArm ? 1 : -1);
  });

  document.addEventListener("mousemove", (event) => {
      if (moving) {
        const deltaY = initialMouseY - event.clientY; // Inverted calculation for swinging direction

        // Adjust rotation based on arm side
        const newRotation = clamp(
            currentRotation + deltaY * 0.2, 
            isLeftArm ? -45 : -45, // Minimum rotation
            isLeftArm ? 45 : 45   // Maximum rotation
        );

        arm.style.transform = `rotate(${newRotation * (isLeftArm ? 1 : -1)}deg)`; // Invert angle for right arm
        let mappedValue = Math.floor(mapValue(newRotation, -45, 45, 0, MAX_ARM_INTENSITY));
        debouncedSend(mappedValue, isLeftArm ? "A" : "B");
      }
  });

  document.addEventListener("mouseup", (event) => {  
      event.preventDefault();

      arm.classList.remove("limb-active");

      arm.style.cursor = "grab";
      moving = false;

      // Update currentRotation with the final rotation
      currentRotation = parseFloat(arm.style.transform.replace('rotate(', '').replace('deg)', '')) * (isLeftArm ? 1 : -1);
  });

  return arm;
}

function createLeg(isLeftLeg: boolean) {
  const leg = document.createElement("div");
  let moving = false;
  let initialMouseY = 0;
  let initialRotation = isLeftLeg ? -45 : 45; // Left leg starts at -45, right leg at 45
  let currentRotation = initialRotation; // Set the initial rotation

  // Configure the initial rotation and pivot point
  leg.classList.add("limb");
  leg.style.transform = `rotate(${currentRotation}deg)`;
  limbs?.appendChild(leg);

  leg.addEventListener("mousedown", (event) => {  
      event.preventDefault();

      leg.classList.add("limb-active");
      leg.style.cursor = "grabbing";
      moving = true;
      initialMouseY = event.clientY;

      currentRotation = parseFloat(leg.style.transform.replace('rotate(', '').replace('deg)', '')) * (isLeftLeg ? 1 : -1);
  });

  document.addEventListener("mousemove", (event) => {
      if (moving) {
          const deltaY = initialMouseY - event.clientY; // Inverted calculation for swinging direction

          // Adjust rotation based on leg side
          const newRotation = clamp(
              currentRotation + deltaY * 0.3, 
              isLeftLeg ? -45 : -45, // Minimum rotation
              isLeftLeg ? 45 : 45   // Maximum rotation
          );

          leg.style.transform = `rotate(${newRotation * (isLeftLeg ? 1 : -1)}deg)`; // Invert angle for right leg
          let mappedValue = Math.floor(mapValue(newRotation, -45, 45, 0, MAX_LEG_INTENSITY));
          debouncedSend(mappedValue, isLeftLeg ? "A" : "B");
      }
  });

  document.addEventListener("mouseup", (event) => {  
      event.preventDefault();
      leg.style.cursor = "grab";
      moving = false;

      leg.classList.remove("limb-active");

      currentRotation = parseFloat(leg.style.transform.replace('rotate(', '').replace('deg)', '')) * (isLeftLeg ? 1 : -1);
    });

  return leg;
}



// Add event listeners for the buttons
arms?.addEventListener("click", toggle);
legs?.addEventListener("click", toggle);
addArms();
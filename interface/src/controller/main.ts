import "./styles.css";

const API_KEY = "bobthekiller!";
const URL = "https://3fb7-131-111-5-193.ngrok-free.app/";
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
      let requestInProgress = false;

      if (timeout) {
          clearTimeout(timeout);
      }
      timeout = setTimeout(async () => {
        if (requestInProgress) return; // Prevent sending if a request is already in progress
        requestInProgress = true; // Set flag to indicate a request is in progress

        await func.apply(context, args); // Call the provided function with context and arguments

        requestInProgress = false; // Reset the flag after request completes
    }, wait);
  };
}

// const debouncedLog = debounce(console.log, 500);
const createDebounce = (channel: string) => debounce(async (value: number) => {
  await fetch(`${URL}big_unit_${channel}?intensity=${value}`, {headers: {"Authorization": API_KEY}});
}, 150);

const debouncedSendA = createDebounce("A");
const debouncedSendB = createDebounce("B");

// Select the buttons and initialize variables for robot state
const arms = document.querySelector<HTMLButtonElement>("#arms");
const legs = document.querySelector<HTMLButtonElement>("#legs");
const limbs = document.querySelector<HTMLDivElement>("#limbs");
const robot = document.querySelector<HTMLImageElement>("#robot");
const sync = document.querySelector<HTMLButtonElement>("#sync");

let armsSelected = true;
let synced = false;

// Toggle function to switch images and reset position
const toggle = () => {
  arms?.classList.toggle("selected");
  legs?.classList.toggle("selected");

  removeLimbs();
  armsSelected ? addLegs() : addArms();

  robot?.setAttribute("src", armsSelected ? "legless.png" : "armless.png");

  armsSelected = !armsSelected;
};

const toggleSync = () => {
  sync?.classList.toggle("sync-active");
  synced = !synced;
}


const addArms = () => {
  const leftArm = createArm(true);
  leftArm.arm.classList.add("left-arm");

  const rightArm = createArm(false);
  rightArm.arm.classList.add("right-arm");

  leftArm.arm.addEventListener("mousedown", (event) => {
    leftArm.mousedown(leftArm.arm, event, true);
    if (synced) {
      rightArm.mousedown(rightArm.arm, event, false);
    }
  });

  rightArm.arm.addEventListener("mousedown", (event) => {
    rightArm.mousedown(rightArm.arm, event, false);
    if (synced) {
      leftArm.mousedown(leftArm.arm, event, true);
    }
  });

  document.addEventListener("mousemove", (event: MouseEvent) => {
    leftArm.mousemove(leftArm.arm, event, true);
    rightArm.mousemove(rightArm.arm, event, false);
  });
}

const addLegs = () => {
  const leftLeg = createLeg(true);
  leftLeg.leg.classList.add("left-leg");

  const rightLeg = createLeg(false);
  rightLeg.leg.classList.add("right-leg");

  leftLeg.leg.addEventListener("mousedown", (event) => {
    leftLeg.mousedown(leftLeg.leg, event, true);
    if (synced) {
      rightLeg.mousedown(rightLeg.leg, event, false);
    }
  });

  rightLeg.leg.addEventListener("mousedown", (event) => {
    rightLeg.mousedown(rightLeg.leg, event, false);
    if (synced) {
      leftLeg.mousedown(leftLeg.leg, event, true);
    }
  });

  document.addEventListener("mousemove", (event: MouseEvent) => {
    leftLeg.mousemove(leftLeg.leg, event, true);
    rightLeg.mousemove(rightLeg.leg, event, false);
  });
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

  function mousemove (arm: HTMLDivElement, event: MouseEvent, isLeftArm: boolean) {
    if (moving) {
      const deltaY = initialMouseY - event.clientY; // Inverted calculation for swinging directio

      // Adjust rotation based on arm side
      const newRotation = clamp(
          currentRotation + deltaY * 0.2, 
          isLeftArm ? -45 : -45, // Minimum rotation
          isLeftArm ? 45 : 45   // Maximum rotation
      );

      arm.style.transform = `rotate(${newRotation * (isLeftArm ? 1 : -1)}deg)`; // Invert angle for right arm
      let mappedValue = Math.floor(mapValue(newRotation, -45, 45, 0, MAX_ARM_INTENSITY));
      if (isLeftArm) {
        debouncedSendA(mappedValue);
      } else {
        debouncedSendB(mappedValue);
      }
    }
  }

  function mousedown(arm: HTMLDivElement, event: MouseEvent, isLeftArm: boolean) {
      event.preventDefault();
      arm.classList.add("limb-active");
      arm.style.cursor = "grabbing";
      moving = true;
      initialMouseY = event.clientY;

      currentRotation = parseFloat(arm.style.transform.replace('rotate(', '').replace('deg)', '')) * (isLeftArm ? 1 : -1);
  };

  document.addEventListener("mouseup", (event) => {  
      event.preventDefault();

      arm.classList.remove("limb-active");

      arm.style.cursor = "grab";
      moving = false;

      // Update currentRotation with the final rotation
      currentRotation = parseFloat(arm.style.transform.replace('rotate(', '').replace('deg)', '')) * (isLeftArm ? 1 : -1);
  });

  function setMoving(value: boolean) {
    moving = value;
  }

  function getMoving() {
    return moving;
  }

  return {arm, mousemove, mousedown, moving, getMoving, setMoving};
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

  function mousemove (leg: HTMLDivElement, event: MouseEvent, isLeftLeg: boolean) {
    if (moving) {
      const deltaY = initialMouseY - event.clientY; // Inverted calculation for swinging directio

      // Adjust rotation based on leg side
      const newRotation = clamp(
          currentRotation + deltaY * 0.2, 
          isLeftLeg ? -45 : -45, // Minimum rotation
          isLeftLeg ? 45 : 45   // Maximum rotation
      );

      leg.style.transform = `rotate(${newRotation * (isLeftLeg ? 1 : -1)}deg)`; // Invert angle for right leg
      let mappedValue = Math.floor(mapValue(newRotation, -45, 45, 0, MAX_LEG_INTENSITY));
      if (isLeftLeg) {
        debouncedSendA(mappedValue);
      } else {
        debouncedSendB(mappedValue);
      }
    }
  }

  function mousedown(leg: HTMLDivElement, event: MouseEvent, isLeftLeg: boolean) {
      event.preventDefault();
      leg.classList.add("limb-active");
      leg.style.cursor = "grabbing";
      moving = true;
      initialMouseY = event.clientY;

      currentRotation = parseFloat(leg.style.transform.replace('rotate(', '').replace('deg)', '')) * (isLeftLeg ? 1 : -1);
  };

  document.addEventListener("mouseup", (event) => {  
      event.preventDefault();

      leg.classList.remove("limb-active");

      leg.style.cursor = "grab";
      moving = false;

      // Update currentRotation with the final rotation
      currentRotation = parseFloat(leg.style.transform.replace('rotate(', '').replace('deg)', '')) * (isLeftLeg ? 1 : -1);
  });

  function setMoving(value: boolean) {
    moving = value;
  }

  function getMoving() {
    return moving;
  }

  return {leg, mousemove, mousedown, moving, getMoving, setMoving};
}



// Add event listeners for the buttons
arms?.addEventListener("click", toggle);
legs?.addEventListener("click", toggle);
sync?.addEventListener("click", toggleSync);
addArms();
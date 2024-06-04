const inputSlider = document.querySelector("[data-lenSlider]");
const lengthDisplay = document.querySelector("[data-lenNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generation = document.querySelector(".generate-btn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbol = "!@#$%&?";

let password = "";
let passwordLen = 10;
let checkCount = 0;

//set strength color to gray
setIndicator("#ccc");

handleSlider();
//set passwordlength
function handleSlider() {
  inputSlider.value = passwordLen;
  lengthDisplay.innerText = passwordLen;
  // anything
const min = parseInt(inputSlider.min);
const max = parseInt(inputSlider.max);

// const percentage = ((passwordLen - min) * 100) / (max - min);
// inputSlider.style.backgroundSize = `${percentage}% 100%`;
  // inputSlider.style.backgroundSize = 
  //   ((passwordLen - min) * 100) / (max - min) + "% 100%";
  const percentage = ((passwordLen - min) * 100) / (max - min);
  inputSlider.style.background = `linear-gradient(to right, #DE0DDE ${percentage}%, #ccc ${percentage}%)`;

}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  //shadow
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function generateNumber() {
  return getRandomInteger(0, 9);
}
function generateLowercase() {
  return String.fromCharCode(getRandomInteger(97, 123));
}
function generateUppercase() {
  return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol() {
  const randomNum = getRandomInteger(0, symbol.length);
  return symbol.charAt(randomNum);
}

function calculateStrength() {
  let upper = false;
  let lower = false;
  let number = false;
  let sym = false;
  if (uppercaseCheck.checked) upper = true;
  if (lowercaseCheck.checked) lower = true;
  if (numbersCheck.checked) number = true;
  if (symbolsCheck.checked) sym = true;

  if (upper && lower && (number || sym) && passwordLen >= 8) {
    setIndicator("#0f0");
  } else if ((upper || lower) && (number || sym) && passwordLen >= 5) {
    setIndicator("#ff0");
  } else setIndicator("#f00");
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (error) {
    copyMsg.innerText = "Failed";
  }

  //to make copy vala span visible
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 1200);
}

//shuffle function
function shufflePass(array) {
  //fisher yates method--array k uper apply karke sufle kar sakte h

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => {
    str += el;
  });
  return str;
}

function handleCheckboxChange() {
  checkCount = 0;

  allCheckBox.forEach((checkbox) => {
    // console.log(checkCount);
    if (checkbox.checked) {
      checkCount++;
    }
  });
  //special case
  if (passwordLen < checkCount) {
    passwordLen = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  // console.log(checkbox)
  checkbox.addEventListener("change", handleCheckboxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLen = e.target.value;
  // console.log(passwordLen);
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

//generate password
generation.addEventListener("click", (e) => {
  console.log("hy");
  // console.log(checkCount);
  //none of the checkbox seleccted
  if (checkCount <= 0) return;
  console.log("hhelloy");
  if (passwordLen < checkCount) {
    passwordLen = checkCount;
    console.log(checkCount);
    handleSlider();
  }

  // find new password;
  //remove old password
  console.log("password empty");
  password = "";

  //stuff mentioned by checkboxes

  // if(uppercaseCheck.checked){
  //     password += generateUppercase();
  // }
  // if(lowercaseCheck.checked){
  //     password += generateLowercase();
  // }
  // if(numbersCheck.checked){
  //     password += generateNumber();
  // }
  // if(symbolsCheck.checked){
  //     password += generateSymbol();
  // }

  let funcArr = [];

  if (uppercaseCheck.checked) {
    funcArr.push(generateUppercase);
  }
  if (lowercaseCheck.checked) {
    funcArr.push(generateLowercase);
  }
  if (numbersCheck.checked) {
    funcArr.push(generateNumber);
  }
  if (symbolsCheck.checked) {
    funcArr.push(generateSymbol);
  }
  //compulsary addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
    console.log("compulasary addition");
  }
  //remaining addition
  for (let i = 0; i < passwordLen - funcArr.length; i++) {
    let randIdx = getRandomInteger(0, funcArr.length);
    password += funcArr[randIdx]();
    console.log("remaining");
  }
  //shuffle the password
  password = shufflePass(Array.from(password));
  console.log("shuffling done");
  //show in UI
  passwordDisplay.value = password;
  passwordDisplay.style.color = " rgba(254, 187, 71, 0.975)";

  //calculate strength
  calculateStrength();
  console.log("strength calculated");
});



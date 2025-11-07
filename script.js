//toggle
document.getElementById('modeToggle').addEventListener('change', function () {
    const bandToValue = document.getElementById('bandToValue');
    const valueToBand = document.getElementById('valueToBand');
    const label = document.getElementById('modeLabel');
  
    if (this.checked) {
      bandToValue.style.display = 'none';
      valueToBand.style.display = 'block';
      label.textContent = 'Value → Band';
    } else {
      bandToValue.style.display = 'block';
      valueToBand.style.display = 'none';
      label.textContent = 'Band → Value';
    }
});  

let d1 = document.getElementById('digit1');
let d2 = document.getElementById('digit2');
let d3 = document.getElementById('digit3');
let mul = document.getElementById('multiplier');
let tol = document.getElementById('tolerance');
let tempC = document.getElementById('tempCoef');

const colorMap = {
    BLK: '#1E1E1E',
    BRN: '#8B4513',
    RED: '#DC143C',
    ORN: '#fb7900ff',
    YEL: '#FFFF00',
    GRN: '#228B22',
    BLU: '#0cbdc0ff',
    VIO: '#663399',
    GRY: '#7A7A7A',
    WHT: '#FAFAFA',
    GLD: '#ddbe0bde',
    SLV: '#b0b0b0c4'
};

const digitMap = {
    BLK: 0,    BRN: 1,    RED: 2,    ORN: 3,    YEL: 4,
    GRN: 5,    BLU: 6,    VIO: 7,    GRY: 8,    WHT: 9
};

const multiplierMap = {
    SLV: 0.01,
    GLD: 0.1,
    BLK: 1,    
    BRN: 10,    
    RED: 100,    
    ORN: 1_000,
    YEL: 10_000,
    GRN: 100_000,    
    BLU: 1_000_000,    
    VIO: 10_000_000,    
    GRY: 100_000_000,    
    WHT: 1_000_000_000
};

const toleranceMap = {
    BRN: ' ±1%',
    RED: ' ±2%',
    GRN: ' ±0.5%',
    BLU: ' ±0.25%',
    VIO: ' ±0.1%',
    GLD: ' ±5%',
    SLV: ' ±10%'
};
  
const tempCoeffMap = {
    BRN: ' 100 ppm/°C',
    RED: ' 50 ppm/°C',
    ORN: ' 15 ppm/°C',
    YEL: ' 25 ppm/°C'
};

d1.addEventListener('change', function() {
    const cssColor = colorMap[this.value];
    document.querySelector('.stripe-1').style.backgroundColor = cssColor;
    calcResistance();
});
d2.addEventListener('change', function() {
    const cssColor = colorMap[this.value];
    document.querySelector('.stripe-2').style.backgroundColor = cssColor;
    calcResistance();
});
d3.addEventListener('change', function() {
    const cssColor = colorMap[this.value];
    document.querySelector('.stripe-3').style.backgroundColor = cssColor;
    calcResistance();
});
mul.addEventListener('change', function() {
    const cssColor = colorMap[this.value];
    document.querySelector('.stripe-4').style.backgroundColor = cssColor;
    calcResistance();
});
tol.addEventListener('change', function() {
    const cssColor = colorMap[this.value];
    document.querySelector('.stripe-5').style.backgroundColor = cssColor;
    calcResistance();
});
tempC.addEventListener('change', function() {
    const cssColor = colorMap[this.value];
    document.querySelector('.stripe-6').style.backgroundColor = cssColor;
    calcResistance();
});

const bandSelect = document.getElementById('bandCountSelect');

bandSelect.addEventListener('change', () => {
    const value = bandSelect.value;

    if (value === '4') {
        document.querySelector('.digit1').style.display = 'block';
        document.querySelector('.digit2').style.display = 'block';
        document.querySelector('.multiplier').style.display = 'block';
        document.querySelector('.tolerance').style.display = 'block';
        document.querySelector('.digit3').style.display = 'none';
        document.querySelector('.tempCoef').style.display = 'none';

        document.querySelector('.stripe-1').style.display = 'block';
        document.querySelector('.stripe-2').style.display = 'block';
        document.querySelector('.stripe-4').style.display = 'block';
        document.querySelector('.stripe-5').style.display = 'block';
        document.querySelector('.stripe-3').style.display = 'none';
        document.querySelector('.stripe-6').style.display = 'none';
        document.querySelector('.result-row.band6').style.display = 'none';
    } 
    else if (value === '5') {
        document.querySelector('.digit1').style.display = 'block';
        document.querySelector('.digit2').style.display = 'block';
        document.querySelector('.digit3').style.display = 'block';
        document.querySelector('.multiplier').style.display = 'block';
        document.querySelector('.tolerance').style.display = 'block';
        document.querySelector('.tempCoef').style.display = 'none';

        document.querySelector('.stripe-1').style.display = 'block';
        document.querySelector('.stripe-2').style.display = 'block';
        document.querySelector('.stripe-3').style.display = 'block';
        document.querySelector('.stripe-4').style.display = 'block';
        document.querySelector('.stripe-5').style.display = 'block';
        document.querySelector('.stripe-6').style.display = 'none';
        document.querySelector('.result-row.band6').style.display = 'none';
    } 
    else { // 6 Band
        document.querySelector('.digit1').style.display = 'block';
        document.querySelector('.digit2').style.display = 'block';
        document.querySelector('.digit3').style.display = 'block';
        document.querySelector('.multiplier').style.display = 'block';
        document.querySelector('.tolerance').style.display = 'block';
        document.querySelector('.tempCoef').style.display = 'block';

        document.querySelector('.stripe-1').style.display = 'block';
        document.querySelector('.stripe-2').style.display = 'block';
        document.querySelector('.stripe-3').style.display = 'block';
        document.querySelector('.stripe-4').style.display = 'block';
        document.querySelector('.stripe-5').style.display = 'block';
        document.querySelector('.stripe-6').style.display = 'block';

        document.querySelectorAll('.band6').forEach(el => {
            el.style.display = el.classList.contains('result-row') ? 'flex' : 'block';
        });
    }

    calcResistance();
});
  
function calcResistance() {
    const bandCount = document.getElementById('bandCountSelect').value;

    const d1Val = digitMap[d1.value];
    const d2Val = digitMap[d2.value];
    const d3Val = digitMap[d3.value];
    const mulVal = multiplierMap[mul.value];
    const tolVal = toleranceMap[tol.value];
    const tempVal = tempCoeffMap[tempC.value];

    let resistance = 0;

    if (bandCount === '4') {
        resistance = (d1Val * 10 + d2Val) * mulVal;
    }
    else { // 5 or 6 band
        resistance = (d1Val * 100 + d2Val * 10 + d3Val) * mulVal;
    }

    //Easy Readability
    let formatted = '';
    if (resistance >= 1_000_000_000) {
        formatted = (resistance/1_000_000_000) + 'GΩ';
    } 
    else if (resistance >= 1_000_000) {
        formatted = (resistance/1_000_000) + 'MΩ';
    }
    else if (resistance >= 1000) {
        formatted = (resistance/1000) + 'kΩ';
    }
    else {
        formatted = resistance + 'Ω';
    }

    document.getElementById('res-value').textContent = formatted;
    document.getElementById('tol-value').textContent = tolVal;

    if (bandCount === '6') {
        document.querySelectorAll('.band6').forEach(el => {
            el.style.display = el.classList.contains('result-row') ? 'flex' : 'block';
        });
        document.querySelector('.tempCoef').style.display = 'block';
        document.getElementById('temp-value').textContent = tempCoeffMap[tempC.value];
    } else {
        document.querySelectorAll('.band6').forEach(el => el.style.display = 'none');
        document.querySelector('.tempCoef').style.display = 'none';
        document.getElementById('temp-value').textContent = '--';

        // Keep this as it updates the visible stripe even if tempCoef display is none
        document.querySelector('.stripe-6').style.backgroundColor = colorMap[tempC.value];
    }       
}

window.addEventListener('DOMContentLoaded', () => {
    // Show Band → Value on page load
    document.getElementById("bandToValue").style.display = "block";
    document.getElementById("valueToBand").style.display = "none";
    document.getElementById("bandOutput").style.display = "none"; // Ensure hidden on load

    // Set the initial state of the mode toggle and dispatch change
    const modeToggle = document.getElementById('modeToggle');
    modeToggle.checked = false; // Ensure Band -> Value is selected
    modeToggle.dispatchEvent(new Event('change')); // Trigger toggle logic (which now uses display)

    // Trigger the change event for bandCountSelect to set correct visibility of bands
    document.getElementById('bandCountSelect').dispatchEvent(new Event('change'));

    // Explicitly set initial stripe colors based on default select values
    document.querySelector('.stripe-1').style.backgroundColor = colorMap[d1.value];
    document.querySelector('.stripe-2').style.backgroundColor = colorMap[d2.value];
    document.querySelector('.stripe-3').style.backgroundColor = colorMap[d3.value];
    document.querySelector('.stripe-4').style.backgroundColor = colorMap[mul.value];
    document.querySelector('.stripe-5').style.backgroundColor = colorMap[tol.value];
    document.querySelector('.stripe-6').style.backgroundColor = colorMap[tempC.value];

    // Calculate initial resistance based on default selects
    calcResistance();
});

function setupStripeCycling() {
    const digitColors = Object.keys(digitMap);
    const multiplierColors = Object.keys(multiplierMap);
    const toleranceColors = Object.keys(toleranceMap);
    const tempColors = Object.keys(tempCoeffMap);
    const digitKeysNoBlack = Object.keys(digitMap).filter(key => key !== 'BLK');

    // Initial indices (will be updated by change events on selects anyway)
    let d1Index = digitKeysNoBlack.indexOf(d1.value); // For stripe-1, no black
    let d2Index = digitColors.indexOf(d2.value);
    let d3Index = digitColors.indexOf(d3.value);
    let mulIndex = multiplierColors.indexOf(mul.value);
    let tolIndex = toleranceColors.indexOf(tol.value);
    let tempIndex = tempColors.indexOf(tempC.value);

    document.querySelector('.stripe-1').addEventListener('click', () => {
        d1Index = (d1Index + 1) % digitKeysNoBlack.length;
        const nextColor = digitKeysNoBlack[d1Index];
        d1.value = nextColor;
        d1.dispatchEvent(new Event('change')); // Trigger event listener
    });

    document.querySelector('.stripe-2').addEventListener('click', () => {
        d2Index = (d2Index + 1) % digitColors.length;
        d2.value = digitColors[d2Index];
        d2.dispatchEvent(new Event('change'));
    });

    document.querySelector('.stripe-3').addEventListener('click', () => {
        if (getComputedStyle(document.querySelector('.stripe-3')).display === 'none') return;
        d3Index = (d3Index + 1) % digitColors.length;
        d3.value = digitColors[d3Index];
        d3.dispatchEvent(new Event('change'));
    });

    document.querySelector('.stripe-4').addEventListener('click', () => {
        mulIndex = (mulIndex + 1) % multiplierColors.length;
        mul.value = multiplierColors[mulIndex];
        mul.dispatchEvent(new Event('change'));
    });

    document.querySelector('.stripe-5').addEventListener('click', () => {
        tolIndex = (tolIndex + 1) % toleranceColors.length;
        tol.value = toleranceColors[tolIndex];
        tol.dispatchEvent(new Event('change'));
    });

    document.querySelector('.stripe-6').addEventListener('click', () => {
        if (getComputedStyle(document.querySelector('.stripe-6')).display === 'none') return;
        tempIndex = (tempIndex + 1) % tempColors.length;
        tempC.value = tempColors[tempIndex];
        tempC.dispatchEvent(new Event('change'));
    });
}

setupStripeCycling();

// No longer directly called, but kept if you plan to use it for other purposes
function handleBandChange(value) {
    document.querySelector(`input[name="bandCount"][value="${value}"]`).checked = true;
    document.querySelector(`input[name="bandCount"][value="${value}"]`)
      .dispatchEvent(new Event('change'));
  }


//Value to Band
const toleranceColorMap = {
    "±1%": 'BRN',
    "±2%": 'RED',
    "±0.5%": 'GRN',
    "±0.25%": 'BLU',
    "±0.1%": 'VIO',
    "±5%": 'GLD',
    "±10%": 'SLV'
};


const tempColorMap = {
    "100 ppm/°C": 'BRN',
    "50 ppm/°C": 'RED',
    "15 ppm/°C": 'ORN',
    "25 ppm/°C": 'YEL'
};

// Add a function to handle displaying the resistor bands for Value -> Band
function updateValueToBandResistor(resistance, tolerance, tempCoef, targetBandCount) {
    const stripes = document.querySelectorAll('#bandOutput .stripe-v2b');
    const see5BandBtn = document.getElementById("see5BandBtn");
    const bandOutput = document.getElementById("bandOutput");
    const errorDisplay = document.getElementById("error-message");

    // Clear any previous errors at the start
    if (errorDisplay) {
        errorDisplay.textContent = ""; // Clear text
        errorDisplay.classList.remove('show-error'); // Remove class to hide it smoothly
    }

    if (!resistance || resistance <= 0) { // Handle 0 or negative resistance
        bandOutput.style.display = "none";
        if (errorDisplay) {
            errorDisplay.textContent = "Resistance must be a positive value.";
            errorDisplay.classList.add('show-error'); // Add class to show it
        }
        return;
    }
    
    let baseDigitsStr;
    let multiplierValue;
    let mulKey;

    // Determine base digits and multiplier more accurately
    let resistanceString = resistance.toExponential();
    let [coefficient, exp] = resistanceString.split('e').map(Number);
    exp = parseInt(exp); // Ensure exponent is integer

    if (targetBandCount >= 5) { // Try for 3 significant digits
        // Adjust coefficient to be a 3-digit integer, adjust exponent
        coefficient = Math.round(coefficient * 100); // e.g., 4.7 -> 470
        exp -= 2; // Adjust exponent for multiplying by 100
        baseDigitsStr = String(coefficient);
    } else { // Try for 2 significant digits
        // Adjust coefficient to be a 2-digit integer, adjust exponent
        coefficient = Math.round(coefficient * 10); // e.g., 4.7 -> 47
        exp -= 1; // Adjust exponent for multiplying by 10
        baseDigitsStr = String(coefficient);
    }
    
    // Ensure baseDigitsStr has enough digits and remove leading zeros if it's the only digit
    if (baseDigitsStr.length < 2 && resistance >= 1) { // Prevent single digits like '4' from 4700 as first two
        if (targetBandCount >= 5) {
            baseDigitsStr = String(Math.round(resistance * 100 / Math.pow(10, exp + 2))); // Recalc to ensure enough sig figs
            if (baseDigitsStr.length < 3) baseDigitsStr = baseDigitsStr.padEnd(3, '0');
        } else {
            baseDigitsStr = String(Math.round(resistance * 10 / Math.pow(10, exp + 1)));
            if (baseDigitsStr.length < 2) baseDigitsStr = baseDigitsStr.padEnd(2, '0');
        }
    }

    // Fallback for very small numbers if initial coefficient is 0 or 1 digit
    if (baseDigitsStr.length === 0 || baseDigitsStr === '0') {
         if (resistance < 1 && resistance > 0) {
            let tempExp = resistance.toExponential().split('e');
            let tempCoeff = parseFloat(tempExp[0]);
            let tempActualExp = parseInt(tempExp[1]);

            if (targetBandCount >= 5) {
                 baseDigitsStr = String(Math.round(tempCoeff * 100)).padStart(3, '0');
                 exp = tempActualExp - 2;
            } else {
                baseDigitsStr = String(Math.round(tempCoeff * 10)).padStart(2, '0');
                exp = tempActualExp - 1;
            }
         } else {
             if (errorDisplay) {
                 errorDisplay.textContent = "Could not derive a suitable digit combination. Try a different value.";
                 errorDisplay.classList.add('show-error');
             }
             bandOutput.style.display = "none";
             return;
         }
    }

    // Now, find the multiplier from the exp
    mulKey = Object.entries(multiplierMap).find(([key, val]) => {
        let log10Val = Math.log10(val);
        // Compare exponents, allowing for small floating point differences
        return Math.abs(log10Val - exp) < 1e-9;
    })?.[0];

    if (!mulKey) {
        if (errorDisplay) {
            errorDisplay.textContent = "Could not find a matching multiplier band for the given resistance. Please adjust the value.";
            errorDisplay.classList.add('show-error');
        }
        bandOutput.style.display = "none";
        return;
    }

    // Digits
    const d1 = parseInt(baseDigitsStr[0]);
    const d2 = parseInt(baseDigitsStr[1]);
    const d3 = targetBandCount >= 5 ? parseInt(baseDigitsStr[2]) : null;


    // Apply colors and set display
    stripes[0].style.backgroundColor = colorMap[getColorKey(d1)];
    stripes[1].style.backgroundColor = colorMap[getColorKey(d2)];
    stripes[3].style.backgroundColor = colorMap[mulKey];
    stripes[4].style.backgroundColor = getTolColor(tolerance);

    // Default all stripes to display none, then selectively block
    stripes.forEach(s => s.style.display = 'none');

    // Always show first, second, multiplier, tolerance
    stripes[0].style.display = 'block';
    stripes[1].style.display = 'block';
    stripes[3].style.display = 'block';
    stripes[4].style.display = 'block';

    if (targetBandCount === 4) {
        stripes[2].style.backgroundColor = 'transparent'; // 3rd digit hidden
        stripes[5].style.backgroundColor = 'transparent'; // Temp Coef hidden

        see5BandBtn.style.display = "inline-block";
        see5BandBtn.textContent = "See 5-Band Version";
    } else if (targetBandCount === 5) {
        stripes[2].style.backgroundColor = colorMap[getColorKey(d3)];
        stripes[5].style.backgroundColor = 'transparent'; // Temp Coef hidden
        stripes[2].style.display = 'block'; // Show 3rd digit

        see5BandBtn.style.display = "inline-block";
        see5BandBtn.textContent = "See 4-Band Version";
    } else if (targetBandCount === 6) {
        stripes[2].style.backgroundColor = colorMap[getColorKey(d3)];
        stripes[5].style.backgroundColor = getTempColor(tempCoef);
        stripes[2].style.display = 'block'; // Show 3rd digit
        stripes[5].style.display = 'block'; // Show Temp Coef

        see5BandBtn.style.display = "none"; // 6-band is specific, no easy toggle to 4/5
    }

    bandOutput.style.display = "block";
}


// --- Centralized Conversion Function for "Value -> Band" ---
// This function will handle both button clicks and Enter key presses
function triggerValueToBandConversion() {
    const input = document.getElementById("resistanceInput").value.trim().toUpperCase();
    const tolerance = document.getElementById("toleranceInput").value;
    const tempCoef = document.getElementById("tempInput").value;
    const errorDisplay = document.getElementById("error-message");

    // Clear previous errors immediately
    if (errorDisplay) {
        errorDisplay.textContent = "";
        errorDisplay.classList.remove('show-error');
    }

    if (!input) {
        if (errorDisplay) {
            errorDisplay.textContent = "Please enter a resistance value.";
            errorDisplay.classList.add('show-error');
        }
        document.getElementById("bandOutput").style.display = "none";
        return;
    }

    let resistance;
    try {
        if (input.match(/^[0-9]+(\.[0-9]+)?[KMG]?$/)) { // More robust regex for numbers
            resistance = parseFloat(input.replace(/K/, 'e3').replace(/M/, 'e6').replace(/G/, 'e9'));
        } else {
            if (errorDisplay) {
                errorDisplay.textContent = "Invalid resistance format (e.g., 4.7k, 3M, 500).";
                errorDisplay.classList.add('show-error');
            }
            document.getElementById("bandOutput").style.display = "none";
            return;
        }
    } catch (e) {
        if (errorDisplay) {
            errorDisplay.textContent = "An unexpected error occurred parsing resistance.";
            errorDisplay.classList.add('show-error');
        }
        document.getElementById("bandOutput").style.display = "none";
        return;
    }

    // Determine target band count based on tempCoef
    const use6Band = tempCoef && tempCoef !== "--";
    const targetBandCount = use6Band ? 6 : 4; // Default to 4 if not 6-band initially

    updateValueToBandResistor(resistance, tolerance, tempCoef, targetBandCount);
}


// --- Event Listeners for "Value -> Band" Section ---

// Main Convert Button Click Listener
document.getElementById("convertBtn").addEventListener("click", function() {
    // Add visual feedback
    this.classList.add('active-feedback');
    setTimeout(() => {
        this.classList.remove('active-feedback');
    }, 150);

    // Call the centralized function
    triggerValueToBandConversion();
});

// Event listener for the resistance input field (Enter key press)
document.getElementById("resistanceInput").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const convertBtn = document.getElementById("convertBtn");
        convertBtn.classList.add('active-feedback'); // Add feedback class
        setTimeout(() => {
            convertBtn.classList.remove('active-feedback');
        }, 150); // Match this duration to your CSS transition
        
        triggerValueToBandConversion(); // Call the centralized function
    } else {
        // Optional: Clear error message as user types
        const errorDisplay = document.getElementById("error-message");
        if (errorDisplay && errorDisplay.classList.contains('show-error')) {
            errorDisplay.textContent = "";
            errorDisplay.classList.remove('show-error');
        }
    }
});

// Event listener for the tolerance select field (Enter key press)
document.getElementById("toleranceInput").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const convertBtn = document.getElementById("convertBtn");
        convertBtn.classList.add('active-feedback');
        setTimeout(() => {
            convertBtn.classList.remove('active-feedback');
        }, 150);
        triggerValueToBandConversion();
    }
});

// Event listener for the temperature coefficient select field (Enter key press)
document.getElementById("tempInput").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const convertBtn = document.getElementById("convertBtn");
        convertBtn.classList.add('active-feedback');
        setTimeout(() => {
            convertBtn.classList.remove('active-feedback');
        }, 150);
        triggerValueToBandConversion();
    }
});

// Event listener for the "See 5-Band Version" button
document.getElementById("see5BandBtn").addEventListener("click", () => {
    const btn = document.getElementById("see5BandBtn");
    const input = document.getElementById("resistanceInput").value.trim().toUpperCase();
    const tolerance = document.getElementById("toleranceInput").value;
    const tempCoef = document.getElementById("tempInput").value;
    const errorDisplay = document.getElementById("error-message");

    if (!input) { // If input is empty, don't try to convert
        if (errorDisplay) {
            errorDisplay.textContent = "Please enter a resistance value first.";
            errorDisplay.classList.add('show-error');
        }
        document.getElementById("bandOutput").style.display = "none";
        return;
    }

    let resistance = parseFloat(input.replace(/K/, 'e3').replace(/M/, 'e6').replace(/G/, 'e9'));

    if (btn.textContent.includes("5-Band")) {
        // Switch to 5-band
        updateValueToBandResistor(resistance, tolerance, tempCoef, 5);
    } else {
        // Switch to 4-band
        updateValueToBandResistor(resistance, tolerance, tempCoef, 4);
    }
});

// Helper functions
function getColorKey(digit) {
    // Digit map values are 0-9
    return Object.entries(digitMap).find(([_, v]) => v === digit)?.[0];
}

function getTolColor(tol) {
    return colorMap[toleranceColorMap[tol]] || 'transparent';
}

function getTempColor(temp) {
    return colorMap[tempColorMap[temp]] || 'transparent';
}
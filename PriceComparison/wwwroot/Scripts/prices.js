



function checkInput() {
    var numberInputElement = document.getElementById('numberInput');
    var numberInputValue = parseInt(numberInputElement.value);

    if (numberInputValue > 180) {
        numberInputElement.value = 180;
    }
    if (numberInputValue < 0) {
        numberInputElement.value = 0;
    }
}

document.getElementById('numberInput').addEventListener('change', checkInput);
const deleteButton = document.querySelector('.btn-warning');
deleteButton.style.visibility = 'hidden';


async function submitFormData() {
    const forms = document.querySelectorAll('#formsContainer .form-container');
    const numberInput = parseInt(document.getElementById('numberInput').value);  // Ensure this is an integer
    const destination = document.getElementById('destinationSelect').value;

    const passengers = Array.from(forms).map(form => {
        const age = parseInt(form.querySelector('input[type="number"]').value);  // Ensure this is an integer
        const covers = Array.from(form.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.id);
        return { age, covers };
    });

    const requestData = {
        DaysAbroad: numberInput,
        Destination: destination,
        Passengers: passengers
    };

    try {
        const response = await fetch('/api/Prices/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            console.error('Failed to fetch prices:', response.statusText);
            return;
        }

        const prices = await response.json();

        for (const [company, price] of Object.entries(prices)) {
            const cardTitle = document.getElementById(`${company}`);
            const cardDays = document.getElementById(`${company}Days`)
            const cardPassengers = document.getElementById(`${company}Passengers`)
            const cardPerDay = document.getElementById(`${company}PerDay`)
            if (cardTitle) {
                const numPassengers = passengers.length;
                const dailyPrice = (price / numberInput).toFixed(2); // Calculate daily price
                let daysContent = ''
                if (numberInput == 1) {
                    daysContent = 'יום 1'
                }
                else {
                    daysContent = `&#x202B;${numberInput} ימים&#x202C;`
                }
                cardDays.innerHTML = daysContent

                let passengersContent = ''
                if (numPassengers == 1) {
                    passengersContent = 'נוסע 1'
                }
                else {
                    passengersContent = `&#x202B;${numPassengers} נוסעים&#x202C;`
                }
                cardPassengers.innerHTML = passengersContent

                let perDayContent = ''
                
                perDayContent = `${dailyPrice}$ ליום בממוצע`
                
                cardPerDay.innerHTML = perDayContent
               




                let content = '';
                content = `${price}$`;
               
                cardTitle.innerHTML = content;
            } else {
                console.warn(`No card found for company: ${company}`);
            }
        }
    } catch (error) {
        console.error('Error fetching prices:', error);
    }
}

document.getElementById('addFormButton').addEventListener('click', function () {
    const originalForm = document.getElementById('form');

    const newForm = originalForm.cloneNode(true);
    newForm.classList.add('cloned-form');

    const formsContainer = document.getElementById('formsContainer');
    let passengerNum = formsContainer.children.length + 1;



    const passengerLabel = newForm.querySelector('.passenger-label');
    passengerLabel.textContent = `נוסע/ת ${passengerNum}`;

    const checkboxes = newForm.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox, index) => {
        if (index === 0) {
            checkbox.checked = true;
            checkbox.disabled = true;// Check the first checkbox
        } else {
            checkbox.checked = false; // Uncheck all other checkboxes
        }
    });

    newForm.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = '30';

    });

    const deleteButton = newForm.querySelector('.btn-warning');
    deleteButton.style.visibility = 'visible';
    deleteButton.addEventListener('click', function () {
        if (newForm.classList.contains('cloned-form')) {
            formsContainer.removeChild(newForm);
            passengerNum = formsContainer.children.length + 1;


            updatePassengerNumbers();
            submitFormData(); // Recalculate prices
        }
    });

    formsContainer.appendChild(newForm);
    addEventListenersToForm(newForm);
    submitFormData(); // Recalculate prices
});

document.getElementById('numberInput').addEventListener('change', submitFormData);
document.getElementById('destinationSelect').addEventListener('change', submitFormData);

function addEventListenersToForm(form) {
    form.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', submitFormData);
    });
    form.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', submitFormData);
    });

}

function updatePassengerNumbers() {
    const formsContainer = document.getElementById('formsContainer');
    const forms = formsContainer.children;
    for (let i = 0; i < forms.length; i++) {
        const passengerLabel = forms[i].querySelector('.passenger-label');
        passengerLabel.textContent = `נוסע/ת ${i + 1}`;
    }
}

document.querySelectorAll('#formsContainer .form-container').forEach(form => {
    addEventListenersToForm(form);
});


async function recordLinkClick(company, passengerNum, amountOfDays, price, location) {
    try {
        // Prepare the data to be sent
        const data = {
            Company: company,
            PassengerNum: passengerNum,
            AmountOfDays: amountOfDays,
            Price: price,
            Location: location

        };


        // Send the data using the Fetch API
        const response = await fetch('/api/LinkClick/AddRecord', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Check if the request was successful
        if (!response.ok) {
            console.error('Failed to log link click:', response.statusText);
        } else {
            console.log('Link click logged successfully');
        }
    } catch (error) {
        console.error('Error logging link click:', error);
    }
}
function addLinkClickListeners() {
    // Amount of passengers
    const formsContainer = document.getElementById('formsContainer');

    // Get all buttons with the 'btn-primary container' class
    const links = document.querySelectorAll('.btn-primary.container');

    links.forEach(link => {
        link.addEventListener('click', function () {
            // Get the company name from the 'name' attribute of the link
            const company = this.getAttribute('name');

            // Find the price element in the card ('.priceTag h2')
            const priceElement = this.closest('.card').querySelector('.priceTag');
            

            // Extract the price from the text (removing the '$' and any extra spaces)
            const priceLine = priceElement ? priceElement.textContent : '0$';
            const price = parseFloat(priceLine.replace('$', '').trim());
            console.log(price)

            // Call the recordLinkClick function with updated parameters
            recordLinkClick(
                company,
                formsContainer.children.length, // Amount of forms (passengers)
                parseInt(document.getElementById('numberInput').value), // Value from number input
                price, // The extracted price
                document.getElementById('destinationSelect').value // Selected destination
            );
        });
    });
}
// Ensure the DOM is fully loaded before adding event listeners
document.addEventListener('DOMContentLoaded', function () {
    addLinkClickListeners();
});

// Function to check if URLs are null/empty and hide corresponding cards
function adjustCards() {
    // Get all cards and map to their parent containers
    const cardElements = document.querySelectorAll('.card');
    const cards = [];

    // For each card, find its parent column
    cardElements.forEach(card => {
        let parent = card.parentElement;
        // Go up the DOM tree until we find a parent with col-md-2 or col-6 class
        while (parent && !parent.classList.contains('col-md-2') && !parent.classList.contains('col-6')) {
            parent = parent.parentElement;
        }
        if (parent) {
            cards.push(parent);
        }
    });

    let visibleCardsCount = 0;

    // Check each card's link
    cards.forEach(card => {
        const link = card.querySelector('a.btn');
        // If link exists and its href is not empty/null (after trimming)
        if (link && link.getAttribute('href') && link.getAttribute('href').trim() !== '' &&
            link.getAttribute('href').trim() !== 'null' &&
            !link.getAttribute('href').includes('@Model')) {
            visibleCardsCount++;
        } else {
            // Hide the card's container
            card.style.display = 'none';
        }
    });

    // Adjust the width of remaining cards
    if (visibleCardsCount > 0 && visibleCardsCount < 4) {
        const newColWidth = Math.floor(8 / visibleCardsCount);

        // Calculate left margin for centering (total space is 12 - (cards * width))
        const totalSpace = 12 - (visibleCardsCount * newColWidth);
        const leftMargin = Math.floor(totalSpace / 2);

        // Get the row that contains the cards
        const row = cards[0].closest('.row');

        // Clear all existing children and prepare to rebuild
        const rowClone = row.cloneNode(false);

        // First add the left margin spacer
        const leftSpacer = document.createElement('div');
        leftSpacer.classList.add(`col-md-${leftMargin}`);
        rowClone.appendChild(leftSpacer);

        // Then add each visible card with new width
        cards.forEach(card => {
            if (card.style.display !== 'none') {
                // Clone the card element
                const cardClone = card.cloneNode(true);

                // Remove existing col-* classes
                cardClone.classList.forEach(className => {
                    if (className.startsWith('col-md-') || className.startsWith('col-')) {
                        cardClone.classList.remove(className);
                    }
                });

                // Add new classes
                cardClone.classList.add(`col-md-${newColWidth}`);
                cardClone.classList.add(`col-${Math.min(12, newColWidth * 2)}`);

                // Add to the new row
                rowClone.appendChild(cardClone);
            }
        });

        // Finally add right margin spacer if needed (to handle odd number of columns)
        const rightMargin = totalSpace - leftMargin;
        if (rightMargin > 0) {
            const rightSpacer = document.createElement('div');
            rightSpacer.classList.add(`col-md-${rightMargin}`);
            rowClone.appendChild(rightSpacer);
        }

        // Replace the old row with the new one
        row.parentNode.replaceChild(rowClone, row);
    }
}

// Add CSS for smoother transitions
const style = document.createElement('style');
style.textContent = `
  .card {
    transition: all 0.3s ease;
  }
  
  .row > [class*="col-"] {
    transition: width 0.3s ease, flex 0.3s ease;
  }
`;
document.head.appendChild(style);

// Try multiple approaches to ensure the function runs
// Option 1: Run immediately if document is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(adjustCards, 1);
}

// Option 2: Use window.onload (runs after all resources like images are loaded)
window.onload = function () {
    adjustCards();
};

// Option 3: Add script at the end of the body
// (This works if script is placed at the end of the body)
adjustCards();

// Option 4: Use jQuery if it's available
if (typeof jQuery !== 'undefined') {
    jQuery(document).ready(adjustCards);
}

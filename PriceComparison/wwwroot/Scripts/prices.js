


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
            const priceElement = this.closest('.card').querySelector('.priceTag h2');

            // Extract the price from the text (removing the '$' and any extra spaces)
            const priceLine = priceElement ? priceElement.textContent : '0$';
            const price = parseFloat(priceLine.replace('$', '').trim());

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

async function submitFormData() {
    const forms = document.querySelectorAll('#formsContainer .form-container');
    const numberInput = parseInt(document.getElementById('numberInput').value);  // Ensure this is an integer
    const destination = document.getElementById('exampleDataList').value;

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
    console.log(requestData);

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
        console.log(prices);

        // Assuming the company enum values match the card IDs in the format 'company{EnumValue}Card'
        for (const [company, price] of Object.entries(prices)) {
            console.log(company);
            const cardTitle = document.getElementById(`${company}`);
            if (cardTitle) {
                cardTitle.textContent = `${price} $`;
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
            checkbox.checked = true; // Check the first checkbox
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
document.getElementById('exampleDataList').addEventListener('change', submitFormData);

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


document.getElementById('addFormButton').addEventListener('click', function () {
    // Get the original form
    const originalForm = document.getElementById('form');

    // Clone the form
    const newForm = originalForm.cloneNode(true);
    newForm.classList.add('cloned-form'); // Add a class to cloned forms

    // Get the current number of forms and set the new passenger number
    const formsContainer = document.getElementById('formsContainer');
    const passengerNum = formsContainer.children.length + 1; // Start counting from 1 since the first form is already 1

    // Update the passenger number label in the new form
    const passengerLabel = newForm.querySelector('.passenger-label');
    passengerLabel.textContent = `נוסע/ת ${passengerNum}`;

    // Reset the form fields
    newForm.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    newForm.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = '';
    });

    // Attach the delete button event listener
    const deleteButton = newForm.querySelector('.btn-warning');
    deleteButton.addEventListener('click', function () {
        if (newForm.classList.contains('cloned-form')) { // Check if it's a cloned form
            formsContainer.removeChild(newForm);
            updatePassengerNumbers();
        }
    });

    // Append the new form to the forms container
    formsContainer.appendChild(newForm);
});

// Function to update passenger numbers after a form is deleted
function updatePassengerNumbers() {
    const formsContainer = document.getElementById('formsContainer');
    const forms = formsContainer.children;
    for (let i = 0; i < forms.length; i++) {
        const passengerLabel = forms[i].querySelector('.passenger-label');
        passengerLabel.textContent = `נוסע/ת ${i + 1}`; // +1 because the first form is labeled as passenger 1
    }
}

// Function to submit form data and fetch prices
async function submitFormData() {
    const forms = document.querySelectorAll('#formsContainer .form-container');
    const numberInput = document.getElementById('numberInput').value;
    const destination = document.getElementById('exampleDataList').value;

    const passengers = Array.from(forms).map(form => {
        const age = form.querySelector('input[type="number"]').value;
        const covers = Array.from(form.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.id);
        return { age, covers };
    });

    const requestData = {
        numberInput,
        destination,
        passengers
    };

    const response = await fetch('/api/prices/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    });

    const prices = await response.json();

    // Update the card titles with the fetched prices
    const cards = document.querySelectorAll('.card .card-title');
    cards.forEach((card, index) => {
        card.textContent = `${prices[index]} $`;
    });
}

document.querySelector('#submitFormButton').addEventListener('click', submitFormData);

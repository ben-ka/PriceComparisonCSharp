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

    if (!response.ok) {
        console.error('Failed to fetch prices:', response.statusText);
        return;
    }

    const prices = await response.json();

    const cards = document.querySelectorAll('.card .card-title');
    cards.forEach((card, index) => {
        card.textContent = `${prices[index]} $`;
    });
}

document.querySelector('#submitFormButton').addEventListener('click', submitFormData);

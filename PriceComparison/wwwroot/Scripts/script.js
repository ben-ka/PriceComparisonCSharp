
const FXPrice = document.getElementById('fxPrice');
const PCPrice = document.getElementById('pasportCard-price');
const harelPrice = document.getElementById('harel-price');

const basicFXPriceText = parseFloat(FXPrice.textContent.trim().replace('$', ''));
const basictPCPriceText = parseFloat(PCPrice.textContent.trim().replace('$', ''));
const basicHarelPriceText = parseFloat(harelPrice.textContent.trim().replace('$', ''));


document.getElementById('addFormButton').addEventListener('click', function () {
    const originalForm = document.getElementById('form');

    const newForm = originalForm.cloneNode(true);
    newForm.classList.add('cloned-form');

    const formsContainer = document.getElementById('formsContainer');
    let passengerNum = formsContainer.children.length + 1;

    PCPrice.textContent = `$ ${(passengerNum) * basictPCPriceText}`;
    FXPrice.textContent = `$ ${(passengerNum) * basicFXPriceText}`;
    harelPrice.textContent = `$ ${(passengerNum) * basicHarelPriceText}`;

    const passengerLabel = newForm.querySelector('.passenger-label');
    passengerLabel.textContent = `נוסע/ת ${passengerNum}`;

    newForm.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    newForm.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = '';
    });

    const deleteButton = newForm.querySelector('.btn-warning');
    deleteButton.addEventListener('click', function () {
        if (newForm.classList.contains('cloned-form')) {
            formsContainer.removeChild(newForm);
            passengerNum = formsContainer.children.length + 1;

            console.log(passengerNum);
            PCPrice.textContent = `$ ${(passengerNum - 1) * basictPCPriceText}`;
            FXPrice.textContent = `$ ${(passengerNum - 1) * basicFXPriceText}`;
            harelPrice.textContent = `$ ${(passengerNum - 1) * basicHarelPriceText}`;
            updatePassengerNumbers();
            submitFormData(); // Recalculate prices
        }
    });

    formsContainer.appendChild(newForm);
    addEventListenersToForm(newForm);
    submitFormData(); // Recalculate prices
});

document.getElementById('numberInput').addEventListener('input', submitFormData);
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

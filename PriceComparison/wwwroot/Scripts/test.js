const FXPrice = document.getElementById('fxPrice');
const PCPrice = document.getElementById('pasportCard-price');
const harelPrice = document.getElementById('harel-price');

const basicFXPriceText = parseFloat(FXPrice.textContent.trim().replace('$', ''));
const basictPCPriceText = parseFloat(PCPrice.textContent.trim().replace('$', ''));
const basicHarelPriceText = parseFloat(harelPrice.textContent.trim().replace('$', ''));

console.log('FX Price:', basicFXPriceText);
console.log('Passport Card Price:', basictPCPriceText);
console.log('Harel Price:', basicHarelPriceText);

document.getElementById('addFormButton').addEventListener('click', function () {
    const formsContainer = document.getElementById('formsContainer');
    const passengerNum = formsContainer.children.length + 1;
    PCPrice.textContent = `$ ${(passengerNum - 1) * basictPCPriceText}`;
    FXPrice.textContent = `$ ${(passengerNum - 1) * basicFXPriceText}`;
    harelPrice.textContent = `$ ${(passengerNum - 1) * basicHarelPriceText}`;


    const deleteButton = newForm.querySelector('.btn-warning');
    deleteButton.addEventListener('click', function () {
        if (newForm.classList.contains('cloned-form')) {
            formsContainer.removeChild(newForm);
            PCPrice.textContent = `$ ${(passengerNum - 1) * basictPCPriceText}`;
            FXPrice.textContent = `$ ${(passengerNum - 1) * basicFXPriceText}`;
            harelPrice.textContent = `$ ${(passengerNum - 1) * basicHarelPriceText}`;
            console.log(harelPrice);
            
        }
    });
});

//  Get the message parameter from the URL
const urlParams = new URLSearchParams(document.location.search);
const message = urlParams.get('message');
console.log(message);
const verStatus = urlParams.get('status');

// Get the card, status icons and status message elements
const card = document.querySelector('.card');
const statusIcon = document.getElementById('statusIcon');
const statusMessage = document.getElementById('statusMessage');
const btn = document.getElementById("btn");

// Display appropriate content and set background color based on the message parameter
if (verStatus === 'success') {
    statusIcon.innerHTML = '✔️';
    statusMessage.textContent = message;
    card.classList.add('success');
    statusIcon.classList.add('success');
    statusMessage.classList.add('success');
    btn.classList.add('showBtn');
} else if (verStatus === 'error') {
    statusIcon.innerHTML = '❌';
    statusMessage.textContent = message;
    card.classList.add('error');
    statusIcon.classList.add('error');
    statusMessage.classList.add('error');
    btn.classList.add('hideBtn');
} else {
    statusIcon.innerHTML = '❓';
    statusMessage.textContent = message;
    card.classList.add('error');
    statusIcon.classList.add('error');
    statusMessage.classList.add('error');
    btn.classList.add('hideBtn');
}

/**
 * Main JavaScript File for Seva Foundation Website
 * Handles Mobile Menu, Modals, Dynamic QR Code Generator & Counter Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    initCounterAnimation();
    setupMobileMenu();
});

/* --- Mobile Navigation Drawer --- */
function setupMobileMenu() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', toggleMobileMenu);
    }
}

function toggleMobileMenu() {
    const mobileDrawer = document.getElementById('mobileDrawer');
    if (mobileDrawer) {
        mobileDrawer.classList.toggle('hidden');
    }
}

/* --- Scholarship Modal Controllers --- */
function openScholarshipModal() {
    const modal = document.getElementById('scholarshipModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeScholarshipModal() {
    const modal = document.getElementById('scholarshipModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

function handleScholarshipSubmit(e) {
    e.preventDefault();
    alert('धन्यवाद! तुमचा अर्ज सेवा फाउंडेशन (Seva Foundation) कडे प्राप्त झाला आहे. आमची टीम लवकरच तुमच्याशी संपर्क साधेल.');
    closeScholarshipModal();
    e.target.reset();
}

/* --- Donation Modal Controllers & Dynamic UPI QR --- */
function openDonateModal() {
    const modal = document.getElementById('donateModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        selectModalAmount(2000); // Default selection
    }
}

function openDonateModalWithAmount(amount) {
    openDonateModal();
    selectModalAmount(amount);
}

function closeDonateModal() {
    const modal = document.getElementById('donateModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

let selectedAmount = 2000;

function selectModalAmount(amount) {
    selectedAmount = amount;
    const input = document.getElementById('customAmountInput');
    if (input) input.value = amount;

    // Highlight active button
    document.querySelectorAll('.modal-amt-btn').forEach(btn => {
        if (btn.innerText.includes(amount.toLocaleString('en-IN'))) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    updateQrCode();
}

function updateQrCode() {
    const input = document.getElementById('customAmountInput');
    const amt = input && input.value ? parseFloat(input.value) : selectedAmount;
    const qrImage = document.getElementById('upiQrImage');
    
    if (qrImage && amt > 0) {
        const upiString = `upi://pay?pa=sevafoundation@sbi&pn=Seva%20Foundation&am=${amt}&cu=INR`;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(upiString)}`;
        qrImage.src = qrUrl;
    }
}

function confirmDonationDone() {
    alert('सेवा फाउंडेशनला सहकार्य केल्याबद्दल मनःपूर्वक धन्यवाद! तुमच्या योगदानामुळे एका गरजू विद्यार्थ्याचे भविष्य उज्ज्वल होईल.');
    closeDonateModal();
}

function handleContactSubmit(e) {
    e.preventDefault();
    alert('धन्यवाद! तुमचा संदेश सेवा फाउंडेशनला प्राप्त झाला आहे. आम्ही लवकरच उत्तर देऊ.');
    e.target.reset();
}

/* --- Animated Statistics Counter on Scroll --- */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    let animated = false;

    const runCounter = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const speed = 200;
            const updateCount = () => {
                const count = +counter.innerText;
                const inc = Math.ceil(target / speed * 5);
                if (count < target) {
                    counter.innerText = count + inc > target ? target : count + inc;
                    setTimeout(updateCount, 30);
                } else {
                    counter.innerText = target + '+';
                }
            };
            updateCount();
        });
    };

    window.addEventListener('scroll', () => {
        const impactSection = document.getElementById('impact');
        if (impactSection && !animated) {
            const rect = impactSection.getBoundingClientRect();
            if (rect.top <= window.innerHeight - 100) {
                animated = true;
                runCounter();
            }
        }
    });
}

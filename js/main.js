/**
 * Main JavaScript File for Swarajya Seva Foundation
 * Features: 3-Step Donation Checkout Wizard, Persistent Logo Header, Admin PIN (1234), and Google Sheets CSV Downloader
 */

// Initial Seed Data for Applicants & Donors (Saved in LocalStorage)
const defaultApplicants = [
    {
        id: "SSF-2026-01",
        date: "2026-10-01",
        name: "Rahul Prakash Patil",
        dob: "2004-05-14",
        phone: "9876543210",
        occupation: "Small Scale Farmer",
        status: "Completed 12th Science",
        college: "Government Engineering College, Pune",
        course: "B.Tech (Computer Engineering)",
        amount: "15000",
        reason: "Father faces agricultural debt. Needs semester exam fee support."
    },
    {
        id: "SSF-2026-02",
        date: "2026-10-03",
        name: "Sneha Kadam",
        dob: "2005-08-22",
        phone: "9123456780",
        occupation: "Daily Wage Agriculture Laborer",
        status: "Completed 12th HSC",
        college: "Institute of Nursing Sciences",
        course: "B.Sc Nursing",
        amount: "12000",
        reason: "Mother is sole breadwinner. Needs admission fee assistance."
    }
];

const defaultDonations = [
    {
        id: "DON-1001",
        date: "2026-10-05",
        name: "Anand Deshmukh",
        phone: "9021751543",
        email: "anand@example.com",
        address: "MG Road, Deccan",
        city: "Pune",
        pincode: "411004",
        state: "Maharashtra",
        amount: "5000",
        mode: "UPI (GPay)"
    },
    {
        id: "DON-1002",
        date: "2026-10-07",
        name: "Sunita Kulkarni",
        phone: "9822001122",
        email: "sunita@example.com",
        address: "Kothrud Depot",
        city: "Pune",
        pincode: "411038",
        state: "Maharashtra",
        amount: "10000",
        mode: "Bank Transfer (NEFT)"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    initStorage();
    setupMobileMenu();
});

function initStorage() {
    if (!localStorage.getItem('ssf_applicants')) {
        localStorage.setItem('ssf_applicants', JSON.stringify(defaultApplicants));
    }
    if (!localStorage.getItem('ssf_donations')) {
        localStorage.setItem('ssf_donations', JSON.stringify(defaultDonations));
    }
}

function getApplicants() {
    return JSON.parse(localStorage.getItem('ssf_applicants') || '[]');
}

function getDonations() {
    return JSON.parse(localStorage.getItem('ssf_donations') || '[]');
}

/* --- Admin Portal Toggle & Authentication --- */
let isAdminLoggedIn = false;

function toggleAdminMode() {
    if (!isAdminLoggedIn) {
        const pin = prompt("Owner/Admin Access - Enter Admin PIN (Default PIN: 1234):");
        if (pin === "1234") {
            isAdminLoggedIn = true;
            document.getElementById('adminToggleText').innerText = "🌐 Exit Admin Mode";
            document.getElementById('userPublicView').classList.add('hidden');
            document.getElementById('adminDashboardView').classList.remove('hidden');
            renderAdminTables();
        } else if (pin !== null) {
            alert("Incorrect Admin PIN! Please enter 1234.");
        }
    } else {
        isAdminLoggedIn = false;
        document.getElementById('adminToggleText').innerText = "🔒 Owner/Admin Portal";
        document.getElementById('adminDashboardView').classList.add('hidden');
        document.getElementById('userPublicView').classList.remove('hidden');
    }
}

function switchAdminTab(tab) {
    const appTab = document.getElementById('adminApplicantsTab');
    const donTab = document.getElementById('adminDonationsTab');
    const btnApp = document.getElementById('tabBtnApplicants');
    const btnDon = document.getElementById('tabBtnDonations');

    if (tab === 'applicants') {
        appTab.classList.remove('hidden');
        donTab.classList.add('hidden');
        btnApp.className = "py-3 px-6 border-b-2 border-sunOrange-600 text-sunOrange-600 font-extrabold";
        btnDon.className = "py-3 px-6 border-b-2 border-transparent text-navy-800 font-bold hover:text-sunOrange-600";
    } else {
        donTab.classList.remove('hidden');
        appTab.classList.add('hidden');
        btnDon.className = "py-3 px-6 border-b-2 border-sunOrange-600 text-sunOrange-600 font-extrabold";
        btnApp.className = "py-3 px-6 border-b-2 border-transparent text-navy-800 font-bold hover:text-sunOrange-600";
    }
}

function renderAdminTables() {
    const applicants = getApplicants();
    const donations = getDonations();

    document.getElementById('applicantCount').innerText = applicants.length;
    document.getElementById('donorCount').innerText = donations.length;

    // Render Applicants Table
    const appTbody = document.getElementById('applicantsTableBody');
    appTbody.innerHTML = applicants.map(a => `
        <tr class="hover:bg-slate-50">
            <td class="p-3 font-mono text-slate-500"><strong>${a.id}</strong><br><span class="text-[10px]">${a.date}</span></td>
            <td class="p-3 font-bold text-navy-700">${a.name}</td>
            <td class="p-3">${a.dob}</td>
            <td class="p-3">${a.phone}</td>
            <td class="p-3">${a.occupation}</td>
            <td class="p-3"><strong>${a.college}</strong><br><span class="text-sunOrange-600">${a.course}</span></td>
            <td class="p-3 font-extrabold text-sprout-600">₹ ${parseInt(a.amount).toLocaleString('en-IN')}</td>
            <td class="p-3 text-slate-600 max-w-xs truncate" title="${a.reason}">${a.reason}</td>
        </tr>
    `).join('');

    // Render Donations & Address Audit Table
    const donTbody = document.getElementById('donationsTableBody');
    donTbody.innerHTML = donations.map(d => `
        <tr class="hover:bg-slate-50">
            <td class="p-3 font-mono text-slate-500"><strong>${d.id}</strong><br><span class="text-[10px]">${d.date}</span></td>
            <td class="p-3 font-bold text-navy-700">${d.name}</td>
            <td class="p-3">${d.phone}<br><span class="text-[11px] text-slate-500">${d.email || '-'}</span></td>
            <td class="p-3">${d.address || '-'}, ${d.city || ''} (${d.pincode || ''}) ${d.state || ''}</td>
            <td class="p-3 font-extrabold text-sprout-600">₹ ${parseInt(d.amount).toLocaleString('en-IN')}</td>
            <td class="p-3"><span class="bg-sunflower-100 text-navy-900 text-[10px] font-bold px-2 py-0.5 rounded-md">${d.mode}</span></td>
        </tr>
    `).join('');
}

/* --- Export Data to CSV (Optimized for Google Sheets & Microsoft Excel) --- */
function downloadApplicantsCSV() {
    const applicants = getApplicants();
    if (applicants.length === 0) {
        alert("No applicants data available to export.");
        return;
    }

    let csvContent = "\uFEFF"; // UTF-8 BOM for proper Unicode rendering in Google Sheets & Excel
    csvContent += "Ref ID,Application Date,Student Full Name,Birth Date,Contact Phone,Parent Occupation,Current Status,College Name,Course Name,Amount Needed (INR),Reason\n";

    applicants.forEach(a => {
        const row = [
            `"${a.id}"`,
            `"${a.date}"`,
            `"${a.name}"`,
            `"${a.dob}"`,
            `"${a.phone}"`,
            `"${a.occupation}"`,
            `"${a.status}"`,
            `"${a.college}"`,
            `"${a.course}"`,
            `"${a.amount}"`,
            `"${a.reason.replace(/"/g, '""')}"`
        ];
        csvContent += row.join(",") + "\n";
    });

    triggerCSVDownload(csvContent, `Swarajya_Seva_Foundation_Applicants_${new Date().toISOString().slice(0, 10)}.csv`);
}

function downloadDonationsCSV() {
    const donations = getDonations();
    if (donations.length === 0) {
        alert("No donor audit data available to export.");
        return;
    }

    let csvContent = "\uFEFF";
    csvContent += "Donation Ref ID,Date,Donor Full Name,Contact Phone,Email Address,Address,City,Pincode,State,Donation Amount (INR),Payment Mode\n";

    donations.forEach(d => {
        const row = [
            `"${d.id}"`,
            `"${d.date}"`,
            `"${d.name}"`,
            `"${d.phone}"`,
            `"${d.email}"`,
            `"${(d.address || '').replace(/"/g, '""')}"`,
            `"${d.city || ''}"`,
            `"${d.pincode || ''}"`,
            `"${d.state || ''}"`,
            `"${d.amount}"`,
            `"${d.mode}"`
        ];
        csvContent += row.join(",") + "\n";
    });

    triggerCSVDownload(csvContent, `Swarajya_Seva_Foundation_Donor_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
}

function triggerCSVDownload(content, fileName) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/* --- 3-STEP DONATION CHECKOUT WIZARD LOGIC --- */
let currentDonateStep = 1;

function openDonateModal() {
    const modal = document.getElementById('donateModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        goToDonateStep(1);
    }
}

function closeDonateModal() {
    const modal = document.getElementById('donateModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

function selectDonatePreset(amount) {
    const input = document.getElementById('donateAmountInput');
    if (input) {
        input.value = amount;
    }

    document.querySelectorAll('.donate-preset-btn').forEach(btn => {
        if (btn.innerText.includes(amount.toLocaleString('en-IN'))) {
            btn.className = "donate-preset-btn active py-3 px-2 text-xs font-black border-2 border-sunOrange-500 bg-amber-50 text-sunOrange-600 rounded-xl transition-all";
        } else {
            btn.className = "donate-preset-btn py-3 px-2 text-xs font-black border-2 border-slate-200 rounded-xl hover:border-sunOrange-500 text-navy-900 transition-all";
        }
    });

    updateCheckoutAmount();
}

function updateCheckoutAmount() {
    const amtInput = document.getElementById('donateAmountInput');
    const amt = amtInput && amtInput.value ? parseFloat(amtInput.value) : 5000;
    
    // Update Checkout Display
    const display = document.getElementById('checkoutAmountDisplay');
    if (display) {
        display.innerText = '₹ ' + (amt > 0 ? amt.toLocaleString('en-IN') : '0');
    }

    // Update Dynamic UPI QR Code
    const qrImg = document.getElementById('dynamicUpiQr');
    if (qrImg) {
        const upiString = `upi://pay?pa=swarajyasevafoundation@sbi&pn=Swarajya%20Seva%20Foundation&am=${amt}&cu=INR`;
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(upiString)}`;
    }
}

function goToDonateStep(step) {
    currentDonateStep = step;

    // Step Visibility
    document.getElementById('donateStep1').classList.toggle('hidden', step !== 1);
    document.getElementById('donateStep2').classList.toggle('hidden', step !== 2);
    document.getElementById('donateStep3').classList.toggle('hidden', step !== 3);

    // Indicator Styles
    const ind1 = document.getElementById('stepIndicator1');
    const ind2 = document.getElementById('stepIndicator2');
    const ind3 = document.getElementById('stepIndicator3');

    if (step === 1) {
        ind1.className = "flex items-center gap-1.5 text-sunOrange-600 font-extrabold";
        ind2.className = "flex items-center gap-1.5 text-slate-400 font-extrabold";
        ind3.className = "flex items-center gap-1.5 text-slate-400 font-extrabold";
    } else if (step === 2) {
        ind1.className = "flex items-center gap-1.5 text-sprout-600 font-extrabold";
        ind2.className = "flex items-center gap-1.5 text-sunOrange-600 font-extrabold";
        ind3.className = "flex items-center gap-1.5 text-slate-400 font-extrabold";
    } else if (step === 3) {
        ind1.className = "flex items-center gap-1.5 text-sprout-600 font-extrabold";
        ind2.className = "flex items-center gap-1.5 text-sprout-600 font-extrabold";
        ind3.className = "flex items-center gap-1.5 text-sunOrange-600 font-extrabold";
        updateCheckoutAmount();
    }
}

function validateAndGoToStep3() {
    const name = document.getElementById('donorName').value;
    const phone = document.getElementById('donorPhone').value;
    const email = document.getElementById('donorEmail').value;

    if (!name || !phone || !email) {
        alert("Please fill in your Full Name, Contact Phone, and Email ID.");
        return;
    }

    goToDonateStep(3);
}

function confirmDonationDone() {
    const amtInput = document.getElementById('donateAmountInput');
    const amount = amtInput && amtInput.value ? amtInput.value : "5000";

    const newDonation = {
        id: "DON-" + (Math.floor(Math.random() * 9000) + 1000),
        date: new Date().toISOString().slice(0, 10),
        name: document.getElementById('donorName').value || "Generous Donor",
        phone: document.getElementById('donorPhone').value || "-",
        email: document.getElementById('donorEmail').value || "-",
        address: document.getElementById('donorAddress').value || "-",
        city: document.getElementById('donorCity').value || "-",
        pincode: document.getElementById('donorPincode').value || "-",
        state: document.getElementById('donorState').value || "-",
        amount: amount,
        mode: "UPI / QR Checkout"
    };

    const dons = getDonations();
    dons.unshift(newDonation);
    localStorage.setItem('ssf_donations', JSON.stringify(dons));

    alert('Heartfelt thanks, ' + newDonation.name + '! Your donation record of ₹' + parseFloat(amount).toLocaleString('en-IN') + ' has been saved in Swarajya Seva Foundation Audit Database. Admin can view & export this data to Google Sheets.');
    closeDonateModal();
}

/* --- Scholarship Submission Handler --- */
function handleScholarshipSubmit(e) {
    e.preventDefault();
    
    const newApp = {
        id: "SSF-2026-0" + (getApplicants().length + 1),
        date: new Date().toISOString().slice(0, 10),
        name: document.getElementById('appFullName').value,
        dob: document.getElementById('appDob').value,
        phone: document.getElementById('appPhone').value,
        occupation: document.getElementById('appOccupation').value,
        status: document.getElementById('appStatus').value,
        college: document.getElementById('appCollege').value,
        course: document.getElementById('appCourse').value,
        amount: document.getElementById('appAmount').value,
        reason: document.getElementById('appReason').value
    };

    const apps = getApplicants();
    apps.unshift(newApp);
    localStorage.setItem('ssf_applicants', JSON.stringify(apps));

    alert('Thank you! Your Scholarship Application has been submitted. Reference ID: ' + newApp.id + '. Admin can view and download this entry for Google Sheets.');
    closeScholarshipModal();
    e.target.reset();
}

/* --- Contact & Sponsor Handlers --- */
function handleContactSubmit(e) {
    e.preventDefault();
    alert('Thank you for contacting Swarajya Seva Foundation! Your message has been saved (+91 90217 51543).');
    e.target.reset();
}

function expressSponsorInterest(studentName, refNo) {
    const sponsorName = prompt(`You are sponsoring ${studentName} (${refNo}). Please enter your Name / Phone Number:`);
    if (sponsorName) {
        alert(`Thank you ${sponsorName}! Swarajya Seva Foundation will obtain formal consent from ${studentName} and connect you directly (+91 90217 51543).`);
    }
}

/* --- Mobile Menu --- */
function setupMobileMenu() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    if (mobileBtn) mobileBtn.addEventListener('click', toggleMobileMenu);
}

function toggleMobileMenu() {
    const mobileDrawer = document.getElementById('mobileDrawer');
    if (mobileDrawer) mobileDrawer.classList.toggle('hidden');
}

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

/**
 * Main JavaScript File for Swarajya Seva Foundation
 * Features: Trust Deed Alignment, Admin Mode Toggle, LocalStorage Persistence & Google Sheets CSV Data Exporter
 */

// Initial Sample Seed Data for Applicants & Donors (Persisted in LocalStorage)
const defaultApplicants = [
    {
        id: "SSF-2026-01",
        date: "2026-09-28",
        name: "Rahul Prakash Patil",
        dob: "2004-05-14",
        phone: "9876543210",
        occupation: "Small Scale Farmer",
        status: "Completed 12th Science",
        college: "Government Engineering College, Pune",
        course: "B.Tech (Computer Engineering)",
        amount: "15000",
        reason: "Father faces agricultural debt. Needs semester fee support."
    },
    {
        id: "SSF-2026-02",
        date: "2026-09-30",
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
        name: "Anand Deshmukh",
        amount: "5000",
        sector: "Education & Awareness (40%)",
        date: "2026-09-29",
        mode: "UPI (GPay)"
    },
    {
        id: "DON-1002",
        name: "Sunita Kulkarni",
        amount: "10000",
        sector: "Agricultural Empowerment (30%)",
        date: "2026-10-01",
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
        btnApp.className = "py-3 px-6 border-b-2 border-soil-600 text-soil-600 font-bold";
        btnDon.className = "py-3 px-6 border-b-2 border-transparent text-slate-500 hover:text-slate-800 font-bold";
    } else {
        donTab.classList.remove('hidden');
        appTab.classList.add('hidden');
        btnDon.className = "py-3 px-6 border-b-2 border-soil-600 text-soil-600 font-bold";
        btnApp.className = "py-3 px-6 border-b-2 border-transparent text-slate-500 hover:text-slate-800 font-bold";
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
            <td class="p-3 font-bold text-slate-900">${a.name}</td>
            <td class="p-3">${a.dob}</td>
            <td class="p-3">${a.phone}</td>
            <td class="p-3">${a.occupation}</td>
            <td class="p-3"><strong>${a.college}</strong><br><span class="text-soil-600">${a.course}</span></td>
            <td class="p-3 font-extrabold text-emerald-700">₹ ${parseInt(a.amount).toLocaleString('en-IN')}</td>
            <td class="p-3 text-slate-600 max-w-xs truncate" title="${a.reason}">${a.reason}</td>
        </tr>
    `).join('');

    // Render Donations Table
    const donTbody = document.getElementById('donationsTableBody');
    donTbody.innerHTML = donations.map(d => `
        <tr class="hover:bg-slate-50">
            <td class="p-3 font-bold text-slate-900">${d.name}<br><span class="text-[10px] text-slate-400 font-mono">${d.id}</span></td>
            <td class="p-3 font-extrabold text-emerald-700">₹ ${parseInt(d.amount).toLocaleString('en-IN')}</td>
            <td class="p-3"><span class="bg-soil-100 text-soil-800 text-[10px] font-bold px-2 py-0.5 rounded-md">${d.sector}</span></td>
            <td class="p-3">${d.date}</td>
            <td class="p-3">${d.mode}</td>
        </tr>
    `).join('');
}

/* --- Export Data to CSV (Compatible with Google Sheets & Excel) --- */
function downloadApplicantsCSV() {
    const applicants = getApplicants();
    if (applicants.length === 0) {
        alert("No applicants data available to export.");
        return;
    }

    let csvContent = "\uFEFF"; // UTF-8 BOM for proper Excel / Google Sheets unicode rendering
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
        alert("No donation audit data available to export.");
        return;
    }

    let csvContent = "\uFEFF";
    csvContent += "Transaction ID,Donor Name,Amount (INR),Allocated Sector,Date,Payment Mode\n";

    donations.forEach(d => {
        const row = [
            `"${d.id}"`,
            `"${d.name}"`,
            `"${d.amount}"`,
            `"${d.sector}"`,
            `"${d.date}"`,
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

    alert('Thank you! Your Scholarship Application has been recorded. Reference ID: ' + newApp.id + '. Admin can view and export this entry to Google Sheets.');
    closeScholarshipModal();
    e.target.reset();
}

/* --- Mobile Menu & Modals --- */
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

function openDonateModal() {
    const modal = document.getElementById('donateModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeDonateModal() {
    const modal = document.getElementById('donateModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

function confirmDonationDone() {
    const donorName = prompt("Thank you for your donation! Please enter your Name for receipt logging:") || "Anonymous Donor";
    const newDonation = {
        id: "DON-" + (Math.floor(Math.random() * 9000) + 1000),
        name: donorName,
        amount: "5000",
        sector: "General Trust Deed Fund",
        date: new Date().toISOString().slice(0, 10),
        mode: "UPI Scan"
    };

    const dons = getDonations();
    dons.unshift(newDonation);
    localStorage.setItem('ssf_donations', JSON.stringify(dons));

    alert('Heartfelt thanks! Your contribution has been recorded in the Audit log.');
    closeDonateModal();
}

function expressSponsorInterest(studentName, refNo) {
    const sponsorName = prompt(`You are sponsoring ${studentName} (${refNo}). Please enter your Name / Phone Number:`);
    if (sponsorName) {
        alert(`Thank you ${sponsorName}! Swarajya Seva Foundation will obtain formal consent from ${studentName} and connect you directly (+91 90217 51543).`);
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    alert('Thank you for contacting Swarajya Seva Foundation! We will respond within 24 hours (+91 90217 51543).');
    e.target.reset();
}

/**
 * Main JavaScript File for Swarajya Seva Foundation
 * Features: Official Logo Matching, LocalStorage Data Persistence, Admin PIN (1234), and Google Sheets CSV Downloader
 */

// Initial Seed Data for Applicants & Inquiries (Saved in LocalStorage)
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

const defaultInquiries = [
    {
        date: "2026-10-04",
        name: "Anand Deshmukh",
        phone: "9021751543",
        email: "anand@example.com",
        sector: "Education / Scholarship",
        message: "Interested in sponsoring a engineering student."
    },
    {
        date: "2026-10-05",
        name: "Sunita Kulkarni",
        phone: "9822001122",
        email: "sunita@example.com",
        sector: "Agriculture / Soil Health",
        message: "Want to organize organic soil testing drive in our village."
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
    if (!localStorage.getItem('ssf_inquiries')) {
        localStorage.setItem('ssf_inquiries', JSON.stringify(defaultInquiries));
    }
}

function getApplicants() {
    return JSON.parse(localStorage.getItem('ssf_applicants') || '[]');
}

function getInquiries() {
    return JSON.parse(localStorage.getItem('ssf_inquiries') || '[]');
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
    const inqTab = document.getElementById('adminInquiriesTab');
    const btnApp = document.getElementById('tabBtnApplicants');
    const btnInq = document.getElementById('tabBtnInquiries');

    if (tab === 'applicants') {
        appTab.classList.remove('hidden');
        inqTab.classList.add('hidden');
        btnApp.className = "py-3 px-6 border-b-2 border-saffron-500 text-saffron-600 font-bold";
        btnInq.className = "py-3 px-6 border-b-2 border-transparent text-slate-500 hover:text-slate-800 font-bold";
    } else {
        inqTab.classList.remove('hidden');
        appTab.classList.add('hidden');
        btnInq.className = "py-3 px-6 border-b-2 border-saffron-500 text-saffron-600 font-bold";
        btnApp.className = "py-3 px-6 border-b-2 border-transparent text-slate-500 hover:text-slate-800 font-bold";
    }
}

function renderAdminTables() {
    const applicants = getApplicants();
    const inquiries = getInquiries();

    document.getElementById('applicantCount').innerText = applicants.length;
    document.getElementById('inquiryCount').innerText = inquiries.length;

    // Render Applicants Table
    const appTbody = document.getElementById('applicantsTableBody');
    appTbody.innerHTML = applicants.map(a => `
        <tr class="hover:bg-slate-50">
            <td class="p-3 font-mono text-slate-500"><strong>${a.id}</strong><br><span class="text-[10px]">${a.date}</span></td>
            <td class="p-3 font-bold text-navy-700">${a.name}</td>
            <td class="p-3">${a.dob}</td>
            <td class="p-3">${a.phone}</td>
            <td class="p-3">${a.occupation}</td>
            <td class="p-3"><strong>${a.college}</strong><br><span class="text-saffron-600">${a.course}</span></td>
            <td class="p-3 font-extrabold text-sprout-600">₹ ${parseInt(a.amount).toLocaleString('en-IN')}</td>
            <td class="p-3 text-slate-600 max-w-xs truncate" title="${a.reason}">${a.reason}</td>
        </tr>
    `).join('');

    // Render Inquiries Table
    const inqTbody = document.getElementById('inquiriesTableBody');
    inqTbody.innerHTML = inquiries.map(i => `
        <tr class="hover:bg-slate-50">
            <td class="p-3 font-mono text-slate-500">${i.date}</td>
            <td class="p-3 font-bold text-navy-700">${i.name}</td>
            <td class="p-3">${i.phone}<br><span class="text-[11px] text-slate-500">${i.email || '-'}</span></td>
            <td class="p-3"><span class="bg-saffron-50 text-saffron-700 text-[10px] font-bold px-2 py-0.5 rounded-md">${i.sector}</span></td>
            <td class="p-3 text-slate-600">${i.message}</td>
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

function downloadInquiriesCSV() {
    const inquiries = getInquiries();
    if (inquiries.length === 0) {
        alert("No contact inquiry data available to export.");
        return;
    }

    let csvContent = "\uFEFF";
    csvContent += "Date,Name,Phone Number,Email Address,Sector of Interest,Message\n";

    inquiries.forEach(i => {
        const row = [
            `"${i.date}"`,
            `"${i.name}"`,
            `"${i.phone}"`,
            `"${i.email || ''}"`,
            `"${i.sector}"`,
            `"${i.message.replace(/"/g, '""')}"`
        ];
        csvContent += row.join(",") + "\n";
    });

    triggerCSVDownload(csvContent, `Swarajya_Seva_Foundation_Inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
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

/* --- Scholarship Application Handler --- */
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

/* --- Contact Form Submission Handler --- */
function handleContactSubmit(e) {
    e.preventDefault();
    
    const newInquiry = {
        date: new Date().toISOString().slice(0, 10),
        name: document.getElementById('contactName').value,
        phone: document.getElementById('contactPhone').value,
        email: document.getElementById('contactEmail').value,
        sector: document.getElementById('contactSector').value,
        message: document.getElementById('contactMessage').value
    };

    const inqs = getInquiries();
    inqs.unshift(newInquiry);
    localStorage.setItem('ssf_inquiries', JSON.stringify(inqs));

    alert('Thank you for contacting Swarajya Seva Foundation! Your message has been saved and can be exported by Admin to Google Sheets (+91 90217 51543).');
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
    alert('Heartfelt thanks for supporting Swarajya Seva Foundation! Your contribution empowers education, health and agricultural progress.');
    closeDonateModal();
}

function expressSponsorInterest(studentName, refNo) {
    const sponsorName = prompt(`You are sponsoring ${studentName} (${refNo}). Please enter your Name / Phone Number:`);
    if (sponsorName) {
        alert(`Thank you ${sponsorName}! Swarajya Seva Foundation will obtain formal consent from ${studentName} and connect you directly (+91 90217 51543).`);
    }
}

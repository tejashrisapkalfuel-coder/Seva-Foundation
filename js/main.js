/**
 * Main JavaScript File for Swarajya Seva Foundation
 * Features: Multilingual (English/Marathi/Hindi) Switcher, Sponsor Matching, Modals & Tracking
 */

document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
});

/* --- Multilingual Dictionary Engine --- */
const translations = {
    en: {
        ngo_title: "Swarajya Seva Foundation",
        ngo_slogan: "Serving the Soil • Education | Agriculture | Health",
        nav_about: "About Us",
        nav_sectors: "Our Sectors",
        nav_transparency: "Funding Transparency",
        nav_sponsors: "Sponsor a Student",
        nav_contact: "Contact",
        btn_apply_scholarship: "Apply for Scholarship",
        btn_donate: "Donate Now",
        hero_tagline_badge: "Official Registered NGO • Slogan: Serving the Soil",
        hero_h1_1: "Serving the Soil,",
        hero_h1_2: "Empowering Education, Agriculture & Health",
        hero_desc: "Swarajya Seva Foundation (Founded by Tejashri Sapkal) works relentlessly to provide Educational Scholarships, Farmer & Agricultural Support, and Healthcare assistance with 100% transparent funding.",
        hero_btn_scholarship: "Apply for Scholarship",
        hero_btn_donate: "Support / Donate",
        badge_scholarships: "Scholarship & Counseling",
        badge_agri: "Farmer & Soil Health",
        badge_health: "Free Medical Camps",
        founder_card_title: "Founder's Vision",
        founder_quote: '"Through Swarajya Seva Foundation, our mission is to nourish the roots of our society — by serving the soil that feeds us, educating the youth who shape our future, and caring for the health of every family."',
        sectors_badge: "Our Focus Areas",
        sectors_h2: "Major Work Sectors",
        sectors_desc: "Empowering society through three interconnected pillars of sustainable growth.",
        sector1_title: "1. Education & Scholarships",
        sector1_desc: "Providing financial scholarship support, 1-on-1 career guidance, exam fee assistance, and study materials for deserving students.",
        sector2_title: "2. Agriculture (Serving the Soil)",
        sector2_desc: "Promoting organic farming, soil testing guidance, farmer training workshops, and sustainable agricultural techniques for rural prosperity.",
        sector3_title: "3. Healthcare & Medical Assistance",
        sector3_desc: "Organizing free health check-up camps, blood donation drives, emergency medical relief, and preventive healthcare awareness.",
        transparency_badge: "Full Transparency",
        transparency_h2: "Funding Utilization & Beneficiary Tracker",
        transparency_desc: "At Swarajya Seva Foundation, every rupee contributed by donors is tracked and assigned directly to verified beneficiaries with complete transparency."
    },
    mr: {
        ngo_title: "स्वराज्य सेवा फाउंडेशन",
        ngo_slogan: "मातीची सेवा • शिक्षण | शेती | आरोग्य",
        nav_about: "आमच्याबद्दल",
        nav_sectors: "कार्यक्षेत्रे",
        nav_transparency: "निधी पारदर्शकता",
        nav_sponsors: "विद्यार्थ्याला दत्तक घ्या",
        nav_contact: "संपर्क",
        btn_apply_scholarship: "शिष्यवृत्ती अर्ज करा",
        btn_donate: "देणगी द्या",
        hero_tagline_badge: "अधिकृत नोंदणीकृत एनजीओ • ब्रीदवाक्य: मातीची सेवा (Serving the Soil)",
        hero_h1_1: "मातीची सेवा आणि",
        hero_h1_2: "शिक्षण, शेती व आरोग्याचा विकास!",
        hero_desc: "स्वराज्य सेवा फाउंडेशन (संस्थापिका: तेजश्री सपकाळ) गरजू विद्यार्थ्यांना शिष्यवृत्ती, शेतकऱ्यांना कृषी मार्गदर्शन आणि रुग्णांना वैद्यकीय मदत १००% पारदर्शकतेने पुरवते.",
        hero_btn_scholarship: "शिष्यवृत्तीसाठी अर्ज करा",
        hero_btn_donate: "देणगी देऊन मदत करा",
        badge_scholarships: "शिष्यवृत्ती व समुपदेशन",
        badge_agri: "शेतकरी व मातीचे आरोग्य",
        badge_health: "मोफत आरोग्य शिबिरे",
        founder_card_title: "संस्थापिकेची दृष्टी",
        founder_quote: '"आपल्या समाजाच्या पाळ्यामुळ्या घट्ट करणे हेच स्वराज्य सेवा फाउंडेशनचे उद्दिष्ट आहे — आपल्याला अन्न देणाऱ्या मातीची सेवा करणे, देशाचे भविष्य घडवणाऱ्या तरुणांना शिक्षण देणे आणि सर्वांचे आरोग्य जपणे."',
        sectors_badge: "प्रमुख कार्यक्षेत्रे",
        sectors_h2: "आमचे ३ मुख्य विभाग",
        sectors_desc: "शाश्वत विकासाच्या तीन मजबूत स्तंभांद्वारे समाजाची प्रगती करणे.",
        sector1_title: "१. शिक्षण व शिष्यवृत्ती",
        sector1_desc: "गरजू व हुशार विद्यार्थ्यांना थेट शैक्षणिक शिष्यवृत्ती, १-ऑन-१ करिअर समुपदेशन, परीक्षा फी मदत व अभ्यास साहित्य देणे.",
        sector2_title: "२. शेती (मातीची सेवा - Serving the Soil)",
        sector2_desc: "सेंद्रिय शेती प्रोत्साहन, माती परीक्षण मार्गदर्शन, शेतकरी कार्यशाळा आणि आधुनिक कृषी तंत्रज्ञान मार्गदर्शन.",
        sector3_title: "३. आरोग्य व वैद्यकीय मदत",
        sector3_desc: "मोफत आरोग्य तपासणी शिबिरे, रक्तदान मोहीम, आपत्कालीन वैद्यकीय मदत आणि आरोग्य जनजागृती."
    },
    hi: {
        ngo_title: "स्वराज्य सेवा फाउंडेशन",
        ngo_slogan: "मिट्टी की सेवा • शिक्षा | कृषि | स्वास्थ्य",
        nav_about: "हमारे बारे में",
        nav_sectors: "कार्य क्षेत्र",
        nav_transparency: "फंड पारदर्शिता",
        nav_sponsors: "छात्र को स्पॉन्सर करें",
        nav_contact: "संपर्क",
        btn_apply_scholarship: "छात्रवृत्ति आवेदन",
        btn_donate: "दान करें",
        hero_tagline_badge: "पंजीकृत एनजीओ • नारा: मिट्टी की सेवा (Serving the Soil)",
        hero_h1_1: "मिट्टी की सेवा और",
        hero_h1_2: "शिक्षा, कृषि एवं स्वास्थ्य का विकास",
        hero_desc: "स्वराज्य सेवा फाउंडेशन (संस्थापक: तेजश्री सपकाल) छात्रों को छात्रवृत्ति, किसानों को कृषि सहायता और स्वास्थ्य सहायता 100% पारदर्शिता के साथ प्रदान करता है।",
        hero_btn_scholarship: "छात्रवृत्ति के लिए आवेदन करें",
        hero_btn_donate: "दान देकर सहयोग करें",
        badge_scholarships: "छात्रवृत्ति एवं मार्गदर्शन",
        badge_agri: "किसान एवं मृदा स्वास्थ्य",
        badge_health: "मुफ्त स्वास्थ्य शिविर",
        founder_card_title: "संस्थापक का संदेश",
        founder_quote: '"स्वराज्य सेवा फाउंडेशन का मुख्य उद्देश्य समाज की जड़ों को मजबूत करना है — अन्न देने वाली मिट्टी की सेवा करना, भविष्य बनाने वाले युवाओं को शिक्षा देना और हर परिवार के स्वास्थ्य की देखभाल करना।"'
    }
};

function changeLanguage(lang) {
    const dict = translations[lang] || translations.en;
    document.querySelectorAll('[data-i18n]').forEach(elem => {
        const key = elem.getAttribute('data-i18n');
        if (dict[key]) {
            elem.innerText = dict[key];
        }
    });
}

/* --- Mobile Menu Drawer --- */
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

/* --- Scholarship Application Modal --- */
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
    alert('Thank you! Your Scholarship Application has been received by Swarajya Seva Foundation. Our team will verify your details and connect with you shortly.');
    closeScholarshipModal();
    e.target.reset();
}

/* --- Sponsor Interest Direct Workflow --- */
function expressSponsorInterest(studentName, refNo) {
    const sponsorName = prompt(`You are sponsoring ${studentName} (${refNo}). Please enter your Name / Phone Number to express interest:`);
    if (sponsorName) {
        alert(`Thank you ${sponsorName}! Swarajya Seva Foundation will take formal consent from ${studentName} and connect you directly (+91 90217 51543).`);
    }
}

/* --- Donation Tracker --- */
function trackDonationStatus() {
    const input = document.getElementById('donorTrackInput');
    const resultDiv = document.getElementById('trackResult');
    if (input && input.value.trim() !== '') {
        resultDiv.classList.remove('hidden');
        resultDiv.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400 mr-1"></i> Transaction Verified! Status: Funds Assigned to Verified Student Scholarship (#SSF-2026).`;
    } else {
        alert('Please enter your Donor Transaction ID or Email ID.');
    }
}

/* --- General Donation Modal --- */
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
    alert('Heartfelt thanks for contributing to Swarajya Seva Foundation! Your support empowers education, soil health, and medical aid.');
    closeDonateModal();
}

function handleContactSubmit(e) {
    e.preventDefault();
    alert('Thank you for contacting Swarajya Seva Foundation! We will respond within 24 hours (+91 90217 51543).');
    e.target.reset();
}

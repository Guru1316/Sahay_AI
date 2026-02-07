// --------------------
// DOM Elements
// --------------------
const departmentsContainer = document.getElementById('departments-container');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-btn');
const categoryCards = document.querySelectorAll('.category-card');
const emptyStateEl = document.getElementById('empty-state');
const callModal = document.getElementById('callModal');
const modalClose = document.querySelector('.modal-close');
const modalDeptName = document.getElementById('modal-dept-name');
const modalDeptNumber = document.getElementById('modal-dept-number');
const callBtnCancel = document.querySelector('.call-btn-cancel');
const callBtnDial = document.querySelector('.call-btn-dial');

// --------------------
// Dummy Data - Emergency Departments
// --------------------
const departments = [
  {
    id: 1,
    name: "National Disaster Response Force (NDRF)",
    category: "government",
    icon: "fas fa-shield-alt",
    description: "Specialized force for disaster response and relief operations",
    contacts: [
      { type: "Emergency", number: "011-23410700" },
      { type: "Control Room", number: "011-23093550" }
    ],
    availability: "24/7",
    status: "active",
    resources: ["Rescue Teams", "Medical Units", "Boats", "Cutting Equipment"],
    location: "National Headquarters, Delhi"
  },
  {
    id: 2,
    name: "State Emergency Operations Center",
    category: "government",
    icon: "fas fa-headset",
    description: "Central coordination hub for all emergency services",
    contacts: [
      { type: "Emergency", number: "1070" },
      { type: "Control Room", number: "011-23792233" }
    ],
    availability: "24/7",
    status: "active",
    resources: ["Coordination", "Communication", "Logistics"],
    location: "State Secretariat"
  },
  {
    id: 3,
    name: "Metropolitan Police Control Room",
    category: "government",
    icon: "fas fa-police-car",
    description: "Law enforcement and public safety emergency response",
    contacts: [
      { type: "Emergency", number: "100" },
      { type: "Women's Helpline", number: "1091" },
      { type: "Traffic Police", number: "1095" }
    ],
    availability: "24/7",
    status: "busy",
    resources: ["Patrol Units", "SWAT Teams", "Traffic Control"],
    location: "Police Headquarters"
  },
  {
    id: 4,
    name: "Fire & Rescue Services",
    category: "rescue",
    icon: "fas fa-fire-extinguisher",
    description: "Fire suppression, rescue operations, and hazardous material response",
    contacts: [
      { type: "Emergency", number: "101" },
      { type: "Control Room", number: "011-23365555" }
    ],
    availability: "24/7",
    status: "active",
    resources: ["Fire Trucks", "Rescue Boats", "Ambulances", "Hazmat Units"],
    location: "Central Fire Station"
  },
  {
    id: 5,
    name: "Government Medical College Hospital",
    category: "medical",
    icon: "fas fa-hospital",
    description: "Major trauma center with emergency medical services",
    contacts: [
      { type: "Emergency", number: "108" },
      { type: "Ambulance", number: "102" },
      { type: "COVID Helpline", number: "1075" }
    ],
    availability: "24/7",
    status: "active",
    resources: ["ICU Beds", "Trauma Center", "Ambulances", "Blood Bank"],
    location: "Medical College Road"
  },
  {
    id: 6,
    name: "Red Cross Society",
    category: "ngo",
    icon: "fas fa-cross",
    description: "Humanitarian aid, blood banks, and disaster relief services",
    contacts: [
      { type: "Emergency", number: "011-23711541" },
      { type: "Blood Bank", number: "011-23716441" }
    ],
    availability: "24/7",
    status: "active",
    resources: ["Volunteers", "First Aid", "Shelter", "Food Supplies"],
    location: "Red Cross House"
  },
  {
    id: 7,
    name: "Coast Guard Emergency",
    category: "rescue",
    icon: "fas fa-ship",
    description: "Maritime search and rescue, coastal security",
    contacts: [
      { type: "Emergency", number: "1554" },
      { type: "Coastal Security", number: "1093" }
    ],
    availability: "24/7",
    status: "active",
    resources: ["Patrol Vessels", "Helicopters", "Rescue Teams"],
    location: "Coastal Headquarters"
  },
  {
    id: 8,
    name: "Electricity Emergency Services",
    category: "support",
    icon: "fas fa-bolt",
    description: "Power restoration and electrical hazard response",
    contacts: [
      { type: "Emergency", number: "1912" },
      { type: "Complaints", number: "011-23355111" }
    ],
    availability: "24/7",
    status: "active",
    resources: ["Repair Teams", "Generators", "Safety Equipment"],
    location: "Power Grid Corporation"
  },
  {
    id: 9,
    name: "Water Supply Emergency",
    category: "support",
    icon: "fas fa-tint",
    description: "Water supply restoration and quality monitoring",
    contacts: [
      { type: "Emergency", number: "1916" },
      { type: "Complaints", number: "011-23355222" }
    ],
    availability: "24/7",
    status: "active",
    resources: ["Water Tankers", "Purification Units", "Repair Teams"],
    location: "Water Board Headquarters"
  },
  {
    id: 10,
    name: "Child Helpline",
    category: "ngo",
    icon: "fas fa-child",
    description: "Emergency services for children in distress",
    contacts: [
      { type: "Emergency", number: "1098" }
    ],
    availability: "24/7",
    status: "active",
    resources: ["Counselors", "Rescue Teams", "Shelter Homes"],
    location: "Child Welfare Committee"
  },
  {
    id: 11,
    name: "Women's Protection Cell",
    category: "government",
    icon: "fas fa-female",
    description: "Emergency response for women's safety and protection",
    contacts: [
      { type: "Emergency", number: "1091" },
      { type: "Counseling", number: "011-23379111" }
    ],
    availability: "24/7",
    status: "active",
    resources: ["Protection Officers", "Counselors", "Safe Houses"],
    location: "Women's Commission Office"
  },
  {
    id: 12,
    name: "Animal Rescue Services",
    category: "ngo",
    icon: "fas fa-paw",
    description: "Emergency rescue and medical care for animals",
    contacts: [
      { type: "Emergency", number: "011-23379333" }
    ],
    availability: "24/7",
    status: "active",
    resources: ["Veterinarians", "Rescue Vehicles", "Shelter"],
    location: "Animal Welfare Center"
  },
  {
    id: 13,
    name: "Meteorological Department",
    category: "government",
    icon: "fas fa-cloud-sun",
    description: "Weather forecasting and early warning systems",
    contacts: [
      { type: "Forecast", number: "011-24631913" },
      { type: "Cyclone Warning", number: "011-24629721" }
    ],
    availability: "24/7",
    status: "active",
    resources: ["Weather Radar", "Monitoring Systems", "Alert Systems"],
    location: "Meteorological Center"
  },
  {
    id: 14,
    name: "Public Health Emergency",
    category: "medical",
    icon: "fas fa-stethoscope",
    description: "Epidemic control and public health emergency response",
    contacts: [
      { type: "Emergency", number: "1075" },
      { type: "Helpline", number: "011-23978046" }
    ],
    availability: "24/7",
    status: "active",
    resources: ["Medical Teams", "Testing Kits", "Isolation Facilities"],
    location: "Health Department HQ"
  },
  {
    id: 15,
    name: "Railway Emergency",
    category: "government",
    icon: "fas fa-train",
    description: "Railway accident response and emergency services",
    contacts: [
      { type: "Emergency", number: "1512" },
      { type: "Ambulance", number: "1322" }
    ],
    availability: "24/7",
    status: "active",
    resources: ["Rescue Trains", "Medical Vans", "Cranes"],
    location: "Railway Headquarters"
  },
  {
    id: 16,
    name: "Gas Leak Emergency",
    category: "rescue",
    icon: "fas fa-gas-pump",
    description: "Gas leak detection and emergency response",
    contacts: [
      { type: "Emergency", number: "1906" },
      { type: "Complaints", number: "011-23379444" }
    ],
    availability: "24/7",
    status: "active",
    resources: ["Detection Equipment", "Safety Teams", "Repair Crews"],
    location: "Gas Corporation Office"
  },
  {
    id: 17,
    name: "Mental Health Helpline",
    category: "medical",
    icon: "fas fa-brain",
    description: "Crisis counseling and mental health emergency services",
    contacts: [
      { type: "Emergency", number: "0824-2983444" }
    ],
    availability: "24/7",
    status: "active",
    resources: ["Psychiatrists", "Counselors", "Crisis Teams"],
    location: "Mental Health Institute"
  },
  {
    id: 18,
    name: "Road Transport Emergency",
    category: "support",
    icon: "fas fa-road",
    description: "Road accident response and traffic management",
    contacts: [
      { type: "Emergency", number: "1073" },
      { type: "Roadside Assistance", number: "1033" }
    ],
    availability: "24/7",
    status: "active",
    resources: ["Cranes", "Ambulances", "Traffic Control"],
    location: "Transport Department"
  },
  {
    id: 19,
    name: "Search & Rescue Helicopter Unit",
    category: "rescue",
    icon: "fas fa-helicopter",
    description: "Aerial search, rescue, and medical evacuation",
    contacts: [
      { type: "Emergency", number: "011-23792444" }
    ],
    availability: "Daylight Hours",
    status: "active",
    resources: ["Rescue Helicopters", "Medical Teams", "Winch Systems"],
    location: "Air Force Station"
  },
  {
    id: 20,
    name: "Food & Supplies Distribution",
    category: "ngo",
    icon: "fas fa-utensils",
    description: "Emergency food distribution and supply chain management",
    contacts: [
      { type: "Coordination", number: "011-23379555" }
    ],
    availability: "24/7",
    status: "active",
    resources: ["Food Packets", "Water", "Logistics", "Volunteers"],
    location: "Central Warehouse"
  },
  {
    id: 21,
    name: "Earthquake Monitoring Center",
    category: "government",
    icon: "fas fa-mountain",
    description: "Seismic monitoring and earthquake early warning",
    contacts: [
      { type: "Information", number: "011-24631914" }
    ],
    availability: "24/7",
    status: "active",
    resources: ["Seismographs", "Alert Systems", "Monitoring"],
    location: "Geological Survey"
  },
  {
    id: 22,
    name: "Disaster Volunteer Corps",
    category: "ngo",
    icon: "fas fa-users",
    description: "Trained volunteer network for disaster response",
    contacts: [
      { type: "Volunteer Line", number: "011-23379666" }
    ],
    availability: "24/7",
    status: "active",
    resources: ["Volunteers", "First Aid", "Rescue Equipment"],
    location: "Community Center"
  },
  {
    id: 23,
    name: "Emergency Blood Bank",
    category: "medical",
    icon: "fas fa-tint",
    description: "24/7 blood collection and distribution service",
    contacts: [
      { type: "Emergency", number: "011-23716442" },
      { type: "Donation", number: "011-23716443" }
    ],
    availability: "24/7",
    status: "active",
    resources: ["Blood Units", "Testing", "Storage", "Delivery"],
    location: "Central Blood Bank"
  },
  {
    id: 24,
    name: "Cyber Emergency Response",
    category: "government",
    icon: "fas fa-shield-alt",
    description: "Cybersecurity threats and digital infrastructure protection",
    contacts: [
      { type: "Emergency", number: "011-24368572" }
    ],
    availability: "24/7",
    status: "active",
    resources: ["Cyber Experts", "Monitoring", "Response Teams"],
    location: "IT Department"
  }
];

// --------------------
// State
// --------------------
let filteredDepartments = departments;
let activeFilter = 'all';
let activeSearch = '';

// --------------------
// Initialize
// --------------------
document.addEventListener('DOMContentLoaded', () => {
  renderDepartments();
  setupEventListeners();
  setupModal();
});

// --------------------
// Event Listeners
// --------------------
function setupEventListeners() {
  // Filter buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      filterAndRenderDepartments();
    });
  });

  // Category cards
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      filterButtons.forEach(b => b.classList.remove('active'));
      const targetBtn = document.querySelector(`.filter-btn[data-filter="${category}"]`);
      if (targetBtn) {
        targetBtn.click();
      }
    });
  });

  // Search input
  searchInput.addEventListener('input', (e) => {
    activeSearch = e.target.value.toLowerCase();
    filterAndRenderDepartments();
  });
}

function setupModal() {
  modalClose.addEventListener('click', () => {
    callModal.style.display = 'none';
  });

  callBtnCancel.addEventListener('click', () => {
    callModal.style.display = 'none';
  });

  callBtnDial.addEventListener('click', () => {
    const number = modalDeptNumber.textContent;
    alert(`Dialing emergency number: ${number}\n\nNote: This is a demo. In a real application, this would initiate a phone call.`);
    callModal.style.display = 'none';
  });

  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === callModal) {
      callModal.style.display = 'none';
    }
  });
}

// --------------------
// Filtering
// --------------------
function filterAndRenderDepartments() {
  filteredDepartments = departments.filter(dept => {
    // Apply category filter
    if (activeFilter !== 'all' && dept.category !== activeFilter) {
      return false;
    }

    // Apply search filter
    if (activeSearch) {
      const searchStr = `${dept.name} ${dept.description} ${dept.location}`.toLowerCase();
      if (!searchStr.includes(activeSearch)) {
        return false;
      }
    }

    return true;
  });

  renderDepartments();
}

// --------------------
// Rendering
// --------------------
function renderDepartments() {
  if (filteredDepartments.length === 0) {
    departmentsContainer.innerHTML = '';
    emptyStateEl.style.display = 'block';
    return;
  }

  emptyStateEl.style.display = 'none';

  departmentsContainer.innerHTML = filteredDepartments.map(dept => {
    const iconClass = dept.icon;
    let iconBgClass = 'dept-icon ';
    
    // Determine icon background class
    switch(dept.category) {
      case 'medical': iconBgClass += 'medical'; break;
      case 'police': iconBgClass += 'police'; break;
      case 'fire': iconBgClass += 'fire'; break;
      case 'ngo': iconBgClass += 'ngo'; break;
      case 'government': iconBgClass += 'government'; break;
      case 'support': iconBgClass += 'support'; break;
      case 'rescue': iconBgClass += 'fire'; break;
      default: iconBgClass += 'government';
    }

    return `
      <div class="department-card" data-category="${dept.category}">
        <div class="dept-header">
          <div class="${iconBgClass}">
            <i class="${iconClass}"></i>
          </div>
          <div class="dept-info">
            <span class="dept-category">${dept.category.toUpperCase()}</span>
            <h3>${dept.name}</h3>
            <p class="dept-description">${dept.description}</p>
          </div>
        </div>

        <div class="dept-contacts">
          ${dept.contacts.map(contact => `
            <div class="contact-item">
              <div class="contact-icon">
                <i class="fas fa-phone"></i>
              </div>
              <div class="contact-info">
                <div class="contact-type">${contact.type}</div>
                <div class="contact-number">${contact.number}</div>
              </div>
              <button class="call-btn" onclick="openCallModal('${dept.name}', '${contact.number}')">
                <i class="fas fa-phone-alt"></i>
              </button>
            </div>
          `).join('')}
        </div>

        <div class="dept-details">
          <div class="detail-row">
            <span class="detail-label">Availability</span>
            <span class="detail-value">${dept.availability}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Location</span>
            <span class="detail-value">${dept.location}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Resources</span>
            <span class="detail-value">${dept.resources.slice(0, 2).join(', ')}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Total Resources</span>
            <span class="detail-value">${dept.resources.length}</span>
          </div>
        </div>

        <div class="dept-footer">
          <div class="status-badge status-${dept.status}">
            ${dept.status === 'active' ? '✅ Available' : '⚠️ High Demand'}
          </div>
          <div class="availability">
            <i class="fas fa-clock"></i>
            <span>${dept.availability}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// --------------------
// Modal Functions
// --------------------
function openCallModal(deptName, phoneNumber) {
  modalDeptName.textContent = deptName;
  modalDeptNumber.textContent = phoneNumber;
  callModal.style.display = 'flex';
}

// --------------------
// Utility Functions
// --------------------
function updateLastUpdateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  document.getElementById('last-update-time').textContent = `Today, ${timeString}`;
}

// Initialize time
updateLastUpdateTime();
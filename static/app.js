// --------------------
// DOM Elements
// --------------------
const casesContainer = document.getElementById('cases-container');
const totalCasesEl = document.getElementById('total-cases');
const highPriorityEl = document.getElementById('high-priority');
const lastUpdateTimeEl = document.getElementById('last-update-time');
const emptyStateEl = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-btn');
const refreshIcon = document.getElementById('refresh-icon');

// Chart elements
const chartHigh = document.getElementById('chart-high');
const chartMedium = document.getElementById('chart-medium');
const chartLow = document.getElementById('chart-low');

// --------------------
// State
// --------------------
let allCases = [];
let filteredCases = [];
let activeFilter = 'all';
let searchQuery = '';

// --------------------
// Initialize
// --------------------
document.addEventListener('DOMContentLoaded', () => {
  loadCases();
  setupEventListeners();
  updateLastUpdateTime();

  // Auto-refresh every 5 seconds
  setInterval(() => {
    loadCases();
    refreshIcon.classList.add('spin');
    setTimeout(() => refreshIcon.classList.remove('spin'), 1000);
  }, 5000);
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
      filterAndRenderCases();
    });
  });

  // Search input
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    filterAndRenderCases();
  });
}

// --------------------
// Utility Functions
// --------------------
function urgencyClass(score) {
  if (score >= 80) return "high";
  if (score >= 40) return "medium";
  return "low";
}

function urgencyLevelText(score) {
  if (score >= 80) return "Immediate Response Required";
  if (score >= 40) return "Response Within 1 Hour";
  return "Monitor & Respond When Possible";
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getUrgencyIcon(level) {
  switch(level) {
    case 'high': return 'fas fa-exclamation-triangle';
    case 'medium': return 'fas fa-exclamation-circle';
    case 'low': return 'fas fa-info-circle';
    default: return 'fas fa-question-circle';
  }
}

function formatMessage(message) {
  // Add proper formatting to messages
  return message.charAt(0).toUpperCase() + message.slice(1);
}

// --------------------
// API Calls
// --------------------
async function loadCases() {
  try {
    const res = await fetch('/cases');
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    
    // Validate data structure
    if (!Array.isArray(data)) {
      throw new Error('Invalid data format received');
    }
    
    allCases = data.map(caseItem => ({
      ...caseItem,
      id: caseItem.id || Math.random().toString(36).substr(2, 9),
      time: caseItem.time || new Date().toISOString()
    }));
    
    // Sort cases by urgency (highest first)
    allCases.sort((a, b) => b.urgency - a.urgency);

    updateStats();
    filterAndRenderCases();
    updateLastUpdateTime();
  } catch (error) {
    console.error('Error loading cases:', error);
    showError();
  }
}

async function resolveCase(caseId) {
  try {
    const res = await fetch(`/resolve/${caseId}`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (res.ok) {
      // Remove case from UI immediately for better UX
      allCases = allCases.filter(c => c.id !== caseId);
      filteredCases = filteredCases.filter(c => c.id !== caseId);
      renderCases();
      updateStats();
    } else {
      alert('Failed to mark case as resolved. Please try again.');
    }
  } catch (error) {
    console.error('Error resolving case:', error);
    alert('Network error. Please check your connection.');
  }
}

// --------------------
// Stats & Charts
// --------------------
function updateStats() {
  totalCasesEl.textContent = allCases.length;
  
  const highPriorityCount = allCases.filter(c => urgencyClass(c.urgency) === 'high').length;
  highPriorityEl.textContent = highPriorityCount;
  
  updateChart();
}

function updateChart() {
  const highCount = allCases.filter(c => urgencyClass(c.urgency) === 'high').length;
  const mediumCount = allCases.filter(c => urgencyClass(c.urgency) === 'medium').length;
  const lowCount = allCases.filter(c => urgencyClass(c.urgency) === 'low').length;
  const total = allCases.length || 1;
  
  const highPercent = Math.round((highCount / total) * 100);
  const mediumPercent = Math.round((mediumCount / total) * 100);
  const lowPercent = Math.round((lowCount / total) * 100);
  
  // Update chart bars with smooth animation
  chartHigh.textContent = `${highPercent}%`;
  chartHigh.style.width = `${highPercent}%`;
  
  chartMedium.textContent = `${mediumPercent}%`;
  chartMedium.style.width = `${mediumPercent}%`;
  
  chartLow.textContent = `${lowPercent}%`;
  chartLow.style.width = `${lowPercent}%`;
}

// --------------------
// Filtering & Rendering
// --------------------
function filterAndRenderCases() {
  // Apply filters
  filteredCases = allCases.filter(caseItem => {
    // Apply urgency filter
    if (activeFilter !== 'all' && urgencyClass(caseItem.urgency) !== activeFilter) {
      return false;
    }
    
    // Apply search filter
    if (searchQuery) {
      const searchStr = `${caseItem.need || ''} ${caseItem.message || ''} ${caseItem.sender || ''} ${caseItem.explanation || ''}`.toLowerCase();
      if (!searchStr.includes(searchQuery)) {
        return false;
      }
    }
    
    return true;
  });
  
  renderCases();
}

function renderCases() {
  if (filteredCases.length === 0) {
    casesContainer.innerHTML = '';
    emptyStateEl.style.display = 'block';
    return;
  }
  
  emptyStateEl.style.display = 'none';
  
  const casesHTML = filteredCases.map(caseItem => {
    const level = urgencyClass(caseItem.urgency);
    const urgencyPercent = Math.min(caseItem.urgency, 100);
    const urgencyText = urgencyLevelText(caseItem.urgency);
    const urgencyIcon = getUrgencyIcon(level);
    
    return `
      <div class="case-card ${level}">
        <div class="case-priority ${level}">${level.toUpperCase()} PRIORITY</div>
        
        <div class="case-header">
          <div class="case-title">
            <i class="${urgencyIcon}"></i>
            ${caseItem.need || 'Emergency Assistance Required'}
          </div>
          <div class="case-meta">
            <span><i class="fas fa-user"></i> ${caseItem.sender || 'Anonymous'}</span>
            <span><i class="far fa-clock"></i> ${formatTime(caseItem.time)}</span>
          </div>
        </div>
        
        <div class="urgency-meter">
          <div class="urgency-label">
            <span>Urgency Score: ${caseItem.urgency}</span>
            <span>${urgencyText}</span>
          </div>
          <div class="urgency-bar">
            <div class="urgency-fill ${level}" style="width: ${urgencyPercent}%"></div>
          </div>
        </div>
        
        <div class="case-details">
          <div class="detail-item">
            <span class="detail-label">Need Type</span>
            <span class="detail-value">${caseItem.need || 'General Assistance'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Sender</span>
            <span class="detail-value"><i class="fas fa-phone-alt"></i> ${caseItem.sender || 'Unknown'}</span>
          </div>
        </div>
        
        <div class="message-box">
          <strong><i class="fas fa-comment-dots"></i> Distress Message:</strong>
          <p>${formatMessage(caseItem.message || 'No message provided')}</p>
        </div>
        
        <div class="explanation-box">
          <span class="explanation-label"><i class="fas fa-brain"></i> AI Analysis:</span>
          ${caseItem.explanation || 'AI analysis in progress...'}
        </div>
        
        <div class="case-footer">
          <div class="sender-info">
            <i class="fas fa-map-marker-alt"></i>
            <span>Location: ${caseItem.location || 'Processing...'}</span>
          </div>
          <button class="resolve-btn" onclick="resolveCase('${caseItem.id}')">
            <i class="fas fa-check"></i> Mark Resolved
          </button>
        </div>
      </div>
    `;
  }).join('');
  
  casesContainer.innerHTML = casesHTML;
}

function updateLastUpdateTime() {
  const now = new Date();
  lastUpdateTimeEl.textContent = now.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
}

function showError() {
  casesContainer.innerHTML = `
    <div class="error-state">
      <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #ef4444; margin-bottom: 20px;"></i>
      <h3>Unable to Load Cases</h3>
      <p style="color: #cbd5e1; margin-bottom: 20px;">Please check your connection and try again.</p>
      <button onclick="loadCases()" style="background: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 500;">
        <i class="fas fa-redo"></i> Retry Connection
      </button>
    </div>
  `;
}

// Export functions for global access
window.resolveCase = resolveCase;
window.loadCases = loadCases;

async function sendGroqQuestion() {
  const input = document.getElementById("chat-question");
  const question = input.value.trim();
  if (!question) return;

  const messages = document.getElementById("chat-messages");

  messages.innerHTML += `<div class="chat-message user">You: ${question}</div>`;
  input.value = "";

  const res = await fetch("/groq-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });

  const data = await res.json();
  messages.innerHTML += `<div class="chat-message bot">AI: ${data.answer}</div>`;
  messages.scrollTop = messages.scrollHeight;
}

const chatBox = document.querySelector(".groq-chat");
const chatFab = document.getElementById("chat-fab");

function minimizeChat() {
  chatBox.style.display = "none";
  chatFab.style.display = "flex";
}

function openChat() {
  chatBox.style.display = "flex";
  chatFab.style.display = "none";
  chatBox.classList.remove("chat-maximized");
}

function maximizeChat() {
  chatBox.classList.toggle("chat-maximized");
}

function closeChat() {
  chatBox.style.display = "none";
  chatFab.style.display = "flex";
}

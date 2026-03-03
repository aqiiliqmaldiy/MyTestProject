// State Management
let state = {
    balance: 100000000,
    theme: 'light',
    portfolio: [
        { id: 'durian', name: 'Durian Fund', icon: '🍈', value: 20000000, change: 1.2 },
        { id: 'jati', name: 'Kayu Jati', icon: '🌳', value: 20000000, change: -0.5 },
        { id: 'sagu', name: 'Sagu Prime', icon: '🌾', value: 15000000, change: 3.1 }
    ],
    marketData: [45, 48, 47, 52, 50, 55, 58, 54, 60, 62, 59, 65]
};

// DOM Elements
const views = {
    home: document.getElementById('home'),
    dashboard: document.getElementById('dashboard'),
    funds: document.getElementById('funds'),
    profile: document.getElementById('profile')
};

const navItems = document.querySelectorAll('.nav-item');
const themeToggle = document.getElementById('themeToggle');
const investSlider = document.getElementById('investSlider');
const investAmountDisplay = document.getElementById('investAmountDisplay');
const totalBalanceDisplay = document.getElementById('totalBalanceDisplay');
const confirmInvestBtn = document.getElementById('confirmInvestBtn');

// Navigation
function switchView(viewName) {
    Object.values(views).forEach(v => v.classList.remove('active'));
    navItems.forEach(n => n.classList.remove('active'));

    const activeView = views[viewName];
    if (activeView) activeView.classList.add('active');

    const activeNav = document.querySelector(`.nav-item[data-view="${viewName}"]`);
    if (activeNav) activeNav.classList.add('active');

    if (viewName === 'dashboard') initChart();
    if (viewName === 'home') renderTopPerformers();
    if (viewName === 'funds') renderPortfolio();
}

// Chart Logic (Canvas API)
function initChart() {
    const canvas = document.getElementById('performanceChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Set scale for high DPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const padding = 20;
    const points = state.marketData;
    const step = (width - padding * 2) / (points.length - 1);
    const max = Math.max(...points) * 1.1;
    const min = Math.min(...points) * 0.9;

    ctx.clearRect(0, 0, width, height);

    // Gradient Background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(13, 148, 136, 0.2)');
    gradient.addColorStop(1, 'rgba(13, 148, 136, 0)');

    ctx.beginPath();
    ctx.moveTo(padding, height - padding);

    points.forEach((p, i) => {
        const x = padding + i * step;
        const y = height - padding - ((p - min) / (max - min)) * (height - padding * 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.bezierCurveTo(x - step / 2, ctx.lastY, x - step / 2, y, x, y);
        ctx.lastY = y;
    });

    ctx.strokeStyle = '#0d9488';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Fill Area
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Interaction Line (Mock)
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();
}

// Render Logic
function renderTopPerformers() {
    const container = document.getElementById('topPerformers');
    container.innerHTML = state.portfolio.map(p => `
        <div class="list-item">
            <div class="item-icon" style="background: ${p.change > 0 ? '#ecfdf5' : '#fef2f2'}; color: ${p.change > 0 ? '#059669' : '#dc2626'}">
                ${p.icon}
            </div>
            <div style="flex: 1">
                <p style="font-weight: 700; font-size: 0.95rem;">${p.name}</p>
                <p style="color: var(--text-dim); font-size: 0.75rem;">$${p.change > 0 ? '+' : ''}${p.change}% Performance</p>
            </div>
            <div style="text-align: right">
                <p style="font-weight: 800; font-size: 0.95rem;">Rp ${(p.value / 1000000).toFixed(1)}M</p>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${p.change > 0 ? '#10b981' : '#ef4444'}" stroke-width="3"><polyline points="${p.change > 0 ? '18 15 12 9 6 15' : '6 9 12 15 18 9'}"/></svg>
            </div>
        </div>
    `).join('');
}

function renderPortfolio() {
    const container = document.getElementById('portfolioList');
    container.innerHTML = state.portfolio.map(p => `
        <div class="list-item">
            <span style="font-size: 1.5rem;">${p.icon}</span>
            <div style="flex:1">
                <h4 style="font-weight: 800;">${p.name}</h4>
                <p style="font-size: 0.8rem; color: var(--text-dim);">Holdings: Rp ${p.value.toLocaleString()}</p>
            </div>
            <div style="background: var(--border); padding: 4px 12px; border-radius: 12px; font-size: 0.75rem; font-weight: 700;">
                Details
            </div>
        </div>
    `).join('');
}

// Interactivity
function openInvestModal() {
    document.getElementById('investModal').classList.add('active');
}

function closeInvestModal() {
    document.getElementById('investModal').classList.remove('active');
}

investSlider.addEventListener('input', (e) => {
    investAmountDisplay.innerText = `Rp ${parseInt(e.target.value).toLocaleString()}`;
});

confirmInvestBtn.addEventListener('click', () => {
    const amount = parseInt(investSlider.value);
    state.balance += amount;
    totalBalanceDisplay.innerText = state.balance.toLocaleString();

    // Animation effect
    confirmInvestBtn.innerText = "Processing...";
    setTimeout(() => {
        confirmInvestBtn.innerText = "Success! ✅";
        setTimeout(() => {
            closeInvestModal();
            confirmInvestBtn.innerText = "Confirm Investment";
        }, 1000);
    }, 1500);
});

themeToggle.addEventListener('click', () => {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', state.theme);
});

navItems.forEach(item => {
    item.addEventListener('click', () => switchView(item.dataset.view));
});

// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
    switchView('home');

    // Live price simulation
    setInterval(() => {
        state.marketData.shift();
        state.marketData.push(Math.floor(Math.random() * 20) + 50);
        if (views.dashboard.classList.contains('active')) initChart();
    }, 3000);
});

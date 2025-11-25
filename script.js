// --- CONFIG & STATE ---
const defaultAdmin = { id: 1, name: 'Admin Ritu', email: 'rritu8786@gmail.com', pass: 'Ritu@100504', role: 'admin' };

// Load admins from local storage or use default
let admins = JSON.parse(localStorage.getItem('site_admins')) || [defaultAdmin];

let user = null; // Currently logged in user
let posts = [
    { id: 1, title: "Adventures in Typography", date: "January 16, 2024", excerpt: "Exploring how font choices influence the aesthetic of modern web design.", img: "https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=800", type: 'photo' },
    { id: 2, title: "The Silent Companion", date: "January 06, 2024", excerpt: "Why pets are more than just animals; they are silent observers.", img: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800", type: 'photo' },
    { id: 3, title: "75th Anniversary", date: "January 05, 2024", excerpt: "Indian Independence celebration event details and photos.", img: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800", type: 'photo' },
    { id: 4, title: "Mahatma Gandhi", date: "January 05, 2024", excerpt: "Mohandas Karamchand Gandhi was an Indian lawyer and ethicist.", img: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Mahatma-Gandhi-studio-1931.jpg", type: 'photo' }
];
let authMode = 'login';
let uploadType = null;

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    renderPosts();
    updateAuthUI();
    lucide.createIcons();
    
    if(admins.length === 0) {
        admins.push(defaultAdmin);
        saveAdmins();
    }
});

function saveAdmins() {
    localStorage.setItem('site_admins', JSON.stringify(admins));
}

// --- Admin Management Logic ---
function openAdminPanel() {
    renderAdminList();
    openModal('admin-modal');
}

function renderAdminList() {
    const list = document.getElementById('admin-list');
    list.innerHTML = '';
    
    admins.forEach(admin => {
        const isMe = admin.id === user.id;
        const div = document.createElement('div');
        div.className = 'admin-item';
        div.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                    ${admin.name.charAt(0)}
                </div>
                <div>
                    <div class="text-sm font-bold text-white">${admin.name} ${isMe ? '<span class="text-xs text-gray-500">(You)</span>' : ''}</div>
                    <div class="text-[10px] text-gray-400">${admin.email}</div>
                </div>
            </div>
            ${!isMe ? `<button onclick="deleteAdmin(${admin.id})" class="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded transition"><i data-lucide="trash-2" class="w-4 h-4"></i></button>` : ''}
        `;
        list.appendChild(div);
    });
    lucide.createIcons();
}

function addNewAdmin(e) {
    e.preventDefault();
    const name = document.getElementById('new-admin-name').value;
    const email = document.getElementById('new-admin-email').value;
    const pass = document.getElementById('new-admin-pass').value;

    if (admins.find(a => a.email === email)) {
        alert("Admin with this email already exists.");
        return;
    }

    admins.push({ id: Date.now(), name, email, pass, role: 'admin' });
    saveAdmins();
    renderAdminList();
    
    document.getElementById('new-admin-name').value = '';
    document.getElementById('new-admin-email').value = '';
    document.getElementById('new-admin-pass').value = '';
    alert("New admin added successfully.");
}

function deleteAdmin(id) {
    if(confirm("Are you sure you want to remove this admin?")) {
        admins = admins.filter(a => a.id !== id);
        saveAdmins();
        renderAdminList();
    }
}

// --- Rendering ---
function renderPosts() {
    const container = document.getElementById('posts-container');
    container.innerHTML = '';
    posts.forEach(post => {
        const isAdmin = user?.role === 'admin';
        const deleteBtn = isAdmin ? `<button onclick="deletePost(${post.id})" class="absolute top-4 right-4 z-10 bg-red-600 p-2 rounded-full text-white shadow-lg hover:bg-red-700 transition"><i data-lucide="trash-2" class="w-4 h-4"></i></button>` : '';
        
        let media = `<img src="${post.img}" class="w-full h-full object-cover transition duration-700 hover:scale-110">`;
        if(post.type === 'video') media = `<div class="w-full h-full bg-black flex items-center justify-center relative group-hover:bg-gray-900 transition"><i data-lucide="video" class="w-12 h-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition"></i></div>`;
        if(post.type === 'music') media = `<div class="w-full h-full bg-gray-900 flex flex-col items-center justify-center"><i data-lucide="music" class="w-12 h-12 text-pink-500 mb-2 animate-pulse"></i><span class="text-xs text-gray-500">Audio Track</span></div>`;

        const html = `
            <article class="glass-card rounded-xl overflow-hidden relative group">
                ${deleteBtn}
                <div class="w-full h-64 bg-gray-800 overflow-hidden relative">
                    ${media}
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                    <div class="absolute bottom-4 left-4">
                        <div class="flex items-center gap-2 text-orange-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                            <span>${post.date}</span>
                            ${post.type !== 'photo' ? `<span class="border border-orange-500/50 px-1.5 py-0.5 rounded text-[8px] bg-orange-500/10">${post.type}</span>` : ''}
                        </div>
                        <h3 class="text-xl font-bold text-white leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-pink-500 transition-all">${post.title}</h3>
                    </div>
                </div>
                <div class="p-6">
                    <p class="text-gray-400 mb-6 text-sm leading-relaxed line-clamp-3">${post.excerpt}</p>
                    <div class="flex items-center justify-between text-xs font-bold uppercase text-gray-500 border-t border-white/5 pt-4">
                        <div class="flex gap-4">
                            <button class="hover:text-white transition flex items-center gap-1"><i data-lucide="heart" class="w-3 h-3"></i> Like</button>
                            <button class="hover:text-white transition">Share</button>
                        </div>
                        <button class="text-white hover:text-orange-500 transition flex items-center gap-1 group-hover:translate-x-1 duration-300">Read More <i data-lucide="arrow-right" class="w-3 h-3"></i></button>
                    </div>
                </div>
            </article>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
    lucide.createIcons();
}

function updateAuthUI() {
    const deskAuth = document.getElementById('desk-auth');
    const mobAuth = document.getElementById('mob-auth');
    const adminBadge = document.getElementById('admin-badge');
    const adminControlsDesk = document.getElementById('admin-controls-desk');
    const adminControlsMob = document.getElementById('admin-controls-mob');

    if (user) {
        // Logged In
        const isAdmin = user.role === 'admin';
        
        if(isAdmin) {
            adminBadge.classList.remove('hidden');
            adminControlsDesk.classList.remove('hidden');
            adminControlsDesk.classList.add('flex');
            adminControlsMob.classList.remove('hidden');
            adminControlsMob.classList.add('flex');
        } else {
            adminBadge.classList.add('hidden');
            adminControlsDesk.classList.add('hidden');
            adminControlsDesk.classList.remove('flex');
            adminControlsMob.classList.add('hidden');
            adminControlsMob.classList.remove('flex');
        }

        // Auth Buttons
        deskAuth.innerHTML = `
            <div class="text-right">
                <span class="block text-[10px] text-gray-500 uppercase font-bold tracking-wider">Signed in as</span>
                <span class="text-xs text-white font-bold">${user.name}</span>
            </div>
            <button onclick="logout()" class="w-8 h-8 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition flex items-center justify-center"><i data-lucide="log-out" class="w-4 h-4"></i></button>
        `;
        mobAuth.innerHTML = `
            <div class="text-center mb-4">
                <span class="text-gray-500 text-xs uppercase font-bold">Current User</span>
                <div class="text-white font-bold text-lg">${user.name}</div>
            </div>
            <button onclick="logout()" class="w-full py-3 rounded-lg bg-red-500/10 text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition"><i data-lucide="log-out"></i> Log Out</button>
        `;
    } else {
        // Logged Out
        adminBadge.classList.add('hidden');
        adminControlsDesk.classList.add('hidden');
        adminControlsDesk.classList.remove('flex');
        adminControlsMob.classList.add('hidden');
        adminControlsMob.classList.remove('flex');

        deskAuth.innerHTML = `
            <button onclick="openModal('auth-modal', 'login')" class="bg-white text-black px-5 py-2 font-bold text-xs hover:bg-gradient-to-r hover:from-orange-500 hover:to-pink-500 hover:text-white transition flex items-center gap-2 rounded shadow-lg shadow-white/10"><i data-lucide="log-in" class="w-3 h-3"></i> LOG IN</button>
            <button onclick="openModal('auth-modal', 'signup')" class="text-gray-400 px-2 font-bold text-xs hover:text-white transition">SIGN UP</button>
        `;
        mobAuth.innerHTML = `
            <button onclick="openModal('auth-modal', 'login')" class="w-full border border-white/20 py-3 text-white font-bold rounded-lg hover:bg-white hover:text-black transition flex items-center justify-center gap-2"><i data-lucide="log-in"></i> Log In</button>
            <button onclick="openModal('auth-modal', 'signup')" class="text-gray-400 text-sm hover:text-orange-500">Don't have an account? Sign Up</button>
        `;
    }
    lucide.createIcons();
}

// --- Actions ---
function handleAuth(e) {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const pass = document.getElementById('auth-pass').value;
    const name = document.getElementById('auth-name').value;
    const error = document.getElementById('auth-error');

    if (authMode === 'login') {
        // Check against admin list
        const foundAdmin = admins.find(a => a.email === email && a.pass === pass);
        
        if (foundAdmin) {
            user = { ...foundAdmin };
            closeModal('auth-modal');
        } else if (email && pass) {
            // Regular user mock
            user = { name: email.split('@')[0], email, role: 'user' };
            closeModal('auth-modal');
        } else {
            error.classList.remove('hidden');
            return;
        }
    } else {
        // Signup
        if (email && pass && name) {
            user = { name, email, role: 'user' };
            closeModal('auth-modal');
        } else {
            error.innerText = "Please fill all fields";
            error.classList.remove('hidden');
            return;
        }
    }
    updateAuthUI();
    renderPosts();
}

function logout() {
    user = null;
    updateAuthUI();
    renderPosts();
}

function submitPost() {
    const title = document.getElementById('post-title').value;
    const desc = document.getElementById('post-desc').value;
    
    if (!title) return alert('Please enter a title');

    const newPost = {
        id: Date.now(),
        title: title,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        excerpt: desc,
        img: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800",
        type: uploadType || 'photo'
    };

    posts.unshift(newPost);
    renderPosts();
    closeModal('upload-modal');
    
    // Reset form
    document.getElementById('post-title').value = '';
    document.getElementById('post-desc').value = '';
    document.getElementById('upload-fields').classList.add('hidden');
}

function deletePost(id) {
    if(confirm("Are you sure you want to delete this post?")) {
        posts = posts.filter(p => p.id !== id);
        renderPosts();
    }
}

// --- UI Helpers ---
function openModal(id, mode = null) {
    document.getElementById(id).classList.add('active');
    if (id === 'auth-modal' && mode) {
        setAuthMode(mode);
    }
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        menu.classList.add('flex');
    } else {
        menu.classList.add('hidden');
        menu.classList.remove('flex');
    }
}

function toggleAuthMode() {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
}

function setAuthMode(mode) {
    authMode = mode;
    const title = document.getElementById('auth-title');
    const subtitle = document.getElementById('auth-subtitle');
    const btn = document.getElementById('auth-submit');
    const switchText = document.getElementById('auth-switch-text');
    const switchBtn = document.getElementById('auth-switch-btn');
    const nameGroup = document.getElementById('name-group');
    const error = document.getElementById('auth-error');

    error.classList.add('hidden');

    if (mode === 'login') {
        title.innerText = "Welcome Back";
        subtitle.innerText = "Sign in to your account";
        btn.innerText = "Log In";
        switchText.innerText = "Don't have an account?";
        switchBtn.innerText = "Sign Up";
        nameGroup.classList.add('hidden');
    } else {
        title.innerText = "Join Us";
        subtitle.innerText = "Create your personal account";
        btn.innerText = "Sign Up";
        switchText.innerText = "Already have an account?";
        switchBtn.innerText = "Log In";
        nameGroup.classList.remove('hidden');
    }
}

function selectUploadType(type) {
    uploadType = type;
    document.getElementById('selected-type').innerText = type;
    document.getElementById('upload-fields').classList.remove('hidden');
}
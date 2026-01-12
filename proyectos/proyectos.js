/* =========================================
   NINBLU PROJECTS ENGINE v5.0 (CORS Fixed)
   ========================================= */

// URL DE TU API (YA INTEGRADA)
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx5kwzw5YRYKDmP0EpkqwPme3MWSIJIq3cLDdUGg-cvwGGrlEnn6hUy0xvhnmY9M-w2Yg/exec';

// VARIABLES GLOBALES
let allProjectsData = [];
let currentCategory = 'all';
let currentSort = 'newest';

// --- 1. CORE VISUALS ---

// 1.1 Cursor Personalizado
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
if(cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX; const posY = e.clientY;
        cursorDot.style.left = `${posX}px`; cursorDot.style.top = `${posY}px`;
        cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });
    });
}

// 1.2 Universo Three.js
const initUniverse = () => {
    const canvas = document.getElementById('universe-canvas');
    if(!canvas) return;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05020a, 0.002);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 50;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    const pCount = 3000;
    const pos = new Float32Array(pCount * 3);
    const scales = new Float32Array(pCount);
    for(let i=0; i<pCount; i++){
        pos[i*3] = (Math.random()-0.5)*200; pos[i*3+1] = (Math.random()-0.5)*200; pos[i*3+2] = (Math.random()-0.5)*200; scales[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    const mat = new THREE.ShaderMaterial({
        uniforms: { uTime: {value: 0}, uColor: {value: new THREE.Color(0xffffff)} },
        vertexShader: `attribute float aScale; uniform float uTime; varying float vAlpha; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); float t = sin(uTime*2.0 + aScale*10.0)*0.5 + 0.5; vAlpha = t * (0.3 + aScale*0.7); gl_PointSize = (2.0 + aScale*3.0) * (100.0 / -mv.z); gl_Position = projectionMatrix * mv; }`,
        fragmentShader: `uniform vec3 uColor; varying float vAlpha; void main(){ if(distance(gl_PointCoord, vec2(0.5))>0.5) discard; gl_FragColor = vec4(uColor, vAlpha); }`,
        transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
    });
    const mesh = new THREE.Points(geo, mat); scene.add(mesh);
    const light = new THREE.PointLight(0xf4676f, 3, 60, 2); scene.add(light);
    let mouseX=0, mouseY=0;
    document.addEventListener('mousemove', e => { mouseX = (e.clientX/window.innerWidth)*2-1; mouseY = -(e.clientY/window.innerHeight)*2+1; });
    const animate = (t) => { requestAnimationFrame(animate); mat.uniforms.uTime.value = t*0.001; light.position.x += (mouseX*50-light.position.x)*0.05; light.position.y += (mouseY*30-light.position.y)*0.05; light.position.z = 20; mesh.rotation.y = t*0.0001; renderer.render(scene, camera); };
    animate(0);
    window.addEventListener('resize', () => { camera.aspect = window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });
};

// 1.3 Logo SVG Injector
class NinbluLogo {
    static getSVG() { return `<svg viewBox="0 0 425 487" xmlns="http://www.w3.org/2000/svg"><path d="M224.04,0c16.95,21.59,37.54,38.97,48.79,64.64,38.05,86.83-28.37,164.27-32.05,250.62l-2.48,2.6-4.69-.76c-3.48-39.33,12.1-76.74,22.1-113.89,11.94-44.36,19.26-75.66,5.99-121.43-7.61-26.24-23.01-44.24-40.16-64.77-13.73,19.14-35.42,35.5-44.2,57.72-21.32,53.93,4.37,122.78,12.58,177.93,4.45,29.94,7.11,63.61,6.2,93.87-.52,17.18-1.63,60.97-8.15,74.84-1.47,3.13-10.87,15.63-10.73,17.15,10.74,8.75,22.13,17.02,31.34,27.46,2.3,2.61,3.51,6.91,6.84,7.94,1.31-.23,14.03-16.48,16.01-19.03,3.48-4.49,12.46-19.03,15.5-21.47,4.49-3.6,8.91-.84,6.53,4.54-13.46,16.33-24.32,35.09-40.4,49.04h-3c-12.4-16.3-32.56-22.82-47.84-35.69,3.43-9.42,11.83-17.47,16.07-26.63,6.16-13.3,8.67-41.95,9.8-57.19,2.98-40.49.84-78.98-8.47-118.5-14.3-60.72-55.35-133.36-14.71-191.71,15.3-21.97,40.46-35.77,56.14-57.28h3Z" fill="%23752c86"/><path d="M.36,233c2.92-28.85,27.71-59.74,57.54-62.88,65.6-6.9,105.63,65.52,115.92,120.67,5.47,29.31,8.67,78.37-8.28,104.12-5.58,8.48-18.2,16.47-28.36,11.57l17.98-10.97c28.91-32.45,12.92-95.68.5-133.52-13.51-41.13-58.96-92.48-106.4-68.53-43.62,22.02-37.57,77.32.73,102.35,3.88,2.54,25.29,13.91,28.31,11.77,4.19-8.03,3.87-20.68,11.45-26.58,5.8-4.52,12.94-4.04,19.86-2.9,6.42,1.06,12.44,3.94,18.57,5.91l-20.03,2.42c-15.27,3.48-19.73,33.6-20.9,46.58-27.72-4.85-58.91-14.77-74.32-40.09-6.41-10.54-11.59-27.63-12.56-39.92-.43-5.36-.53-14.72,0-20Z" fill="%23752c86"/><path d="M424.75,231c.18,4.06.45,10.12,0,14-5.03,43.41-29.47,78.64-73.08,89.32-1.5.37-3.43,1.31-4.88.27-3.14-11.11-3.45-31.7-11.47-40.53-5.18-5.7-13.61-1.6-19.92-2.04-1.5-.1-2.9.75-2.48-1.5,8.08-5.14,25.46-18.95,32.95-7.02,3.97,6.33,6.39,37.37,7.99,38.51,35.28-12.07,59.04-53.77,53.79-90.38-5.62-39.25-44-58.9-78.69-38.04-36.21,21.77-48.56,67.74-57.51,106.41-7.01,30.29-13.06,69.87,6.61,96.41l18.86,12.6c-31.45,6.48-39.71-32.96-40.98-56.44-3.98-73.16,31.21-187.3,122.41-180.59,32.85,2.42,45.11,29.95,46.39,59.04Z" fill="%23752c86"/></svg>`; }
    static inject() { document.querySelectorAll('.ninblu-icon:empty').forEach(el => el.innerHTML = this.getSVG()); }
}

// --- 2. API DATA ENGINE (Fetch JSON) ---

// Helper: Convertir "dd/MM/yyyy" a Objeto Date
function parseDate(dateStr) {
    if(!dateStr) return new Date(0);
    const [day, month, year] = dateStr.split('/');
    // Nota: El constructor Date acepta (yyyy, indexMes, dia)
    return new Date(`${year}-${month}-${day}`);
}

async function fetchProjects() {
    const loader = document.getElementById('loader');

    try {
        console.log("Conectando con Ninblu API...");
        
        // MODIFICACIÓN CRÍTICA PARA CORS: redirect: 'follow'
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'GET',
            redirect: 'follow' // Esto sigue la redirección de Google
        });
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json(); 
        
        // Validar si la API devolvió un error controlado
        if (data.error) {
            throw new Error(data.error);
        }

        allProjectsData = [];

        // Mapeo de datos JSON a nuestro objeto
        data.forEach(item => {
            // Evitar filas vacías
            if(!item.title) return;

            // Procesar categorías (Separar por comas)
            const rawCats = item.categories ? String(item.categories) : 'General';
            // Crear Array limpio ["Web", "Branding"]
            const catArray = rawCats.split(',').map(c => c.trim()).filter(c => c.length > 0);

            allProjectsData.push({
                id: item.id,
                title: item.title,
                dept: item.dept,
                lead: item.lead,
                media: item.media,
                desc: item.desc,
                linkUrl: item.linkUrl,
                linkTxt: item.linkTxt,
                categories: catArray, 
                categoriesStr: catArray.join(' | '), // Texto para mostrar
                dateStr: item.date, // Fecha visual
                dateObj: parseDate(item.date) // Fecha lógica
            });
        });

        generateFilters();
        renderProjects();
        loader.style.display = 'none';

    } catch (e) {
        console.error("Fetch Error:", e);
        loader.innerText = "Error de conexión. Verifica la consola.";
        loader.style.color = "#f4676f";
    }
}

// --- 3. LOGIC FOR FILTERS & RENDERING ---

function generateFilters() {
    const container = document.getElementById('categoryFilters');
    
    // Extraer todas las categorías únicas
    const allCats = allProjectsData.flatMap(p => p.categories);
    const uniqueCats = [...new Set(allCats)].sort();
    
    // Botón "Todos"
    container.innerHTML = `<button class="filter-btn active" onclick="setFilter('all', this)">Todos</button>`;
    
    uniqueCats.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.innerText = cat;
        btn.onclick = () => setFilter(cat, btn);
        container.appendChild(btn);
    });
}

// Función global para onclick en HTML
window.setFilter = (cat, btn) => {
    currentCategory = cat;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProjects();
};

document.getElementById('dateSort').addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderProjects();
});

function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = '';

    // 1. Filtrar (Multi-Categoría)
    // Si es 'all', muestra todo. Si no, busca si la categoría está en el array del proyecto.
    let filtered = currentCategory === 'all' 
        ? allProjectsData 
        : allProjectsData.filter(p => p.categories.includes(currentCategory));

    // 2. Ordenar
    filtered.sort((a, b) => {
        if (currentSort === 'newest') {
            return b.dateObj - a.dateObj; // Reciente primero
        } else {
            return a.dateObj - b.dateObj; // Antiguo primero
        }
    });

    // 3. Pintar
    if(filtered.length === 0) {
        grid.innerHTML = '<p style="color:#aaa; grid-column:1/-1; text-align:center;">No hay proyectos disponibles.</p>';
        return;
    }

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'project-card-dynamic';
        card.style.animation = 'fadeIn 0.5s ease forwards';
        
        let mediaHtml = p.media.includes('.mp4') 
            ? `<video src="${p.media}" muted loop onmouseover="this.play()" onmouseout="this.pause()"></video>`
            : `<img src="${p.media}" alt="${p.title}" loading="lazy">`;

        card.innerHTML = `
            <div class="p-media">${mediaHtml}</div>
            <div class="p-info">
                <div>
                    <div class="p-dept">${p.categoriesStr}</div>
                    <h3 class="p-title">${p.title}</h3>
                </div>
                <div class="p-lead">
                    <span>${p.dateStr}</span>
                    <span style="float:right; color:var(--ninblu-pink)">Encargado/a: ${p.lead}</span>
                </div>
            </div>
        `;
        card.onclick = () => openModal(p);
        grid.appendChild(card);
    });
}

// --- 4. MODAL INTERACTIONS ---

const modal = document.getElementById('projectModal');
const mMedia = document.getElementById('modalMediaContainer');
const mTitle = document.getElementById('modalTitle');
const mDept = document.getElementById('modalDept');
const mLead = document.getElementById('modalLead');
const mDesc = document.getElementById('modalDesc');
const mLink = document.getElementById('modalLink');
const closeBtn = document.getElementById('closeModalBtn');

function openModal(p) {
    mTitle.innerText = p.title;
    mDept.innerText = `${p.categoriesStr} — ${p.dept}`;
    mLead.innerText = p.lead;
    mDesc.innerText = p.desc;
    
    // Botón
    mLink.style.display = p.linkUrl ? 'inline-block' : 'none';
    if(p.linkUrl) { 
        mLink.href = p.linkUrl; 
        mLink.innerText = p.linkTxt || 'VER PROYECTO'; 
    }
    
    // Media
    mMedia.innerHTML = p.media.includes('.mp4') 
        ? `<video src="${p.media}" controls autoplay class="modal-video"></video>`
        : `<img src="${p.media}">`;
    mMedia.classList.remove('expanded');

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    const v = mMedia.querySelector('video');
    if(v) v.pause();
}

closeBtn.onclick = closeModal;
modal.onclick = (e) => { if(e.target === modal) closeModal(); };
mMedia.onclick = function() { 
    if(this.querySelector('img')) this.classList.toggle('expanded'); 
};

// Scroll Top
const sBtn = document.getElementById('scrollTopBtn');
window.onscroll = () => {
    if(window.scrollY > 300) sBtn.classList.add('visible');
    else sBtn.classList.remove('visible');
};
sBtn.onclick = () => window.scrollTo({top:0, behavior:'smooth'});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initUniverse();
    NinbluLogo.inject();
    fetchProjects();
});

// Estilo de Animación
const style = document.createElement('style');
style.innerHTML = `@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`;
document.head.appendChild(style);
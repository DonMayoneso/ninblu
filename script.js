// --- 1. COMPONENTE JS LOGO (Evita repetir SVG) ---
class NinbluLogo {
    static getSVG() {
        return `
        <svg viewBox="0 0 425 487" xmlns="http://www.w3.org/2000/svg">
            <path d="M224.04,0c16.95,21.59,37.54,38.97,48.79,64.64,38.05,86.83-28.37,164.27-32.05,250.62l-2.48,2.6-4.69-.76c-3.48-39.33,12.1-76.74,22.1-113.89,11.94-44.36,19.26-75.66,5.99-121.43-7.61-26.24-23.01-44.24-40.16-64.77-13.73,19.14-35.42,35.5-44.2,57.72-21.32,53.93,4.37,122.78,12.58,177.93,4.45,29.94,7.11,63.61,6.2,93.87-.52,17.18-1.63,60.97-8.15,74.84-1.47,3.13-10.87,15.63-10.73,17.15,10.74,8.75,22.13,17.02,31.34,27.46,2.3,2.61,3.51,6.91,6.84,7.94,1.31-.23,14.03-16.48,16.01-19.03,3.48-4.49,12.46-19.03,15.5-21.47,4.49-3.6,8.91-.84,6.53,4.54-13.46,16.33-24.32,35.09-40.4,49.04h-3c-12.4-16.3-32.56-22.82-47.84-35.69,3.43-9.42,11.83-17.47,16.07-26.63,6.16-13.3,8.67-41.95,9.8-57.19,2.98-40.49.84-78.98-8.47-118.5-14.3-60.72-55.35-133.36-14.71-191.71,15.3-21.97,40.46-35.77,56.14-57.28h3Z"/>
            <path d="M.36,233c2.92-28.85,27.71-59.74,57.54-62.88,65.6-6.9,105.63,65.52,115.92,120.67,5.47,29.31,8.67,78.37-8.28,104.12-5.58,8.48-18.2,16.47-28.36,11.57l17.98-10.97c28.91-32.45,12.92-95.68.5-133.52-13.51-41.13-58.96-92.48-106.4-68.53-43.62,22.02-37.57,77.32.73,102.35,3.88,2.54,25.29,13.91,28.31,11.77,4.19-8.03,3.87-20.68,11.45-26.58,5.8-4.52,12.94-4.04,19.86-2.9,6.42,1.06,12.44,3.94,18.57,5.91l-20.03,2.42c-15.27,3.48-19.73,33.6-20.9,46.58-27.72-4.85-58.91-14.77-74.32-40.09-6.41-10.54-11.59-27.63-12.56-39.92-.43-5.36-.53-14.72,0-20Z"/>
            <path d="M424.75,231c.18,4.06.45,10.12,0,14-5.03,43.41-29.47,78.64-73.08,89.32-1.5.37-3.43,1.31-4.88.27-3.14-11.11-3.45-31.7-11.47-40.53-5.18-5.7-13.61-1.6-19.92-2.04-1.5-.1-2.9.75-2.48-1.5,8.08-5.14,25.46-18.95,32.95-7.02,3.97,6.33,6.39,37.37,7.99,38.51,35.28-12.07,59.04-53.77,53.79-90.38-5.62-39.25-44-58.9-78.69-38.04-36.21,21.77-48.56,67.74-57.51,106.41-7.01,30.29-13.06,69.87,6.61,96.41l18.86,12.6c-31.45,6.48-39.71-32.96-40.98-56.44-3.98-73.16,31.21-187.3,122.41-180.59,32.85,2.42,45.11,29.95,46.39,59.04Z"/>
        </svg>`;
    }
    static inject() {
        document.querySelectorAll('.ninblu-icon').forEach(el => {
            el.innerHTML = this.getSVG();
        });
    }
}
NinbluLogo.inject();

// --- 2. LOGO PARALLAX INTERACTIVO ---
const bgLogo = document.getElementById('bg-logo-container');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    // Desplazamiento sutil hacia arriba (negativo Y) al hacer scroll
    bgLogo.style.transform = `translate(-50%, calc(-50% - ${scrollY * 0.15}px))`;
});


// --- 3. NAVBAR BUBBLE ---
const navBubble = document.querySelector('.nav-bubble');
const navLinks = document.querySelectorAll('.nav-item');
const navContainer = document.querySelector('.nav-links');

function moveBubble(target) {
    navBubble.style.width = `${target.offsetWidth}px`;
    navBubble.style.left = `${target.offsetLeft}px`;
    navBubble.style.opacity = '1';
}

navLinks.forEach(link => {
    link.addEventListener('mouseenter', (e) => moveBubble(e.target));
});

navContainer.addEventListener('mouseleave', () => {
    const activeLink = document.querySelector('.nav-item.active');
    if(activeLink) moveBubble(activeLink);
});

window.addEventListener('scroll', () => {
    let current = '';
    document.querySelectorAll('section').forEach(sec => {
        if(pageYOffset >= sec.offsetTop - 300) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('href').includes(current)) link.classList.add('active');
    });
    if(!navContainer.matches(':hover')) {
        const active = document.querySelector('.nav-item.active');
        if(active) moveBubble(active);
    }
});


// --- 4. CURSOR PERSONALIZADO ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });
});


// --- 5. TILT EFFECT ---
const cards = document.querySelectorAll('.tilt-card');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y - rect.height/2) / rect.height/2) * -10;
        const rotateY = ((x - rect.width/2) / rect.width/2) * 10;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
    });
});


// --- 6. TEXT ROTATOR ---
const words = ["Audiovisual", "Sonoro", "Fotográfico", "de Marketing", "Visual", "Web", "de Animación", "de Diseño"];
let wordIndex = 0;
const wrapper = document.getElementById('word-rotator');
function updateWord() {
    const span = document.createElement('span');
    span.textContent = words[wordIndex];
    span.className = 'dynamic-word';
    wrapper.appendChild(span);
    void span.offsetWidth; span.classList.add('active');
    const oldSpans = wrapper.getElementsByTagName('span');
    if(oldSpans.length > 1) {
        oldSpans[0].classList.remove('active');
        oldSpans[0].classList.add('exit');
        setTimeout(() => oldSpans[0].remove(), 600);
    }
    wordIndex = (wordIndex + 1) % words.length;
}
updateWord();
setInterval(updateWord, 3000);


// --- 7. THREE.JS UNIVERSE (FIXED) ---
const initUniverse = () => {
    const canvas = document.getElementById('universe-canvas');
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05020a, 0.002);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const pCount = 3000;
    const pos = new Float32Array(pCount * 3);
    const scales = new Float32Array(pCount);
    for(let i=0; i<pCount; i++){
        pos[i*3] = (Math.random()-0.5)*200;
        pos[i*3+1] = (Math.random()-0.5)*200;
        pos[i*3+2] = (Math.random()-0.5)*200;
        scales[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

    const mat = new THREE.ShaderMaterial({
        uniforms: { uTime: {value: 0}, uColor: {value: new THREE.Color(0xffffff)} },
        vertexShader: `
            attribute float aScale; uniform float uTime; varying float vAlpha;
            void main(){
                vec4 mv = modelViewMatrix * vec4(position, 1.0);
                float t = sin(uTime*2.0 + aScale*10.0)*0.5 + 0.5;
                vAlpha = t * (0.3 + aScale*0.7);
                gl_PointSize = (2.0 + aScale*3.0) * (100.0 / -mv.z);
                gl_Position = projectionMatrix * mv;
            }
        `,
        fragmentShader: `
            uniform vec3 uColor; varying float vAlpha;
            void main(){
                if(distance(gl_PointCoord, vec2(0.5))>0.5) discard;
                gl_FragColor = vec4(uColor, vAlpha);
            }
        `,
        transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
    });

    const mesh = new THREE.Points(geo, mat);
    scene.add(mesh);

    const light = new THREE.PointLight(0xf4676f, 3, 60, 2);
    scene.add(light);

    let mouseX=0, mouseY=0;
    document.addEventListener('mousemove', e => {
        mouseX = (e.clientX / window.innerWidth)*2 -1;
        mouseY = -(e.clientY / window.innerHeight)*2 +1;
    });

    const animate = (t) => {
        requestAnimationFrame(animate);
        mat.uniforms.uTime.value = t*0.001;
        light.position.x += (mouseX*50 - light.position.x)*0.05;
        light.position.y += (mouseY*30 - light.position.y)*0.05;
        light.position.z = 20;
        mesh.rotation.y = t*0.0001;
        renderer.render(scene, camera);
    };
    animate(0);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};
initUniverse();
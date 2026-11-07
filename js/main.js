/* ============================================
   3D PRODUCT SHOWCASE — SPACE EDITION
   Three.js + OrbitControls + Bloom
   ============================================ */

// ── Product Data ──────────────────────────────
const PRODUCTS = [
  {
    name: 'NOVA X1',
    subtitle: 'Next-Gen Quantum Device',
    description: 'Experience the future of technology with our flagship quantum processor. Engineered for the cosmos, built for you.',
    tag: 'NEW ARRIVAL',
    specs: [
      { value: '12 THz', label: 'Processing' },
      { value: '0.3 nm', label: 'Precision' },
      { value: '∞', label: 'Possibilities' },
    ],
    color: 0x6c5ce7,
    emissive: 0x6c5ce7,
    accent: 0x00cec9,
  },
  {
    name: 'ORBIT R7',
    subtitle: 'Hyperdrive Navigation Core',
    description: 'Navigate through the stars with unmatched precision. The ORBIT R7 redefines spatial computing with crystalline clarity.',
    tag: 'BEST SELLER',
    specs: [
      { value: '8.4 PB', label: 'Memory' },
      { value: '99.97%', label: 'Accuracy' },
      { value: '< 1 ms', label: 'Latency' },
    ],
    color: 0xe84393,
    emissive: 0xe84393,
    accent: 0xfd79a8,
  },
  {
    name: 'NEBULA Z3',
    subtitle: 'Dark Matter Energy Cell',
    description: 'Harness the power of dark matter. The NEBULA Z3 provides limitless energy in a form factor smaller than a neutron star.',
    tag: 'LIMITED EDITION',
    specs: [
      { value: '∞ kWh', label: 'Capacity' },
      { value: '0 g', label: 'Emissions' },
      { value: '500 yr', label: 'Lifespan' },
    ],
    color: 0x00b894,
    emissive: 0x00b894,
    accent: 0x55efc4,
  },
];

let currentProduct = 0;

// ── Scene Setup ───────────────────────────────
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0a0f, 0.035);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 8);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.outputEncoding = THREE.sRGBEncoding;

// ── Post Processing (Bloom) ──────────────────
const composer = new THREE.EffectComposer(renderer);
const renderPass = new THREE.RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new THREE.UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,  // strength
  0.4,  // radius
  0.85  // threshold
);
composer.addPass(bloomPass);

// ── Orbit Controls ────────────────────────────
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.minDistance = 4;
controls.maxDistance = 15;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.8;
controls.maxPolarAngle = Math.PI * 0.75;
controls.minPolarAngle = Math.PI * 0.25;

// ── Lighting ──────────────────────────────────
const ambientLight = new THREE.AmbientLight(0x222244, 0.5);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 1);
mainLight.position.set(5, 5, 5);
scene.add(mainLight);

const accentLight1 = new THREE.PointLight(0x6c5ce7, 2, 20);
accentLight1.position.set(-3, 3, 3);
scene.add(accentLight1);

const accentLight2 = new THREE.PointLight(0x00cec9, 2, 20);
accentLight2.position.set(3, -2, 4);
scene.add(accentLight2);

const rimLight = new THREE.PointLight(0xe84393, 1.5, 15);
rimLight.position.set(0, 5, -5);
scene.add(rimLight);

// ── Starfield ─────────────────────────────────
function createStarfield() {
  const starCount = 3000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);
  const colors = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    const radius = 50 + Math.random() * 150;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    sizes[i] = Math.random() * 2 + 0.5;

    // Slight color variation: white, blue-ish, purple-ish
    const colorChoice = Math.random();
    if (colorChoice > 0.7) {
      colors[i3] = 0.6; colors[i3 + 1] = 0.7; colors[i3 + 2] = 1.0;
    } else if (colorChoice > 0.4) {
      colors[i3] = 0.8; colors[i3 + 1] = 0.6; colors[i3 + 2] = 1.0;
    } else {
      colors[i3] = 1.0; colors[i3 + 1] = 1.0; colors[i3 + 2] = 1.0;
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const stars = new THREE.Points(geometry, material);
  scene.add(stars);
  return stars;
}

const starfield = createStarfield();

// ── Nebula Particles ──────────────────────────
function createNebula() {
  const count = 500;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 80;
    positions[i3 + 1] = (Math.random() - 0.5) * 40;
    positions[i3 + 2] = (Math.random() - 0.5) * 80 - 20;

    const c = new THREE.Color();
    c.setHSL(0.7 + Math.random() * 0.2, 0.8, 0.3 + Math.random() * 0.2);
    colors[i3] = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 2.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.15,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const nebula = new THREE.Points(geometry, material);
  scene.add(nebula);
  return nebula;
}

const nebula = createNebula();

// ── Floating Particles (around product) ───────
function createFloatingParticles() {
  const count = 200;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const angle = Math.random() * Math.PI * 2;
    const radius = 2 + Math.random() * 4;
    positions[i3] = Math.cos(angle) * radius;
    positions[i3 + 1] = (Math.random() - 0.5) * 4;
    positions[i3 + 2] = Math.sin(angle) * radius;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 0.04,
    color: 0x00cec9,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
  return particles;
}

const floatingParticles = createFloatingParticles();

// ── Orbital Rings ─────────────────────────────
function createOrbitalRing(radius, color, opacity) {
  const geometry = new THREE.TorusGeometry(radius, 0.01, 8, 128);
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
  });
  const ring = new THREE.Mesh(geometry, material);
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);
  return ring;
}

const ring1 = createOrbitalRing(3.5, 0x6c5ce7, 0.2);
const ring2 = createOrbitalRing(4.2, 0x00cec9, 0.1);
const ring3 = createOrbitalRing(5.0, 0xe84393, 0.08);

// ── Product Platform ──────────────────────────
function createPlatform() {
  const geometry = new THREE.CylinderGeometry(2.5, 2.8, 0.1, 64);
  const material = new THREE.MeshStandardMaterial({
    color: 0x111122,
    metalness: 0.9,
    roughness: 0.3,
    transparent: true,
    opacity: 0.6,
  });
  const platform = new THREE.Mesh(geometry, material);
  platform.position.y = -1.5;
  scene.add(platform);

  // Platform edge glow
  const edgeGeometry = new THREE.TorusGeometry(2.65, 0.02, 8, 64);
  const edgeMaterial = new THREE.MeshBasicMaterial({
    color: 0x00cec9,
    transparent: true,
    opacity: 0.6,
  });
  const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
  edge.rotation.x = Math.PI / 2;
  edge.position.y = -1.45;
  scene.add(edge);

  return { platform, edge };
}

const platform = createPlatform();

// ── Product Models ────────────────────────────
const productGroup = new THREE.Group();
scene.add(productGroup);

function createProductNova() {
  const group = new THREE.Group();

  // Main body — icosahedron (futuristic core)
  const coreGeo = new THREE.IcosahedronGeometry(1, 1);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a2e,
    metalness: 0.95,
    roughness: 0.1,
    emissive: 0x6c5ce7,
    emissiveIntensity: 0.3,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  // Wireframe overlay
  const wireGeo = new THREE.IcosahedronGeometry(1.02, 1);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x6c5ce7,
    wireframe: true,
    transparent: true,
    opacity: 0.3,
  });
  const wireframe = new THREE.Mesh(wireGeo, wireMat);
  group.add(wireframe);

  // Glowing inner sphere
  const innerGeo = new THREE.SphereGeometry(0.6, 32, 32);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0x00cec9,
    transparent: true,
    opacity: 0.4,
  });
  const inner = new THREE.Mesh(innerGeo, innerMat);
  group.add(inner);

  // Orbiting small spheres
  for (let i = 0; i < 6; i++) {
    const smallGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const smallMat = new THREE.MeshBasicMaterial({
      color: 0x00cec9,
    });
    const small = new THREE.Mesh(smallGeo, smallMat);
    const angle = (i / 6) * Math.PI * 2;
    small.position.set(Math.cos(angle) * 1.5, 0, Math.sin(angle) * 1.5);
    small.userData = { angle, speed: 0.5 + Math.random() * 0.5, radius: 1.5 };
    group.add(small);
  }

  return group;
}

function createProductOrbit() {
  const group = new THREE.Group();

  // Torus knot — complex geometry
  const knotGeo = new THREE.TorusKnotGeometry(0.8, 0.25, 128, 32, 2, 3);
  const knotMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a2e,
    metalness: 0.9,
    roughness: 0.15,
    emissive: 0xe84393,
    emissiveIntensity: 0.3,
  });
  const knot = new THREE.Mesh(knotGeo, knotMat);
  group.add(knot);

  // Wireframe overlay
  const wireGeo = new THREE.TorusKnotGeometry(0.82, 0.26, 128, 32, 2, 3);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xe84393,
    wireframe: true,
    transparent: true,
    opacity: 0.2,
  });
  group.add(new THREE.Mesh(wireGeo, wireMat));

  // Floating ring
  const ringGeo = new THREE.TorusGeometry(1.4, 0.03, 8, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xfd79a8,
    transparent: true,
    opacity: 0.5,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 3;
  group.add(ring);

  return group;
}

function createProductNebula() {
  const group = new THREE.Group();

  // Dodecahedron — energy cell shape
  const dodGeo = new THREE.DodecahedronGeometry(1, 0);
  const dodMat = new THREE.MeshStandardMaterial({
    color: 0x0d1117,
    metalness: 0.95,
    roughness: 0.05,
    emissive: 0x00b894,
    emissiveIntensity: 0.4,
  });
  const dod = new THREE.Mesh(dodGeo, dodMat);
  group.add(dod);

  // Wireframe
  const wireGeo = new THREE.DodecahedronGeometry(1.03, 0);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x55efc4,
    wireframe: true,
    transparent: true,
    opacity: 0.4,
  });
  group.add(new THREE.Mesh(wireGeo, wireMat));

  // Energy glow
  const glowGeo = new THREE.SphereGeometry(0.5, 32, 32);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x55efc4,
    transparent: true,
    opacity: 0.3,
  });
  group.add(new THREE.Mesh(glowGeo, glowMat));

  // Orbiting cubes
  for (let i = 0; i < 4; i++) {
    const cubeGeo = new THREE.BoxGeometry(0.15, 0.15, 0.15);
    const cubeMat = new THREE.MeshBasicMaterial({
      color: 0x55efc4,
      transparent: true,
      opacity: 0.7,
    });
    const cube = new THREE.Mesh(cubeGeo, cubeMat);
    const angle = (i / 4) * Math.PI * 2;
    cube.position.set(Math.cos(angle) * 1.6, 0, Math.sin(angle) * 1.6);
    cube.userData = { angle, speed: 0.3 + Math.random() * 0.3, radius: 1.6 };
    group.add(cube);
  }

  return group;
}

// Create all product models
const productModels = [
  createProductNova(),
  createProductOrbit(),
  createProductNebula(),
];

// Add first product
productModels.forEach((model, i) => {
  model.visible = i === 0;
  productGroup.add(model);
});

// ── Switch Product ────────────────────────────
function switchProduct(index) {
  if (index === currentProduct) return;

  const prev = productModels[currentProduct];
  const next = productModels[index];
  const data = PRODUCTS[index];

  // Fade out info
  const info = document.getElementById('product-info');
  info.style.opacity = '0';
  info.style.transition = 'opacity 0.4s ease';

  // Animate product switch
  const duration = 600;
  const start = performance.now();

  function animateSwitch(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic

    if (progress < 0.5) {
      // Shrink old
      const s = 1 - ease * 2;
      prev.scale.setScalar(Math.max(s, 0.001));
    } else {
      // Swap visibility at midpoint
      if (prev.visible) {
        prev.visible = false;
        prev.scale.setScalar(1);
        next.visible = true;
        next.scale.setScalar(0.001);
      }
      // Grow new
      const s = (ease - 0.5) * 2;
      next.scale.setScalar(s);
    }

    if (progress < 1) {
      requestAnimationFrame(animateSwitch);
    } else {
      next.scale.setScalar(1);
    }
  }

  requestAnimationFrame(animateSwitch);

  // Update info after delay
  setTimeout(() => {
    document.getElementById('product-title').textContent = data.name;
    document.getElementById('product-subtitle').textContent = data.subtitle;
    document.getElementById('product-description').textContent = data.description;
    document.querySelector('.product-tag').textContent = data.tag;

    data.specs.forEach((spec, i) => {
      document.getElementById(`spec-${i + 1}-val`).textContent = spec.value;
      document.getElementById(`spec-${i + 1}-lbl`).textContent = spec.label;
    });

    info.style.opacity = '1';
  }, 400);

  // Update accent lights
  accentLight1.color.setHex(data.color);
  accentLight2.color.setHex(data.accent);

  // Update platform edge
  platform.edge.material.color.setHex(data.accent);

  // Update floating particles
  floatingParticles.material.color.setHex(data.accent);

  // Update ring colors
  ring1.material.color.setHex(data.color);

  // Update dots
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });

  // Update nav links
  document.querySelectorAll('.nav-link').forEach((link, i) => {
    link.classList.toggle('active', i === index);
  });

  currentProduct = index;
}

// ── Event Listeners ───────────────────────────
document.querySelectorAll('.dot').forEach(dot => {
  dot.addEventListener('click', () => {
    switchProduct(parseInt(dot.dataset.product));
  });
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    switchProduct(parseInt(link.dataset.product));
  });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    switchProduct((currentProduct + 1) % PRODUCTS.length);
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    switchProduct((currentProduct - 1 + PRODUCTS.length) % PRODUCTS.length);
  }
});

// Mouse wheel product switching
let wheelCooldown = false;
canvas.addEventListener('wheel', (e) => {
  if (wheelCooldown) return;
  wheelCooldown = true;
  setTimeout(() => wheelCooldown = false, 1000);

  if (e.deltaY > 0) {
    switchProduct((currentProduct + 1) % PRODUCTS.length);
  } else {
    switchProduct((currentProduct - 1 + PRODUCTS.length) % PRODUCTS.length);
  }
}, { passive: true });

// ── Animation Loop ────────────────────────────
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsed = clock.getElapsedTime();
  const delta = clock.getDelta();

  // Rotate starfield slowly
  starfield.rotation.y = elapsed * 0.01;
  starfield.rotation.x = Math.sin(elapsed * 0.005) * 0.1;

  // Nebula drift
  nebula.rotation.y = elapsed * 0.008;
  nebula.rotation.z = Math.sin(elapsed * 0.003) * 0.05;

  // Floating particles orbit
  floatingParticles.rotation.y = elapsed * 0.15;
  floatingParticles.position.y = Math.sin(elapsed * 0.5) * 0.1;

  // Orbital rings
  ring1.rotation.x = Math.PI / 2 + Math.sin(elapsed * 0.3) * 0.2;
  ring1.rotation.z = elapsed * 0.1;
  ring2.rotation.x = Math.PI / 3 + Math.cos(elapsed * 0.2) * 0.15;
  ring2.rotation.z = -elapsed * 0.08;
  ring3.rotation.x = Math.PI / 4 + Math.sin(elapsed * 0.15) * 0.1;
  ring3.rotation.y = elapsed * 0.05;

  // Platform edge pulse
  platform.edge.material.opacity = 0.4 + Math.sin(elapsed * 2) * 0.2;

  // Animate current product
  const currentModel = productModels[currentProduct];
  if (currentModel.visible) {
    // Gentle float
    currentModel.position.y = Math.sin(elapsed * 0.8) * 0.15;

    // Slow self-rotation
    currentModel.rotation.y = elapsed * 0.2;

    // Animate orbiting children
    currentModel.children.forEach(child => {
      if (child.userData && child.userData.angle !== undefined) {
        const a = child.userData.angle + elapsed * child.userData.speed;
        const r = child.userData.radius;
        child.position.x = Math.cos(a) * r;
        child.position.z = Math.sin(a) * r;
        child.position.y = Math.sin(a * 2) * 0.3;
        child.rotation.x = elapsed;
        child.rotation.y = elapsed * 1.5;
      }
    });
  }

  // Accent lights orbit
  accentLight1.position.x = Math.cos(elapsed * 0.3) * 4;
  accentLight1.position.z = Math.sin(elapsed * 0.3) * 4;
  accentLight2.position.x = Math.cos(elapsed * 0.2 + Math.PI) * 5;
  accentLight2.position.z = Math.sin(elapsed * 0.2 + Math.PI) * 5;

  // Update controls
  controls.update();

  // Render with bloom
  composer.render();
}

// ── Resize Handler ────────────────────────────
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onResize);

// ── Start ─────────────────────────────────────
// Hide loader after a short delay
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1500);
});

// Start animation
animate();
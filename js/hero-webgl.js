/**
 * Hero WebGL — particle nebula + shader glow (Three.js)
 * Tắt khi prefers-reduced-motion hoặc WebGL không khả dụng.
 */
(function () {
    const canvas = document.getElementById("hero-canvas");
    const hero = document.getElementById("home-hero");
    if (!canvas || !hero || typeof THREE === "undefined") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
        hero.classList.add("home-hero--static");
        return;
    }

    let gl;
    try {
        gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    } catch (e) {
        gl = null;
    }
    if (!gl) {
        hero.classList.add("home-hero--static");
        return;
    }

    try {
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x050508, 1);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.036);

    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 120);
    camera.position.z = 6.2;

    // —— Particles: vòng xoắn + hạt phụ ——
    const narrow = window.matchMedia("(max-width: 768px)").matches;
    const COUNT = narrow ? 2400 : 5200;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const phases = new Float32Array(COUNT);

    const c1 = new THREE.Color("#38bdf8");
    const c2 = new THREE.Color("#f472b6");
    const c3 = new THREE.Color("#a78bfa");
    const tmp = new THREE.Color();

    for (let i = 0; i < COUNT; i++) {
        const t = (i / COUNT) * Math.PI * 8;
        const r = 1.8 + Math.random() * 3.2;
        const spread = (Math.random() - 0.5) * 1.1;
        positions[i * 3] = Math.cos(t) * r + spread * 0.4;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2.8 + Math.sin(t * 0.7) * 0.6;
        positions[i * 3 + 2] = Math.sin(t) * r + spread * 0.4;

        const mix = Math.random();
        if (mix < 0.33) tmp.copy(c1);
        else if (mix < 0.66) tmp.copy(c2);
        else tmp.copy(c3);
        tmp.multiplyScalar(0.75 + Math.random() * 0.45);
        colors[i * 3] = tmp.r;
        colors[i * 3 + 1] = tmp.g;
        colors[i * 3 + 2] = tmp.b;

        sizes[i] = 0.4 + Math.random() * 1.4;
        phases[i] = Math.random() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));

    const particleVert = `
    precision highp float;
    attribute vec3 aColor;
    attribute float aSize;
    attribute float aPhase;
    uniform float uTime;
    uniform float uPixelRatio;
    varying vec3 vColor;
    varying float vBlink;
    void main() {
      vColor = aColor;
      vec3 pos = position;
      float w = uTime * 0.35 + aPhase;
      pos.x += sin(w + position.z * 2.0) * 0.08;
      pos.y += cos(w * 0.8 + position.x * 1.5) * 0.12;
      pos.z += sin(w * 0.6 + position.y) * 0.08;
      vBlink = 0.55 + 0.45 * sin(uTime * 1.2 + aPhase);
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = aSize * uPixelRatio * (260.0 / -mvPosition.z);
      gl_PointSize = clamp(gl_PointSize, 1.0, 120.0);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

    const particleFrag = `
    precision mediump float;
    varying vec3 vColor;
    varying float vBlink;
    void main() {
      vec2 c = gl_PointCoord - vec2(0.5);
      float d = length(c);
      if (d > 0.5) discard;
      float alpha = pow(1.0 - d * 2.0, 1.8) * vBlink;
      gl_FragColor = vec4(vColor * 1.08, alpha * 0.72);
    }
  `;

    const particles = new THREE.Points(
        geo,
        new THREE.ShaderMaterial({
            vertexShader: particleVert,
            fragmentShader: particleFrag,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
            },
        })
    );
    scene.add(particles);

    // —— Chuột: xoay nhẹ scene ——
    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;

    function onPointerMove(e) {
        const r = hero.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    }

    function onPointerLeave() {
        tx = 0;
        ty = 0;
    }

    hero.addEventListener("mousemove", onPointerMove);
    hero.addEventListener("mouseleave", onPointerLeave);
    hero.addEventListener(
        "touchmove",
        (e) => {
            if (e.touches.length) onPointerMove(e.touches[0]);
        },
        { passive: true }
    );

    let w = 0;
    let h = 0;

    function resize() {
        w = hero.clientWidth;
        h = hero.clientHeight;
        if (w < 1 || h < 1) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        particles.material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    }

    resize();
    window.addEventListener("resize", resize);

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        particles.material.uniforms.uTime.value = t;
        particles.rotation.y = t * 0.045;
        particles.rotation.x = Math.sin(t * 0.08) * 0.06;

        mx += (tx - mx) * 0.04;
        my += (ty - my) * 0.04;
        scene.rotation.y = mx * 0.22;
        scene.rotation.x = my * -0.12;

        renderer.render(scene, camera);
    }

    animate();
    } catch (err) {
        console.warn("hero-webgl:", err);
        hero.classList.add("home-hero--static");
    }
})();

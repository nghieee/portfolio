// Hero hologram frame (Babylon.js)
// - Runs only on desktop
// - Draws a glowing wireframe-like rectangle around your photo
// - Does NOT change background; sits behind content layer
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  if (typeof BABYLON === "undefined") return;

  const hero = document.querySelector(".home-hero");
  const canvas = document.getElementById("hero-babylon");
  const photo = document.querySelector(".home-hero__photo");
  if (!hero || !canvas || !photo) return;

  const isSmall = window.matchMedia("(max-width: 900px)").matches;
  if (isSmall) return; // keep it clean on mobile

  try {
    const engine = new BABYLON.Engine(canvas, true, {
      preserveDrawingBuffer: false,
      stencil: true,
    });

    const scene = new BABYLON.Scene(engine);
    // Keep transparent so our hero CSS background still shows
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    const light = new BABYLON.HemisphericLight(
      "h",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    light.intensity = 1.1;

    // Orthographic camera so world units map to pixels
    const camera = new BABYLON.FreeCamera(
      "cam",
      new BABYLON.Vector3(0, 0, 200),
      scene
    );
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;

    const glow = new BABYLON.GlowLayer("glow", scene, { intensity: 1.15 });
    glow.blurKernel = 80;

    const root = new BABYLON.TransformNode("root", scene);

  const mat = new BABYLON.StandardMaterial("m", scene);
  mat.emissiveColor = new BABYLON.Color3(0.28, 0.85, 1.25); // cyan (stronger)
  mat.diffuseColor = new BABYLON.Color3(0, 0, 0);
  mat.specularColor = new BABYLON.Color3(0, 0, 0);
  mat.alpha = 0.95;
  mat.backFaceCulling = false;

  // Frame pieces (thin boxes)
  const border = 6; // thicker = visible
  const depth = 0.9;

    let top, bottom, left, right;

    function createOrUpdateMeshes(width, height) {
    const totalW = Math.max(100, width);
    const totalH = Math.max(100, height);

    if (!top) {
      top = BABYLON.MeshBuilder.CreateBox(
        "top",
        { width: totalW, height: border, depth },
        scene
      );
      bottom = top.clone("bottom");
      left = top.clone("left");
      right = top.clone("right");

      [top, bottom, left, right].forEach((m) => {
        m.material = mat;
        m.parent = root;
      });
    }

    // top/bottom horizontal
    top.scaling.set(totalW / 2, border / 2, 1);
    bottom.scaling.set(totalW / 2, border / 2, 1);

    // left/right vertical
    left.scaling.set(border / 2, totalH / 2, 1);
    right.scaling.set(border / 2, totalH / 2, 1);

    // positions relative to root center
    top.position.set(0, totalH / 2 - border / 2, 0);
    bottom.position.set(0, -totalH / 2 + border / 2, 0);
    left.position.set(-totalW / 2 + border / 2, 0, 0);
    right.position.set(totalW / 2 - border / 2, 0, 0);
  }

  let mx = 0;
  let my = 0;
  let tx = 0;
  let ty = 0;

    function onMove(e) {
    const r = hero.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5; // [-0.5..0.5]
    const ny = (e.clientY - r.top) / r.height - 0.5;
    tx = nx * 2;
    ty = ny * 2;
  }

    hero.addEventListener("mousemove", onMove, { passive: true });
    hero.addEventListener("mouseleave", () => {
      tx = 0;
      ty = 0;
    });

    function resizeCameraAndFrame() {
    const hr = hero.getBoundingClientRect();
    const width = Math.max(1, hr.width);
    const height = Math.max(1, hr.height);

    // world range
    camera.orthoLeft = -width / 2;
    camera.orthoRight = width / 2;
    camera.orthoTop = height / 2;
    camera.orthoBottom = -height / 2;

    camera.position.z = 200;
    camera.updateProjectionMatrix();

    const pr = photo.getBoundingClientRect();
    const cx = pr.left - hr.left + pr.width / 2;
    const cy = pr.top - hr.top + pr.height / 2;

    // Convert screen coords to centered world coords
    const wx = cx - width / 2;
    const wy = height / 2 - cy; // invert Y
    root.position.set(wx, wy, 0);

    createOrUpdateMeshes(pr.width, pr.height);
  }

    window.addEventListener("resize", resizeCameraAndFrame);
    resizeCameraAndFrame();

    const start = performance.now();

    scene.onBeforeRenderObservable.add(() => {
      const t = (performance.now() - start) / 1000;
      mx += (tx - mx) * 0.05;
      my += (ty - my) * 0.05;

      root.rotation.z = mx * 0.12;
      root.rotation.x = my * 0.06;

      // subtle pulse in glow/material
      const pulse = 0.6 + 0.4 * Math.sin(t * 1.2);
      glow.intensity = 0.65 + pulse * 0.5;

      mat.emissiveColor = new BABYLON.Color3(
      0.25 + pulse * 0.18,
      0.8,
        1.0
      );
    });

    engine.runRenderLoop(() => {
      scene.render();
    });
  } catch (err) {
    // If orthographic mode isn't supported for some reason, just fail silently.
    console.warn("hero-frame-babylon init failed:", err);
  }
})();


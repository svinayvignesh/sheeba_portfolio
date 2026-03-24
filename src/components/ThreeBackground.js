"use client";

import { useEffect, useRef } from "react";
import styles from "./ThreeBackground.module.css";

export default function ThreeBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    let renderer, scene, camera, raf;
    let globeGroup, particleSystem, arcLines;
    let mouse = { x: 0, y: 0 };
    let targetMouse = { x: 0, y: 0 };
    let scrollProgress = 0;

    async function init() {
      const THREE = await import("three");

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 42;

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      if (containerRef.current) {
        containerRef.current.appendChild(renderer.domElement);
      }

      // Colors
      const GOLD = new THREE.Color(0xc9a84c);
      const GOLD_BRIGHT = new THREE.Color(0xe8c55a);
      const GOLD_DIM = new THREE.Color(0x8a7233);
      const GOLD_FAINT = new THREE.Color(0x5a4a20);

      // ============================================
      // 1. GLOBE — LARGE wireframe sphere
      // ============================================
      globeGroup = new THREE.Group();
      const globeRadius = 16;

      // Main wireframe sphere — brighter
      const sphereGeo = new THREE.SphereGeometry(globeRadius, 48, 32);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: GOLD_DIM,
        wireframe: true,
        transparent: true,
        opacity: 0.08,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      globeGroup.add(sphere);

      // Crisp edge sphere on top
      const edgeSphereGeo = new THREE.IcosahedronGeometry(globeRadius * 1.002, 2);
      const edgeSphereMat = new THREE.MeshBasicMaterial({
        color: GOLD,
        wireframe: true,
        transparent: true,
        opacity: 0.14,
      });
      const edgeSphere = new THREE.Mesh(edgeSphereGeo, edgeSphereMat);
      globeGroup.add(edgeSphere);

      // Latitude rings — bolder
      const latitudes = [-60, -30, 0, 30, 60];
      latitudes.forEach((lat) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const ringRadius = globeRadius * Math.sin(phi);
        const ringY = globeRadius * Math.cos(phi);

        // Use a torus for visible thickness
        const torusGeo = new THREE.TorusGeometry(ringRadius, 0.04, 8, 96);
        const torusMat = new THREE.MeshBasicMaterial({
          color: GOLD,
          transparent: true,
          opacity: lat === 0 ? 0.45 : 0.2,
        });
        const torus = new THREE.Mesh(torusGeo, torusMat);
        torus.position.y = ringY;
        torus.rotation.x = Math.PI / 2;
        globeGroup.add(torus);
      });

      // Longitude meridian lines — using tubes for thickness
      for (let i = 0; i < 8; i++) {
        const curvePoints = [];
        for (let j = 0; j <= 64; j++) {
          const angle = (j / 64) * Math.PI * 2;
          curvePoints.push(
            new THREE.Vector3(
              globeRadius * Math.sin(angle),
              globeRadius * Math.cos(angle),
              0
            )
          );
        }
        const curvePath = new THREE.CatmullRomCurve3(curvePoints, true);
        const tubeGeo = new THREE.TubeGeometry(curvePath, 64, 0.03, 4, true);
        const tubeMat = new THREE.MeshBasicMaterial({
          color: GOLD_DIM,
          transparent: true,
          opacity: 0.15,
        });
        const tube = new THREE.Mesh(tubeGeo, tubeMat);
        tube.rotation.y = (i / 8) * Math.PI;
        globeGroup.add(tube);
      }

      // ============================================
      // 2. SURFACE NODES — bright glowing points
      // ============================================
      const nodePositions = [];
      const nodeCount = 50;
      for (let i = 0; i < nodeCount; i++) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const x = globeRadius * Math.sin(phi) * Math.cos(theta);
        const y = globeRadius * Math.sin(phi) * Math.sin(theta);
        const z = globeRadius * Math.cos(phi);
        nodePositions.push(new THREE.Vector3(x, y, z));
      }

      // Large node dots
      const nodeGeo = new THREE.BufferGeometry();
      const nodePos = new Float32Array(nodeCount * 3);
      nodePositions.forEach((p, i) => {
        nodePos[i * 3] = p.x;
        nodePos[i * 3 + 1] = p.y;
        nodePos[i * 3 + 2] = p.z;
      });
      nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePos, 3));
      const nodeMat = new THREE.PointsMaterial({
        color: GOLD_BRIGHT,
        size: 0.55,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
      });
      const nodePoints = new THREE.Points(nodeGeo, nodeMat);
      globeGroup.add(nodePoints);

      // Tiny node halos (larger, dimmer dots behind each node)
      const haloMat = new THREE.PointsMaterial({
        color: GOLD,
        size: 1.4,
        transparent: true,
        opacity: 0.15,
        sizeAttenuation: true,
      });
      const haloPoints = new THREE.Points(nodeGeo.clone(), haloMat);
      globeGroup.add(haloPoints);

      // ============================================
      // 3. CONNECTION ARCS — bright golden arcs
      // ============================================
      arcLines = [];
      const arcCount = 22;
      for (let i = 0; i < arcCount; i++) {
        const startIdx = Math.floor(Math.random() * nodeCount);
        let endIdx = Math.floor(Math.random() * nodeCount);
        while (endIdx === startIdx)
          endIdx = Math.floor(Math.random() * nodeCount);

        const start = nodePositions[startIdx];
        const end = nodePositions[endIdx];

        // Arc midpoint elevated above globe
        const mid = new THREE.Vector3()
          .addVectors(start, end)
          .multiplyScalar(0.5);
        const elevation = 1.2 + Math.random() * 0.3;
        mid.normalize().multiplyScalar(globeRadius * elevation);

        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const curvePoints = curve.getPoints(48);

        // Use TubeGeometry for thicker, visible arcs
        const curvePath = new THREE.CatmullRomCurve3(curvePoints);
        const arcGeo = new THREE.TubeGeometry(curvePath, 48, 0.04, 4, false);
        const arcMat = new THREE.MeshBasicMaterial({
          color: GOLD,
          transparent: true,
          opacity: 0.4,
        });
        const arcMesh = new THREE.Mesh(arcGeo, arcMat);
        globeGroup.add(arcMesh);

        // Traveling bright pulse dot
        const pulseGeo = new THREE.SphereGeometry(0.18, 8, 8);
        const pulseMat = new THREE.MeshBasicMaterial({
          color: GOLD_BRIGHT,
          transparent: true,
          opacity: 0.95,
        });
        const pulse = new THREE.Mesh(pulseGeo, pulseMat);
        globeGroup.add(pulse);

        arcLines.push({
          curve,
          pulse,
          speed: 0.12 + Math.random() * 0.2,
          offset: Math.random(),
        });
      }

      // ============================================
      // 4. GLOW RINGS — gold halos around the globe
      // ============================================
      const glowRing1 = new THREE.Mesh(
        new THREE.TorusGeometry(globeRadius + 1.5, 0.5, 8, 96),
        new THREE.MeshBasicMaterial({
          color: GOLD,
          transparent: true,
          opacity: 0.05,
        })
      );
      glowRing1.rotation.x = Math.PI * 0.5;
      globeGroup.add(glowRing1);

      const glowRing2 = new THREE.Mesh(
        new THREE.TorusGeometry(globeRadius + 3, 1.0, 8, 96),
        new THREE.MeshBasicMaterial({
          color: GOLD_FAINT,
          transparent: true,
          opacity: 0.025,
        })
      );
      glowRing2.rotation.x = Math.PI * 0.5;
      globeGroup.add(glowRing2);

      // Position globe
      globeGroup.position.set(0, 1, 0);
      // Tilt slightly for depth
      globeGroup.rotation.x = 0.2;
      globeGroup.rotation.z = 0.05;
      scene.add(globeGroup);

      // ============================================
      // 5. ORBITING KEYWORDS — resume data in space
      // ============================================
      const keywords = [
        { text: "TRANSFORMATION", size: 20 },
        { text: "AI & DIGITAL", size: 18 },
        { text: "SIX SIGMA", size: 16 },
        { text: "M&A INTEGRATION", size: 17 },
        { text: "40% FASTER", size: 22 },
        { text: "DATA-DRIVEN", size: 18 },
        { text: "AGILE", size: 19 },
        { text: "INNOVATION", size: 18 },
      ];

      const textSprites = [];
      keywords.forEach((kw, i) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 512;
        canvas.height = 64;
        ctx.font = `700 ${kw.size}px Inter, sans-serif`;
        ctx.fillStyle = `rgba(201, 168, 76, 0.5)`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.letterSpacing = "3px";
        ctx.fillText(kw.text, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          depthTest: false,
        });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(12, 1.5, 1);

        const angle = (i / keywords.length) * Math.PI * 2;
        const orbitRadius = globeRadius + 5 + (i % 3) * 2;

        sprite.userData = {
          angle,
          orbitRadius,
          orbitSpeed: 0.04 + (i % 3) * 0.015,
          yOffset: (Math.random() - 0.5) * 12,
          tiltPhase: Math.random() * Math.PI * 2,
        };

        globeGroup.add(sprite);
        textSprites.push(sprite);
      });

      // ============================================
      // 6. AMBIENT PARTICLES — constant across page
      // ============================================
      const pCount = 300;
      const pGeo = new THREE.BufferGeometry();
      const pPositions = new Float32Array(pCount * 3);
      const pVelocities = [];

      for (let i = 0; i < pCount; i++) {
        pPositions[i * 3] = (Math.random() - 0.5) * 90;
        pPositions[i * 3 + 1] = (Math.random() - 0.5) * 70;
        pPositions[i * 3 + 2] = (Math.random() - 0.5) * 50 - 5;
        pVelocities.push({
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.008,
          z: (Math.random() - 0.5) * 0.005,
        });
      }

      pGeo.setAttribute(
        "position",
        new THREE.BufferAttribute(pPositions, 3)
      );
      const pMat = new THREE.PointsMaterial({
        color: GOLD,
        size: 0.12,
        transparent: true,
        opacity: 0.25,
        sizeAttenuation: true,
      });
      particleSystem = new THREE.Points(pGeo, pMat);
      scene.add(particleSystem);

      // ============================================
      // EVENT LISTENERS
      // ============================================
      function onMouseMove(e) {
        targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        targetMouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
      }
      window.addEventListener("mousemove", onMouseMove);

      function onScroll() {
        const vh = window.innerHeight;
        scrollProgress = Math.min(window.scrollY / vh, 4);
      }
      window.addEventListener("scroll", onScroll, { passive: true });

      function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
      window.addEventListener("resize", onResize);

      // ============================================
      // ANIMATION LOOP
      // ============================================
      const clock = new THREE.Clock();

      function animate() {
        raf = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        // Smooth mouse
        mouse.x += (targetMouse.x - mouse.x) * 0.03;
        mouse.y += (targetMouse.y - mouse.y) * 0.03;

        // Globe fade/transform on scroll
        const heroFade = Math.max(0, 1 - scrollProgress * 0.65);

        globeGroup.visible = heroFade > 0.01;

        if (globeGroup.visible) {
          // Continuous rotation + mouse tilt
          globeGroup.rotation.y = elapsed * 0.06 + mouse.x * 0.4;
          globeGroup.rotation.x = 0.2 + mouse.y * 0.2;

          // Scale down slowly with scroll
          const s = Math.max(0.4, 1 - scrollProgress * 0.12);
          globeGroup.scale.setScalar(s);

          // Drift up with scroll
          globeGroup.position.y = 1 + scrollProgress * 10;

          // Update material opacities
          globeGroup.traverse((child) => {
            if (child.material) {
              if (child.material._baseOpacity === undefined) {
                child.material._baseOpacity = child.material.opacity;
              }
              child.material.opacity = child.material._baseOpacity * heroFade;
            }
          });

          // Arc pulse animation
          arcLines.forEach((arc) => {
            const t = (elapsed * arc.speed + arc.offset) % 1;
            const point = arc.curve.getPoint(t);
            arc.pulse.position.copy(point);
          });

          // Keyword orbit animation
          textSprites.forEach((sprite) => {
            const ud = sprite.userData;
            const angle = ud.angle + elapsed * ud.orbitSpeed;
            sprite.position.x = Math.cos(angle) * ud.orbitRadius;
            sprite.position.z = Math.sin(angle) * ud.orbitRadius;
            sprite.position.y =
              ud.yOffset + Math.sin(elapsed * 0.4 + ud.tiltPhase) * 1.5;
          });
        }

        // Ambient particles — always visible, intensify after hero
        const pFade = 0.15 + Math.min(scrollProgress * 0.12, 0.3);
        pMat.opacity = pFade;

        const positions = particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < pCount; i++) {
          positions[i * 3] += pVelocities[i].x;
          positions[i * 3 + 1] += pVelocities[i].y;
          positions[i * 3 + 2] += pVelocities[i].z;

          if (positions[i * 3] > 45) positions[i * 3] = -45;
          if (positions[i * 3] < -45) positions[i * 3] = 45;
          if (positions[i * 3 + 1] > 35) positions[i * 3 + 1] = -35;
          if (positions[i * 3 + 1] < -35) positions[i * 3 + 1] = 35;
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;

        particleSystem.rotation.y += mouse.x * 0.0003;
        particleSystem.rotation.x += mouse.y * 0.0002;

        // Camera sway
        camera.position.x += (mouse.x * 2.5 - camera.position.x) * 0.02;
        camera.position.y += (mouse.y * 1.5 - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      }

      animate();

      containerRef.current._three_cleanup = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(raf);
        renderer.dispose();
        if (containerRef.current && renderer.domElement.parentNode) {
          containerRef.current.removeChild(renderer.domElement);
        }
      };
    }

    init();

    return () => {
      if (containerRef.current && containerRef.current._three_cleanup) {
        containerRef.current._three_cleanup();
      }
    };
  }, []);

  return <div ref={containerRef} className={styles.threeBackground} />;
}

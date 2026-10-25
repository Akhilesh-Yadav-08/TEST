import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import { RotateCw, Compass, Shield, Sparkles } from 'lucide-react';

interface CorkBallScrollCanvasProps {
  className?: string;
  variant?: 'floating' | 'embedded' | 'hero';
}

/**
 * 3D Procedural Cork Cricket Ball that dynamically rotates in 3D as the user scrolls.
 * Completely 3D (Three.js WebGL) — no static pictures or fake sprites.
 */
export const CorkBallScrollCanvas: React.FC<CorkBallScrollCanvasProps> = ({
  className = '',
  variant = 'floating',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();
  const [scrollSpeed, setScrollSpeed] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [seamAngleDeg, setSeamAngleDeg] = useState<number>(18);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Mutable animation state ref to prevent React re-renders from resetting WebGL
  const animStateRef = useRef({
    ballGroup: null as THREE.Group | null,
    seamGroup: null as THREE.Group | null,
    scrollY: 0,
    prevScrollY: 0,
    scrollVelocity: 0,
    isDragging: false,
    pointerStartX: 0,
    pointerStartY: 0,
    manualRotX: 0.35,
    manualRotY: 0.75,
    autoSpin: 0.004,
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 1. Scene setup
    const scene = new THREE.Scene();

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0.4, 4.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // Clear background to transparent so it blends with pure black
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    // 2. Procedural Cork Cricket Ball Generation
    const ballGroup = new THREE.Group();
    scene.add(ballGroup);
    animStateRef.current.ballGroup = ballGroup;

    // Procedural leather texture with fine grain and gold crown foil stamp
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Leather base tone: rich deep cricket crimson
      const grad = ctx.createLinearGradient(0, 0, 1024, 512);
      grad.addColorStop(0, '#860c18');
      grad.addColorStop(0.5, '#720814');
      grad.addColorStop(1, '#56040d');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 512);

      // Procedural fine leather grain / pores
      const imgData = ctx.getImageData(0, 0, 1024, 512);
      for (let i = 0; i < imgData.data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 22;
        imgData.data[i] = Math.min(255, Math.max(0, imgData.data[i] + noise));
        imgData.data[i + 1] = Math.min(255, Math.max(0, imgData.data[i + 1] + noise * 0.4));
        imgData.data[i + 2] = Math.min(255, Math.max(0, imgData.data[i + 2] + noise * 0.4));
      }
      ctx.putImageData(imgData, 0, 0);

      // Gold Foil Stamp on the leather hemisphere
      ctx.save();
      ctx.translate(512, 160);
      ctx.strokeStyle = '#d4af37';
      ctx.fillStyle = '#ffd700';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 52, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 44, 0, Math.PI * 2);
      ctx.stroke();

      ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SPECIAL CORK', 0, -14);
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillText('156g • TEST', 0, 4);
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText('★ REGULATION ★', 0, 20);
      ctx.restore();

      // Quarter-seam impressions (perpendicular fine groove)
      ctx.strokeStyle = 'rgba(40, 0, 5, 0.45)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(256, 0);
      ctx.lineTo(256, 512);
      ctx.moveTo(768, 0);
      ctx.lineTo(768, 512);
      ctx.stroke();
    }

    const leatherTexture = new THREE.CanvasTexture(canvas);
    leatherTexture.colorSpace = THREE.SRGBColorSpace;
    leatherTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Procedural Normal / Bump Map for leather grain & stitch welt
    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = 512;
    bumpCanvas.height = 256;
    const bCtx = bumpCanvas.getContext('2d');
    if (bCtx) {
      bCtx.fillStyle = '#808080';
      bCtx.fillRect(0, 0, 512, 256);

      // Leather pebble noise
      const bData = bCtx.getImageData(0, 0, 512, 256);
      for (let i = 0; i < bData.data.length; i += 4) {
        const n = (Math.random() - 0.5) * 35;
        bData.data[i] = Math.min(255, Math.max(0, 128 + n));
        bData.data[i + 1] = Math.min(255, Math.max(0, 128 + n));
        bData.data[i + 2] = Math.min(255, Math.max(0, 128 + n));
      }
      bCtx.putImageData(bData, 0, 0);

      // Equator raised seam welt
      bCtx.fillStyle = '#ffffff';
      bCtx.fillRect(0, 122, 512, 12);
    }
    const bumpTexture = new THREE.CanvasTexture(bumpCanvas);

    // Ball Core Sphere
    const ballGeo = new THREE.SphereGeometry(1.15, 64, 64);
    const ballMat = new THREE.MeshPhysicalMaterial({
      map: leatherTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.025,
      roughness: 0.28,
      metalness: 0.05,
      clearcoat: 0.7,
      clearcoatRoughness: 0.18,
    });
    const ballMesh = new THREE.Mesh(ballGeo, ballMat);
    ballGroup.add(ballMesh);

    // 3. Prominent Raised Seam Assembly
    const seamGroup = new THREE.Group();
    ballGroup.add(seamGroup);
    animStateRef.current.seamGroup = seamGroup;

    // Raised Leather Welt Ring along the equator
    const weltGeo = new THREE.TorusGeometry(1.152, 0.024, 16, 128);
    const weltMat = new THREE.MeshStandardMaterial({
      color: 0x6e0811,
      roughness: 0.35,
      metalness: 0.05,
    });
    const weltMesh = new THREE.Mesh(weltGeo, weltMat);
    weltMesh.rotation.x = Math.PI / 2;
    seamGroup.add(weltMesh);

    // Hand-stitched Seam Cord: 6 rows of alternating ivory cross-stitches
    const stitchCount = 120;
    const stitchGeo = new THREE.CylinderGeometry(0.007, 0.007, 0.05, 6);
    const stitchMat = new THREE.MeshStandardMaterial({
      color: 0xf4ecd8,
      roughness: 0.5,
      metalness: 0.0,
    });

    const stitchInstanced = new THREE.InstancedMesh(stitchGeo, stitchMat, stitchCount * 2);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < stitchCount; i++) {
      const angle = (i / stitchCount) * Math.PI * 2;
      const radius = 1.168;

      // Primary row stitch
      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      dummy.position.set(x1, 0.014, z1);
      dummy.rotation.set(0, -angle, Math.PI / 4);
      dummy.updateMatrix();
      stitchInstanced.setMatrixAt(i, dummy.matrix);

      // Interlocking alternating stitch
      dummy.position.set(x1, -0.014, z1);
      dummy.rotation.set(0, -angle, -Math.PI / 4);
      dummy.updateMatrix();
      stitchInstanced.setMatrixAt(i + stitchCount, dummy.matrix);
    }
    stitchInstanced.instanceMatrix.needsUpdate = true;
    seamGroup.add(stitchInstanced);

    // Initial natural seam tilt
    ballGroup.rotation.z = THREE.MathUtils.degToRad(18);

    // 4. Studio Lighting Rig
    // Warm Key Light (Trophy & Ball Golden Rim)
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.8);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    // Cool Rim Light for leather edge silhouette
    const rimLight = new THREE.DirectionalLight(0x8bc34a, 1.2);
    rimLight.position.set(-3.5, 2, -2.5);
    scene.add(rimLight);

    // Under-light
    const warmBounce = new THREE.PointLight(0xffb300, 1.4, 8);
    warmBounce.position.set(0, -2, 1.5);
    scene.add(warmBounce);

    // Soft Ambient
    const ambientLight = new THREE.HemisphereLight(0xffffff, 0x111111, 0.85);
    scene.add(ambientLight);

    // Soft contact shadow disc
    const shadowGeo = new THREE.CircleGeometry(1.2, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.4,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.35;
    scene.add(shadowMesh);

    // 5. Scroll Interaction Handler
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - animStateRef.current.prevScrollY;
      animStateRef.current.scrollY = currentScrollY;
      animStateRef.current.scrollVelocity = delta;
      animStateRef.current.prevScrollY = currentScrollY;

      setScrollSpeed(Math.abs(Math.round(delta * 2)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // 6. Pointer Drag Interaction Handlers
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      animStateRef.current.isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      animStateRef.current.pointerStartX = clientX;
      animStateRef.current.pointerStartY = clientY;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!animStateRef.current.isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const dx = clientX - animStateRef.current.pointerStartX;
      const dy = clientY - animStateRef.current.pointerStartY;

      animStateRef.current.manualRotY += dx * 0.008;
      animStateRef.current.manualRotX += dy * 0.008;

      animStateRef.current.pointerStartX = clientX;
      animStateRef.current.pointerStartY = clientY;
    };

    const handlePointerUp = () => {
      animStateRef.current.isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    domElement.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // 7. Animation Loop with Exponential Damping & Scroll Synced Spin
    let frameId = 0;
    let clock = new THREE.Clock();

    const tick = () => {
      const delta = clock.getDelta();
      const st = animStateRef.current;

      if (ballGroup) {
        // As user scrolls, the ball rotates vigorously along X and Y axes
        const scrollDelta = st.scrollVelocity;
        
        // Dampen velocity smoothly
        st.scrollVelocity *= 0.92;

        // Base idle tumble + continuous scroll rotation
        const scrollSpinSpeed = scrollDelta * 0.02;
        st.manualRotY += (st.autoSpin + scrollSpinSpeed) * (delta * 60);
        st.manualRotX += (scrollSpinSpeed * 0.7) * (delta * 60);

        // Apply smoothed rotations
        ballGroup.rotation.y = THREE.MathUtils.damp(ballGroup.rotation.y, st.manualRotY, 8, delta);
        ballGroup.rotation.x = THREE.MathUtils.damp(ballGroup.rotation.x, st.manualRotX, 8, delta);

        // Subtle realistic precession wobble
        const time = clock.getElapsedTime();
        ballGroup.position.y = Math.sin(time * 1.5) * 0.04;
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 320;
      const newHeight = container.clientHeight || 320;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      domElement.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);

      renderer.dispose();
      ballGeo.dispose();
      ballMat.dispose();
      leatherTexture.dispose();
      bumpTexture.dispose();
      weltGeo.dispose();
      weltMat.dispose();
      stitchGeo.dispose();
      stitchMat.dispose();
      stitchInstanced.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();

      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, []);

  if (variant === 'floating') {
    return (
      <div
        className={`fixed bottom-6 left-6 z-40 transition-all duration-300 ${
          isCollapsed ? 'translate-y-20 opacity-40 hover:opacity-100 hover:translate-y-0' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative group bg-black/90 border border-amber-500/30 rounded-3xl p-3 shadow-2xl backdrop-blur-xl flex flex-col items-center">
          {/* Header pill */}
          <div className="flex items-center justify-between w-full px-2 pb-1 border-b border-white/10 text-[10px] font-mono">
            <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              3D Cork Ball
            </span>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-slate-400 hover:text-white cursor-pointer px-1"
            >
              {isCollapsed ? '▲ Show' : '▼ Hide'}
            </button>
          </div>

          {/* 3D WebGL Canvas Mount */}
          <div
            ref={mountRef}
            className="w-44 h-44 sm:w-52 sm:h-52 cursor-grab active:cursor-grabbing relative"
            title="Drag to rotate, scroll page to spin"
          />

          {/* Scroll & Rotation Live Telemetry */}
          <div className="w-full pt-1 border-t border-white/10 text-center space-y-0.5">
            <div className="text-[11px] font-mono font-bold text-white flex items-center justify-center gap-1.5">
              <RotateCw className={`w-3 h-3 text-amber-400 ${scrollSpeed > 0 ? 'animate-spin' : ''}`} />
              <span>Scroll-Driven 3D Spin</span>
            </div>
            <div className="text-[9px] font-mono text-slate-400">
              {scrollSpeed > 0 ? (
                <span className="text-emerald-400 font-bold">{scrollSpeed} RPM (Scrolling)</span>
              ) : (
                '156g Test Regulation Cork'
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Embedded or Hero Variant
  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <div
        ref={mountRef}
        className="w-full h-72 sm:h-80 md:h-96 cursor-grab active:cursor-grabbing relative"
      />
      <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-2 border-t border-white/10">
        <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          Authentic 3D Cork Core
        </span>
        <span>·</span>
        <span>Hand-Stitched Seam</span>
        <span>·</span>
        <span className="text-emerald-400">Rotates with Scroll</span>
      </div>
    </div>
  );
};

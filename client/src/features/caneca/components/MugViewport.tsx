/**
 * Atelier Editorial — o objeto 3D domina a bancada; controlos e leitura são periféricos.
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { renderMugDesignCanvas, type MugDesign } from "@/features/caneca/lib/designTexture";

type ViewId = "front" | "right" | "back" | "left" | "threequarters";

type MugViewportProps = {
  design: MugDesign;
  autoSpin: boolean;
  backgroundColor: string;
  backgroundImage: string;
  handleColor: string;
  innerColor: string;
  view: ViewId;
  snapshotToken: number;
  recordToken: number;
  onSnapshot: (dataUrl: string) => void;
  onVideoReady: (video: Blob) => void;
  onVideoError: (message: string) => void;
  onModelStatus: (status: "model" | "fallback") => void;
};

const MODEL_URL = "/assets/caneca/caneca.fbx";

function angleForView(view: ViewId) {
  const values: Record<ViewId, number> = {
    front: 0,
    right: -Math.PI / 2,
    back: Math.PI,
    left: Math.PI / 2,
    threequarters: -Math.PI / 4,
  };
  return values[view];
}

function setMaterialColor(material: any, color: string, texture?: any) {
  const candidate = material as any;
  if ("color" in candidate && candidate.color) candidate.color.set(color);
  if ("roughness" in candidate) candidate.roughness = 0.32;
  if ("metalness" in candidate) candidate.metalness = 0;
  if ("map" in candidate) candidate.map = texture ?? null;
  candidate.needsUpdate = true;
}

export default function MugViewport({
  design,
  autoSpin,
  backgroundColor,
  backgroundImage,
  handleColor,
  innerColor,
  view,
  snapshotToken,
  recordToken,
  onSnapshot,
  onVideoReady,
  onVideoError,
  onModelStatus,
}: MugViewportProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<any>(null);
  const mugGroupRef = useRef<any>(null);
  const modelRef = useRef<any>(null);
  const fallbackRef = useRef<any>(null);
  const printFilmRef = useRef<any>(null);
  const textureRef = useRef<any>(null);
  const decalTextureRef = useRef<any>(null);
  const artworkImageRef = useRef<HTMLImageElement | null>(null);
  const materialRefreshRef = useRef<() => void>(() => undefined);
  const autoSpinRef = useRef(autoSpin);
  const targetAngleRef = useRef(angleForView(view));
  const currentAngleRef = useRef(angleForView(view));

  useEffect(() => {
    autoSpinRef.current = autoSpin;
  }, [autoSpin]);

  useEffect(() => {
    targetAngleRef.current = angleForView(view);
  }, [view]);

  useEffect(() => {
    if (!design.imageSrc) {
      artworkImageRef.current = null;
      materialRefreshRef.current();
      return;
    }
    const image = new Image();
    image.onload = () => {
      artworkImageRef.current = image;
      materialRefreshRef.current();
    };
    image.onerror = () => {
      artworkImageRef.current = null;
      materialRefreshRef.current();
    };
    image.src = design.imageSrc;
  }, [design.imageSrc]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.01, 10000);
    camera.position.set(0, 0.4, 9.7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.setAttribute("aria-label", "Pré-visualização tridimensional da caneca");
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    scene.add(new THREE.HemisphereLight(0xfff7e9, 0x3f5069, 2.3));
    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const keyLight = new THREE.DirectionalLight(0xffffff, 4.2);
    keyLight.position.set(4.8, 6.5, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xffdfbf, 2.1);
    fillLight.position.set(-5, 2.5, 3);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0x92a9c8, 2.4);
    rimLight.position.set(2, 1.5, -6);
    scene.add(rimLight);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.ShadowMaterial({ color: 0x1a2940, opacity: 0.16 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.42;
    floor.receiveShadow = true;
    scene.add(floor);

    const mugGroup = new THREE.Group();
    mugGroup.rotation.y = currentAngleRef.current;
    scene.add(mugGroup);
    mugGroupRef.current = mugGroup;

    const texture = new THREE.CanvasTexture(renderMugDesignCanvas(design));
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    textureRef.current = texture;
    const decalTexture = new THREE.CanvasTexture(renderMugDesignCanvas(design, null, true));
    decalTexture.colorSpace = THREE.SRGBColorSpace;
    decalTexture.wrapS = THREE.ClampToEdgeWrapping;
    decalTexture.wrapT = THREE.ClampToEdgeWrapping;
    decalTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    decalTextureRef.current = decalTexture;

    // A película de impressão mantém a personalização legível mesmo em FBX sem UV de impressão confiável.
    const printFilm = new THREE.Mesh(
      new THREE.CylinderGeometry(1.735, 1.655, 3.32, 96, 1, true, -Math.PI * 0.7, Math.PI * 1.4),
      new THREE.MeshBasicMaterial({ map: decalTexture, transparent: true, depthWrite: false, side: THREE.DoubleSide }),
    );
    printFilm.position.y = -0.04;
    printFilm.renderOrder = 2;
    mugGroup.add(printFilm);
    printFilmRef.current = printFilm;

    const fallback = new THREE.Group();
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      map: texture,
      color: "#ffffff",
      roughness: 0.33,
      metalness: 0,
      clearcoat: 0.16,
      clearcoatRoughness: 0.4,
      side: THREE.DoubleSide,
    });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(1.72, 1.62, 3.7, 96, 1, true), bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    body.rotation.y = Math.PI;
    fallback.add(body);

    const rimMaterial = new THREE.MeshPhysicalMaterial({ color: innerColor, roughness: 0.26, clearcoat: 0.18 });
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.69, 0.14, 18, 96), rimMaterial);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 1.85;
    rim.castShadow = true;
    fallback.add(rim);

    const interior = new THREE.Mesh(
      new THREE.CircleGeometry(1.54, 96),
      new THREE.MeshPhysicalMaterial({ color: innerColor, roughness: 0.38, side: THREE.DoubleSide }),
    );
    interior.rotation.x = -Math.PI / 2;
    interior.position.y = 1.82;
    fallback.add(interior);

    const base = new THREE.Mesh(
      new THREE.TorusGeometry(1.61, 0.075, 12, 80),
      new THREE.MeshPhysicalMaterial({ color: design.bodyColor, roughness: 0.35 }),
    );
    base.rotation.x = Math.PI / 2;
    base.position.y = -1.85;
    fallback.add(base);

    const handleMaterial = new THREE.MeshPhysicalMaterial({ color: handleColor, roughness: 0.32, clearcoat: 0.14 });
    const handle = new THREE.Mesh(new THREE.TorusGeometry(1.03, 0.25, 18, 72), handleMaterial);
    handle.scale.set(0.78, 1.28, 0.72);
    handle.position.set(1.7, 0, 0);
    handle.rotation.y = Math.PI / 2;
    handle.castShadow = true;
    fallback.add(handle);

    mugGroup.add(fallback);
    fallbackRef.current = fallback;

    const normalizeModel = (model: any) => {
      // FBX pode vir em centímetros, metros ou com pivô deslocado. Primeiro mede, depois centraliza.
      model.position.set(0, 0, 0);
      model.rotation.set(0, 0, 0);
      model.scale.set(1, 1, 1);
      model.updateMatrixWorld(true);
      const sourceBounds = new THREE.Box3().setFromObject(model);
      const sourceSize = sourceBounds.getSize(new THREE.Vector3());
      const sourceMaxSize = Math.max(sourceSize.x, sourceSize.y, sourceSize.z);
      if (!Number.isFinite(sourceMaxSize) || sourceMaxSize <= 0.00001) throw new Error("FBX sem geometria visível");

      model.scale.setScalar(4.75 / sourceMaxSize);
      model.updateMatrixWorld(true);
      const scaledBounds = new THREE.Box3().setFromObject(model);
      const scaledCenter = scaledBounds.getCenter(new THREE.Vector3());
      const scaledSize = scaledBounds.getSize(new THREE.Vector3());
      const scaledRadius = Math.max(scaledSize.x, scaledSize.y, scaledSize.z) / 2;
      const printFilm = printFilmRef.current;
      if (printFilm) {
        // A profundidade do corpo e a altura permitem colocar a arte ligeiramente à frente do esmalte.
        const printRadius = Math.max(scaledSize.z / 2, scaledSize.y * 0.38) * 1.035;
        const printHeight = scaledSize.y * 0.79;
        printFilm.scale.set(printRadius / 1.735, printHeight / 3.32, printRadius / 1.735);
        printFilm.position.y = -scaledSize.y * 0.04;
      }
      model.position.sub(scaledCenter);
      model.position.y += -0.05;
      model.rotation.y = 0;
      model.updateMatrixWorld(true);
      camera.position.set(0, 0.35, Math.max(8.1, scaledRadius * 3.1));
      camera.near = Math.max(0.01, scaledRadius / 120);
      camera.far = Math.max(1000, scaledRadius * 90);
      camera.updateProjectionMatrix();
      model.traverse((child: any) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.frustumCulled = false;
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material: any) => {
            material.side = THREE.DoubleSide;
            material.transparent = false;
            material.opacity = 1;
            material.needsUpdate = true;
          });
        }
      });
    };

    const loader = new FBXLoader();
    loader.load(
      MODEL_URL,
      (model) => {
        normalizeModel(model);
        if (fallback.parent) fallback.parent.remove(fallback);
        mugGroup.add(model);
        modelRef.current = model;
        materialRefreshRef.current();
        onModelStatus("model");
      },
      undefined,
      () => onModelStatus("fallback"),
    );

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let tilt = -0.08;
    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      mount.setPointerCapture?.(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const xDelta = event.clientX - lastX;
      const yDelta = event.clientY - lastY;
      currentAngleRef.current += xDelta * 0.012;
      targetAngleRef.current = currentAngleRef.current;
      tilt = Math.max(-0.42, Math.min(0.34, tilt + yDelta * 0.004));
      lastX = event.clientX;
      lastY = event.clientY;
    };
    const onPointerUp = (event: PointerEvent) => {
      dragging = false;
      mount.releasePointerCapture?.(event.pointerId);
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      camera.position.z = Math.max(6.7, Math.min(12.5, camera.position.z + event.deltaY * 0.008));
    };
    mount.addEventListener("pointerdown", onPointerDown);
    mount.addEventListener("pointermove", onPointerMove);
    mount.addEventListener("pointerup", onPointerUp);
    mount.addEventListener("pointerleave", onPointerUp);
    mount.addEventListener("wheel", onWheel, { passive: false });

    let frame = 0;
    const render = () => {
      frame = window.requestAnimationFrame(render);
      if (autoSpinRef.current && !dragging) targetAngleRef.current += 0.0008;
      const difference = targetAngleRef.current - currentAngleRef.current;
      currentAngleRef.current += difference * 0.09;
      mugGroup.rotation.y = currentAngleRef.current;
      mugGroup.rotation.x = tilt;
      renderer.render(scene, camera);
    };
    render();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      mount.removeEventListener("pointerdown", onPointerDown);
      mount.removeEventListener("pointermove", onPointerMove);
      mount.removeEventListener("pointerup", onPointerUp);
      mount.removeEventListener("pointerleave", onPointerUp);
      mount.removeEventListener("wheel", onWheel);
      texture.dispose();
      decalTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
      rendererRef.current = null;
    };
    // A cena é criada uma única vez; alterações de design atualizam apenas a textura.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const refreshMaterials = () => {
      const texture = textureRef.current;
      if (!texture) return;
      const canvas = renderMugDesignCanvas(design, artworkImageRef.current);
      texture.image = canvas;
      texture.needsUpdate = true;
      const decalTexture = decalTextureRef.current;
      if (decalTexture) {
        decalTexture.image = renderMugDesignCanvas(design, artworkImageRef.current, true);
        decalTexture.needsUpdate = true;
      }

      const styleModel = (object: any) => {
        if (!object) return;
        object.traverse((child: any) => {
          if (!(child instanceof THREE.Mesh)) return;
          const partName = child.name.toLowerCase();
          const isHandle = /handle|alca|alça|asa/.test(partName);
          const isInner = /inner|inside|interior|rim|anel/.test(partName);
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material: any) => {
            if (isHandle) setMaterialColor(material, handleColor, null);
            else if (isInner) setMaterialColor(material, innerColor, null);
            // O FBX oferece o volume cerâmico; a arte é aplicada na película de impressão para evitar repetição por UVs internos.
            else setMaterialColor(material, design.bodyColor, null);
          });
        });
      };

      styleModel(modelRef.current);
      const fallback = fallbackRef.current;
      if (fallback) {
        fallback.traverse((child: any) => {
          if (!(child instanceof THREE.Mesh)) return;
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          const geometryType = child.geometry.type;
          materials.forEach((material: any) => {
            if (geometryType === "CylinderGeometry") setMaterialColor(material, "#ffffff", texture);
            else if (geometryType === "TorusGeometry" && child.position.x > 1) setMaterialColor(material, handleColor, null);
            else setMaterialColor(material, innerColor, null);
          });
        });
      }
    };

    materialRefreshRef.current = refreshMaterials;
    refreshMaterials();
  }, [design, handleColor, innerColor]);

  useEffect(() => {
    if (!snapshotToken || !rendererRef.current) return;
    const id = window.setTimeout(() => {
      const renderer = rendererRef.current;
      if (renderer) onSnapshot(renderer.domElement.toDataURL("image/png"));
    }, 80);
    return () => window.clearTimeout(id);
  }, [snapshotToken, onSnapshot]);

  useEffect(() => {
    if (!recordToken || !rendererRef.current) return;
    const canvas = rendererRef.current.domElement;
    if (!("captureStream" in canvas) || typeof MediaRecorder === "undefined") {
      onVideoError("O seu navegador não disponibiliza gravação de vídeo nesta sessão.");
      return;
    }

    const stream = canvas.captureStream(30);
    const mimeType = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"].find((type) => MediaRecorder.isTypeSupported(type));
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    const chunks: BlobPart[] = [];
    const spinBeforeRecording = autoSpinRef.current;
    autoSpinRef.current = true;
    recorder.ondataavailable = (event) => {
      if (event.data.size) chunks.push(event.data);
    };
    recorder.onstop = () => {
      autoSpinRef.current = spinBeforeRecording;
      stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      onVideoReady(new Blob(chunks, { type: mimeType || "video/webm" }));
    };
    recorder.start();
    const stopTimer = window.setTimeout(() => {
      if (recorder.state !== "inactive") recorder.stop();
    }, 4000);

    return () => {
      window.clearTimeout(stopTimer);
      if (recorder.state !== "inactive") recorder.stop();
    };
    // A gravação só inicia quando o utilizador a pede explicitamente.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordToken]);

  const backgroundStyle = backgroundImage
    ? { backgroundColor, backgroundImage: `linear-gradient(rgba(247, 240, 229, 0.36), rgba(247, 240, 229, 0.36)), url(${backgroundImage})` }
    : { backgroundColor };

  return (
    <div className="caneca-stage-canvas relative h-full min-h-[400px] overflow-hidden rounded-[1.6rem]" style={backgroundStyle}>
      <div ref={mountRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute bottom-7 left-7 top-7 w-[2px] bg-[#E98DAA]/85 shadow-[0_0_0_4px_rgba(233,141,170,0.12)]" />
      <div className="pointer-events-none absolute left-[22px] top-[35px] h-3 w-3 border-l-2 border-t-2 border-[#E98DAA]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5 sm:p-6">
        <div className="rounded-full border border-[#4E5F93]/10 bg-[#FFFFFF]/78 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#4E5F93] backdrop-blur-sm">
          Vista 3D ao vivo
        </div>
        <div className="hidden rounded-full bg-[#4E5F93] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/80 sm:block">
          Arraste para rodar
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#4E5F93]/10 to-transparent" />
    </div>
  );
}

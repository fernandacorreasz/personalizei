/* Oficina Editorial: bancada assimétrica, palco dominante, marfim/azul-tinta e vermelhão de registro. */
import { useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import {
  ArrowDownToLine,
  ChevronDown,
  CircleHelp,
  FileImage,
  FlipHorizontal2,
  Grid3X3,
  Hand,
  ImagePlus,
  Maximize2,
  Minus,
  Move,
  Plus,
  RotateCcw,
  RotateCw,
  Ruler,
  Shirt as ShirtIcon,
  SlidersHorizontal,
  Sparkles,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import ShirtCanvas from "@/components/ShirtCanvas";

const initialLogo = { x: 50, y: 38, scale: 26, rotation: 0 };
type View = "front" | "back";
type Artwork = { id: string; src: string; name: string };
type Placement = typeof initialLogo;
const defaultPlacement = () => ({ ...initialLogo });

export default function Home() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [artworkHistory, setArtworkHistory] = useState<Artwork[]>(() => { try { return JSON.parse(localStorage.getItem("atrye-artwork-history") || "[]"); } catch { return []; } });
  const [activeArtId, setActiveArtId] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Record<string, { front: Placement; back: Placement }>>({});
  const [shirtColor, setShirtColor] = useState("#f4f0e8");
  const [showGrid, setShowGrid] = useState(true);
  const [view, setView] = useState<View>("front");
  const [rotating, setRotating] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(1.2);
  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState(125);
  const fileInput = useRef<HTMLInputElement>(null);
  const dragRef = useRef<{ pointerX: number; pointerY: number; x: number; y: number; width: number; height: number } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const activeArtwork = artworks.find((item) => item.id === activeArtId) ?? artworks[0];
  const placement = activeArtwork ? placements[activeArtwork.id]?.[view] ?? defaultPlacement() : defaultPlacement();

  const status = useMemo(() => (artworks.length ? `${artworks.length} arte${artworks.length > 1 ? "s" : ""} pronta${artworks.length > 1 ? "s" : ""}` : "Aguardando sua arte"), [artworks.length]);

  function handleFile(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Escolha um arquivo de imagem PNG, JPG ou SVG.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const id = `${file.name}-${Date.now()}`;
      const artwork = { id, src: String(reader.result), name: file.name };
      setArtworks((current) => [...current, artwork].slice(0, 3));
      setArtworkHistory((current) => { const next = [artwork, ...current.filter((item) => item.src !== artwork.src)].slice(0, 12); localStorage.setItem("atrye-artwork-history", JSON.stringify(next)); return next; });
      setActiveArtId(id);
      setPlacements((current) => ({ ...current, [id]: { front: defaultPlacement(), back: defaultPlacement() } }));
      toast.success(`Arte ${Math.min(artworks.length + 1, 3)} adicionada à composição.`);
    };
    reader.readAsDataURL(file);
  }

  function update(key: keyof Placement, value: number) {
    if (!activeArtwork) return;
    setPlacements((current) => ({ ...current, [activeArtwork.id]: { front: current[activeArtwork.id]?.front ?? defaultPlacement(), back: current[activeArtwork.id]?.back ?? defaultPlacement(), [view]: { ...placement, [key]: value } } }));
  }

  function switchView(nextView: View) {
    setView(nextView);
    setPlacements((current) => Object.fromEntries(Object.entries(current).map(([id, value]) => [id, { ...value, [nextView]: defaultPlacement() }])));
  }

  function reuseArtwork(artwork: Artwork) {
    if (artworks.some((item) => item.src === artwork.src)) { setActiveArtId(artworks.find((item) => item.src === artwork.src)?.id ?? null); return; }
    if (artworks.length >= 3) { toast.error("A composição já tem três artes."); return; }
    const reused = { ...artwork, id: `${artwork.name}-${Date.now()}` };
    setArtworks((current) => [...current, reused]);
    setActiveArtId(reused.id);
    setPlacements((current) => ({ ...current, [reused.id]: { front: defaultPlacement(), back: defaultPlacement() } }));
  }

  function adjustZoom(delta: number) {
    setZoom((current) => Math.min(155, Math.max(90, current + delta)));
  }

  function handleLogoPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!activeArtwork) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const rect = event.currentTarget.getBoundingClientRect();
    dragRef.current = { pointerX: event.clientX, pointerY: event.clientY, x: placement.x, y: placement.y, width: rect.width, height: rect.height };
  }

  function handleLogoPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || !activeArtwork) return;
    event.preventDefault();
    const nextX = Math.min(88, Math.max(12, drag.x + ((event.clientX - drag.pointerX) / drag.width) * 100));
    const nextY = Math.min(88, Math.max(12, drag.y + ((event.clientY - drag.pointerY) / drag.height) * 100));
    setPlacements((current) => ({ ...current, [activeArtwork.id]: { front: current[activeArtwork.id]?.front ?? defaultPlacement(), back: current[activeArtwork.id]?.back ?? defaultPlacement(), [view]: { ...placement, x: nextX, y: nextY } } }));
  }

  function handleLogoPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function getWhatsAppMessage() {
    return `Olá, ATRYÊ! Essa é a ideia inicial da minha camiseta personalizada. Preparei uma arte sutil e deliciosa e gostaria de ver como ficou. Tamanho: ${size} | quantidade: ${quantity} | artes: ${artworks.map((item) => item.name).join(", ") || "nenhuma"} | vista: ${view === "front" ? "frente" : "costas"}.`;
  }

  async function capturePreview() {
    if (!stageRef.current) throw new Error("preview-not-ready");
    const canvas = await html2canvas(stageRef.current, { backgroundColor: "#fff8f2", scale: 2, useCORS: true, logging: false });
    return new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("image-export-failed")), "image/png"));
  }

  async function requestWhatsApp() {
    try {
      const blob = await capturePreview();
      const file = new File([blob], `atrye-personalizacao-${view}.png`, { type: "image/png" });
      const message = getWhatsAppMessage();
      if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
        await navigator.share({ files: [file], title: "Prévia da minha camiseta ATRYÊ", text: message });
        toast.success("Prévia pronta para compartilhar no WhatsApp.");
        return;
      }
      const link = document.createElement("a");
      link.download = file.name;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
      window.open(`https://wa.me/554788740894?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
      toast.success("Imagem baixada e WhatsApp ATRYÊ aberto.");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      window.open(`https://wa.me/554788740894?text=${encodeURIComponent(getWhatsAppMessage())}`, "_blank", "noopener,noreferrer");
      toast.error("Não foi possível anexar a imagem automaticamente. Ela pode ser baixada pelo botão de imagem.");
    }
  }

  async function exportImage() {
    try {
      const blob = await capturePreview();
      const link = document.createElement("a");
      link.download = `atrye-personalizacao-${view}.png`;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
      toast.success("Imagem da prévia baixada com sucesso.");
    } catch {
      toast.error("Não foi possível gerar a imagem. Tente novamente.");
    }
  }

  return (
    <main className="atelier-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <img className="brand-mark-image" src="/manus-storage/atelier-mark_f6f73a48.png" alt="" aria-hidden="true" />
          <div><div className="brand-name">ATRYÊ</div><div className="brand-kicker">personalizados feitos pra ter a sua cara</div></div>
        </div>
        <nav className="main-nav"><button className="active"><ShirtIcon /> Camiseta</button><a href="#como-funciona">Como funciona</a></nav>
        <div className="top-actions">
          <span className="save-state"><span className="save-dot" /> Salvamento local ativo</span>
          <Button variant="outline" className="help-button"><CircleHelp size={16} /> Ajuda</Button>
          <Button className="whatsapp-button" onClick={requestWhatsApp}>Pedir pelo WhatsApp</Button>
          <Button className="export-button" onClick={exportImage}><ArrowDownToLine size={16} /> Baixar imagem</Button>
        </div>
      </header>

      <section className="workspace">
        <aside className="sidebar">
          <div className="sidebar-heading"><div><span className="eyebrow">PERSONALIZE / 01</span><h1>Feito pra ter a sua cara.</h1></div><Sparkles size={18} className="spark-icon" /></div>
          <p className="intro">Escolha uma criação ATRYÊ ou envie sua própria arte. Você monta, visualiza e pede pelo WhatsApp.</p>

          <div className="step active-step"><span className="step-number">01</span><div><strong>Arquivo da logo</strong><span>{status}</span></div></div>
          <div className="upload-zone" onClick={() => fileInput.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); Array.from(e.dataTransfer.files ?? []).slice(0, 3 - artworks.length).forEach(handleFile); }}>
            <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/svg+xml" multiple hidden onChange={(e) => Array.from(e.target.files ?? []).slice(0, 3 - artworks.length).forEach(handleFile)} />
            {activeArtwork ? <img src={activeArtwork.src} alt="Arte ativa" className="logo-preview" /> : <ImagePlus size={22} />}
            <strong>{artworks.length >= 3 ? "Limite de 3 artes atingido" : "Solte ou escolha até 3 artes"}</strong>
            <span>{activeArtwork ? activeArtwork.name : "PNG, JPG ou SVG / área 28 × 34 cm"}</span>
            <button type="button" className="text-action"><Upload size={13} /> Procurar no dispositivo</button>
          </div>
          {artworks.length > 0 && <div className="artwork-list" aria-label="Artes carregadas">{artworks.map((artwork, index) => <button key={artwork.id} className={activeArtwork?.id === artwork.id ? "artwork-thumb active" : "artwork-thumb"} onClick={() => setActiveArtId(artwork.id)} aria-label={`Editar arte ${index + 1}`}><img src={artwork.src} alt="" /><span>{index + 1}</span></button>)}</div>}
          {artworkHistory.length > 0 && <details className="artwork-history"><summary>Usar um arquivo enviado anteriormente</summary><div>{artworkHistory.slice(0, 6).map((artwork) => <button key={artwork.id} onClick={() => reuseArtwork(artwork)} title={artwork.name}><img src={artwork.src} alt="" /></button>)}</div></details>}


          <div className="step"><span className="step-number">02</span><div><strong>Ajuste fino</strong><span>Posição e escala no tecido</span></div></div>
          <div className="control-card">
            <div className="control-title"><span><Move size={15} /> Posição horizontal</span><b>{placement.x}%</b></div>
            <Slider value={[placement.x]} min={15} max={85} step={1} onValueChange={([v]) => update("x", v)} />
            <div className="control-title"><span><Move size={15} /> Posição vertical</span><b>{placement.y}%</b></div>
            <Slider value={[placement.y]} min={15} max={75} step={1} onValueChange={([v]) => update("y", v)} />
            <div className="control-title"><span><Maximize2 size={15} /> Escala</span><b>{placement.scale}%</b></div>
            <Slider value={[placement.scale]} min={10} max={48} step={1} onValueChange={([v]) => update("scale", v)} />
            <div className="control-title"><span><RotateCw size={15} /> Rotação</span><b>{placement.rotation}°</b></div>
            <Slider value={[placement.rotation]} min={-180} max={180} step={1} onValueChange={([v]) => update("rotation", v)} />
            <div className="mini-actions"><Button variant="outline" size="sm" onClick={() => update("rotation", 0)}><RotateCcw size={14} /> Resetar</Button><Button variant="outline" size="sm" onClick={() => update("rotation", placement.rotation * -1)}><FlipHorizontal2 size={14} /> Espelhar</Button></div>
          </div>

          <div className="step"><span className="step-number">03</span><div><strong>Acabamento</strong><span>Cor base da camiseta</span></div></div>
          <div className="swatches">
            {[{ name: "Creme", hex: "#FFF8F2" }, { name: "Cacau", hex: "#3A2830" }, { name: "Cereja", hex: "#F94F7A" }, { name: "Lilás", hex: "#B8A7F2" }, { name: "Manteiga", hex: "#FFE28A" }, { name: "Preto", hex: "#000000" }, { name: "Azul-bebê", hex: "#B9DDF5" }].map(({ name, hex }) => <button aria-label={`Escolher cor ${name}`} title={`${name} ${hex}`} key={hex} className={`swatch ${shirtColor.toUpperCase() === hex ? "selected" : ""}`} style={{ background: hex }} onClick={() => setShirtColor(hex)} />)}
            <span className="color-code">{shirtColor.toUpperCase()}</span>
          </div>
          <label className="custom-color-picker" htmlFor="custom-shirt-color"><span>Escolha qualquer cor</span><input id="custom-shirt-color" type="color" value={shirtColor} onChange={(event) => setShirtColor(event.target.value.toUpperCase())} aria-label="Escolher uma cor personalizada para a camiseta" /><b>{shirtColor.toUpperCase()}</b></label>
          <button type="button" className="measure-button" onClick={() => toast.info("A tabela de medidas será adicionada em breve.")}><Ruler size={15} /> Tabela de medidas <span>em breve</span></button>
          <div className="order-fields" id="catalogo">
            <div className="field-row"><label htmlFor="size">Tamanho</label><select id="size" value={size} onChange={(e) => setSize(e.target.value)}><option>PP</option><option>P</option><option>M</option><option>G</option><option>GG</option></select></div>
            <div className="field-row"><label htmlFor="quantity">Quantidade</label><div className="quantity-control"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Diminuir quantidade">−</button><span>{quantity}</span><button onClick={() => setQuantity(quantity + 1)} aria-label="Aumentar quantidade">+</button></div></div>
            <Button className="request-button" onClick={requestWhatsApp}>Gostei da prévia <ArrowDownToLine size={15} /></Button>
          </div>
        </aside>

        <section className="stage-panel" id="temas">
          <div className="stage-toolbar"><div className="view-switcher"><button className={view === "front" ? "selected" : ""} onClick={() => switchView("front")}>Frente</button><button className={view === "back" ? "selected" : ""} onClick={() => switchView("back")}>Costas</button></div><div className="stage-tools"><button className={showGrid ? "tool-active" : ""} onClick={() => setShowGrid(!showGrid)} title="Alternar grade"><Grid3X3 size={16} /></button><button title="Modo mover"><Hand size={16} /></button><button className="zoom-button" onClick={() => adjustZoom(-5)} title="Diminuir zoom"><Minus size={15} /></button><span className="zoom-readout">{zoom}%</span><button className="zoom-button" onClick={() => adjustZoom(5)} title="Aumentar zoom"><Plus size={15} /></button><button className="rotation-button" onClick={() => setRotating(!rotating)} title={rotating ? "Pausar rotação" : "Retomar rotação"}><RotateCw size={15} /></button><button title="Ajustes"><SlidersHorizontal size={16} /></button></div></div>
          <div ref={stageRef} className={`shirt-stage ${showGrid ? "with-grid" : ""}`}>
            <div className="stage-label label-top">MODELO BASE / CAMISA UNISSEX <span>GLB READY</span></div>
            <div className="registration registration-a">A</div><div className="registration registration-b">B</div>
            <div className={`shirt-model ${view === "back" ? "back-view" : ""}`} style={{ transform: `scale(${zoom / 100})` }}>
              <div className="shirt-canvas"><ShirtCanvas color={shirtColor} back={view === "back"} rotating={rotating} speed={rotationSpeed} /></div>
              <div className="print-overlay" onPointerDown={handleLogoPointerDown} onPointerMove={handleLogoPointerMove} onPointerUp={handleLogoPointerUp} onPointerCancel={handleLogoPointerUp} aria-label={activeArtwork ? "Arraste para mover a arte ativa" : "Área de impressão segura"}>
                {artworks.map((artwork) => { const itemPlacement = placements[artwork.id]?.[view] ?? defaultPlacement(); return <img key={artwork.id} src={artwork.src} alt="Arte posicionada no produto" className={activeArtwork?.id === artwork.id ? "placed-logo active-art" : "placed-logo"} style={{ left: `${itemPlacement.x}%`, top: `${itemPlacement.y}%`, width: `${itemPlacement.scale}%`, transform: `translate(-50%, -50%) rotate(${itemPlacement.rotation}deg)` }} onClick={() => setActiveArtId(artwork.id)} />; })}
                {!activeArtwork && <div className="logo-empty"><FileImage size={18} /><span>adicione sua arte</span></div>}
              </div>
            </div>
            <div className="stage-label label-bottom"><span className="crosshair" /> ÁREA DE IMPRESSÃO SEGURA <span className="dimension">28 × 34 cm</span></div>
          </div>
          <div className="stage-footer"><span><span className="live-dot" /> Prévia interativa</span><span>{activeArtwork ? "Arraste a arte ativa ou use os controles para ajustar" : "Adicione uma arte para começar a composição"}</span><span className="rotation-speed">Velocidade <input type="range" min="0.4" max="2.4" step="0.2" value={rotationSpeed} onChange={(event) => setRotationSpeed(Number(event.target.value))} aria-label="Velocidade da rotação" /></span><span className="footer-zoom">Zoom <button onClick={() => adjustZoom(-5)} aria-label="Diminuir zoom"><Minus size={12} /></button><b>{zoom}%</b><button onClick={() => adjustZoom(5)} aria-label="Aumentar zoom"><Plus size={12} /></button></span></div>
        </section>
      </section>
      <footer className="footer-note" id="como-funciona"><span><strong>ATRYÊ</strong> / feito pra ter a sua cara</span><span>Escolha · personalize · peça pelo WhatsApp</span></footer>
    </main>
  );
}

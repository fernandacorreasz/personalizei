import { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { Camera, Check, ChevronRight, CircleHelp, Download, ImagePlus, Info, Leaf, Palette, Printer, RotateCcw, Sparkles, Upload, Wifi, X } from "lucide-react";
import "./cabine.css";
import "./cabine-print.css";

type RGB = [number, number, number];
type Photo = string | null;
type Theme = { id: string; name: string; note: string; className: string; icon: string; paper: RGB; ink: RGB };

const themes: Theme[] = [
  { id: "floral", name: "Flores amarelas", note: "A favorita da noiva", className: "cabine-theme-floral", icon: "✽", paper: [250, 225, 178], ink: [121, 91, 52] },
  { id: "beach", name: "Chácara na praia", note: "Mar, areia e afeto", className: "cabine-theme-beach", icon: "◌", paper: [211, 231, 220], ink: [63, 105, 91] },
  { id: "olive", name: "Oliva & branco", note: "O traje do noivo", className: "cabine-theme-olive", icon: "❧", paper: [205, 211, 185], ink: [72, 86, 59] },
  { id: "bridesmaids", name: "Madrinhas pastel", note: "Delicadas e alegres", className: "cabine-theme-pink", icon: "♡", paper: [244, 214, 209], ink: [136, 86, 86] },
  { id: "garden", name: "Jardim florido", note: "Um dia amigável", className: "cabine-theme-garden", icon: "✦", paper: [228, 225, 196], ink: [83, 101, 71] },
  { id: "sunset", name: "Pôr do sol", note: "Sorrisos para sempre", className: "cabine-theme-party", icon: "♥", paper: [244, 207, 176], ink: [132, 77, 67] },
];

const samples: Photo[] = [null, null, null];

function Decor({ theme }: { theme: Theme }) {
  return <><span className="cabine-decor cabine-decor-a">{theme.icon}</span><span className="cabine-decor cabine-decor-b">✽</span><span className="cabine-decor cabine-decor-c">♡</span></>;
}

async function imageData(src: string) {
  if (src.startsWith("data:")) return src;
  try { const response = await fetch(src); return URL.createObjectURL(await response.blob()); } catch { return null; }
}

export default function PhotoBoothPage() {
  const [selectedTheme, setSelectedTheme] = useState("floral");
  const [photos, setPhotos] = useState<Photo[]>(samples);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [printed, setPrinted] = useState(false);
  const [generating, setGenerating] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const theme = themes.find((item) => item.id === selectedTheme) ?? themes[0];
  const completed = photos.filter(Boolean).length;
  const visibleSlots = Math.min(completed + 1, 3);

  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), []);

  const openCamera = async () => {
    setCameraError(""); setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch { setCameraError("Não foi possível acessar a câmera. Você pode enviar uma foto pelo botão ao lado."); }
  };

  const closeCamera = () => { streamRef.current?.getTracks().forEach((track) => track.stop()); streamRef.current = null; setCameraOpen(false); };

  const addPhoto = (photo: string) => {
    setPhotos((current) => { const next = [...current]; const slot = next.findIndex((item) => item === null); if (slot >= 0) next[slot] = photo; return next; });
  };

  const takePhoto = () => {
    if (!videoRef.current || completed >= 3) return;
    const canvas = document.createElement("canvas"); canvas.width = 900; canvas.height = 700;
    const context = canvas.getContext("2d"); if (!context) return;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height); addPhoto(canvas.toDataURL("image/jpeg", 0.9));
    if (completed >= 2) closeCamera();
  };

  const onFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(0, 3 - completed);
    if (!files.length) return;
    Promise.all(files.map((file) => new Promise<string>((resolve) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.readAsDataURL(file); }))).then((incoming) => {
      setPhotos((current) => { const next = [...current]; incoming.forEach((photo) => { const slot = next.findIndex((item) => item === null); if (slot >= 0) next[slot] = photo; }); return next; });
    });
    event.target.value = "";
  };

  const makePdf = async () => {
    if (generating) return;
    setGenerating(true);
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: [56, 210], compress: true });
    const [r, g, b] = theme.paper;
    pdf.setFillColor(r, g, b); pdf.rect(0, 0, 56, 210, "F");
    pdf.setTextColor(...theme.ink); pdf.setFont("times", "bold"); pdf.setFontSize(16); pdf.text("G & J", 28, 9, { align: "center" });
    pdf.setFont("times", "italic"); pdf.setFontSize(7); pdf.text("11 · 11 · 2026  •  nosso dia", 28, 13, { align: "center" });
    pdf.setFontSize(9); pdf.text(theme.icon, 4, 7); pdf.text("✽", 51, 7);
    for (let index = 0; index < 3; index++) {
      const source = photos[index]; const y = 17 + index * 56;
      if (source) { const data = await imageData(source); if (data) { try { pdf.addImage(data, "JPEG", 4, y, 48, 53, `foto${index}`, "FAST"); } catch { pdf.setFillColor(235, 220, 184); pdf.rect(4, y, 48, 53, "F"); } } }
      else { pdf.setFillColor(Math.min(255, r + 8), Math.min(255, g + 8), Math.min(255, b + 8)); pdf.rect(4, y, 48, 53, "F"); pdf.setTextColor(...theme.ink); pdf.setFontSize(7); pdf.text("adicione uma foto", 28, y + 28, { align: "center" }); }
    }
    pdf.setTextColor(...theme.ink); pdf.setFont("times", "italic"); pdf.setFontSize(7); pdf.text("flores, mar e amor para sempre  ♥", 28, 207, { align: "center" });
    pdf.save("create-love-GJ-11-11-2026.pdf"); setPrinted(true); setGenerating(false);
  };

  return <div className="cabine-module cabine-app-shell">
    <header className="cabine-topbar"><div className="cabine-brand-mark"><Leaf size={19} /></div><div><div className="cabine-brand-name">Create Love</div><div className="cabine-brand-sub">G & J · 11.11.2026</div></div><div className="cabine-topbar-spacer" /><div className="cabine-connection-pill"><Wifi size={15} /><span>Impressora conectada</span><i /></div><button className="cabine-icon-button" aria-label="Ajuda"><CircleHelp size={19} /></button></header>
    <main className="cabine-workspace"><section className="cabine-hero-row"><div><div className="cabine-eyebrow"><Sparkles size={14} /> UM CANTINHO PARA CELEBRAR</div><h1>Qual lembrança vai<br /><em>ficar para sempre?</em></h1><p className="cabine-hero-copy">Escolha um tema, adicione suas fotos e<br className="cabine-desktop-only" /> crie uma tirinha cheia de carinho.</p></div><div className="cabine-dimension-card"><span>FORMATO DO PDF</span><strong>5,6 × 21 <small>cm</small></strong><div>1 página · tamanho real</div></div></section>
      <div className="cabine-story-note"><span>11 · 11 · 2026</span><span>Chácara na praia</span><span>Flores amarelas</span></div>
      <div className="cabine-stepper"><div className="cabine-step active"><b>01</b><span>Escolha o tema</span></div><div className="cabine-step-line" /><div className="cabine-step"><b>02</b><span>Adicione suas fotos</span></div><div className="cabine-step-line" /><div className="cabine-step"><b>03</b><span>Baixe o PDF</span></div></div>
      <section className="cabine-content-grid"><div className="cabine-panel cabine-theme-panel"><div className="cabine-panel-heading"><div><span className="cabine-section-kicker">01 / NOSSA ATMOSFERA</span><h2>Escolha o tema</h2></div><Palette size={21} /></div><div className="cabine-theme-grid">{themes.map((item) => <button key={item.id} className={`cabine-theme-card ${item.className} ${selectedTheme === item.id ? "selected" : ""}`} onClick={() => setSelectedTheme(item.id)}><div className="cabine-theme-mini"><Decor theme={item} /></div><span>{item.name}</span><small>{item.note}</small>{selectedTheme === item.id && <div className="cabine-selected-check"><Check size={12} /></div>}</button>)}</div></div>
        <div className="cabine-panel cabine-photos-panel"><div className="cabine-panel-heading"><div><span className="cabine-section-kicker">02 / MOMENTOS</span><h2>Adicione suas fotos</h2></div><span className="cabine-photo-count">{completed}/3</span></div><p className="cabine-photo-hint">Preencha uma foto por vez. O próximo espaço aparece automaticamente.</p><div className="cabine-photo-slots">{photos.slice(0, visibleSlots).map((photo, index) => <div className={`cabine-photo-slot ${photo ? "filled" : "empty"}`} key={index}>{photo ? <img src={photo} alt={`Foto ${index + 1}`} /> : <div className="cabine-empty-photo"><ImagePlus size={25} /><span>Enviar uma foto</span><small>ou tirar agora</small></div>}<span className="cabine-slot-number">0{index + 1}</span></div>)}</div><div className="cabine-photo-actions"><button className="cabine-secondary-button" onClick={openCamera} disabled={completed >= 3}><Camera size={17} /> Tirar foto {completed < 3 ? `${completed + 1}/3` : ""}</button><button className="cabine-secondary-button" onClick={() => fileRef.current?.click()} disabled={completed >= 3}><Upload size={17} /> Enviar foto</button><input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={onFiles} /></div><button className="cabine-reset-button" onClick={() => setPhotos([null, null, null])}><RotateCcw size={14} /> Começar de novo</button></div>
        <div className="cabine-preview-column"><div className={`cabine-strip-card ${theme.className}`} style={{ backgroundColor: `rgb(${theme.paper.join(",")})`, color: `rgb(${theme.ink.join(",")})` }}><Decor theme={theme} /><div className="cabine-strip-title">G & J</div><div className="cabine-strip-date">11 · 11 · 2026</div>{photos.map((photo, index) => <div className="cabine-strip-photo" key={index}>{photo ? <img src={photo} alt="" /> : <div className="cabine-strip-empty"><ImagePlus size={13} /><span>foto {index + 1}</span></div>}</div>)}<div className="cabine-strip-footer">flores, mar e amor <span>♥</span></div></div><div className="cabine-preview-caption"><span><Info size={14} /> Prévia de G & J</span><small>PDF em página única · 56 × 210 mm</small></div></div></section>
      <section className="cabine-print-bar"><div className="cabine-print-info"><div className="cabine-printer-icon"><Printer size={20} /></div><div><strong>PDF pronto para baixar</strong><span>G & J · 11/11/2026 · 56 × 210 mm</span></div></div><button className="cabine-print-button" onClick={makePdf} disabled={generating}>{generating ? "Gerando PDF…" : "Baixar PDF e imprimir"} {!generating && <ChevronRight size={18} />}</button></section>{printed && <div className="cabine-success-note"><Check size={15} /> PDF de G & J salvo com uma única página.</div>}<p className="cabine-privacy-note"><Download size={13} /> O PDF é gerado no dispositivo e não fica armazenado online.</p></main>
    {cameraOpen && <div className="cabine-modal-backdrop"><div className="cabine-camera-modal"><button className="cabine-modal-close" onClick={closeCamera}><X size={19} /></button><span className="cabine-section-kicker">CAPTURA {completed + 1} DE 3</span><h2>Um sorriso para G & J</h2><div className="cabine-camera-frame">{cameraError ? <div className="cabine-camera-error"><Camera size={30} /><p>{cameraError}</p></div> : <video ref={videoRef} autoPlay playsInline />}</div>{!cameraError && <button className="cabine-print-button cabine-camera-capture" onClick={takePhoto}><Camera size={18} /> Capturar foto {completed + 1}/3</button>}</div></div>}
  </div>;
}

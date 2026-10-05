/**
 * Atelier Editorial — uma bancada assimétrica: produto no centro, ferramentas à direita, registo gráfico à esquerda.
 */
import { useRef, useState } from "react";
import {
  Aperture,
  Box,
  Camera,
  Check,
  ChevronDown,
  CircleHelp,
  Download,
  ImagePlus,
  Layers3,
  Orbit,
  Palette,
  Plus,
  Printer,
  Redo2,
  RotateCcw,
  Sparkles,
  Type,
  Undo2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import MugViewport from "@/features/caneca/components/MugViewport";
import { DEFAULT_DESIGN, renderMugDesignCanvas, type MugDesign } from "@/features/caneca/lib/designTexture";
import "./caneca.css";

type Panel = "arte" | "texto" | "acabamento" | "vista";
type ViewId = "front" | "right" | "back" | "left" | "threequarters";

const ASSET_URLS = {
  mark: "/assets/caneca/create-and-customize-mark.png",
  studio: "/assets/caneca/create-and-customize-studio.jpg",
  ribbon: "/assets/caneca/create-and-customize-ribbon.jpg",
  patterns: "/assets/caneca/create-and-customize-patterns.jpg",
};

const BODY_SWATCHES = ["#F6F8FD", "#FFFFFF", "#D7EAF7", "#E98DAA", "#4E5F93", "#C6A2E9"];
const ACCENT_SWATCHES = ["#E98DAA", "#4E5F93", "#3A72A7", "#C6A2E9", "#6D8FCB", "#2D2027"];

function downloadDataUrl(dataUrl: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = dataUrl;
  anchor.download = filename;
  anchor.click();
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 600);
}

function ControlLabel({ children, value }: { children: string; value?: string }) {
  return (
    <div className="mb-2 flex items-center justify-between gap-4">
      <label className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#4E5F93]/70">{children}</label>
      {value ? <span className="font-mono text-[10px] text-[#4E5F93]/48">{value}</span> : null}
    </div>
  );
}

function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  suffix = "",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  suffix?: string;
}) {
  return (
    <div>
      <ControlLabel value={`${Number(value.toFixed(2))}${suffix}`}>{label}</ControlLabel>
      <input
        aria-label={label}
        className="caneca-range-editor w-full"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

export default function CanecaPage() {
  const [panel, setPanel] = useState<Panel>("arte");
  const [design, setDesign] = useState<MugDesign>(DEFAULT_DESIGN);
  const [autoSpin, setAutoSpin] = useState(false);
  const [view, setView] = useState<ViewId>("front");
  const [backgroundColor, setBackgroundColor] = useState("#DCEAF7");
  const [backgroundImage, setBackgroundImage] = useState(ASSET_URLS.studio);
  const [handleColor, setHandleColor] = useState("#F6F8FD");
  const [innerColor, setInnerColor] = useState("#FFFFFF");
  const [snapshotToken, setSnapshotToken] = useState(0);
  const [recordToken, setRecordToken] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [modelStatus, setModelStatus] = useState<"model" | "fallback">("fallback");
  const artworkInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const changeDesign = (updates: Partial<MugDesign>) => setDesign((current) => ({ ...current, ...updates }));

  const handleArtworkUpload = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Escolha um ficheiro de imagem válido.");
      return;
    }
    changeDesign({ imageSrc: URL.createObjectURL(file) });
    setPanel("arte");
    toast.success("Imagem adicionada à área de impressão.");
  };

  const handleBackgroundUpload = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Escolha uma imagem válida para o cenário.");
      return;
    }
    setBackgroundImage(URL.createObjectURL(file));
    toast.success("O fundo da cena foi atualizado.");
  };

  const resetDesign = () => {
    setDesign(DEFAULT_DESIGN);
    setHandleColor("#F6F8FD");
    setInnerColor("#FFFFFF");
    setBackgroundColor("#DCEAF7");
    setBackgroundImage(ASSET_URLS.studio);
    setView("front");
    setAutoSpin(false);
    toast.success("A bancada voltou ao ponto de partida.");
  };

  const downloadLayout = async () => {
    let image: HTMLImageElement | null = null;
    if (design.imageSrc) {
      image = await new Promise<HTMLImageElement | null>((resolve) => {
        const artwork = new Image();
        artwork.onload = () => resolve(artwork);
        artwork.onerror = () => resolve(null);
        artwork.src = design.imageSrc;
      });
    }
    const canvas = renderMugDesignCanvas(design, image);
    downloadDataUrl(canvas.toDataURL("image/png"), "create-and-customize-layout.png");
    toast.success("Layout de impressão exportado em PNG.");
  };

  const views: { id: ViewId; label: string }[] = [
    { id: "front", label: "Frente" },
    { id: "threequarters", label: "45°" },
    { id: "right", label: "90°" },
    { id: "back", label: "Verso" },
    { id: "left", label: "270°" },
  ];

  const tools: { id: Panel; label: string; icon: typeof ImagePlus }[] = [
    { id: "arte", label: "Arte", icon: ImagePlus },
    { id: "texto", label: "Texto", icon: Type },
    { id: "acabamento", label: "Cores", icon: Palette },
    { id: "vista", label: "Cena", icon: Orbit },
  ];

  return (
    <div className="caneca-module caneca-paper-noise min-h-screen overflow-x-hidden bg-[#F5F7FC] text-[#4E5F93]">
      <header className="relative z-20 flex min-h-[74px] items-center justify-between border-b border-[#4E5F93]/10 bg-[#F5F7FC]/92 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <img src={ASSET_URLS.mark} alt="Símbolo Create & Customize" className="h-10 w-10 object-contain" />
          <div className="leading-none">
            <div className="font-[DM_Serif_Display] text-[1.42rem] tracking-[-0.05em]">Create <span className="text-[#E98DAA]">&</span> Customize</div>
            <div className="mt-1 font-mono text-[8px] font-bold uppercase tracking-[0.23em] text-[#4E5F93]/55">3D Creator</div>
          </div>
        </div>

        <div className="hidden items-center gap-7 lg:flex">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#4E5F93]/60"><span className="h-1.5 w-1.5 rounded-full bg-[#E98DAA]" />Sessão local</div>
          <button className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#4E5F93]/65 transition-colors hover:text-[#E98DAA]" onClick={() => toast.info("As suas alterações ficam no navegador enquanto esta sessão estiver aberta.")}>Como funciona</button>
          <button className="inline-flex items-center gap-2 rounded-full border border-[#4E5F93]/15 bg-white/60 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] transition-all hover:border-[#4E5F93]/45 hover:bg-white active:scale-[0.97]" onClick={resetDesign}><RotateCcw className="h-3.5 w-3.5" />Recomeçar</button>
        </div>

        <button className="rounded-full border border-[#4E5F93]/15 bg-white/70 p-2.5 lg:hidden" onClick={resetDesign} aria-label="Recomeçar personalização"><RotateCcw className="h-4 w-4" /></button>
      </header>

      <main className="relative mx-auto max-w-[1680px] px-3 pb-4 pt-3 sm:px-5 sm:pt-5 lg:px-7">
        <div className="grid gap-3 lg:grid-cols-[104px_minmax(0,1fr)] lg:gap-5">
          <aside className="hidden flex-col justify-between overflow-hidden rounded-[1.45rem] bg-[#4E5F93] p-3 text-white lg:flex">
            <div>
              <div className="flex h-12 items-center justify-center border-b border-white/12"><Box className="h-5 w-5 text-[#F5F7FC]" /></div>
              <div className="pt-6 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/72 [writing-mode:vertical-rl]">Create & Customize — 330ml</div>
            </div>
            <div className="relative min-h-48 overflow-hidden rounded-xl">
              <img src={ASSET_URLS.ribbon} alt="Pormenor artístico de tinta impressa" className="absolute inset-0 h-full w-full object-cover opacity-75" />
              <div className="absolute inset-0 bg-[#4E5F93]/42" />
              <div className="absolute bottom-3 left-3 font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-white/80 [writing-mode:vertical-rl]">Editor circular</div>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-1 sm:mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E98DAA] font-mono text-[10px] font-bold text-white">01</div>
                <div>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.17em] text-[#4E5F93]/52">Bancada de personalização</p>
                  <h1 className="font-[DM_Serif_Display] text-[1.42rem] leading-none tracking-[-0.045em] sm:text-[1.65rem]">Caneca clássica <span className="text-[#E98DAA]">330 ml</span></h1>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#4E5F93]/54">
                <Undo2 className="h-4 w-4" /><Redo2 className="h-4 w-4" />
                <span className="ml-2 hidden font-mono text-[9px] uppercase tracking-[0.16em] sm:inline">Pré-visualização local</span>
              </div>
            </div>

            <div className="grid min-h-[720px] overflow-hidden rounded-[1.65rem] border border-[#4E5F93]/12 bg-[#FAF9FF] shadow-[0_24px_65px_rgba(78,95,147,0.12)] xl:grid-cols-[minmax(0,1fr)_365px]">
              <div className="relative flex min-h-[455px] flex-col p-3 sm:p-5 xl:min-h-0 xl:p-6">
                <div className="soft-grid absolute inset-0 opacity-75" />
                <div className="relative mb-4 flex items-center justify-between gap-3 border-l-2 border-[#E98DAA] pl-3">
                  <div className="rounded-full bg-[#4E5F93] px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white">Área de impressão: 210 × 90 mm</div>
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${modelStatus === "model" ? "bg-[#6D8FCB]" : "bg-[#C6A2E9]"}`} />
                    <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#4E5F93]/55">{modelStatus === "model" ? "Modelo FBX ativo" : "A carregar modelo"}</span>
                  </div>
                </div>

                <div className="relative flex-1">
                  <MugViewport
                    design={design}
                    autoSpin={autoSpin}
                    backgroundColor={backgroundColor}
                    backgroundImage={backgroundImage}
                    handleColor={handleColor}
                    innerColor={innerColor}
                    view={view}
                    snapshotToken={snapshotToken}
                    recordToken={recordToken}
                    onSnapshot={(dataUrl) => {
                      downloadDataUrl(dataUrl, "create-and-customize-cena-3d.png");
                      toast.success("Instantâneo 3D exportado em PNG.");
                    }}
                    onVideoReady={(video) => {
                      downloadBlob(video, "create-and-customize-giro-3d.webm");
                      setIsRecording(false);
                      toast.success("Giro de 4 segundos exportado em WEBM.");
                    }}
                    onVideoError={(message) => {
                      setIsRecording(false);
                      toast.error(message);
                    }}
                    onModelStatus={setModelStatus}
                  />
                </div>

                <div className="relative mt-4 flex flex-col gap-3 border-t border-[#4E5F93]/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {views.map((item) => (
                      <button key={item.id} onClick={() => setView(item.id)} className={`rounded-full px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.12em] transition-all active:scale-[0.97] ${view === item.id ? "bg-[#E98DAA] text-white shadow-sm" : "bg-[#EDF0FA] text-[#4E5F93]/65 hover:bg-[#DCE1F4]"}`}>{item.label}</button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setAutoSpin((current) => !current)} className={`inline-flex items-center gap-2 rounded-full px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.12em] transition-all active:scale-[0.97] ${autoSpin ? "bg-[#4E5F93] text-white" : "bg-[#EDF0FA] text-[#4E5F93]/65"}`}><Orbit className="h-3.5 w-3.5" />{autoSpin ? "Rodar" : "Parado"}</button>
                    <button onClick={() => setSnapshotToken((current) => current + 1)} className="inline-flex items-center gap-2 rounded-full border border-[#4E5F93]/14 bg-white px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.12em] transition-all hover:border-[#4E5F93]/45 active:scale-[0.97]"><Camera className="h-3.5 w-3.5" />Cena</button>
                  </div>
                </div>
              </div>

              <aside className="flex min-h-0 flex-col border-t border-[#4E5F93]/12 bg-[#F1EEFA] xl:border-l xl:border-t-0">
                <div className="flex border-b border-[#4E5F93]/12 px-2 pt-2">
                  {tools.map((tool) => {
                    const Icon = tool.icon;
                    const active = panel === tool.id;
                    return <button key={tool.id} onClick={() => setPanel(tool.id)} className={`group relative flex flex-1 flex-col items-center gap-1.5 px-1 pb-3 pt-2 font-mono text-[8px] font-bold uppercase tracking-[0.1em] transition-colors ${active ? "text-[#E98DAA]" : "text-[#4E5F93]/48 hover:text-[#4E5F93]"}`}><Icon className="h-4 w-4" />{tool.label}{active ? <span className="absolute bottom-0 h-0.5 w-7 bg-[#E98DAA]" /> : null}</button>;
                  })}
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
                  {panel === "arte" ? (
                    <div className="space-y-6">
                      <div>
                        <p className="font-[DM_Serif_Display] text-[1.45rem] leading-none tracking-[-0.04em]">A sua arte</p>
                        <p className="mt-2 max-w-[27rem] text-sm leading-5 text-[#4E5F93]/62">Carregue um ficheiro e posicione-o diretamente na área de impressão.</p>
                      </div>
                      <input ref={artworkInputRef} className="hidden" type="file" accept="image/*" onChange={(event) => handleArtworkUpload(event.target.files?.[0])} />
                      <button onClick={() => artworkInputRef.current?.click()} className="group flex w-full items-center justify-between rounded-[1.05rem] border border-dashed border-[#4E5F93]/28 bg-[#FFFFFF] p-4 text-left transition-all hover:border-[#E98DAA] hover:bg-white active:scale-[0.985]">
                        <span className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E98DAA] text-white"><Upload className="h-4 w-4" /></span><span><span className="block font-mono text-[10px] font-bold uppercase tracking-[0.12em]">{design.imageSrc ? "Substituir imagem" : "Adicionar imagem"}</span><span className="mt-1 block text-xs text-[#4E5F93]/50">PNG, JPG ou WEBP</span></span></span><Plus className="h-4 w-4 text-[#4E5F93]/48 group-hover:text-[#E98DAA]" />
                      </button>
                      {design.imageSrc ? <button onClick={() => changeDesign({ imageSrc: "" })} className="w-full font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[#E98DAA] underline underline-offset-4">Remover arte</button> : null}
                      <RangeField label="Escala da arte" value={design.imageScale} min={0.18} max={0.9} step={0.01} suffix="×" onChange={(imageScale) => changeDesign({ imageScale })} />
                      <div className="grid grid-cols-2 gap-4"><RangeField label="Eixo horizontal" value={design.imageX} min={-0.32} max={0.32} step={0.01} onChange={(imageX) => changeDesign({ imageX })} /><RangeField label="Eixo vertical" value={design.imageY} min={-0.25} max={0.25} step={0.01} onChange={(imageY) => changeDesign({ imageY })} /></div>
                      <RangeField label="Rotação" value={design.imageRotation} min={-180} max={180} onChange={(imageRotation) => changeDesign({ imageRotation })} suffix="°" />
                      <div className="overflow-hidden rounded-2xl bg-[#4E5F93] p-3 text-white">
                        <div className="flex items-center gap-3"><img src={ASSET_URLS.patterns} alt="Amostras de padrões artísticos" className="h-12 w-12 rounded-xl object-cover" /><p className="font-mono text-[9px] uppercase leading-4 tracking-[0.13em] text-white/72">Sugestão: use ficheiros com fundo transparente para obter mais espaço na cerâmica.</p></div>
                      </div>
                    </div>
                  ) : null}

                  {panel === "texto" ? (
                    <div className="space-y-6">
                      <div><p className="font-[DM_Serif_Display] text-[1.45rem] leading-none tracking-[-0.04em]">Composição tipográfica</p><p className="mt-2 text-sm leading-5 text-[#4E5F93]/62">Escreva uma mensagem. Use uma quebra de linha para dar ritmo à composição.</p></div>
                      <textarea value={design.text} onChange={(event) => changeDesign({ text: event.target.value.slice(0, 54) })} className="min-h-28 w-full resize-none rounded-2xl border border-[#4E5F93]/15 bg-[#FFFFFF] px-4 py-3 font-[DM_Serif_Display] text-lg leading-tight outline-none transition focus:border-[#E98DAA] focus:ring-4 focus:ring-[#E98DAA]/10" aria-label="Texto da caneca" />
                      <div><ControlLabel>Família tipográfica</ControlLabel><div className="relative"><select value={design.fontFamily} onChange={(event) => changeDesign({ fontFamily: event.target.value as MugDesign["fontFamily"] })} className="w-full appearance-none rounded-xl border border-[#4E5F93]/15 bg-[#FFFFFF] px-3 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.11em] outline-none transition focus:border-[#E98DAA]"><option value="DM Serif Display">DM Serif Display — editorial</option><option value="Manrope">Manrope — técnico</option><option value="Georgia">Georgia — clássico</option></select><ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-[#4E5F93]/55" /></div></div>
                      <div className="grid grid-cols-[1fr_auto] gap-3"><RangeField label="Corpo" value={design.fontSize} min={42} max={170} onChange={(fontSize) => changeDesign({ fontSize })} suffix=" px" /><label className="mt-6 flex h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-sm"><input type="color" className="h-12 w-12 -translate-x-1 -translate-y-1 cursor-pointer" value={design.textColor} onChange={(event) => changeDesign({ textColor: event.target.value })} aria-label="Cor do texto" /></label></div>
                      <div className="grid grid-cols-2 gap-4"><RangeField label="Eixo horizontal" value={design.textX} min={-0.32} max={0.32} step={0.01} onChange={(textX) => changeDesign({ textX })} /><RangeField label="Eixo vertical" value={design.textY} min={-0.25} max={0.25} step={0.01} onChange={(textY) => changeDesign({ textY })} /></div>
                      <RangeField label="Inclinação" value={design.textRotation} min={-180} max={180} onChange={(textRotation) => changeDesign({ textRotation })} suffix="°" />
                    </div>
                  ) : null}

                  {panel === "acabamento" ? (
                    <div className="space-y-6">
                      <div><p className="font-[DM_Serif_Display] text-[1.45rem] leading-none tracking-[-0.04em]">Cerâmica & tinta</p><p className="mt-2 text-sm leading-5 text-[#4E5F93]/62">Ajuste o corpo da peça e os detalhes que definem o acabamento.</p></div>
                      <div><ControlLabel>Cor principal</ControlLabel><div className="flex flex-wrap gap-2">{BODY_SWATCHES.map((color) => <button key={color} aria-label={`Cor principal ${color}`} onClick={() => changeDesign({ bodyColor: color })} className={`flex h-9 w-9 items-center justify-center rounded-full border transition-transform hover:scale-110 ${design.bodyColor === color ? "border-[#4E5F93] ring-2 ring-[#4E5F93]/20 ring-offset-2 ring-offset-[#F1EEFA]" : "border-[#4E5F93]/15"}`} style={{ background: color }}>{design.bodyColor === color ? <Check className={`h-3.5 w-3.5 ${["#4E5F93"].includes(color) ? "text-white" : "text-[#4E5F93]"}`} /> : null}</button>)}</div></div>
                      <div><ControlLabel>Cor de destaque</ControlLabel><div className="flex flex-wrap gap-2">{ACCENT_SWATCHES.map((color) => <button key={color} aria-label={`Cor de destaque ${color}`} onClick={() => changeDesign({ accentColor: color })} className={`flex h-9 w-9 items-center justify-center rounded-full border transition-transform hover:scale-110 ${design.accentColor === color ? "border-[#4E5F93] ring-2 ring-[#4E5F93]/20 ring-offset-2 ring-offset-[#F1EEFA]" : "border-[#4E5F93]/15"}`} style={{ background: color }}>{design.accentColor === color ? <Check className={`h-3.5 w-3.5 ${["#4E5F93", "#2D2027", "#3A72A7", "#6D8FCB"].includes(color) ? "text-white" : "text-[#4E5F93]"}`} /> : null}</button>)}</div></div>
                      <div className="grid grid-cols-2 gap-3"><label className="rounded-xl border border-[#4E5F93]/13 bg-[#FFFFFF] p-3"><span className="block font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-[#4E5F93]/65">Pega</span><input type="color" className="mt-3 h-7 w-full cursor-pointer rounded-md border-0 bg-transparent" value={handleColor} onChange={(event) => setHandleColor(event.target.value)} aria-label="Cor da pega" /></label><label className="rounded-xl border border-[#4E5F93]/13 bg-[#FFFFFF] p-3"><span className="block font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-[#4E5F93]/65">Interior</span><input type="color" className="mt-3 h-7 w-full cursor-pointer rounded-md border-0 bg-transparent" value={innerColor} onChange={(event) => setInnerColor(event.target.value)} aria-label="Cor interior" /></label></div>
                      <div className="rounded-2xl border border-[#E98DAA]/20 bg-[#E98DAA]/8 p-4"><div className="flex gap-3"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#E98DAA]" /><p className="text-xs leading-5 text-[#4E5F93]/70">A cor do corpo é aplicada à impressão e atualiza a pré-visualização em tempo real.</p></div></div>
                    </div>
                  ) : null}

                  {panel === "vista" ? (
                    <div className="space-y-6">
                      <div><p className="font-[DM_Serif_Display] text-[1.45rem] leading-none tracking-[-0.04em]">Cenário de estudo</p><p className="mt-2 text-sm leading-5 text-[#4E5F93]/62">Defina a superfície da fotografia de produto e grave uma vista para partilhar.</p></div>
                      <div className="grid grid-cols-2 gap-3"><button onClick={() => setAutoSpin((current) => !current)} className={`rounded-xl border p-3 text-left transition-all active:scale-[0.97] ${autoSpin ? "border-[#E98DAA] bg-[#E98DAA] text-white" : "border-[#4E5F93]/15 bg-[#FFFFFF]"}`}><Orbit className="h-4 w-4" /><span className="mt-4 block font-mono text-[9px] font-bold uppercase tracking-[0.12em]">{autoSpin ? "Rotação ativa" : "Rotação parada"}</span></button><button onClick={() => setView("front")} className="rounded-xl border border-[#4E5F93]/15 bg-[#FFFFFF] p-3 text-left transition-all hover:border-[#4E5F93]/45 active:scale-[0.97]"><Aperture className="h-4 w-4" /><span className="mt-4 block font-mono text-[9px] font-bold uppercase tracking-[0.12em]">Centralizar</span></button></div>
                      <input ref={backgroundInputRef} className="hidden" type="file" accept="image/*" onChange={(event) => handleBackgroundUpload(event.target.files?.[0])} />
                      <button onClick={() => backgroundInputRef.current?.click()} className="flex w-full items-center justify-between rounded-xl border border-[#4E5F93]/15 bg-[#FFFFFF] px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition-all hover:border-[#E98DAA] active:scale-[0.985]"><span className="flex items-center gap-2"><ImagePlus className="h-4 w-4 text-[#E98DAA]" />Imagem de fundo</span><Plus className="h-4 w-4" /></button>
                      <button onClick={() => setBackgroundImage("")} className="w-full font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[#4E5F93]/57 underline underline-offset-4">Limpar fundo</button>
                      <div><ControlLabel>Tom de fundo</ControlLabel><div className="flex items-center gap-3"><input type="color" className="h-10 w-10 cursor-pointer rounded-full border-2 border-white bg-transparent shadow-sm" value={backgroundColor} onChange={(event) => setBackgroundColor(event.target.value)} aria-label="Tom do fundo" /><span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#4E5F93]/55">{backgroundColor}</span></div></div>
                      <div className="rounded-2xl bg-[#4E5F93] p-4 text-white"><div className="flex gap-3"><CircleHelp className="h-4 w-4 shrink-0 text-[#C6A2E9]" /><p className="text-xs leading-5 text-white/70">Na pré-visualização, arraste a caneca para rodar e use a roda do rato para aproximar.</p></div></div>
                    </div>
                  ) : null}
                </div>

                <div className="border-t border-[#4E5F93]/12 border-l-2 border-l-[#E98DAA] bg-[#FFFFFF] p-4 sm:p-5">
                  <div className="mb-3 flex items-center justify-between"><span className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-[#4E5F93]/55">Prova & saída</span><span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#6D8FCB]">Pronto</span></div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={downloadLayout} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#4E5F93] px-3 font-mono text-[9px] font-bold uppercase tracking-[0.11em] text-white transition-all hover:bg-[#6575AA] active:scale-[0.97]"><Download className="h-3.5 w-3.5" />Layout</button>
                    <button onClick={() => setSnapshotToken((current) => current + 1)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#E98DAA] px-3 font-mono text-[9px] font-bold uppercase tracking-[0.11em] text-white transition-all hover:bg-[#D97999] active:scale-[0.97]"><Camera className="h-3.5 w-3.5" />Cena 3D</button>
                  </div>
                  <button disabled={isRecording} onClick={() => { setIsRecording(true); setRecordToken((current) => current + 1); }} className="mt-2 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#4E5F93]/15 bg-[#F1EEFA] px-3 font-mono text-[9px] font-bold uppercase tracking-[0.11em] text-[#4E5F93] transition-all hover:border-[#4E5F93]/45 hover:bg-[#E8E9F8] disabled:cursor-wait disabled:opacity-65 active:scale-[0.97]"><Orbit className="h-3.5 w-3.5" />{isRecording ? "A gravar giro…" : "Gravar giro · 4 s"}</button>
                </div>
              </aside>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-[1.15fr_0.85fr]">
              <div className="relative overflow-hidden rounded-[1.4rem] border-l-2 border-l-[#E98DAA] bg-[#4E5F93] p-5 text-white sm:p-6">
                <div className="relative z-10 flex items-start gap-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E98DAA]"><Printer className="h-4 w-4" /></div><div><p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white/50">Ficheiro base</p><p className="mt-1 font-[DM_Serif_Display] text-xl tracking-[-0.03em]">Desenho circular preparado para a sua prova.</p></div></div>
                <div className="relative z-10 mt-5 grid grid-cols-4 gap-2 border-t border-white/12 pt-4 font-mono text-[8px] uppercase tracking-[0.13em] text-white/62"><span>1800 × 900</span><span>PNG</span><span>Prova 01</span><span>Local</span></div>
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border-[20px] border-[#E98DAA]/25" />
              </div>
              <div className="flex items-center justify-between overflow-hidden rounded-[1.4rem] border border-[#4E5F93]/12 bg-[#E8E9F8] p-4 sm:p-5"><div><p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#4E5F93]/50">Funcionalidades</p><p className="mt-2 max-w-[16rem] text-sm leading-5 text-[#4E5F93]/68">Arte, texto, cores, rotação, fundo e três saídas locais.</p></div><Layers3 className="h-9 w-9 shrink-0 text-[#E98DAA]" /></div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

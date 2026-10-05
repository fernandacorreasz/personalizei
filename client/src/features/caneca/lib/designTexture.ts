/**
 * Atelier Editorial — textura de impressão limpa, tátil e centrada no objeto.
 */
export type MugDesign = {
  text: string;
  fontFamily: "DM Serif Display" | "Manrope" | "Georgia";
  fontSize: number;
  textColor: string;
  textX: number;
  textY: number;
  textRotation: number;
  imageSrc: string;
  imageScale: number;
  imageX: number;
  imageY: number;
  imageRotation: number;
  bodyColor: string;
  accentColor: string;
};

export const DEFAULT_DESIGN: MugDesign = {
  text: "A SUA IDEIA\nEM VOLTA.",
  fontFamily: "DM Serif Display",
  fontSize: 75,
  textColor: "#4E5F93",
  textX: 0,
  textY: 0,
  textRotation: 0,
  imageSrc: "",
  imageScale: 0.58,
  imageX: 0.19,
  imageY: -0.02,
  imageRotation: 0,
  bodyColor: "#F6F8FD",
  accentColor: "#E98DAA",
};

export function renderMugDesignCanvas(
  design: MugDesign,
  image: CanvasImageSource | null = null,
  transparent = false,
) {
  const canvas = document.createElement("canvas");
  canvas.width = 1800;
  canvas.height = 900;
  const context = canvas.getContext("2d");

  if (!context) return canvas;

  const { width, height } = canvas;
  if (transparent) context.clearRect(0, 0, width, height);
  else {
    context.fillStyle = design.bodyColor;
    context.fillRect(0, 0, width, height);
  }

  // A marca de registo é propositadamente discreta; faz parte do motivo visual da peça impressa.
  context.fillStyle = design.accentColor;
  context.fillRect(92, 112, 12, 260);
  context.fillStyle = "rgba(23, 42, 69, 0.11)";
  context.fillRect(121, 112, 2, 260);
  context.fillStyle = "rgba(23, 42, 69, 0.08)";
  context.fillRect(0, height - 132, width, 2);

  context.save();
  context.globalAlpha = 0.86;
  context.strokeStyle = design.accentColor;
  context.lineWidth = 10;
  context.beginPath();
  context.arc(width - 270, 210, 126, Math.PI * 0.16, Math.PI * 1.37);
  context.stroke();
  context.setLineDash([8, 18]);
  context.lineWidth = 3;
  context.beginPath();
  context.arc(width - 270, 210, 166, Math.PI * 0.16, Math.PI * 1.35);
  context.stroke();
  context.restore();

  if (image) {
    const sourceWidth = "naturalWidth" in image ? image.naturalWidth : width;
    const sourceHeight = "naturalHeight" in image ? image.naturalHeight : height;
    const maxSize = Math.min(width, height) * design.imageScale;
    const imageRatio = sourceWidth / Math.max(sourceHeight, 1);
    const drawWidth = imageRatio >= 1 ? maxSize : maxSize * imageRatio;
    const drawHeight = imageRatio >= 1 ? maxSize / imageRatio : maxSize;
    const imageCenterX = width * (0.5 + design.imageX);
    const imageCenterY = height * (0.52 + design.imageY);
    context.save();
    context.translate(imageCenterX, imageCenterY);
    context.rotate((design.imageRotation * Math.PI) / 180);
    context.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    context.restore();
  }

  const textX = width * (0.5 + design.textX);
  const textY = height * (0.52 + design.textY);
  context.save();
  context.translate(textX, textY);
  context.rotate((design.textRotation * Math.PI) / 180);
  context.fillStyle = design.textColor;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `600 ${design.fontSize}px "${design.fontFamily}", Georgia, serif`;
  const lines = design.text.split("\n").slice(0, 3);
  lines.forEach((line, index) => {
    const lineOffset = (index - (lines.length - 1) / 2) * design.fontSize * 0.92;
    context.fillText(line, 0, lineOffset, width * 0.72);
  });
  context.restore();

  return canvas;
}

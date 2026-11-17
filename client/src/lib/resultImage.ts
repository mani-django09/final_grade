/**
 * Renders the final-grade result as a branded square PNG for sharing.
 *
 * Drawn directly on a canvas rather than rasterising the DOM: the result panel
 * leans on backdrop-filter, gradient-clipped text and layered blurs, none of
 * which DOM-to-canvas libraries reproduce faithfully. Hand-drawing also keeps
 * the bundle free of a ~200KB dependency and lets the card carry the site URL.
 */

const SIZE = 1080;
const CX = SIZE / 2;
const SITE = "finalgradecalculators.us";

export interface ResultCardData {
  requiredGrade: number;
  currentGrade: number;
  finalExamWeight: number;
  desiredGrade: number;
  difficultyLabel: string;
  difficultyEmoji: string;
  /** Hex colour for the ring and badge, e.g. "#fb923c". */
  accent: string;
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  // Safari < 16 and older Firefox.
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function font(weight: number, px: number) {
  return `${weight} ${px}px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`;
}

/** Score as it appears on the card — clamped the same way the on-page result is. */
function scoreText(score: number) {
  if (score > 100) return "100+";
  if (score < 0) return "0";
  return `${score}`;
}

export async function renderResultCard(data: ResultCardData): Promise<Blob | null> {
  // Inter comes from Google Fonts; without this the first draw can fall back to a system face.
  try {
    await document.fonts.ready;
  } catch {
    // Font Loading API unavailable — the fallback stack still renders.
  }

  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  /* ── Background ─────────────────────────────────────────── */
  const bg = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  bg.addColorStop(0, "#060812");
  bg.addColorStop(0.35, "#0e0c2a");
  bg.addColorStop(0.7, "#0a1a3a");
  bg.addColorStop(1, "#060d1f");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Soft indigo glow, echoing the hero orbs.
  const glow = ctx.createRadialGradient(820, 180, 0, 820, 180, 560);
  glow.addColorStop(0, "rgba(99,102,241,0.22)");
  glow.addColorStop(1, "rgba(99,102,241,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, SIZE, SIZE);

  ctx.textAlign = "center";

  /* ── Brand ──────────────────────────────────────────────── */
  ctx.font = font(800, 38);
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "middle";
  const brandA = "FinalGrade";
  const brandB = "Calculator";
  const wA = ctx.measureText(brandA).width;
  const wB = ctx.measureText(brandB).width;
  const brandStart = CX - (wA + wB) / 2;
  ctx.textAlign = "left";
  ctx.fillText(brandA, brandStart, 96);
  const brandGrad = ctx.createLinearGradient(brandStart + wA, 78, brandStart + wA + wB, 114);
  brandGrad.addColorStop(0, "#818cf8");
  brandGrad.addColorStop(1, "#38bdf8");
  ctx.fillStyle = brandGrad;
  ctx.fillText(brandB, brandStart + wA, 96);
  ctx.textAlign = "center";

  /* ── Label ──────────────────────────────────────────────── */
  ctx.font = font(600, 26);
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.letterSpacing = "4px";
  ctx.fillText("SCORE NEEDED ON FINAL EXAM", CX, 190);
  ctx.letterSpacing = "0px";

  /* ── Score ring ─────────────────────────────────────────── */
  const ringY = 430;
  const radius = 165;
  const stroke = 28;
  const pct = Math.min(Math.max(data.requiredGrade, 0), 100) / 100;

  ctx.lineWidth = stroke;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.arc(CX, ringY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.stroke();

  if (pct > 0) {
    ctx.beginPath();
    ctx.arc(CX, ringY, radius, -Math.PI / 2, -Math.PI / 2 + pct * Math.PI * 2);
    ctx.strokeStyle = data.accent;
    ctx.shadowColor = data.accent;
    ctx.shadowBlur = 30;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  ctx.font = font(900, 130);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(scoreText(data.requiredGrade), CX, ringY - 6);

  if (data.requiredGrade >= 0 && data.requiredGrade <= 100) {
    ctx.font = font(700, 40);
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fillText("%", CX, ringY + 82);
  }

  /* ── Difficulty badge ───────────────────────────────────── */
  const badgeText = `${data.difficultyEmoji}  ${data.difficultyLabel}`;
  ctx.font = font(700, 30);
  const badgeW = ctx.measureText(badgeText).width + 64;
  const badgeH = 66;
  const badgeY = 668;
  roundRectPath(ctx, CX - badgeW / 2, badgeY, badgeW, badgeH, badgeH / 2);
  ctx.fillStyle = `${data.accent}26`; // ~15% alpha
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = `${data.accent}66`;
  ctx.stroke();
  ctx.fillStyle = data.accent;
  ctx.fillText(badgeText, CX, badgeY + badgeH / 2 + 1);

  /* ── Stats ──────────────────────────────────────────────── */
  const stats: Array<[string, string]> = [
    ["CURRENT", `${data.currentGrade}%`],
    ["WEIGHT", `${data.finalExamWeight}%`],
    ["GOAL", `${data.desiredGrade}%`],
  ];
  const gap = 24;
  const boxW = (SIZE - 160 - gap * 2) / 3;
  const boxH = 130;
  const boxY = 790;

  stats.forEach(([label, value], i) => {
    const x = 80 + i * (boxW + gap);
    roundRectPath(ctx, x, boxY, boxW, boxH, 22);
    ctx.fillStyle = "rgba(255,255,255,0.07)";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.stroke();

    ctx.font = font(800, 46);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(value, x + boxW / 2, boxY + 52);

    ctx.font = font(600, 22);
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.letterSpacing = "2px";
    ctx.fillText(label, x + boxW / 2, boxY + 97);
    ctx.letterSpacing = "0px";
  });

  /* ── Footer URL ─────────────────────────────────────────── */
  ctx.font = font(600, 28);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.letterSpacing = "1px";
  ctx.fillText(SITE, CX, 995);
  ctx.letterSpacing = "0px";

  return new Promise(resolve => canvas.toBlob(blob => resolve(blob), "image/png"));
}

/** Saves a blob under `filename` via a temporary object URL. */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoke on the next tick so the download has taken the URL.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

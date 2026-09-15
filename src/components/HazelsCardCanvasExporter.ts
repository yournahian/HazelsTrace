export interface CardExportData {
  handle: string;
  avatarUrl?: string;
  totalImpressions: number;
  postCount: number;
  archetypeId: string;
  archetypeTitle: string;
  archetypeLore: string;
  glowColor: string;
  rarity: string;
  image: string;
}

export async function exportHazelsCardPNG(data: CardExportData): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const width = 800;
  const height = 1140;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  // Background gradient (Deep Obsidian + Crimson Accent)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#0A0C14');
  bgGrad.addColorStop(0.5, '#06080E');
  bgGrad.addColorStop(1, '#040508');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Outer Border with Archetype Glow
  ctx.save();
  ctx.strokeStyle = data.glowColor || '#FF2A5F';
  ctx.lineWidth = 6;
  ctx.shadowColor = data.glowColor || '#FF2A5F';
  ctx.shadowBlur = 40;
  ctx.strokeRect(16, 16, width - 32, height - 32);
  ctx.restore();

  // Inner Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  ctx.strokeRect(26, 26, width - 52, height - 52);

  // Card Header: HAZELS CARDS // SERIES 1
  ctx.font = '700 16px "JetBrains Mono", monospace';
  ctx.fillStyle = '#FF2A5F';
  ctx.fillText('HAZELS CARDS', 48, 64);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#8B5CF6';
  ctx.fillText('GTD SERIES 1 // 七転び八起き', width - 48, 64);
  ctx.textAlign = 'left';

  // Character Artwork Frame (Aspect 1:1)
  const artX = 48;
  const artY = 90;
  const artW = width - 96;
  const artH = 580;

  // Draw Artwork
  try {
    const charImg = await loadImage(data.image);
    ctx.save();
    // Rounded clip for artwork
    roundedRect(ctx, artX, artY, artW, artH, 20);
    ctx.clip();
    ctx.drawImage(charImg, artX, artY, artW, artH);
    ctx.restore();
  } catch {
    ctx.fillStyle = 'rgba(255, 42, 95, 0.1)';
    ctx.fillRect(artX, artY, artW, artH);
  }

  // Artwork Border
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2;
  roundedRect(ctx, artX, artY, artW, artH, 20);
  ctx.stroke();
  ctx.restore();

  // User Nameplate Bar
  const npY = 690;
  const npH = 80;
  ctx.fillStyle = 'rgba(10, 14, 24, 0.9)';
  roundedRect(ctx, artX, npY, artW, npH, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 42, 95, 0.35)';
  ctx.lineWidth = 1.5;
  roundedRect(ctx, artX, npY, artW, npH, 16);
  ctx.stroke();

  // Draw User Avatar
  const avX = artX + 20;
  const avY = npY + 16;
  const avR = 24;
  if (data.avatarUrl) {
    try {
      const avImg = await loadImage(data.avatarUrl);
      ctx.save();
      ctx.beginPath();
      ctx.arc(avX + avR, avY + avR, avR, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(avImg, avX, avY, avR * 2, avR * 2);
      ctx.restore();
    } catch {
      drawAvatarFallback(ctx, avX, avY, avR, data.handle);
    }
  } else {
    drawAvatarFallback(ctx, avX, avY, avR, data.handle);
  }

  // Avatar Border
  ctx.beginPath();
  ctx.arc(avX + avR, avY + avR, avR, 0, Math.PI * 2);
  ctx.strokeStyle = data.glowColor || '#FF2A5F';
  ctx.lineWidth = 2;
  ctx.stroke();

  // User Handle
  ctx.font = '800 24px "Outfit", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(`@${data.handle.replace('@', '')}`, avX + avR * 2 + 16, npY + 36);

  ctx.font = '600 13px "JetBrains Mono", monospace';
  ctx.fillStyle = '#FF7597';
  ctx.fillText('VERIFIED GTD CONTENDER', avX + avR * 2 + 16, npY + 58);

  // Rarity Badge inside Nameplate (Right aligned)
  ctx.textAlign = 'right';
  ctx.font = '800 14px "JetBrains Mono", monospace';
  ctx.fillStyle = data.glowColor;
  ctx.fillText(data.rarity, artX + artW - 20, npY + 46);
  ctx.textAlign = 'left';

  // Archetype Trait & Lore Box
  const tbY = 790;
  const tbH = 170;
  ctx.fillStyle = 'rgba(16, 20, 32, 0.85)';
  roundedRect(ctx, artX, tbY, artW, tbH, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1.5;
  roundedRect(ctx, artX, tbY, artW, tbH, 16);
  ctx.stroke();

  // Archetype Title
  ctx.font = '800 22px "Outfit", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(data.archetypeTitle, artX + 24, tbY + 40);

  // Archetype Lore (Wrap text)
  ctx.font = '400 14px "Outfit", sans-serif';
  ctx.fillStyle = '#A0AEC0';
  wrapText(ctx, data.archetypeLore, artX + 24, tbY + 70, artW - 48, 22);

  // Stats Bar (Impressions & YORAI Points)
  const stY = tbY + 110;
  ctx.font = '700 12px "JetBrains Mono", monospace';
  ctx.fillStyle = '#8B5CF6';
  ctx.fillText('YORAI IMPRESSIONS', artX + 24, stY + 16);
  ctx.font = '800 20px "Outfit", sans-serif';
  ctx.fillStyle = '#00E5FF';
  ctx.fillText(data.totalImpressions.toLocaleString(), artX + 24, stY + 42);

  ctx.font = '700 12px "JetBrains Mono", monospace';
  ctx.fillStyle = '#8B5CF6';
  ctx.fillText('GTD POSTS', artX + 260, stY + 16);
  ctx.font = '800 20px "Outfit", sans-serif';
  ctx.fillStyle = '#FF7597';
  ctx.fillText(data.postCount.toString(), artX + 260, stY + 42);

  // Card Footer: studio.hazels.io // @0xhazels
  const footY = height - 48;
  ctx.font = '700 13px "JetBrains Mono", monospace';
  ctx.fillStyle = '#718096';
  ctx.fillText('studio.hazels.io', 48, footY);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#FF2A5F';
  ctx.fillText('@0xhazels // THE EIGHTH RISE', width - 48, footY);
  ctx.textAlign = 'left';

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to create card blob'));
    }, 'image/png');
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawAvatarFallback(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  handle: string
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x + r, y + r, r, 0, Math.PI * 2);
  ctx.fillStyle = '#FF2A5F';
  ctx.fill();
  ctx.font = '800 16px "JetBrains Mono", monospace';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(handle.slice(0, 2).toUpperCase(), x + r, y + r);
  ctx.restore();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

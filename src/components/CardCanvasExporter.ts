export interface CardExportData {
  name: string;
  handle: string;
  avatar: string;
  impressions: number;
  postCount: number;
  series: Array<{ t: string; v: number }>;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function formatDateMonthYear(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export async function generateProofOfWorkPNG(data: CardExportData): Promise<Blob | null> {
  // Ultra high-res 2x scaling: 2048 x 818
  const width = 2048;
  const height = 818;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // 1. Draw the Anime Banner Character Background
  const bgImg = await loadImage('/brand/pow-banner-bg.png');
  if (bgImg) {
    ctx.drawImage(bgImg, 0, 0, width, height);
  } else {
    // Fallback if image fails to load
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, width, height);
  }

  // Banner bounds in 2048x818 canvas:
  // Banner starts at x = 9.5% * 2048 = 195, y = 43% * 818 = 352
  // Width = 81% * 2048 = 1658, Height = 41% * 818 = 335
  const bannerX = width * 0.095;
  const bannerY = height * 0.43;
  const bannerW = width * 0.81;
  const bannerH = height * 0.41;

  const padX = 42;
  const padY = 24;

  // 2. User Profile (Avatar, Display Name, Handle)
  const avatarSize = 64;
  const avatarX = bannerX + padX;
  const avatarY = bannerY + padY;

  const avatarImg = await loadImage(data.avatar);
  ctx.save();
  ctx.beginPath();
  ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
  ctx.clip();
  if (avatarImg) {
    ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
  } else {
    ctx.fillStyle = '#FF2A5F';
    ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(data.name.charAt(0).toUpperCase(), avatarX + avatarSize / 2, avatarY + avatarSize / 2);
  }
  ctx.restore();

  // Name & Handle
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 28px Inter, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(data.name, avatarX + avatarSize + 16, avatarY + 4);

  ctx.fillStyle = '#64748B';
  ctx.font = '600 20px Inter, -apple-system, sans-serif';
  ctx.fillText(`@${data.handle}`, avatarX + avatarSize + 16, avatarY + 36);

  // 3. Target Pill (@0xhazels) on the right of banner
  const pillW = 140;
  const pillH = 44;
  const pillX = bannerX + bannerW - padX - pillW;
  const pillY = avatarY + 8;

  ctx.save();
  ctx.fillStyle = '#F1F5F9';
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, 22);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FF2A5F';
  ctx.font = 'bold 18px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('0xhazels', pillX + pillW / 2, pillY + pillH / 2);
  ctx.restore();

  // 4. Impressions Counter & Caption
  const statY = avatarY + avatarSize + 28;
  ctx.fillStyle = '#0F172A';
  ctx.font = '900 68px Space Grotesk, Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(data.impressions.toLocaleString(), bannerX + padX, statY);

  ctx.fillStyle = '#64748B';
  ctx.font = '600 22px Inter, sans-serif';
  ctx.fillText('Impressions generated for 0xhazels', bannerX + padX, statY + 74);

  // 5. Sparkline Curve Chart on right of counter
  const chartX = bannerX + bannerW * 0.48;
  const chartY = statY + 10;
  const chartW = bannerW * 0.46;
  const chartH = 95;

  const series = data.series || [];
  if (series.length >= 2) {
    const minVal = 0;
    const maxVal = Math.max(...series.map((s) => s.v), data.impressions || 1);

    const points = series.map((s, idx) => {
      const px = chartX + (idx / (series.length - 1)) * chartW;
      const normalized = (s.v - minVal) / (maxVal - minVal || 1);
      const py = chartY + chartH - normalized * chartH;
      return { x: px, y: py };
    });

    // Area fill
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.lineTo(chartX + chartW, chartY + chartH);
    ctx.lineTo(chartX, chartY + chartH);
    ctx.closePath();

    const areaGrad = ctx.createLinearGradient(0, chartY, 0, chartY + chartH);
    areaGrad.addColorStop(0, 'rgba(255, 42, 95, 0.28)');
    areaGrad.addColorStop(1, 'rgba(255, 42, 95, 0.02)');
    ctx.fillStyle = areaGrad;
    ctx.fill();
    ctx.restore();

    // Line
    ctx.save();
    ctx.strokeStyle = '#FF2A5F';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    // Endpoint dot
    const last = points[points.length - 1];
    ctx.fillStyle = '#FF2A5F';
    ctx.beginPath();
    ctx.arc(last.x, last.y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 6. Bottom Date Footer
  const footerY = bannerY + bannerH - padY;
  const startStr = series.length > 0 ? formatDateMonthYear(series[0].t) : '';
  const endStr = series.length > 0 ? formatDateMonthYear(series[series.length - 1].t) : '';

  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 18px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText(series.length > 0 ? `${startStr} – ${endStr}` : 'studio.hazels.io', bannerX + padX, footerY);

  ctx.textAlign = 'right';
  ctx.fillText('Hazels Trace • studio.hazels.io', bannerX + bannerW - padX, footerY);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

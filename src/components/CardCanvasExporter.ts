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
  const width = 1080;
  const height = 620;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Background
  ctx.fillStyle = '#010101';
  ctx.fillRect(0, 0, width, height);

  const radGlow = ctx.createRadialGradient(width / 2, 0, 10, width / 2, 0, 480);
  radGlow.addColorStop(0, 'rgba(255, 42, 95, 0.18)');
  radGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = radGlow;
  ctx.fillRect(0, 0, width, height);

  // Subtle coordinate grid
  ctx.strokeStyle = 'rgba(232, 227, 213, 0.025)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Card Outer Container
  const cardPadX = 64;
  const cardPadY = 48;
  const cardW = width - cardPadX * 2;
  const cardH = height - cardPadY * 2;
  const radius = 28;

  // Card Background (Pure White Canvas)
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 14;

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(cardPadX, cardPadY, cardW, cardH, radius);
  ctx.fill();
  ctx.restore();

  // Subtle inner card border
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(cardPadX, cardPadY, cardW, cardH, radius);
  ctx.stroke();

  // Header Area: User profile (Avatar, Name, Handle)
  const userHeadY = cardPadY + 44;
  const avatarSize = 56;
  const avatarX = cardPadX + 44;
  const avatarY = userHeadY;

  // Load and draw avatar
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
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(data.name.charAt(0).toUpperCase(), avatarX + avatarSize / 2, avatarY + avatarSize / 2);
  }
  ctx.restore();

  // User Names
  const textLeft = avatarX + avatarSize + 16;
  ctx.fillStyle = '#0A0A0A';
  ctx.font = 'bold 20px Inter, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(data.name, textLeft, avatarY + 6);

  ctx.fillStyle = 'rgba(10, 10, 10, 0.5)';
  ctx.font = '500 15px Inter, -apple-system, sans-serif';
  ctx.fillText(`@${data.handle}`, textLeft, avatarY + 32);

  // Target Pill (Right corner)
  const badgeW = 90;
  const badgeH = 32;
  const badgeX = cardPadX + cardW - badgeW - 44;
  const badgeY = avatarY + 12;

  ctx.fillStyle = '#F8FAFC';
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FF2A5F';
  ctx.font = 'bold 13px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('0xhazels', badgeX + badgeW / 2, badgeY + badgeH / 2);

  // Impressions Number
  const statY = avatarY + avatarSize + 44;
  ctx.fillStyle = '#010101';
  ctx.font = 'bold 54px Space Grotesk, Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(data.impressions.toLocaleString(), cardPadX + 46, statY - 32);

  ctx.fillStyle = 'rgba(10, 10, 10, 0.55)';
  ctx.font = '500 16px Inter, sans-serif';
  ctx.fillText('Impressions generated for 0xhazels', cardPadX + 46, statY + 30);

  // Line Chart
  const chartX = cardPadX + 44;
  const chartY = statY + 75;
  const chartW = cardW - 88;
  const chartH = 140;

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
    areaGrad.addColorStop(0, 'rgba(255, 42, 95, 0.22)');
    areaGrad.addColorStop(1, 'rgba(255, 42, 95, 0.01)');
    ctx.fillStyle = areaGrad;
    ctx.fill();
    ctx.restore();

    // Chart stroke line
    ctx.save();
    ctx.strokeStyle = '#FF2A5F';
    ctx.lineWidth = 3.5;
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
    ctx.arc(last.x, last.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Bottom Divider & Footer
  const footerY = chartY + chartH + 34;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cardPadX + 44, footerY - 14);
  ctx.lineTo(cardPadX + cardW - 44, footerY - 14);
  ctx.stroke();

  const startStr = series.length > 0 ? formatDateMonthYear(series[0].t) : '';
  const endStr = series.length > 0 ? formatDateMonthYear(series[series.length - 1].t) : '';

  ctx.fillStyle = 'rgba(10, 10, 10, 0.4)';
  ctx.font = '500 14px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(data.series.length > 0 ? `${startStr} – ${endStr}` : 'studio.hazels.io', cardPadX + 46, footerY);

  ctx.textAlign = 'right';
  ctx.fillText('Hazels Trace • studio.hazels.io', cardPadX + cardW - 46, footerY);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

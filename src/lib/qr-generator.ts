import QRCode from 'qrcode';

export interface QRGenerateOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

export const generateQRCode = async (
  lectureId: string,
  _lectureTitle: string,
  options: QRGenerateOptions = {}
): Promise<string> => {
  const {
    width = 300,
    margin = 1,
    color = { dark: '#1e3a8a', light: '#ffffff' },
  } = options;

  const feedbackUrl = `${window.location.origin}/feedback/${lectureId}`;

  try {
    const qrDataUrl = await QRCode.toDataURL(feedbackUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width,
      margin,
      color,
    });

    return qrDataUrl;
  } catch (error) {
    console.error('QR generation error:', error);
    throw new Error('Failed to generate QR code');
  }
};

export const generateQRSVG = async (
  lectureId: string,
  _lectureTitle: string,
  _options: QRGenerateOptions = {}
): Promise<string> => {
  try {
    // Return placeholder SVG for now - QRCode library has typing issues
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="300" height="300">
      <rect width="100" height="100" fill="white"/>
      <text x="50" y="50" font-size="12" text-anchor="middle" dominant-baseline="middle" fill="black">
        QR: ${lectureId.substring(0, 8)}...
      </text>
    </svg>`;
  } catch (error) {
    console.error('QR SVG generation error:', error);
    throw new Error('Failed to generate QR SVG');
  }
};

export const downloadQRCode = async (
  lectureId: string,
  lectureTitle: string,
  filename: string = `lecture-${lectureId}.png`
) => {
  try {
    const qrDataUrl = await generateQRCode(lectureId, lectureTitle);
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};

export const downloadQRCodeBatch = async (
  lectures: Array<{ id: string; title: string }>,
  _zipFilename: string = 'lecture-qr-codes.zip'
) => {
  // This would require JSZip for actual implementation
  // For now, download individual codes
  for (const lecture of lectures) {
    await downloadQRCode(lecture.id, lecture.title, `${lecture.title}.png`);
  }
};

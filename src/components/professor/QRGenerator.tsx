import { useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, Share2, Loader } from 'lucide-react';
import { generateQRCode, downloadQRCode } from '../../lib/qr-generator';

interface QRGeneratorProps {
  lectureId: string;
  lectureTitle: string;
}

export default function QRGenerator({ lectureId, lectureTitle }: QRGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const feedbackUrl = `${window.location.origin}/feedback/${lectureId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(feedbackUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadQRCode(lectureId, lectureTitle, `${lectureTitle}-QR.png`);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(false);
    }
  };

  const handleGenerateQR = async () => {
    try {
      await generateQRCode(lectureId, lectureTitle);
      setShowQR(true);
    } catch (error) {
      console.error('QR generation failed:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg border border-slate-200 shadow-lg p-6"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">🎁 Magic QR Code</h3>
        <p className="text-sm text-gray-600">Students scan → Auto-open feedback (no typing)</p>
      </div>

      {/* QR Display */}
      {showQR && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 flex flex-col items-center p-6 bg-slate-50 rounded-lg"
        >
          <div className="p-4 bg-white rounded-lg border-4 border-blue-500">
            <QRCodeSVG
              value={feedbackUrl}
              size={200}
              level="H"
              includeMargin={true}
              fgColor="#1e3a8a"
              bgColor="#ffffff"
            />
          </div>

          <p className="mt-4 text-sm text-center text-gray-600">
            Lecture: <span className="font-semibold">{lectureTitle}</span>
          </p>

          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>Scan with any phone camera</p>
            <p className="mt-1">Works offline → Syncs when online</p>
          </div>
        </motion.div>
      )}

      {/* Feedback URL */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-700 block mb-2">Feedback Link</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={feedbackUrl}
            readOnly
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-gray-600"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              copied
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-200 text-gray-700 hover:bg-slate-300'
            }`}
          >
            {copied ? '✓ Copied' : <Copy className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGenerateQR}
          className="px-4 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-2"
        >
          📱 {showQR ? 'Regenerate' : 'Generate'} QR
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          disabled={downloading || !showQR}
          className="px-4 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {downloading ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Download PNG
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const text = `Join my lecture feedback: ${feedbackUrl}`;
            if (navigator.share) {
              navigator.share({
                title: lectureTitle,
                text,
                url: feedbackUrl,
              });
            } else {
              alert(text);
            }
          }}
          className="px-4 py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share
        </motion.button>
      </div>

      {/* Benefits */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
          <p className="text-xs font-semibold text-emerald-900">✅ Fast</p>
          <p className="text-xs text-emerald-800">Feedback in 8 seconds</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs font-semibold text-blue-900">📱 Mobile</p>
          <p className="text-xs text-blue-800">Works on all phones</p>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-xs font-semibold text-purple-900">🚀 Offline</p>
          <p className="text-xs text-purple-800">Syncs when online</p>
        </div>
      </div>
    </motion.div>
  );
}

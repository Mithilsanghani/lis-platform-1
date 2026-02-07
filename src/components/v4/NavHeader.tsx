/**
 * NavHeader - Clean header with logo and avatar
 * Fixed 80px, minimal, professional
 */

import { User, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavHeaderProps {
  onMenuClick?: () => void;
  isMobile?: boolean;
}

export default function NavHeader({ onMenuClick, isMobile }: NavHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-20 px-4 py-3 flex items-center justify-between border-b border-[#2A2A40] bg-[#0F0F23]"
    >
      {/* LOGO + BRANDING */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-md flex items-center justify-center">
          <span className="text-white text-xs font-black">LIS</span>
        </div>
        <div>
          <p className="text-xs font-black text-white tracking-wider">LIS</p>
          <p className="text-[10px] text-[#9CA3AF] font-medium">Prof Portal</p>
        </div>
      </div>

      {/* AVATAR + MENU */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-10 h-10 bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-full flex items-center justify-center hover:ring-2 hover:ring-[#7C3AED]/50 transition"
      >
        <User className="w-5 h-5 text-white" />
      </motion.button>
    </motion.div>
  );
}

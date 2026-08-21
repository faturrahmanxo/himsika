import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ArrowToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Fungsi untuk mengecek posisi scroll
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    // Membersihkan event listener ketika komponen dilepas
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Fungsi untuk scroll mulus ke atas
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          aria-label="Kembali ke atas"
          className="fixed bottom-8 right-8 z-[99] flex items-center justify-center w-12 h-12 bg-info border-[3px] border-foreground rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:scale-110 hover:brightness-110 active:scale-95 transition-all duration-300"
        >
          <ArrowUp className="w-6 h-6 text-foreground" strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

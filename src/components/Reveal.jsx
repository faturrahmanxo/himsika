import { motion } from "motion/react";

// Munculkan elemen saat masuk viewport, sekali saja.
// Alasan (R-19): menuntun mata mengikuti alur baca saat menggulir,
// lalu berhenti. Tidak ada animasi berulang.
export default function Reveal({ children, delay = 0, className = "", as = "div" }) {
  const Comp = motion[as] || motion.div;

  return (
    <Comp
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </Comp>
  );
}

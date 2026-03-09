import { motion } from "framer-motion";
import {
  TrendingUp,
  Wallet,
  PieChart,
  CreditCard,
  DollarSign,
  BarChart3,
} from "lucide-react";

const dotPositions = [...Array(6)].map(() => ({
  left: 20 + Math.random() * 60,
  top: 20 + Math.random() * 60,
}));

export const FinanceIllustration = () => {
  const floatingIcons = [
    { Icon: TrendingUp, delay: 0, x: 20, y: -30 },
    { Icon: Wallet, delay: 0.5, x: -40, y: 20 },
    { Icon: PieChart, delay: 1, x: 50, y: 40 },
    { Icon: CreditCard, delay: 1.5, x: -30, y: -50 },
    { Icon: BarChart3, delay: 2, x: 60, y: -10 },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary/20 flex items-center justify-center backdrop-blur-sm">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-primary/30 flex items-center justify-center">
            <DollarSign className="w-12 h-12 md:w-16 md:h-16 text-primary" />
          </div>
        </div>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 w-52 h-52 md:w-64 md:h-64 -top-10 -left-10 md:-top-12 md:-left-12"
        >
          <div className="w-full h-full rounded-full border border-dashed border-primary/30" />
        </motion.div>
      </motion.div>

      {floatingIcons.map(({ Icon, delay, x, y }, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [y, y - 15, y],
          }}
          transition={{
            opacity: { delay: delay + 0.3, duration: 0.5 },
            scale: { delay: delay + 0.3, duration: 0.5 },
            y: {
              delay: delay + 0.8,
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          style={{
            position: "absolute",
            left: `calc(50% + ${x}px)`,
            top: `calc(50% + ${y}px)`,
          }}
          className="p-3 rounded-xl bg-primary/50 backdrop-blur-sm border border-primary shadow-lg"
        >
          <Icon className="w-6 h-6 text-primary" />
        </motion.div>
      ))}

      {dotPositions.map((pos, i) => (
        <motion.div
          key={`dot-${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{
            delay: i * 0.2,
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-2 h-2 rounded-full bg-primary/50"
          style={{
            left: `${pos.left}%`,
            top: `${pos.top}%`,
          }}
        />
      ))}
    </div>
  );
};

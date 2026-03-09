"use client";

import { motion } from "framer-motion";
import { Shield, TrendingUp, Zap } from "lucide-react";
import { FinanceIllustration } from "./FinanceIllustration";

type HeroLeftPanelProps = {
  title: string;
  title_span: string;
};

export const HeroLeftPanel = ({ title, title_span }: HeroLeftPanelProps) => {
  const features = [
    { icon: Shield, text: "Segurança bancária" },
    { icon: TrendingUp, text: "Análises em tempo real" },
    { icon: Zap, text: "Transações instantâneas" },
  ];

  return (
    <div className="flex flex-col h-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">F</span>
          </div>
          <span>Fintrixy</span>
        </h1>
      </motion.div>

      <div className="flex-1 flex items-center justify-center py-12">
        <FinanceIllustration />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="space-y-6"
      >
        <h2 className="text-3xl font-bold text-white leading-tight">
          {title}
          <br />
          <span className="text-primary">{title_span}</span>
        </h2>
        <div className="flex gap-6">
          {features.map(({ icon: Icon, text }, index) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-2 text-white/70"
            >
              <Icon className="w-4 h-4 text-primary" />
              <span className="text-sm">{text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

'use client';
import { motion } from 'framer-motion';
import type { ReactNode, CSSProperties } from 'react';

const EASE = [0.25, 0.46, 0.45, 0.94] as const;
const VIEWPORT = { once: true, margin: '-56px' } as const;

interface Props {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  duration?: number;
}

export function FadeUp({ children, className, style, delay = 0, duration = 0.5 }: Props) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ children, className, style, delay = 0, duration = 0.4 }: Props) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={VIEWPORT}
      transition={{ duration, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, className, style, delay = 0, duration = 0.55 }: Props) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={VIEWPORT}
      transition={{ duration, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerParent({ children, className, style }: Props) {
  return (
    <motion.div
      className={className}
      style={style}
      initial='hidden'
      whileInView='visible'
      viewport={VIEWPORT}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerChild({ children, className, style, duration = 0.5 }: Props) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={{
        hidden:  { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0, transition: { duration, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}

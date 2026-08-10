import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const TaskBoardPreview = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <div ref={containerRef} className="relative h-[600px] perspective-1000">
      <motion.div
        style={{ y, rotateX: rotate }}
        className="absolute inset-0 bg-white rounded-2xl shadow-2xl p-6 transform-gpu"
      >
        <div className="grid grid-cols-3 gap-4 h-full">
          {["To Do", "In Progress", "Done"].map((column) => (
            <div
              key={column}
              className="bg-gray-50 rounded-xl p-4 border border-gray-200"
            >
              <h3 className="font-semibold mb-4">{column}</h3>
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-4 rounded-lg shadow mb-3"
                >
                  <div className="h-2 w-16 bg-blue-200 rounded mb-2" />
                  <div className="h-2 w-24 bg-gray-100 rounded" />
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

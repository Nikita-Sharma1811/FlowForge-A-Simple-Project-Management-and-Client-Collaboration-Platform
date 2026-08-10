import React from 'react';
import { motion } from 'framer-motion';

export const FeatureCard = ({
  icon,
  title,
  description,
  benefits,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <ul className="space-y-2">
        {benefits.map((benefit) => (
          <li key={benefit} className="flex items-center text-gray-700">
            <svg
              className="w-5 h-5 mr-2 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {benefit}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

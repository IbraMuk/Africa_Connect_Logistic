"use client";

import Image from "next/image";
import { useState } from "react";

interface LogoProps {
  size?: number;
  showText?: boolean;
  textClassName?: string;
  subTitle?: React.ReactNode;
  className?: string;
}

export default function Logo({
  size = 48,
  showText = true,
  textClassName = "",
  subTitle,
  className = "",
}: LogoProps) {
  const [imageError, setImageError] = useState(false);

  // Si l'image n'existe pas ou charge mal, on affiche le fallback SVG
  if (imageError) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div
          className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-xl ring-2 ring-white dark:ring-gray-800"
          style={{ width: size, height: size }}
        >
          <svg
            className="text-white"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: size * 0.65, height: size * 0.65 }}
          >
            <path
              d="M5 20C5 20 10 10 20 10C30 10 35 20 35 20C35 20 30 30 20 30C10 30 5 20 5 20Z"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <circle cx="20" cy="20" r="5" fill="currentColor" />
            <path
              d="M2 12L8 8M38 12L32 8M2 28L8 32M38 28L32 32"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        {showText && (
          <div>
            <h1
              className={`text-xl font-bold text-gray-900 dark:text-white ${textClassName}`}
            >
              Africa Connect
            </h1>
            {subTitle !== undefined ? (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {subTitle}
              </p>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Logistic
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div
        className="relative flex-shrink-0 rounded-xl overflow-hidden shadow-xl ring-2 ring-white/50 dark:ring-gray-700/50 bg-white dark:bg-gray-800"
        style={{ width: size, height: size }}
      >
        <Image
          src="/images/logo.png"
          alt="Africa Connect Logistic"
          width={size}
          height={size}
          className="object-contain w-full h-full"
          onError={() => setImageError(true)}
          priority
        />
      </div>
      {showText && (
        <div>
          <h1
            className={`text-2xl font-bold text-gray-900 dark:text-white ${textClassName}`}
          >
            Africa Connect
          </h1>
          {subTitle !== undefined ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {subTitle}
            </p>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">Logistic</p>
          )}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
  cursorClassName?: string;
  prefix?: string;
}

export function TypewriterText({
  words,
  typingSpeed = 65,
  deletingSpeed = 35,
  pauseDuration = 2200,
  className = '',
  cursorClassName = 'text-sky-400',
  prefix = '',
}: TypewriterTextProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const fullWord = words[wordIndex % words.length];

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(pauseTimer);
    }

    if (!isDeleting) {
      // Typing forward
      if (currentText.length < fullWord.length) {
        const nextCharTimeout = setTimeout(() => {
          setCurrentText(fullWord.slice(0, currentText.length + 1));
        }, typingSpeed + (Math.random() * 20 - 10)); // subtle human jitter
        return () => clearTimeout(nextCharTimeout);
      } else {
        // Finished typing word, trigger pause
        setIsPaused(true);
      }
    } else {
      // Deleting backward
      if (currentText.length > 0) {
        const deleteTimer = setTimeout(() => {
          setCurrentText(fullWord.slice(0, currentText.length - 1));
        }, deletingSpeed);
        return () => clearTimeout(deleteTimer);
      } else {
        // Finished deleting, move to next word
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }
  }, [currentText, isDeleting, isPaused, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={`inline-flex items-center font-mono ${className}`}>
      {prefix && <span className="opacity-60 mr-1.5 select-none">{prefix}</span>}
      <span>{currentText}</span>
      <span
        className={`inline-block ml-0.5 font-normal select-none animate-pulse ${cursorClassName}`}
        aria-hidden="true"
      >
        |
      </span>
    </span>
  );
}

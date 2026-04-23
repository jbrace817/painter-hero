"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PortfolioItem {
  title: string;
  location: string;
  description: string;
  src: string;
}

interface CircularPortfolioProps {
  items: PortfolioItem[];
  label?: string;
  heading?: string;
  autoplay?: boolean;
}

function calculateGap(width: number) {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 60;
  const maxGap = 86;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth)
    return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  return (
    minGap +
    (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth))
  );
}

export default function CircularPortfolio({
  items,
  label = "Recent work",
  heading = "A few projects from this year.",
  autoplay = true,
}: CircularPortfolioProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const autoplayIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  const itemsLength = useMemo(() => items.length, [items]);
  const activeItem = useMemo(
    () => items[activeIndex],
    [activeIndex, items]
  );

  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (autoplay) {
      autoplayIntervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % itemsLength);
      }, 5000);
    }
    return () => {
      if (autoplayIntervalRef.current)
        clearInterval(autoplayIntervalRef.current);
    };
  }, [autoplay, itemsLength]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % itemsLength);
    if (autoplayIntervalRef.current)
      clearInterval(autoplayIntervalRef.current);
  }, [itemsLength]);

  const handlePrev = useCallback(() => {
    setActiveIndex(
      (prev) => (prev - 1 + itemsLength) % itemsLength
    );
    if (autoplayIntervalRef.current)
      clearInterval(autoplayIntervalRef.current);
  }, [itemsLength]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handlePrev, handleNext]);

  function getImageStyle(index: number): React.CSSProperties {
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.8;
    const isActive = index === activeIndex;
    const isLeft =
      (activeIndex - 1 + itemsLength) % itemsLength === index;
    const isRight = (activeIndex + 1) % itemsLength === index;

    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: "auto",
        transform: "translateX(0px) translateY(0px) scale(1) rotateY(0deg)",
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
  }

  const quoteVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <section className="cp-section" id="portfolio">
      <div className="cp-wrapper">
        <div className="cp-header">
          <span className="cp-label">{label}</span>
          <h2 className="cp-heading">{heading}</h2>
        </div>

        <div className="cp-grid">
          <div className="cp-images" ref={imageContainerRef}>
            {items.map((item, index) => (
              <img
                key={item.src}
                src={item.src}
                alt={item.title}
                className="cp-image"
                style={getImageStyle(index)}
              />
            ))}
          </div>

          <div className="cp-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                variants={quoteVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <h3 className="cp-title">{activeItem.title}</h3>
                <p className="cp-location">{activeItem.location}</p>
                <motion.p className="cp-description">
                  {activeItem.description.split(" ").map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                      animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.22,
                        ease: "easeInOut",
                        delay: 0.025 * i,
                      }}
                      className="cp-word"
                    >
                      {word}&nbsp;
                    </motion.span>
                  ))}
                </motion.p>
              </motion.div>
            </AnimatePresence>

            <div className="cp-arrows">
              <button
                className="cp-arrow"
                onClick={handlePrev}
                style={{
                  backgroundColor: hoverPrev
                    ? "var(--color-teal-500)"
                    : "var(--color-ink)",
                }}
                onMouseEnter={() => setHoverPrev(true)}
                onMouseLeave={() => setHoverPrev(false)}
                aria-label="Previous project"
              >
                <ArrowLeft size={20} color="var(--color-cream)" />
              </button>
              <button
                className="cp-arrow"
                onClick={handleNext}
                style={{
                  backgroundColor: hoverNext
                    ? "var(--color-teal-500)"
                    : "var(--color-ink)",
                }}
                onMouseEnter={() => setHoverNext(true)}
                onMouseLeave={() => setHoverNext(false)}
                aria-label="Next project"
              >
                <ArrowRight size={20} color="var(--color-cream)" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

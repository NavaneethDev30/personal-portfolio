import React from 'react';
import Image from 'next/image';
import './CoinSlab.css';

interface CoinSlabProps {
  coinImage?: string;
  year?: string;
  title?: string;
  denomination?: string;
  grade?: string;
  notes?: string;
  width?: number | string;
  height?: number | string;
  coinSize?: number | string;
  font?: 'Caveat' | 'Patrick Hand' | 'Kalam';
  className?: string;
}

/**
 * CoinSlab — Standalone React TypeScript Component
 *
 * A realistic coin grading slab display inspired by PCGS/NGC professional holders.
 * Completely self-contained and reusable across any React TypeScript project.
 *
 * @example
 * <CoinSlab
 *   coinImage="/coins/morgan-dollar.png"
 *   year="1898"
 *   title="Morgan Silver Dollar"
 *   grade="XF"
 *   denomination="Silver $1"
 *   width={300}
 *   height={440}
 * />
 */

const CoinSlab: React.FC<CoinSlabProps> = ({
  coinImage,
  year = '',
  title = '',
  denomination = '',
  grade = '',
  notes = '',
  width = 260,
  height = 400,
  coinSize = 70,
  font = 'Caveat',
  className = '',
}) => {
  // Build label content with proper formatting
  const renderLabel = (): React.ReactElement[] => {
    const lines: React.ReactElement[] = [];

    // First line: Year and Grade side by side
    if (year || grade) {
      if (year && grade) {
        lines.push(
          <div key="year-grade" className="coin-slab__label-row">
            <span>{year}</span>
            <span>{grade}</span>
          </div>
        );
      } else {
        lines.push(<div key="year-grade">{year || grade}</div>);
      }
    }

    // Additional lines
    if (denomination) lines.push(<div key="denom">{denomination}</div>);
    if (title) lines.push(<div key="title">{title}</div>);
    if (notes) lines.push(<div key="notes">{notes}</div>);

    // Default placeholder if everything is empty
    if (lines.length === 0) {
      lines.push(
        <div key="placeholder" style={{ opacity: 0.35 }}>
          Coin Label
        </div>
      );
    }

    return lines;
  };

  // Map font name to CSS font-family
  const getFontFamily = (): string => {
    const fontMap: Record<string, string> = {
      caveat: "'Caveat', cursive",
      'patrick hand': "'Patrick Hand', cursive",
      kalam: "'Kalam', cursive",
    };
    return fontMap[font.toLowerCase()] || "'Caveat', cursive";
  };

  // Convert width/height to CSS values
  const getSize = (value: number | string): string => {
    if (typeof value === 'number') return `${value}px`;
    return value;
  };

  return (
    <div
      className={`coin-slab ${className}`.trim()}
      style={{
        ['--coin-slab-width' as any]: getSize(width),
        ['--coin-slab-height' as any]: getSize(height),
        ['--coin-slab-coin-size' as any]: typeof coinSize === 'number' ? `${coinSize}%` : coinSize,
      }}
    >
      {/* Outer plastic casing */}
      <div className="coin-slab__outer">
        {/* Plastic edge highlights */}
        <div className="coin-slab__edge-left" />
        <div className="coin-slab__edge-right" />

        {/* Horizontal seam line */}
        <div className="coin-slab__seam" />

        {/* Inner velvet cavity */}
        <div className="coin-slab__inner">
          {/* White paper label */}
          <div className="coin-slab__label">
            <div
              className="coin-slab__label-text"
              style={{ fontFamily: getFontFamily() }}
            >
              {renderLabel()}
            </div>
          </div>

          {/* Coin display area */}
          <div className="coin-slab__coin-area">
            <div className="coin-slab__coin-window">
              {coinImage ? (
                <Image
                  src={coinImage}
                  alt={title || 'Coin'}
                  width={200}
                  height={200}
                  className="coin-slab__coin-img"
                  draggable={false}
                  priority={false}
                />
              ) : (
                <div className="coin-slab__empty">
                  <span>🪙</span>
                  <small>No image</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinSlab;

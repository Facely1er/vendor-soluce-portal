import React, { useEffect, useRef, useState } from 'react';

interface VendorBlip {
  id: string;
  name: string;
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

interface SonarRadarProps {
  vendors: VendorBlip[];
  height?: number;
}

export default function SonarRadar({ vendors, height = 500 }: SonarRadarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [sweepAngle, setSweepAngle] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(() => 
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    // Listen for theme changes
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    // Set canvas size
    const size = Math.min(container.clientWidth - 40, height);
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const maxRadius = size / 2 - 20;
    const gridColor = isDarkMode ? 'rgba(76, 175, 80, 0.15)' : 'rgba(46, 125, 50, 0.15)';
    const sweepColor = isDarkMode ? 'rgba(76, 175, 80, 0.4)' : 'rgba(46, 125, 50, 0.4)';
    const textColor = isDarkMode ? '#9ca3af' : '#6b7280';

    const drawRadar = () => {
      // Clear canvas
      ctx.clearRect(0, 0, size, size);

      // Draw concentric circles
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (maxRadius / 4) * i, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw crosshairs
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, size);
      ctx.moveTo(0, centerY);
      ctx.lineTo(size, centerY);
      ctx.stroke();

      // Draw angle lines (every 45 degrees)
      for (let angle = 0; angle < 360; angle += 45) {
        const rad = (angle * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(rad) * maxRadius,
          centerY + Math.sin(rad) * maxRadius
        );
        ctx.stroke();
      }

      // Sector labels
      ctx.font = 'bold 11px Inter';
      ctx.fillStyle = textColor;
      ctx.globalAlpha = 0.6;

      // Top - Technology
      ctx.textAlign = 'center';
      ctx.fillText('TECHNOLOGY', centerX, 20);

      // Right - Finance
      ctx.save();
      ctx.translate(size - 20, centerY);
      ctx.rotate(Math.PI / 2);
      ctx.fillText('FINANCE', 0, 0);
      ctx.restore();

      // Bottom - Healthcare
      ctx.fillText('HEALTHCARE', centerX, size - 10);

      // Left - Operations
      ctx.save();
      ctx.translate(20, centerY);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('OPERATIONS', 0, 0);
      ctx.restore();

      ctx.globalAlpha = 1.0;

      // Draw sweep line
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(sweepAngle);

      // Draw sweep gradient
      const gradient = ctx.createLinearGradient(0, 0, maxRadius, 0);
      gradient.addColorStop(0, sweepColor);
      gradient.addColorStop(0.5, sweepColor.replace('0.4', '0.2'));
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, maxRadius, 0, Math.PI / 3);
      ctx.lineTo(0, 0);
      ctx.fill();

      // Draw sweep line
      ctx.strokeStyle = isDarkMode ? '#4caf50' : '#2e7d32';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(maxRadius, 0);
      ctx.stroke();

      ctx.restore();

      // Draw vendor blips
      vendors.forEach(vendor => {
        // Position based on risk score
        const risk = vendor.riskScore;
        const distance = (risk / 100) * maxRadius;

        // Create consistent angle for each vendor based on ID
        let hash = 0;
        for (let i = 0; i < vendor.id.length; i++) {
          hash = vendor.id.charCodeAt(i) + ((hash << 5) - hash);
        }
        const angle = (hash % 360) * (Math.PI / 180);

        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        // Calculate if sweep is near this blip
        const blipAngle = Math.atan2(y - centerY, x - centerX);
        const angleDiff = Math.abs(((sweepAngle - blipAngle + Math.PI) % (Math.PI * 2)) - Math.PI);
        const isNearSweep = angleDiff < Math.PI / 6;

        // Set color based on risk level
        let color: string;
        switch (vendor.riskLevel) {
          case 'Critical':
            color = '#dc2626';
            break;
          case 'High':
            color = '#f59e0b';
            break;
          case 'Medium':
            color = '#3b82f6';
            break;
          default:
            color = '#2e7d32';
        }

        // Draw blip
        ctx.fillStyle = color;
        ctx.shadowBlur = isNearSweep ? 10 : 0;
        ctx.shadowColor = color;

        ctx.beginPath();
        ctx.arc(x, y, isNearSweep ? 6 : 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        // Draw vendor name when sweep is near
        if (isNearSweep) {
          ctx.fillStyle = textColor;
          ctx.font = '10px Inter';
          ctx.textAlign = 'center';
          ctx.fillText(vendor.name, x, y - 12);
        }
      });
    };

    const animate = () => {
      drawRadar();
      setSweepAngle(prev => (prev + 0.02) % (Math.PI * 2));
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [vendors, sweepAngle, isDarkMode, height]);

  return (
    <div className="relative w-full" style={{ minHeight: height }}>
      <div className="relative w-full h-full flex items-center justify-center bg-gray-900 dark:bg-gray-950 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
        {/* Legend */}
        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg">
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600" />
              <span className="text-gray-900 dark:text-white">Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-gray-900 dark:text-white">High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600" />
              <span className="text-gray-900 dark:text-white">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-600" />
              <span className="text-gray-900 dark:text-white">Low</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


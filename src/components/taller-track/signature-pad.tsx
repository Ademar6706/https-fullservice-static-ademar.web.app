"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eraser } from 'lucide-react';

type SignaturePadProps = {
  onEnd: (signature: string) => void;
  signature: string | null;
};

export function SignaturePad({ onEnd, signature }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const getCanvasContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext('2d');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = getCanvasContext();
    if (!canvas || !ctx) return;

    // Set canvas dimensions based on container size
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      if (signature) {
        const img = new Image();
        img.src = signature;
        img.onload = () => ctx.drawImage(img, 0, 0);
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [signature]);

  const getCoords = (e: MouseEvent | TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if (e instanceof MouseEvent) {
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return null;
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const ctx = getCanvasContext();
    const coords = getCoords(e.nativeEvent);
    if (!ctx || !coords) return;
    
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = getCanvasContext();
    const coords = getCoords(e.nativeEvent);
    if (!ctx || !coords) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    if (isDrawing && canvas) {
      onEnd(canvas.toDataURL());
    }
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const ctx = getCanvasContext();
    const canvas = canvasRef.current;
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onEnd('');
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="relative w-full h-48 border-dashed border-2 rounded-lg bg-muted/50 touch-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full"
        />
        {!isDrawing && !signature && (
            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground select-none pointer-events-none">
            Área de Firma
            </p>
        )}
      </div>
      <div className="flex justify-end">
        <Button type="button" variant="ghost" onClick={clearCanvas}>
          <Eraser className="mr-2 h-4 w-4" />
          Limpiar Firma
        </Button>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useRef } from 'react';
import { IResult } from './interface';

const ResultPoster_1 = ({
  imageSrc,
  result,
  number = 1,
  textColor = 'white',
}: {
  imageSrc: string;
  result: IResult;
  number?: number;
  textColor?: 'white' | 'black';
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    try {
      const link = document.createElement("a");
      link.download = `result-${number}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Check CORS or try a different browser.");
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    const img = new Image();
    img.crossOrigin = "anonymous"; // CORS-safe
    img.src = imageSrc;
  
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
  
      // Draw background
      ctx.drawImage(img, 0, 0);
  
      // Setup
      ctx.fillStyle = textColor;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
  
      const marginLeft = 1800;
      let currentY = canvas.height * 0.3;
      const lineSpacing = 150;
  
      // Category
      ctx.font = 'bold 120px sans-serif';
      ctx.fillText(result.category?.name ?? '', marginLeft, currentY);
  
      // Competition
      currentY += lineSpacing;
      ctx.font = 'bold 110px "Brush Script MT", cursive';
      ctx.fillText(result.competition?.name ?? '', marginLeft, currentY);
  
      currentY += lineSpacing;
  
      // Helper to draw bold + regular inline
      const drawNameAndTeam = (label: string, name: string, team: string) => {
        ctx.font = 'bold 100px sans-serif';
        const nameText = `${label}. ${name}`;
        ctx.fillText(nameText, marginLeft, currentY);
        const nameWidth = ctx.measureText(nameText).width;
  
        ctx.font = '100px sans-serif';
        ctx.fillText(` ${team}`, marginLeft + nameWidth + 20, currentY);
        currentY += lineSpacing;
      };
  
      // 1st Place
      if (result.f_name && result.f_team) {
        drawNameAndTeam("1", result.f_name, result.f_team);
      }
  
      // 2nd Place
      if (result.s_name && result.s_team) {
        drawNameAndTeam("2", result.s_name, result.s_team);
      }
  
      // 3rd Place
      if (result.t_name && result.t_team) {
        drawNameAndTeam("3", result.t_name, result.t_team);
      }


      // Result number (centered visually)
      ctx.font = 'bold 550px sans-serif';
      ctx.globalAlpha = 0.5; // Set opacity to 0.5
      ctx.fillText(`#${result.resultNumber}`, 1000, canvas.height * 0.3);
    };
  };
  
  

  useEffect(() => {
    drawCanvas();
  }, [result, imageSrc]);

  return (
    <div className="my-6">
      <canvas ref={canvasRef} className="w-full max-w-2xl mx-auto border" />
      <div className="mt-4 flex justify-center">
        <button
          onClick={downloadImage}
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
        >
          Download Poster
        </button>
      </div>
    </div>
  );
};

export default ResultPoster_1;

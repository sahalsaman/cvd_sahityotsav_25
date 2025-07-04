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
console.log(result);

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
  
      const marginLeft = 840;
      let currentY = canvas.height * 0.23;
  
      // Category
      ctx.font = 'bold 70px sans-serif';
      ctx.fillText(result.category?.name ?? '', marginLeft, currentY);
  
      // Competition
      currentY += 80;
      ctx.font = ' 50px sans-serif';
      ctx.fillText(result.competition?.name ?? '', marginLeft, currentY);
  
      currentY += 110;
  
      // Helper to draw bold + regular inline
      const drawNameAndTeam = (label: string, name: string, team: string) => {
        ctx.font = 'bold 50px sans-serif';
        const nameText = `${label}. ${name}`;
        ctx.fillText(nameText, marginLeft, currentY);
        const nameWidth = ctx.measureText(nameText).width;
  
        ctx.font = '50px sans-serif';
        ctx.fillText(` ${team}`, marginLeft + nameWidth + 20, currentY);
        currentY += 80;
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
      ctx.font = 'bold 300px sans-serif';
      ctx.globalAlpha = 0.5; // Set opacity to 0.5
      ctx.fillText(`#${result.resultNumber}`, 320, canvas.height * 0.22);
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

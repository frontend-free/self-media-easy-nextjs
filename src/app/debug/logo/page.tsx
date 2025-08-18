'use client';

import { useEffect, useRef } from 'react';

function PureLogo({ image }: { image?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 创建下载链接
    const link = document.createElement('a');
    link.download = 'logo.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布尺寸
    const size = 256;
    canvas.width = size;
    canvas.height = size;

    // 绘制内部内容区域
    const contentSize = Math.round(size * 0.78); // 苹果图标风格通常内容区域约占总尺寸的78%
    const contentX = (size - contentSize) / 2;
    const contentY = (size - contentSize) / 2;

    if (image) {
      // 绘制图片
      const img = new Image();
      img.src = image;
      img.onload = () => {
        // 创建圆角裁剪路径
        ctx.beginPath();
        ctx.roundRect(contentX, contentY, contentSize, contentSize, contentSize * 0.23);
        ctx.clip();

        // 绘制图片
        ctx.drawImage(img, contentX, contentY, contentSize, contentSize);
      };
    } else {
      // 背景
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.beginPath();
      // 使用苹果图标风格的圆角，大约为边长的23%
      ctx.roundRect(contentX, contentY, contentSize, contentSize, contentSize * 0.23);
      ctx.fill();

      // 绘制文字
      ctx.fillStyle = 'white';
      ctx.font = 'bold 42px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('短视频', size / 2, size / 2);

      // 绘制文字
      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('工具', size / 2, size - 24 / 2 - 68);
    }
  }, [image]);

  return (
    <div className="p-8">
      <canvas ref={canvasRef} className="shadow-lg" />
      <button
        onClick={handleExport}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        导出 PNG
      </button>
    </div>
  );
}

function Page() {
  return (
    <div className="p-8">
      <PureLogo />
    </div>
  );
}

export default Page;

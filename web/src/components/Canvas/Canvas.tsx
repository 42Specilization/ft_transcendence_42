import { CanvasHTMLAttributes, DetailedHTMLProps, MutableRefObject } from 'react';
import './Canvas.scss';

interface CanvasProps extends
  DetailedHTMLProps<
    CanvasHTMLAttributes<HTMLCanvasElement>,
    HTMLCanvasElement> {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}

export interface Ball {
  x: number;
  y: number;
  radius: number;
  color: string;
}

export interface TextCanvas {
  x: number;
  y: number;
  color: string;
  msg: number | string;
}

export function drawCircle(context: CanvasRenderingContext2D, ball: Ball) {
  context.fillStyle = ball.color;
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
  context.closePath();
  context.fill();
}

export function drawFillRect(context: CanvasRenderingContext2D, rect: Rect) {
  const { x, y, w, h, color } = rect;
  context.fillStyle = color;
  context.fillRect(x, y, w, h);
}

export function drawText(context: CanvasRenderingContext2D, text: TextCanvas) {
  context.fillStyle = text.color;
  context.font = '75px fantasy';
  context.fillText(text.msg.toString(), text.x, text.y);
}

export function drawNet(context: CanvasRenderingContext2D) {
  const net: Rect = {
    x: context.canvas.width / 2 - 2 / 2,
    y: 0,
    w: 5,
    h: 10,
    color: 'WHITE'
  };

  for (let i = 0; i <= context.canvas.height; i += 15) {
    net.y = i;
    drawFillRect(context, net);
  }
}


export function Canvas({ canvasRef, ...props }: CanvasProps) {

  return (
    <canvas
      {...props}
      className='canvas'
      ref={canvasRef}
      width={800}
      height={600}
    />
  );
}
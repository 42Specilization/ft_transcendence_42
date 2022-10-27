import { CanvasHTMLAttributes, DetailedHTMLProps, MutableRefObject } from 'react';
import { Position } from '../../game/gameState';
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
}

export function drawCircle(context: CanvasRenderingContext2D, pos: Position) {
  context.beginPath();
  console.log(pos.x, pos.y);
  context.arc(pos.x, pos.y, 10, 0, 360);
  context.fillStyle = 'black';
  context.fill();
}

export function drawFillRect(context: CanvasRenderingContext2D, rect: Rect) {
  const { x, y, w, h } = rect;
  const color = 'black';

  context.beginPath();
  context.fillStyle = color;

  context.fillRect(x, y, w, h);
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
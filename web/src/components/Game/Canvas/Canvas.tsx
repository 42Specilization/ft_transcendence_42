import { CanvasHTMLAttributes, DetailedHTMLProps, MutableRefObject } from 'react';
import './Canvas.scss';
import imgPowerUp from '../../../assets/powerUp-box.png';


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
  msg?: number | string;
  fontSize?: string;
}

export function drawCircle(context: CanvasRenderingContext2D, ball: Ball) {
  context.fillStyle = ball.color;
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true);
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
  if (!text.fontSize) {
    text.fontSize = '75';
  }
  if (!text.msg) {
    text.msg = '';
  }
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.font = text.fontSize + 'px fantasy';
  context.fillText(text.msg.toString(), text.x, text.y);
}

export function drawNet(context: CanvasRenderingContext2D) {
  const net: Rect = {
    x: context.canvas.width / 2 - 2 / 2,
    y: 0,
    w: 10,
    h: 10,
    color: '#7C1CED'
  };

  for (let i = 0; i <= context.canvas.height; i += 15) {
    net.y = i;
    drawFillRect(context, net);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function drawPowerUpBox(context: CanvasRenderingContext2D, x: number, y: number, img: any) {
  context.drawImage(img, x, y);
}

export function Canvas({ canvasRef, ...props }: CanvasProps) {

  return (
    <div className='canvas'>
      <canvas
        {...props}
        className='canvas__canvas'
        ref={canvasRef}
        width={800}
        height={600}
      />
      <img id='powerUp-box' src={imgPowerUp} className='box-powerUp' />
    </div>
  );
}
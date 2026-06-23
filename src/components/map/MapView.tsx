'use client';

import { useEffect, useRef } from 'react';

import maplibregl from 'maplibre-gl';

import 'maplibre-gl/dist/maplibre-gl.css';

// 서울 시청 기본 중심 좌표
const DEFAULT_CENTER: [number, number] = [126.978, 37.5665];
const DEFAULT_ZOOM = 14;

/**
 * @component
 * @description MapLibre GL JS 기반 지도 뷰어 — vworld 2D 타일 배경 사용
 */
export default function MapView() {
  // MapLibre 인스턴스를 보관하는 ref (리렌더링 시 재생성 방지)
  const mapRef = useRef<maplibregl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const apiKey = process.env.NEXT_PUBLIC_VWORLD_API_KEY;

    mapRef.current = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          vworld: {
            type: 'raster',
            tiles: [
              `https://api.vworld.kr/req/wmts/1.0.0/${apiKey}/Base/{z}/{y}/{x}.png`,
            ],
            tileSize: 256,
            attribution: '© vworld',
          },
        },
        layers: [
          {
            id: 'vworld-layer',
            type: 'raster',
            source: 'vworld',
          },
        ],
      },
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    });

    // 줌 + 나침반 컨트롤 추가
    mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full" />;
}

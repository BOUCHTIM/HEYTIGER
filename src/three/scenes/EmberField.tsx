'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { emberVertexShader, emberFragmentShader } from '../shaders/emberShader';

export interface EmberFieldProps {
  count: number;
  span?: number;
  spread?: [number, number];
  colorHot?: string;
  colorCool?: string;
  opacity?: number;
  parallax?: number;
  sizeRange?: [number, number];
  speedRange?: [number, number];
}

/**
 * A field of GPU-driven glowing embers — used as Hey Tiger's signature
 * three.js moment (warm sparks rising behind the hero title / kanban wall).
 * All per-frame motion happens in the shader; the JS side only updates
 * uTime and a smoothed mouse uniform.
 */
export default function EmberField({
  count,
  span = 6,
  spread = [8, 5],
  colorHot = '#f5c089',
  colorCool = '#c83d20',
  opacity = 0.8,
  parallax = 0.4,
  sizeRange = [2, 7],
  speedRange = [0.15, 0.5],
}: EmberFieldProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));
  const { viewport } = useThree();

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const basePos = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * spread[0];
      const y = Math.random() * span;
      const z = (Math.random() - 0.5) * spread[1];

      positions.set([x, y, z], i * 3);
      basePos.set([x, y, z], i * 3);

      const rise = THREE.MathUtils.lerp(speedRange[0], speedRange[1], Math.random());
      const swayFreq = THREE.MathUtils.lerp(0.2, 0.8, Math.random());
      const swayAmp = THREE.MathUtils.lerp(0.05, 0.3, Math.random());
      seeds.set([rise, swayFreq, swayAmp], i * 3);

      sizes[i] = THREE.MathUtils.lerp(sizeRange[0], sizeRange[1], Math.random());
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aBasePos', new THREE.BufferAttribute(basePos, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [count, span, spread, sizeRange, speedRange]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uSpan: { value: span },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uParallax: { value: parallax },
      uColorHot: { value: new THREE.Color(colorHot) },
      uColorCool: { value: new THREE.Color(colorCool) },
      uOpacity: { value: opacity },
    }),
    [span, parallax, colorHot, colorCool, opacity],
  );

  useFrame((state) => {
    const mat = materialRef.current;
    if (!mat) return;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uPixelRatio.value = state.viewport.dpr;

    // smooth cursor → NDC-ish offset, scaled by viewport size
    mouse.current.lerp(
      new THREE.Vector2(state.pointer.x * viewport.width * 0.5, state.pointer.y * viewport.height * 0.5),
      0.05,
    );
    mat.uniforms.uMouse.value.copy(mouse.current);
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={emberVertexShader}
        fragmentShader={emberFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

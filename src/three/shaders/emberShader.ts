/**
 * Ember particle shader — GPU-driven drift/sway/twinkle for a soft glowing
 * spark field. All motion lives in the vertex shader (uTime-driven), so the
 * CPU does zero per-frame work beyond updating one uniform.
 */

export const emberVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSpan;
  uniform vec2 uMouse;
  uniform float uParallax;

  attribute vec3 aBasePos; // random seed position within the box
  attribute vec3 aSeed;    // x: rise speed, y: sway frequency, z: sway amplitude
  attribute float aSize;

  varying float vTwinkle;

  void main() {
    vec3 pos = aBasePos;

    // vertical rise, wraps within [-uSpan/2, uSpan/2]
    float rise = mod(uTime * aSeed.x + aBasePos.y, uSpan);
    pos.y = -uSpan * 0.5 + rise;

    // horizontal sway
    pos.x += sin(uTime * aSeed.y + aBasePos.z * 6.2831) * aSeed.z;

    // gentle cursor parallax
    pos.xy += uMouse * uParallax;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // twinkle: fades in/out as the ember rises, independent flicker on top
    float lifeFade = sin((rise / uSpan) * 3.14159265);
    float flicker = 0.6 + 0.4 * sin(uTime * 3.0 + aBasePos.x * 12.0);
    vTwinkle = lifeFade * flicker;

    // aSize ~= desired on-screen px at z≈0 (camera sits 5 units back)
    gl_PointSize = aSize * uPixelRatio * (5.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const emberFragmentShader = /* glsl */ `
  uniform vec3 uColorHot;
  uniform vec3 uColorCool;
  uniform float uOpacity;

  varying float vTwinkle;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float glow = smoothstep(0.5, 0.0, d);
    vec3 color = mix(uColorCool, uColorHot, vTwinkle);

    gl_FragColor = vec4(color, glow * vTwinkle * uOpacity);
  }
`;

uniform float uProgress;

varying vec2 vUv;

void main() {
  vUv = uv;

  vec3 mvPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  vec4 projectionPos = projectionMatrix * vec4(mvPosition, 1.0);
  vec4 fullPos = vec4(position, 1.0);
  
  gl_Position = mix(projectionPos, fullPos, uProgress);
}
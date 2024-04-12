uniform float uProgress;

uniform vec2 uViewSize;

varying vec2 vUv;

void main() {
  vUv = uv;

  vec3 defaultPos = position;
  vec3 fullScreenPos = position * vec3(uViewSize, 1.0);

  vec3 pos = mix(defaultPos, fullScreenPos, uProgress);
  vec3 mvPosition = (modelViewMatrix * vec4(pos, 1.0)).xyz;
  
  gl_Position = projectionMatrix * vec4(mvPosition, 1.0);
}
#define TAU 6.2831855
#define PI 3.1415926538

uniform float uTime;
uniform float uProgress;
uniform float uAnimation;
uniform float uAnimation2;
uniform vec2 uViewSize;

varying vec2 vUv;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

mat4 rotation3d(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;

  return mat4(
    oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
    oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
    oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
    0.0,                                0.0,                                0.0,                                1.0
  );
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
  return (rotation3d(axis, angle) * vec4(v, 1.0)).xyz;
}

void main() {
  vUv = uv;

  float phase = uAnimation * PI;
  float amp = cos(uAnimation2 * PI * 2.0 + PI) * 0.5 + 0.5;
  float displacement = vUv.y * 2.0 * amp;
  float angle = phase + displacement;

  vec3 finalPos = rotate(position, vec3(0.0, 1.0, 0.0), angle);
  finalPos = mix(finalPos, finalPos * vec3(uViewSize, 1.0), uAnimation);

  vec3 mvPosition = (modelViewMatrix * vec4(finalPos, 1.0)).xyz;
  
  gl_Position = projectionMatrix * vec4(mvPosition, 1.0);
}
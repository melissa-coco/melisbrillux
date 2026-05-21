// GLSL Shader sources for WebGL2

const vertexShaderSource = `#version 300 es
in vec2 aPosition;
in vec2 aTexCoord;
out vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

const fragmentShaderSource = `#version 300 es
precision highp float;

in vec2 vTexCoord;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;
uniform float uNoiseIntensity;
uniform float uSpeed;
uniform vec3 uColor;
uniform vec3 uStrokeColor;

// Simplex noise 3D — Stefan Gustavson / Ashima Arts
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v   - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - 0.5;
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  vec4 j = p - 49.0 * floor(p * (1.0 / 49.0));
  vec4 x_ = floor(j * (1.0 / 7.0));
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = (x_ * 2.0 + 0.5) / 7.0 - 1.0;
  vec4 y = (y_ * 2.0 + 0.5) / 7.0 - 1.0;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  vec4 m2 = m * m;
  vec4 gx = vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3));
  return 105.0 * dot(m2, gx);
}

void main() {
  vec2 uv = vTexCoord;
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);

  float t = uTime * uSpeed;
  float nx = snoise(vec3(uv.x * 3.0 + 1.2, uv.y * 3.0, t * 0.8));
  float ny = snoise(vec3(uv.x * 3.0, uv.y * 3.0 + 2.3, t * 0.7));
  float nr = snoise(vec3(uv.x * 3.0 + 4.1, uv.y * 3.0 + 1.7, t * 0.6));

  vec2 offset = vec2(nx, ny) * uNoiseIntensity * 0.02;
  vec2 distortedUv = uv + offset;

  float angle = nr * uNoiseIntensity * 0.05;
  vec2 center = vec2(0.5);
  vec2 rel = distortedUv - center;
  float cosA = cos(angle);
  float sinA = sin(angle);
  rel = vec2(rel.x * cosA - rel.y * sinA, rel.x * sinA + rel.y * cosA);
  vec2 finalUv = rel + center;

  vec4 texColor = texture(uTexture, finalUv);

  if (texColor.a < 0.1) {
    fragColor = vec4(0.0, 0.0, 0.0, 0.0);
    return;
  }

  float isFill = texColor.r;
  float isStroke = texColor.g;
  vec3 finalColor;
  if (isFill > 0.3) {
    finalColor = uColor;
  } else if (isStroke > 0.3) {
    finalColor = uStrokeColor;
  } else {
    finalColor = uColor;
  }

  fragColor = vec4(finalColor, texColor.a);
}
`

export { vertexShaderSource, fragmentShaderSource }

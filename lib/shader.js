const VS = {};

VS.Screen = `#version 300 es
in vec3 position;
out vec2 uv;
void main() {
    vec3 pos = position;
    uv = pos.xy * 0.5 + 0.5;
    gl_Position = vec4(pos, 1.0);
}`;

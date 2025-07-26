const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("webgpu");

const shaders = `
struct VertexOut {
  @builtin(position) position : vec4f,
  @location(0) color : vec4f
}

@vertex
fn vertex_main(@location(0) position: vec3f,
               @location(1) color: vec4f) -> VertexOut
{
  var output : VertexOut;
  output.position = vec4f(position, 1.0f);
  output.color = color;
  return output;
}

@fragment
fn fragment_main(fragData: VertexOut) -> @location(0) vec4f
{
  return fragData.color;
}
`;

const vertices = new Float32Array([
    0.0, 0.6, 0,
    1, 0, 0, 1,
    -0.5, -0.6, 0,
    0, 1, 0, 1,
    0.5, -0.6, 0,
    0, 0, 1, 1,
]);

async function init() {
    if (!navigator.gpu) {
        console.log('error');
        return;
    }

    const adapter = await navigator.gpu.requestAdapter();
    const device = await adapter.requestDevice();

    const shaderModule = device.createShaderModule({
        code: shaders,
    });

    ctx.configure({
        device: device,
        format: navigator.gpu.getPreferredCanvasFormat(),
        alphaMode: 'premultiplied'
    });

}

init();
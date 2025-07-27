const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("webgpu");

const shaders = `
struct VertexOut {
  @builtin(position) position : vec4f,
  @location(0) color : vec4f
}

@vertex
fn vertex_main(@location(0) position: vec4f,
               @location(1) color: vec4f) -> VertexOut
{
  var output : VertexOut;
  output.position = position;
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
     0.0,  0.6, 0, 1, 1, 0, 0, 1,
    -0.7, -0.6, 0, 1, 0, 1, 0, 1,
     0.7, -0.6, 0, 1, 0, 0, 1, 1,
]);

const vertexBuffers = [
    {
        attributes: [
            {
                shaderLocation: 0,
                offset: 0,
                format: 'float32x4'
            },
            {
                shaderLocation: 1,
                offset: 16,
                format: 'float32x4'
            }
        ],
        arrayStride: 32,
        stepMode: 'vertex'
    }
];

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

    const vertexBuffer = device.createBuffer({
        size: vertices.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(vertexBuffer, 0, vertices, 0, vertices.length);

    const pipelineDescriptor = {
        vertex: {
            module: shaderModule,
            entryPoint: 'vertex_main',
            buffers: vertexBuffers
        },
        fragment: {
            module: shaderModule,
            entryPoint: 'fragment_main',
            targets: [
                {
                    format: navigator.gpu.getPreferredCanvasFormat()
                }
            ]
        },
        primitive: {
            topology: 'triangle-list'
        },
        layout: 'auto'
    };

    const renderPipeline = device.createRenderPipeline(pipelineDescriptor);
    const commandEncoder = device.createCommandEncoder();

    const clearColor = { r: 0.0, g: 0.5, b: 1.0, a: 1.0 };
    const renderPassDescriptor = {
        colorAttachments: [
            {
                clearValue: clearColor,
                loadOp: 'clear',
                storeOp: 'store',
                view: ctx.getCurrentTexture().createView()
            }
        ]
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

    passEncoder.setPipeline(renderPipeline);
    passEncoder.setVertexBuffer(0, vertexBuffer);
    passEncoder.draw(3);
    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);
}

init();
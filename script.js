// Makes a request to Modal using data on webpage, then updates webpage

const MODAL_URL = "https://hilberttyler1--pytorch-perf-pytorch-perf-dev.modal.run";

async function sendText() {
    // Get elements
    const model_code = document.getElementById("model_code").value;
    const A = document.getElementById("A").value;
    const B = document.getElementById("B").value;
    const resultEl = document.getElementById("result");
    const errorEl = document.getElementById("error");
    const btn = document.getElementById("btn");

    // Update elements while loading
    resultEl.textContent = "";
    errorEl.textContent = "";
    btn.disabled = true;
    btn.textContent = "This may take a minute...";

    try {
        // Make request
        const response = await fetch(MODAL_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
                {
                    model_code: model_code,
                    A: A,
                    B: B
                }
        )});

        const data = await response.json();

        // Update webpage
        resultEl.innerHTML = `
            <table>
                <tr><td>Device</td>    <td>${data.device}</td></tr>
                <tr><td>Mean</td>      <td>${data.mean_ms} ms</td></tr>
                <tr><td>Min</td>       <td>${data.min_ms} ms</td></tr>
                <tr><td>Max</td>       <td>${data.max_ms} ms</td></tr>
                <tr><td>p50</td>       <td>${data.p50_ms} ms</td></tr>
                <tr><td>p95</td>       <td>${data.p95_ms} ms</td></tr>
                <tr><td>Trials</td>    <td>${data.num_trials}</td></tr>
                <tr><td>Warmup</td>    <td>${data.num_warmup}</td></tr>
            </table>
        `;

    } catch (err) {
        // Display error
        //errorEl.textContent = "Error: " + err.message;
        errorEl.textContent = "Error: server not running, contact HilbertTyler1@gmail.com for demo.";
    } finally {
        // Re-enable button
        btn.disabled = false;
        btn.textContent = "Send";
    }
}

// Preset values
const PRESETS = {
    matmul: {
        model_code:
`
class Model(nn.Module):
    def forward(self, A, B):
        return torch.matmul(A, B)
`.trim(),
        A: "A = torch.rand(4096, 4096)",
        B: "B = torch.rand(4096, 4096)"
    },
    scalar: {
        model_code:
`
class Model(nn.Module):
    def forward(self, A, B):
        return A * B
`.trim(),
        A: "A = torch.rand(4096, 4096)",
        B: "B = torch.tensor(2.0)"
    },
    triu: {
        model_code:
`
class Model(nn.Module):
    def forward(self, A, B):
        return torch.triu(A)
`.trim(),
        A: "A = torch.rand(4096, 4096)",
        B: "B = None"
    }
};

// Updates page will preset values
function fillPreset(name) {
    const preset = PRESETS[name];
    document.getElementById("model_code").value = preset.model_code;
    document.getElementById("A").value = preset.A;
    document.getElementById("B").value = preset.B;
}


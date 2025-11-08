// app.js — client logic
(() => {
  const promptEl = document.getElementById('prompt');
  const alphaEl = document.getElementById('alpha');
  const alphaValueEl = document.getElementById('alpha-value');
  const generateBtn = document.getElementById('generate-btn');
  const statusEl = document.getElementById('status');
  const baseOut = document.getElementById('base-output');
  const steeredOut = document.getElementById('steered-output');
  const baseEndpointEl = document.getElementById('base-endpoint');
  const steeredEndpointEl = document.getElementById('steered-endpoint');
  const copyPromptBtn = document.getElementById('copy-prompt');
  const copyBaseBtn = document.getElementById('copy-base');
  const copySteeredBtn = document.getElementById('copy-steered');
  const modelSelect = document.getElementById('model-select');
  const embedArea = document.getElementById('embed-area');
  const embedWrapper = document.getElementById('embed-wrapper');

  // From config.js
  const BASE_API = (typeof BASE_API_URL !== 'undefined') ? BASE_API_URL.trim() : "";
  const STEERED_API = (typeof STEERED_API_URL !== 'undefined') ? STEERED_API_URL.trim() : "";
  const GRADIO_EMBED = (typeof GRADIO_EMBED_URL !== 'undefined') ? GRADIO_EMBED_URL.trim() : "";

  baseEndpointEl.textContent = BASE_API || "(not configured)";
  steeredEndpointEl.textContent = STEERED_API || GRADIO_EMBED || "(not configured)";

  // slider UI
  alphaEl.addEventListener('input', () => {
    alphaValueEl.textContent = alphaEl.value;
  });

  copyPromptBtn.addEventListener('click', async () => {
    await navigator.clipboard.writeText(promptEl.value || "");
    statusEl.textContent = "Prompt copied";
    setTimeout(()=>statusEl.textContent="Ready",1200);
  });
  copyBaseBtn.addEventListener('click', async () => {
    await navigator.clipboard.writeText(baseOut.textContent || "");
    statusEl.textContent = "Base generation copied";
    setTimeout(()=>statusEl.textContent="Ready",1200);
  });
  copySteeredBtn.addEventListener('click', async () => {
    await navigator.clipboard.writeText(steeredOut.textContent || "");
    statusEl.textContent = "Steered generation copied";
    setTimeout(()=>statusEl.textContent="Ready",1200);
  });

  modelSelect.addEventListener('change', () => {
    if (modelSelect.value === 'embed') {
      embedArea.classList.remove('hidden');
      // embed gradio if available
      embedWrapper.innerHTML = "";
      if (GRADIO_EMBED) {
        const iframe = document.createElement('iframe');
        iframe.src = GRADIO_EMBED;
        iframe.width = "100%";
        iframe.height = "700";
        iframe.style.border = "1px solid rgba(255,255,255,0.04)";
        iframe.loading = "lazy";
        embedWrapper.appendChild(iframe);
      } else {
        embedWrapper.innerHTML = "<div style='color:#f5b3b3'>GRADIO_EMBED_URL not configured in config.js</div>";
      }
    } else {
      embedArea.classList.add('hidden');
      embedWrapper.innerHTML = "";
    }
  });

  async function callApi(url, payload, timeout=120000) {
    // returns { ok: bool, text: string, error: string|null }
    if (!url) return { ok:false, text:"", error:"URL not configured" };
    try {
      const controller = new AbortController();
      const id = setTimeout(()=>controller.abort(), timeout);
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(id);
      if (!r.ok) {
        const txt = await r.text().catch(()=>"");
        return { ok:false, text:"", error:`HTTP ${r.status}: ${txt}` };
      }
      const j = await r.json();
      if (j.generation || j.text || j.output) {
        return { ok:true, text: j.generation || j.text || j.output, error:null };
      }
      // fallback - stringify
      return { ok:true, text: JSON.stringify(j, null, 2), error:null };
    } catch (err) {
      return { ok:false, text:"", error: err.message || String(err) };
    }
  }

  generateBtn.addEventListener('click', async () => {
    const prompt = promptEl.value.trim();
    if (!prompt) {
      statusEl.textContent = "Please enter a prompt";
      return;
    }
    const alpha = parseFloat(alphaEl.value);
    statusEl.textContent = "Generating...";

    // Start both requests concurrently where possible
    baseOut.textContent = "Generating...";
    steeredOut.textContent = "Generating...";

    // Call base model API (if configured) else show message
    const basePromise = (BASE_API) ? callApi(BASE_API, { prompt, alpha }) : Promise.resolve({ ok:false, text:"", error:"BASE API not configured in config.js" });
    // For steered: either API or embed mode (embed does not support programmatic call)
    let steeredPromise;
    if (modelSelect.value === 'embed') {
      steeredPromise = Promise.resolve({ ok:false, text:"Embedded UI: use that widget to generate", error:null });
    } else {
      steeredPromise = (STEERED_API) ? callApi(STEERED_API, { prompt, alpha }) : Promise.resolve({ ok:false, text:"", error:"STEERED API not configured in config.js" });
    }

    const [baseRes, steerRes] = await Promise.all([basePromise, steeredPromise]);

    if (baseRes.ok) baseOut.textContent = baseRes.text;
    else baseOut.textContent = `ERROR: ${baseRes.error || "unknown"}`;

    if (steerRes.ok) steeredOut.textContent = steerRes.text;
    else steeredOut.textContent = steerRes.text || `ERROR: ${steerRes.error || "unknown"}`;

    statusEl.textContent = "Done";
    setTimeout(()=>statusEl.textContent="Ready", 1200);
  });

  // On load: show endpoints
  document.addEventListener('DOMContentLoaded', () => {
    baseEndpointEl.textContent = BASE_API || "(not configured)";
    steeredEndpointEl.textContent = STEERED_API || GRADIO_EMBED || "(not configured)";
    if (GRADIO_EMBED) {
      modelSelect.value = 'embed';
      modelSelect.dispatchEvent(new Event('change'));
    }
  });

})();

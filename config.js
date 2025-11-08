// CONFIG: set these to your deployed endpoints or leave blank
// API contract expected:
// POST { prompt: "...", alpha: 1.2 }  ->  JSON { generation: "..." }

const BASE_API_URL = ""   // e.g. "https://api.example.com/generate_base"
const STEERED_API_URL = "" // e.g. "https://api.example.com/generate_steered"
const GRADIO_EMBED_URL = "" // e.g. "https://your-gradio-space.hf.space" or blank

// If you want to force use embed override in UI default: set GRADIO_EMBED_URL

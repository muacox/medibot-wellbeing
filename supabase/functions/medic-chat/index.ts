const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, model } = await req.json();
    const ALLOWED = new Set([
      "google/gemini-3-flash-preview",
      "google/gemini-2.5-pro",
      "openai/gpt-5-mini",
      "openai/gpt-5",
    ]);
    const selectedModel = ALLOWED.has(model) ? model : "google/gemini-3-flash-preview";
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY não configurada");

    const systemPrompt = `Você é o MedicTech AI, um assistente médico de triagem em português brasileiro.
Regras:
- NUNCA forneça diagnóstico definitivo. Sempre lembre que não substitui consulta médica.
- Faça perguntas de acompanhamento quando faltar contexto (duração, intensidade, idade, condições prévias).
- Sugira possíveis condições com nível de probabilidade (alta/média/baixa) quando apropriado.
- Dê recomendações práticas: cuidados em casa, sinais de alerta, quando procurar pronto-socorro.
- Seja claro, empático, conciso. Use listas quando ajudar a leitura.
- Em sintomas graves (dor no peito, falta de ar súbita, sangramento intenso, perda de consciência), oriente buscar emergência IMEDIATAMENTE.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições atingido. Aguarde alguns instantes." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos da IA esgotados." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro na IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("medic-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
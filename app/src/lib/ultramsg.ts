export async function sendWhatsAppMessage(
  _to: string,
  _body: string
): Promise<{ sent: string; message: string }> {
  console.log("[mock] WhatsApp message skipped — no backend");
  return { sent: "ok", message: "Mock: message not sent" };
}

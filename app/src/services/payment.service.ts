export async function createPaymentIntent(
  _orderId: string
): Promise<{ clientSecret: string }> {
  return { clientSecret: "mock_client_secret" };
}

export async function handleWebhookEvent(_event: unknown): Promise<void> {}

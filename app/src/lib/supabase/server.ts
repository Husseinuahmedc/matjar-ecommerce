export async function createSupabaseServerClient() {
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async () => ({ data: null, error: { message: "Not implemented" } }),
      signUp: async () => ({ data: null, error: { message: "Not implemented" } }),
      signOut: async () => ({ error: null }),
      resend: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ error: null }),
      updateUser: async () => ({ data: null, error: null }),
      exchangeCodeForSession: async () => ({ error: null }),
    },
  } as any;
}

export async function createSupabaseServiceClient() {
  return createSupabaseServerClient();
}

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

interface AuthState {
  loading: boolean;
  user: User | null;
  isAdmin: boolean;
}

async function getIsAdmin(userId: string): Promise<boolean> {
  if (!supabase) return false;

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return false;
  return data.role === "admin";
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    loading: true,
    user: null,
    isAdmin: false,
  });

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setState({ loading: false, user: null, isAdmin: false });
      return;
    }

    let isMounted = true;

    const applySession = async (user: User | null) => {
      if (!isMounted) return;

      if (!user) {
        setState({ loading: false, user: null, isAdmin: false });
        return;
      }

      const isAdmin = await getIsAdmin(user.id);
      if (!isMounted) return;
      setState({ loading: false, user, isAdmin });
    };

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      await applySession(data.session?.user ?? null);
    };

    void init();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(prev => ({ ...prev, loading: true }));
      void applySession(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  return state;
}

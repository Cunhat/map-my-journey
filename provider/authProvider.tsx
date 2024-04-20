import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthData = {
  session: Session | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthData>({
  session: null,
  isLoading: true,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);

      //   if (session) {
      //     // fetch profile
      //     const { data } = await supabase
      //       .from("profiles")
      //       .select("*")
      //       .eq("id", session.user.id)
      //       .single();
      //   }

      setIsLoading(false);
    };

    fetchSession();
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

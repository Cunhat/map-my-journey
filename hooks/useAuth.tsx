import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useAuth = () => {
  const { isPending, error, data, isSuccess, isFetching } = useQuery({
    queryKey: ["getSession"],
    queryFn: async () => {
      return await supabase.auth.getSession();
    },
  });

  return { data, isPending, error };
};

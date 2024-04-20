import { supabase } from "@/lib/supabase";

export const useGetUser = () => {
  const getUser = async () => {
    const { data } = await supabase.auth.getSession();
    return data?.session?.user;
  };

  return { getUser };
};

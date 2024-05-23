import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const useAuth = () => {
  const router = useRouter();
  const [loading, setloading] = useState<boolean>(false);
  const signOut = async () => {
    try {
      setloading(false);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "applcation/json",
          },
        }
      );
      if (!res.ok) {
        setloading(false);
        throw new Error();
      }
      setloading(true);
      toast.success("SigneOut successfully");
      router.push("/sign-in");
      router.refresh();
    } catch (err) {
      setloading(false);
      toast.error("could'nt signout, please try again");
    }
  };
  return { signOut, loading };
};

"use client";

import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthCredentials, authCredentialsValidator } from "@/lib/validator";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

export default function signUp() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isSeller = searchParams.get("as") === "seller";
  const origin = searchParams.get("origin");

  const continueAsSeller = () => {
    router.push("?as=seller");
  };
  const continueAsBuyer = () => {
    router.replace("/sign-in", undefined);
  };

  //react-hook-form client side validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthCredentials>({
    resolver: zodResolver(authCredentialsValidator),
  });

  const { mutate: signInUser, isLoading } = trpc.auth.signin.useMutation({
    onSuccess: () => {
      toast.success("Signed in successfully");
      router.refresh();
      if (origin) {
        router.push(`/${origin}`);
      }
      if (isSeller) {
        router.push("/sell");
        return;
      }
      router.push("/");
      router.refresh();
    },
    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") {
        toast.error("Invalid email or password");
      }
    },
  });

  function onSubmit({ email, password }: AuthCredentials) {
    signInUser({ email, password });
  }

  return (
    <>
      <div className='container relative flex pt-20 flex-col items-center justify-center lg:px-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w[350px]'>
          <div className='flex flex-col items-center space-y-2 text-center'>
            <Icons.logo className='w-20 h-20' />
            <h1 className='text-2xl font-bold'>
              Sign in to your {isSeller ? "Seller account" : "Account"}
            </h1>
            <Link
              className={buttonVariants({
                variant: "link",
                className: "gap-1.5",
              })}
              href='/sign-up'
            >
              Doesn't have an account? Sign-up
              <ArrowRight className='w-4 h-4' />
            </Link>
          </div>
          <div className='grid gap-6'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='grid gap-2'>
                <div className='grid gap-1 py-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    {...register("email")}
                    className={cn({
                      "focus-visible:ring-red-500": errors.email,
                    })}
                    placeholder='you@example.com'
                  />
                  {errors?.email && (
                    <p className='text-sm text-red-500'>
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className='grid gap-1 py-2'>
                  <Label htmlFor='email'>Password</Label>
                  <Input
                    {...register("password")}
                    type='password'
                    className={cn({
                      "focus-visible:ring-red-500": errors.password,
                    })}
                    placeholder='password'
                  />
                  {errors?.password && (
                    <p className='text-sm text-red-500'>
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <Button disabled={isLoading}>Sign In</Button>
              </div>
            </form>

            <div className='relative'>
              <div
                aria-hidden='true'
                className='absolute inset-0 flex items-center'
              >
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs  uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  or
                </span>
              </div>
            </div>
            {isSeller ? (
              <Button
                onClick={continueAsBuyer}
                variant='secondary'
                disabled={isLoading}
              >
                Continue as Seller
              </Button>
            ) : (
              <Button
                onClick={continueAsSeller}
                disabled={isLoading}
                isLoading={isLoading}
                variant='secondary'
              >
                Continue as Customer
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

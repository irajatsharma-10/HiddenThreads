"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useTheme } from "next-themes";

import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

export default function SigninForm() {
  const router = useRouter();
  const { toast } = useToast();

  const {theme} = useTheme();

  const isDarkMode = theme === 'dark';
  const containerBg = isDarkMode
    ? "bg-gradient-to-r from-slate-900 to-slate-700"
    : "bg-gray-100";
    const headingText = isDarkMode ? "" : "text-gray-900";
  // const cardBg = isDarkMode ? "" : "bg-white";
  // const cardText = isDarkMode ? "" : "text-gray-900";

  const register = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    console.log("Sign in result", result);
    if (result?.error) {
      toast({
        title: "Login Failed",
        variant: "destructive",
        description: "Incorrect username or password ",
      });
    }
    if (result?.url) {
      router.replace("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className={`w-full max-w-md p-8 space-y-8 rounded-lg shadow-md ${containerBg}`}>
        <div className="text-center">
          <h1 className={`text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 ${headingText}`}>
            Sign In
          </h1>
          <p className="mb-4">Let the mystery begins!</p>
        </div>
        <Form {...register}>
          <form
            onSubmit={register.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              name="identifier"
              control={register.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                </FormItem>
              )}
            />
            {/* name attribute in form field is critical for uniquely identifying the input field within the form */}
            <FormField
              name="password"
              control={register.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

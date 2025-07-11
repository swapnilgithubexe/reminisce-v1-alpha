import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { login } from "../lib/api";
import { MessagesSquare } from "lucide-react";
import { Link } from "react-router";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {
    mutate: loginMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: login,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* LOGIN FORM */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* LOGO */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <MessagesSquare className="size-9 text-primary mr-2" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Reminisce
            </span>
          </div>

          {/* ERROR MESSAGES */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>
                {error?.response?.data?.message || error?.response?.data}
              </span>
            </div>
          )}

          {/* LOGIN FORM */}
          <div className="w-full">
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Welcome Back</h2>
                  <p className="text-sm opacity-70">
                    <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#1fb854] to-[#158a3c]">
                      Log In
                    </span>{" "}
                    to continue your language journey
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="form-control w-full space-y-2">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      className="input input-bordered w-full mb-2"
                      placeholder="John.doe@example.com"
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      value={loginData.email}
                      required
                    />
                  </div>

                  <div className="form-control w-full space-y-2 ">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="**********"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      required
                      className="input input-bordered w-full mb-2"
                    />
                  </div>

                  {/* Remember me */}
                  <div className="form-control mb-2">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        required
                      />
                      <span className="text-primary text-sm">Remember me</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full mb-2 flex items-center justify-center gap-2"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <span className="text-white">Please wait</span>
                        <span className="dot-animate flex gap-[2px]">
                          <span className="w-[4px] h-[4px] bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="w-[4px] h-[4px] bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="w-[4px] h-[4px] bg-white rounded-full animate-bounce"></span>
                        </span>
                      </>
                    ) : (
                      "Log in"
                    )}
                  </button>

                  <div className="text-center mt-4">
                    <p className="text-sm">
                      Don't have an account?{" "}
                      <Link
                        to="/signup"
                        className="text-primary hover:underline"
                      >
                        Create one
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* ILLUSTRATION */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="loginLogo.png" alt="language connection illustration" />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">
                Connect with your language partners worldwide
              </h2>
              <p className="text-sm opacity-70">
                Practice conversations, make new friends, and improve your
                learning language
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

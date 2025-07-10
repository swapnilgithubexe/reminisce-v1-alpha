import React, { useState } from "react";
import { MessagesSquare } from "lucide-react";
import { Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api";

const SignUpPage = () => {
  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {
    mutate: signUpMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: signup,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    signUpMutation(signUpData);
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* SIGNUP FORM - LEFT SIDE*/}

        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* LOGO */}
          <div className="flex mb-4 items-center justify-start gap-2">
            <MessagesSquare className="size-9 text-primary mr-2" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Reminisce
            </span>
          </div>

          {/* ERROR MESSAGES IF ANY */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>
                {error?.response?.data?.message || error?.response?.data}
              </span>
            </div>
          )}

          {/* SIGNUP FORM */}
          <div className="w-full">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold animate-pulse">
                    Create an account
                  </h2>
                  <p className="text-sm opacity-70">
                    Join{" "}
                    <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#1fb854] to-[#158a3c]">
                      Reminsce
                    </span>{" "}
                    and start your friendship journey
                  </p>
                </div>
                {/* FULL NAME */}
                <div className="space-y-3">
                  <div className="form-control w-full space-y-0.5">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="input input-bordered w-full"
                      value={signUpData.fullName}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          fullName: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* EMAIL */}

                  <div className="form-control w-full space-y-0.5">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="John@gmail.com"
                      className="input input-bordered w-full"
                      value={signUpData.email}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* PASSWORD */}

                  <div className="form-control w-full space-y-0.5">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="**********"
                      className="input input-bordered w-full"
                      value={signUpData.password}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          password: e.target.value,
                        })
                      }
                    />
                    <p className="text-xs opacity-70 mt-1">
                      Password must be at least 10 characters
                    </p>

                    {/* TERMS & CONDITIONS */}
                    <div className="form-control">
                      <label className="label cursor-pointer justify-start gap-2">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          required
                        />
                        <span className="text-primary hover:underline">
                          terms of service
                        </span>{" "}
                        &{" "}
                        <span className="text-primary hover:underline">
                          privacy policy
                        </span>
                      </label>
                    </div>
                  </div>

                  <button className="btn btn-primary w-full" typse="submit">
                    {isPending ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>

                  <div className="text-center mt-4">
                    <p>
                      Already have an account?{" "}
                      <Link to="/login" className="hover:underline">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* SIGN UP FORM RIGHT SIDE*/}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/11 items-center justify-center">
          <div className="max-w-md p-8">
            {/* ILLUSTRATION */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/chatLogo.png"
                alt="chat app illustration"
                className="w-full h-full"
              />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">
                Connect with friends worldwide
              </h2>
              <p className="opacity-70">
                Practice conversation, make friends, and improve your skills
                together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

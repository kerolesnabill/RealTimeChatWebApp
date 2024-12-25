import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Signup = () => {
  const { isLoading, isAuthenticated } = useAuth();
  const navigator = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) navigator("/");
  }, [isLoading]);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const signupMutation = useMutation({
    mutationFn: (data: {}) => apiClient.post("users/register", data),
    onSuccess: () =>
      setSuccessMessage("Account created successfully! Please login."),
    onError: (error: any) => {
      console.log(error);
      const errors = error?.response?.data?.errors;
      const err = error?.response?.data?.error;

      if (errors != null) {
        const [msg] = Object.values(errors)[0] as string[];
        setError(msg);
      } else if (err) setError(err);
      else setError("Signup failed. Please try again.");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    signupMutation.mutate(formData);
  };

  return (
    <div className="hero min-h-screen text-white">
      <div className="hero-content flex-col lg:flex-row-reverse gap-8">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Join the Chat World!</h1>
          <p className="py-6">
            Connect, communicate, and collaborate. Sign up now to be part of an
            amazing community!
          </p>
        </div>

        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 text-gray-800">
          <div className="card-body">
            <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="input input-bordered"
                  minLength={1}
                  maxLength={50}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="username"
                  name="username"
                  placeholder="Your Username"
                  className="input input-bordered"
                  minLength={3}
                  maxLength={20}
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="input input-bordered"
                  minLength={6}
                  maxLength={255}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mt-4 text-sm font-semibold">
                {<p className="text-green-800 text-center">{successMessage}</p>}

                {<p className="text-red-600 text-center">{error}</p>}
              </div>
              <div className="form-control mt-6">
                <button
                  type="submit"
                  className={`btn btn-primary`}
                  disabled={signupMutation.isPending}
                >
                  {signupMutation.isPending
                    ? "Signing Up..."
                    : "Create Account"}
                </button>
              </div>

              <div className="divider">OR</div>
              <div className="form-control">
                <Link to="/login" className="btn btn-outline btn-accent">
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

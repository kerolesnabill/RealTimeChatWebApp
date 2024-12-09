import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../api/axios";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const changePasswordMutation = useMutation({
    mutationFn: (data: {}) => apiClient.patch("users/me/password", data),
    onSuccess: () => {
      setSuccessMessage("Password changed successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setTimeout(() => navigate("/profile"), 3000);
    },
    onError: (error: any) => {
      const errors = error?.response?.data?.errors;
      const err = error?.response?.data?.error;

      if (errors != null) {
        const [msg] = Object.values(errors)[0] as string[];
        setError(msg);
      } else if (err) setError(err);
      else setError("Failed to change password. Please try again.");
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

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    changePasswordMutation.mutate({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
      <div className="w-full max-w-md bg-white text-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              placeholder="Enter current password"
              className="input input-bordered w-full"
              value={formData.currentPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              className="input input-bordered w-full"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmNewPassword"
              placeholder="Confirm new password"
              className="input input-bordered w-full"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="text-red-600 text-center">{error}</p>}
          {successMessage && (
            <p className="text-green-600 text-center">{successMessage}</p>
          )}
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={changePasswordMutation.isPending}
          >
            {changePasswordMutation.isPending
              ? "Updating..."
              : "Change Password"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="btn btn-outline w-full"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;

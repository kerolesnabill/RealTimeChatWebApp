import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import profileImg from "../assets/profile.png";

const ChangeImage = () => {
  const { isAuthenticated, isLoading, user, setUser } = useAuth();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate("/login");
  }, [isLoading, isAuthenticated]);

  const uploadImageMutation = useMutation({
    mutationFn: (formData: FormData) =>
      apiClient.patch("users/me/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      setSuccessMessage("Profile image was updated successfully");
      setTimeout(() => window.location.reload(), 2000);
    },
    onError: (error: any) => {
      const errors = error?.response?.data?.errors;
      const err = error?.response?.data?.error;

      if (errors != null) {
        const [msg] = Object.values(errors)[0] as string[];
        setError(msg);
      } else if (err) setError(err);
      else setError("Failed to upload image. Please try again.");
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: () => apiClient.delete("users/me/image"),
    onSuccess: () => {
      setUser({ ...user!, image: null });
      setPreviewImage(null);
      setSuccessMessage("Profile image was deleted");
    },
    onError: (error: any) => {
      const err = error?.response?.data?.error;
      if (err) setError(err);
      else setError("Failed to delete image. Please try again.");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("Image", selectedFile);

    setError("");
    uploadImageMutation.mutate(formData);
  };

  const handleDelete = () => {
    setError("");
    deleteImageMutation.mutate();
  };

  return (
    <>
      {isLoading ? (
        <div className="h-screen flex justify-center items-center">
          <span className="loading loading-bars loading-lg"></span>
        </div>
      ) : (
        <div className="min-h-screen text-white py-10 px-4 mt-20">
          <div className="max-w-lg mx-auto bg-white text-gray-800 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Change Profile Image</h2>
            <div className="flex flex-col items-center gap-4">
              <img
                src={previewImage || user?.image || profileImg}
                alt="Profile"
                className="w-32 h-32 sm:w-56 sm:h-56 rounded-full shadow-md"
              />
              <div className="text-sm font-semibold">
                {successMessage && (
                  <p className="text-green-600">{successMessage}</p>
                )}
                {error && <p className="text-red-600">{error}</p>}
              </div>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                onChange={handleImageChange}
              />
              <button
                className="btn btn-primary w-full mt-4"
                onClick={handleUpload}
                disabled={!selectedFile || uploadImageMutation.isPending}
              >
                {uploadImageMutation.isPending
                  ? "Uploading..."
                  : "Upload Image"}
              </button>
              <button
                className="btn btn-outline btn-error w-full"
                onClick={handleDelete}
                disabled={deleteImageMutation.isPending}
              >
                {deleteImageMutation.isPending ? "Deleting..." : "Delete Image"}
              </button>
              <button
                className="btn btn-outline btn-accent w-full mt-4"
                onClick={() => navigate("/profile")}
              >
                Back to Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChangeImage;

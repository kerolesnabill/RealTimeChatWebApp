import React, { useState, useEffect } from "react";
import apiClient from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import profileImg from "../assets/profile.png";

const Profile = () => {
  const { isAuthenticated, isLoading, user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedData, setUpdatedData] = useState<any>({});
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate("/login");
  }, [isLoading, isAuthenticated]);

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => apiClient.patch("users/me", data),
    onSuccess: () => {
      setUser({ ...user!, ...updatedData });
      setIsEditing(false);
      setIsUpdating(false);
      setUpdatedData({});
    },
    onError: (error: any) => {
      const errors = error?.response?.data?.errors;
      const err = error?.response?.data?.error;

      if (errors != null) {
        const [msg] = Object.values(errors)[0] as string[];
        setError(msg);
      } else if (err) setError(err);
      else setError("Update failed. Please try again.");

      setIsUpdating(false);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsUpdating(true);

    if (updatedData.username)
      setUpdatedData({
        ...updatedData,
        username: updatedData.username.toLowerCase(),
      });

    updateProfileMutation.mutate(updatedData);
  };

  return (
    <>
      {isLoading && (
        <div className="h-screen flex justify-center justify-items-center">
          <span className="loading loading-bars loading-lg"></span>
        </div>
      )}
      {!isLoading && user && (
        <div className="min-h-screen text-white py-10 px-4 mt-20">
          <div className="max-w-3xl mx-auto bg-white text-gray-800 shadow-lg rounded-lg">
            <div className="p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {isEditing ? "Edit Profile" : "Your Profile"}
                </h2>
                <Link to="change-password" className="btn btn-sm btn-accent">
                  Change Password
                </Link>
              </div>
              <hr className="my-4" />
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block font-medium">Name</label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={user.name}
                        minLength={1}
                        maxLength={50}
                        required
                        onChange={handleChange}
                        className="input input-bordered w-full"
                      />
                    </div>
                    <div>
                      <label className="block font-medium">Username</label>
                      <input
                        type="text"
                        name="username"
                        defaultValue={user.username}
                        minLength={3}
                        maxLength={20}
                        required
                        onChange={handleChange}
                        className="input input-bordered w-full"
                      />
                    </div>
                    <div>
                      <label className="block font-medium">About</label>
                      <textarea
                        name="about"
                        defaultValue={user.about}
                        onChange={handleChange}
                        className="textarea textarea-bordered w-full"
                      ></textarea>
                    </div>

                    <div className="mt-4 text-sm font-semibold">
                      <p className="text-red-600 text-center">{error}</p>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-full"
                      disabled={isUpdating}
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline w-full"
                      onClick={() => {
                        setIsEditing(false);
                        setError("");
                        setUpdatedData({});
                      }}
                      disabled={isUpdating}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col items-center gap-6">
                  <img
                    src={user.image || profileImg}
                    alt="Profile"
                    className="w-32 h-32 rounded-full shadow-md"
                  />
                  <div className="text-center">
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-center">
                      {user.about || "No bio added yet."}
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Joined on {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    className="btn btn-outline btn-primary mt-4"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;

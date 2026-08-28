"use client";

import { FormEvent, useEffect, useState } from "react";
import AppShell from "@/components/app-shell";
import { changePassword, getProfile, updateProfile, type Profile } from "@/lib/users";
import { getApiErrorMessage } from "@/lib/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile().then((response) => { const user = response.data?.user as Profile; setProfile(user); setName(user.name); })
      .catch((requestError: unknown) => setError(getApiErrorMessage(requestError, "Failed to load profile.")))
      .finally(() => setLoading(false));
  }, []);

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault(); setError(""); setMessage("");
    try { const response = await updateProfile(name.trim()); setProfile(response.data?.user ?? profile); setMessage("Profile updated."); }
    catch (requestError: unknown) { setError(getApiErrorMessage(requestError, "Failed to update profile.")); }
  };

  const savePassword = async (event: FormEvent) => {
    event.preventDefault(); setError(""); setMessage("");
    if (newPassword.length < 8) { setError("New password must be at least 8 characters."); return; }
    try { await changePassword(currentPassword, newPassword); setCurrentPassword(""); setNewPassword(""); setMessage("Password changed."); }
    catch (requestError: unknown) { setError(getApiErrorMessage(requestError, "Failed to change password.")); }
  };

  if (loading) return <AppShell><main className="page-frame"><p className="muted">Loading profile...</p></main></AppShell>;
  return <AppShell><main className="page-frame"><div className="content-column narrow-column"><p className="eyebrow">Account</p><h1 className="page-title">Your profile</h1>{error && <div className="error-banner" role="alert">{error}</div>}{message && <div className="success-banner" role="status">{message}</div>}<form className="panel form-stack" onSubmit={saveProfile}><h2>Profile details</h2><label>Name<input value={name} onChange={(event) => setName(event.target.value)} maxLength={100} required /></label><label>Email<input value={profile?.email ?? ""} disabled /></label><button className="button button-primary">Save profile</button></form><form className="panel form-stack" onSubmit={savePassword}><h2>Change password</h2><label>Current password<input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required /></label><label>New password<input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength={8} required /></label><button className="button button-secondary">Change password</button></form></div></main></AppShell>;
}
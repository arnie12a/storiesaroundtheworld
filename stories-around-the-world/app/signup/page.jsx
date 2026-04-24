"use client";

import { useState } from "react";
import { signup } from "./actions";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // Check if passwords match BEFORE calling Supabase
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    const { error } = await signup(formData);

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push("/"); // redirect to home page
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h1>Create an Account</h1>

      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" required />
        <br /><br />

        <input name="password" type="password" placeholder="Password" required />
        <br /><br />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          required
        />
        <br /><br />

        <button type="submit">Sign Up</button>
      </form>

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
    </div>
  );
}

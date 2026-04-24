"use client";

import { useState } from "react";
import { login } from "./actions";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const { error } = await login(formData);

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push("/"); // redirect to home page
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" required />
        <br /><br />

        <input name="password" type="password" placeholder="Password" required />
        <br /><br />

        <button type="submit">Login</button>
      </form>

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
    </div>
  );
}

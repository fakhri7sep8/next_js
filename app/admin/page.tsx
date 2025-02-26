"use client";
import React, { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

const AdminPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect jika tidak ada session (belum login)
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="text-black">
      <h1>Admin Page</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre> {/* Lebih rapi pakai <pre> */}
      <p>Status: {status}</p>

      <Button title="Logout" colorSchema="red" onClick={() => signOut()} />
    </div>
  );
};

export default AdminPage;

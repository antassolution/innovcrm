"use client"
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (session_id) {
      const validateSession = async () => {
        try {
          const response = await fetch(`/api/validate-session?session_id=${session_id}`);
          const data = await response.json();

          if (data.success) {
            setSuccess(true);
          } else {
            setSuccess(false);
          }
        } catch (error) {
          console.error("Error validating session:", error);
          setSuccess(false);
        } finally {
          setLoading(false);
        }
      };

      validateSession();
    }
  }, [session_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {success ? (
        <h1>Payment Successful!</h1>
      ) : (
        <h1>Payment Validation Failed</h1>
      )}
    </div>
  );
}
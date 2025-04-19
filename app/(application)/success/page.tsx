"use client"
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { validateSession } from '@/services/subscriptionService';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (session_id) {
      const validateSessionHandler = async () => {
        try {
          const data = await validateSession(session_id);

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

      validateSessionHandler();
    }
  }, [session_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        {success ? (
          <div>
            <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
            <p className="mt-4 text-lg text-gray-700">Thank you for your payment. Your transaction was completed successfully.</p>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-red-600">Payment Validation Failed</h1>
            <p className="mt-4 text-lg text-gray-700">We could not validate your payment. Please contact support for assistance.</p>
          </div>
        )}
      </div>
    </div>
  );
}
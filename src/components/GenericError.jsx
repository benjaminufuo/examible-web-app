// components/GenericError.jsx
import { useEffect } from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function GenericError() {
  const error = useRouteError();

  // Not reported to Sentry here: the router's error boundary is a React error
  // boundary, so main.jsx's onCaughtError already reports it (with the
  // component stack). No route loads data through the router, so every error
  // shown here went through that boundary.
  useEffect(() => {
    console.error(error);
  }, [error]);

  let message = "Something went wrong.";
  let status = "";

  if (isRouteErrorResponse(error)) {
    status = error.status;
    message = error.data?.message || error.statusText;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Oops 😢</h1>
      <p>{message}</p>
      {status && <p>Status: {status}</p>}
      <button onClick={() => (window.location.href = "/")}>Go Home</button>
    </div>
  );
}

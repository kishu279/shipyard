"use client";

import { useState, useEffect, useCallback } from "react";

export default function DebugPage() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTestWebhook = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const mockPayload = {
        repository: {
          id: "test-repo-123",
          full_name: "test-user/test-repo",
          owner: {
            login: "kishu279",
          },
          clone_url: "https://github.com/test-user/test-repo.git",
          ssh_url: "git@github.com:test-user/test-repo.git",
        },
        ref: "refs/heads/main",
        after: "abc123def456",
        sender: {
          login: "kishu279",
        },
      };

      const res = await fetch("/api/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-github-event": "test-event",
          "x-github-delivery": "debug-test-" + Date.now(),
        },
        body: JSON.stringify(mockPayload),
      });

      const data = await res.json();
      setResponse({
        status: res.status,
        statusText: res.statusText,
        data,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🐛 Webhook Debug Page
          </h1>

          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Test the webhook endpoint and Redis xAdd functionality locally.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              This will call{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">
                /api/webhook
              </code>{" "}
              and add a test event to the Redis stream.
            </p>
          </div>

          <button
            onClick={handleTestWebhook}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Testing...
              </>
            ) : (
              "🚀 Test Webhook & Redis xAdd"
            )}
          </button>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-semibold mb-2">❌ Error</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {response && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-green-800 font-semibold mb-2">
                ✅ Response (Status: {response.status})
              </h3>
              <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm">
                {JSON.stringify(response.data, null, 2)}
              </pre>
              <p className="text-sm text-green-700 mt-3">
                ℹ️ Check your server console for Redis Stream logs
              </p>
            </div>
          )}

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-blue-800 font-semibold mb-2">
              📝 Test Payload
            </h3>
            <p className="text-sm text-blue-700 mb-2">
              This will send a mock GitHub webhook event with the following
              data:
            </p>
            <pre className="bg-gray-900 text-blue-400 p-4 rounded overflow-x-auto text-xs">
              {`{
  "repository": {
    "id": "test-repo-123",
    "owner": { "login": "test-user" }
  },
  "x-github-event": "test-event"
}`}
            </pre>
            <p className="text-sm text-blue-700 mt-2">
              The webhook will add this to Redis stream:{" "}
              <code className="bg-blue-100 px-1 py-0.5 rounded">
                webhooks-stream
              </code>
            </p>
          </div>

          <div className="mt-6 border-t pt-6">
            <h3 className="text-gray-800 font-semibold mb-2">
              🔍 How to verify Redis:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>
                Run{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">redis-cli</code>{" "}
                in your terminal
              </li>
              <li>
                Check stream:{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  XREAD COUNT 10 STREAMS webhooks-stream 0
                </code>
              </li>
              <li>
                Or check length:{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  XLEN webhooks-stream
                </code>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";

// Lazy client + defensive configure so the app doesn't crash before running `npx ampx sandbox`.
// When `amplify_outputs.json` becomes available it will configure Amplify and create the client.

type TodoType = Schema["Todo"]["type"];

export default function App() {
  const [client, setClient] = useState<ReturnType<typeof generateClient<Schema>> | null>(null);
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [amplifyReady, setAmplifyReady] = useState<boolean>(false);
  const [amplifyError, setAmplifyError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function initAmplify() {
      try {
        // Dynamic import so build doesn't hard fail if file absent pre-sandbox.
        const mod = await import("@/amplify_outputs.json");
        const outputs = (mod as any).default ?? mod;
        Amplify.configure(outputs);
        if (cancelled) return;
        setClient(generateClient<Schema>());
        setAmplifyReady(true);
      } catch (e) {
        console.warn("amplify_outputs.json not found. Run `npx ampx sandbox` to generate it.");
        if (!cancelled) {
          setAmplifyError("Amplify not configured. Run `npx ampx sandbox` locally to generate amplify_outputs.json.");
        }
      }
    }
    initAmplify();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!client) return;
    const sub = client.models.Todo.observeQuery().subscribe({
      next: ({ items }) => setTodos([...items]),
      error: (err) => console.error("Todo subscription error", err),
    });
    return () => sub.unsubscribe();
  }, [client]);

  function createTodo() {
    if (!client) {
      alert("Backend not ready yet.");
      return;
    }
    const content = window.prompt("Todo content");
    if (content) client.models.Todo.create({ content });
  }

  return (
    <main>
      <h1>Lampoon.xyz - Satire is American.</h1>
      <h2>Under Construction please excuse our mess</h2>
      {!amplifyReady && (
        <p style={{ color: "orange", fontSize: ".9rem" }}>
          {amplifyError ?? "Initializing backend..."}
        </p>
      )}
      {amplifyReady && (
        <section>
          <button onClick={createTodo}>Add Todo</button>
          <ul>
            {todos.map((t) => (
              <li key={t.id}>{t.content}</li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

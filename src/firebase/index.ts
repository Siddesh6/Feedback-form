'use client';

// This file is a barrel file. It re-exports functionality from other
// firebase-related files to provide a single, consistent import path.
// This helps prevent circular dependencies.

import { useUser } from './auth/use-user';
export * from './provider';

// No initializeFirebase function is needed here anymore as the provider handles it.
// Exporting `useUser` alongside the provider hooks.
export { useUser };

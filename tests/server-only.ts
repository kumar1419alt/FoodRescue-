// Vitest runs server modules in a Node test environment. Next.js enforces
// server-only at build time; this inert alias lets guarded integration tests
// exercise the same modules without emulating a Client Component.
export {};

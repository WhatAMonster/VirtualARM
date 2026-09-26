# VirtualARM

A JS-based ARM64 Simulation.
- Pre-mature Demonstration: Demo[https://whatamonster.github.io/VirtualARM/]

## The pieces

- **`Main.js`** — paints the canvas, initializes the CPU class, pulls the version banner from `arm64.js`.
- **`itpr.js`** — the interpreter, it regex-matches typed commands and packs 'em into 32-bit instructions.
- **`process.js`** — the actual CPU, it decodes those 32-bit instructions and executes.
- **`arm64.js`** — the opcode table, decode masks, version tracking, and `memo` — 4MB of `Uint8Array` RAM with a `DataView` on top for word/half-word/byte access.

## What can be done with what's here now

- `varm init` — welcome banner + changelog, version-stamped.
- `ls reg` — dumps all 32 registers.
- `mov`, `add`, `sub`, `mul`, `sdiv` — both reg-reg-reg and reg-reg-#immediate forms (immediate gets stashed in x30 as scratch, then restored). `sdiv` also catches divide-by-zero.
- `orr`, `and` — reg-reg-reg and reg-reg-#immediate.
- `cmp` — full N, C, V, Z flag implementation into CPSR.
- `ldr`, `str`, `ldrh`, `ldrb`, `strh`, `strb` — full word/half-word/byte load-store into real RAM through a base register, with immediate-offset addressing too: `ldr x1 [x2]` and `ldr x1 [x2 #4]`.
- `svc #n` — syscall-style exits and print calls, x8-driven.
- fullscreen toggle + live version display on the console itself.

## Yet to come

- Branching + labels (BEQ is wired up opcode-side, control flow isn't there js yet).
- Full assembly script support (multi-line).
- Better DEBUG pipeline.

# UNUSABLE ATP, In-Progress!

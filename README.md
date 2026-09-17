# VirtualARM

A JS-based ARM64 Simulation.

## The pieces

- **`Main.js`** — paints the canvas and initializes the CPU class.
- **`itpr.js`** — the interpreter, it regex-matches typed commands and packs 'em into 32-bit instructions.
- **`process.js`** — the actual CPU, it Decodes those 32-bit instructions  and executes.
- **`arm64.js`** — the opcode table and the decode masks.

## What can be done with what's here now

- `ls reg` — dumps all 32 registers.
- `mov`, `add`, `sub`, `mul`, `sdiv` — both reg-reg-reg and reg-reg-#immediate forms (immediate gets stashed in x30 as scratch, then restored).

## Yet to come

- All other **remaining instructions** + Support for full **assembly scripts** + Better **DEBUG pipeline** + **Virtual RAM**

# UNUSABLE ATP, In-Progress!

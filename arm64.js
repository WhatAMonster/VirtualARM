// ARM64 OPCDES
export const ARM64_OPCODES = {
    MOV:  0x01000000,
    ADD:  0x02000000,
    SVC:  0x03000000,
    SUB:  0x06000000,
    CMP:  0x04000000,
    ORR:  0x05000000,
    AND:  0x07000000,
    LDR:  0x08000000,
    MUL:  0x09000000,
    SDIV:  0x0A000000
};

export const HARDWARE_MASKS = {
    REG_MASKS: 0x1F,         // isolates bits 4-0
    OPCODE_MASK: 0xFF000000  // isolates top 8 bits for decoding
};


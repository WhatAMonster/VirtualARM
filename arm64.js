// ARM64 OPCDES
/*
 * NAME CODE
 * MOV  0001
 * SVC  0011
 * ADD  0010
 * SUB  0110
 * CMP  0100
 * ORR  0101
 * AND  0111
 * LDR  0110
 * STR  0000
 * LDRB 1000
 * STRB 1001
 */
export const ARM64_OPCODES = {
    MOV:  0x01000000,
    ADD:  0x02000000,
    SVC:  0x03000000,
    SUB:  0x06000000,
    CMP:  0x04000000,
    ORR:  0x05000000,
    AND:  0x07000000,
    LDR:  0x08000000
};

export const HARDWARE_MASKS = {
    REG_MASKS: 0x1F,         // isolates bits 4-0
    OPCODE_MASK: 0xFF000000  // isolates top 8 bits for decoding
};


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
//memory 4MBs of RAM :- 2^2+2^20=2^22Bytes === 4194304 Bytes
export class memo{
    constructor(){
        this.RAM=new Uint8Array(4194304); //unsigned
        this.view=new DataView(this.RAM.buffer); //scale for measuring n bits at a time
    }
    /*
     memtype fetch:-
     000-Write Page
     001-Write Word
     010-Write Half-word
     011-Write Byte
     100-Read Page
     101-Read Word
     110-Read Half-Word
     111-Read Byte

     */
    readWord(addr){return this.view.getUint32(addr, true);}// true stands for little endianess --> first byte(left most) is least significant
    writeWord(addr, val){this.view.setUint32(addr, val, true);}
    readHWord(addr){return this.view.getUint16(addr, true);}
    writeHWord(addr, val){this.view.setUint16(addr, val, true);}
    readByte(addr){return this.view.getUint8(addr, true);}
    writeByte(addr, val){this.view.setUint8(addr, value, true);}
}


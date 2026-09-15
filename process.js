//process handler
import { ARM64_OPCODES, HARDWARE_MASKS } from './opcodes.js';
export class ARMProcessor{
    constructor(){
        this.registers=new BigInt64Array(32);//31 registers and one zero register
        this.PC=0n;//Program Counter to track address
    }
    /*
     *Executing a single 32-bit ARM Instruction
     *@param {number} ins - opcode in binary
     *@returns {string} - status string routed back
     * [ PRIMARY OPCODE (11 bits) ][ Shift (2b) ][ Rm (5b) ][ Imm/Option (6b) ][ Rn (5b) ][ Rd (5b) ]
     * Bits: 31 ----------------- 21 20 ------- 19 18 ---- 14 13 ------------ 10 9 ----- 5 4 ------ 0
     */
    exec_(ins) {
        this.registers[31]=0n; //This is our XZR its always zero
        //DECODER
        //SYNTAX - OPCODE RD(Destination), RN(Operand), RM(Operand) bitwise and to get the real code
        const rd=ins & HARDWARE_MASKS.REG_MASKS //Bits 4-0 Destination
        const rn=(ins>>5) & HARDWARE_MASKS.REG_MASKS // Bits 9-5 Source 1
        //we gonna keep space to adhere to real arm enginnering for operations like lsr, lsl etc without changing the overall map and keeping the run unidirectionals
        const rm=(ins>>16) & HARDWARE_MASKS.REG_MASKS //Bits 20-16 Source 2
        const opc=(ins & HARDWARE_MASKS.OPCODE_MASK) >>> 0; //used >>> 0 to treat output as unsigned 32 bit because its opcode
    }
}

//process handler
import { ARM64_OPCODES, HARDWARE_MASKS } from './arm64.js';
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
        //----------------------DECODER--------------------
        //SYNTAX - OPCODE RD(Destination), RN(Operand), RM(Operand) bitwise and to get the real code
        const rd=ins & HARDWARE_MASKS.REG_MASKS //Bits 4-0 Destination
        const rn=(ins>>5) & HARDWARE_MASKS.REG_MASKS // Bits 9-5 Source
        //we gonna keep space to adhere to real arm enginnering for operations like lsr, lsl etc without changing the overall map and keeping the run unidirectionals
        const rm=(ins>>16) & HARDWARE_MASKS.REG_MASKS //Bits 20-16 Source 2
        const opc=(ins & HARDWARE_MASKS.OPCODE_MASK) >>> 0; //used >>> 0 to treat output as unsigned 32 bit because its opcode
        //---------------------EXECUTION--------------------
        switch(opc){
            case ARM64_OPCODES.ADD:
                this.registers[rd]=this.registers[rn]+this.registers[rm];
                return {signal: 'ok'};
            case ARM64_OPCODES.SUB:
                this.registers[rd]=this.registers[rn]-this.registers[rm];
                return {signal: 'ok'};
            case ARM64_OPCODES.MOV:
                this.registers[rd]=this.registers[rn];
                return {signal: 'ok'};
            case ARM64_OPCODES.ORR:
                this.registers[rd]=this.registers[rn] | this.registers[rm];
                return {signal: 'ok'};
            case ARM64_OPCODES.AND:
                this.registers[rd]=this.registers[rn] & this.registers[rm];
                return {signal: 'ok'};
            //CMP OPRN, CPSR register 0000 is for rn>rm, 0100 is for rn=rm and 1000 is for rn<rm
            case ARM64_OPCODES.CMP:
                const rn_=this.registers[rn];const rm_=this.registers[rm];
                let flags=0;
                if(rn_===rm_){
                    flags |= 0x4
                }else if(rn_<rm_){
                    flags |= 0x8
                }
                this.registers[BigInt(-1)]=flags;
                return {signal: 'ok'};
            case ARM64_OPCODES.BEQ:
                //labels work yet to be done
                //other branching ops to come after this js aint writing now
                return {signal: 'ok'};
            case ARM64_OPCODES.LDR:
                //needs memory work
                //everything pertaining like ldrb, str, strb, adrp to follow up this
                return {signal: 'ok'};
            case ARM64_OPCODES.MUL:
                this.registers[rd]=this.registers[rn]*this.registers[rm];
                return {signal: 'ok'};
            case ARM64_OPCODES.SDIV:
                if(this.registers[rm]>0){
                    this.registers[rd]=this.registers[rn]/this.registers[rm];
                    return {signal: 'ok'};
                }
                    else{
                        return {signal: 'ERROR_DIVISION_BY_ZERO'}
                    }
            case ARM64_OPCODES.SVC: //supervi..
                if(this.registers[rd]===BigInt(0) && this.registers[8]===BigInt(93)){//EXIT CODE
                    return{signal:'HALT',EXIT_CODE:Number(this.registers[0])}
                }else if(this.registers[rd]===BigInt(0) && this.registers[8]===BigInt(64)){
                    //print call
                    return{signal:'PRINT'}
                }else{return {signal:`UNKNOWN_SVC_CALL: x8(${this.registers[8]}) IMM_:${this.registers[rd]}`}}
            default://handle out of declaration opcodes
                return{signal:'FUCK_MAN_WE_DONT_HAVE_IT_YET'}
        }

    }
}

//process handler
import { ARM64_OPCODES, HARDWARE_MASKS, memo } from './arm64.js';

export class ARMProcessor{
    constructor(){
        this.registers=new BigInt64Array(32);//31 registers and one zero register
        this.PC=0n;//Program Counter to track address
        this.mem=new memo();
        this.CPSR=0;//Z:-0x1 = 0001, N:- 0x2 = 0010, C:- 0x4 = 0100, V:- 0x8 = 1000
    }
    /*
     *Executing a single 32-bit ARM Instruction
     *@param {number} ins - opcode in binary
     *@returns {string} - status string routed back
     * [ PRIMARY OPCODE (11 bits) ][ Shift (2b) ][ Rm (5b) ][ Imm/Option (6b) ][ Rn (5b) ][ Rd (5b) ]
     * Bits: 31 ----------------- 21 20 ------- 19 18 ---- 14 13 ------------ 10 9 ----- 5 4 ------ 0
     */
    exec_(ins) {
        let addr=0;
        this.registers[31]=0n; //This is our XZR its always zero
        //----------------------DECODER--------------------
        //SYNTAX - OPCODE RD(Destination), RN(Operand), RM(Operand) bitwise and to get the real code
        const rd=ins & HARDWARE_MASKS.REG_MASKS //Bits 4-0 Destination
        const rn=(ins>>5) & HARDWARE_MASKS.REG_MASKS // Bits 9-5 Source 1
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
                const r=rn_-rm_;
                if(r===0n){flags |= 0x1;}//Z
                if(r<0n){flags |= 0x2;}//N
                if(rn_>=rm_){flags |= 0x4;}//C
                let vf=0;
                if(rn_>=0n && rm_<0n &&  r<0n){vf=1}//PosMinusNeg -> positive overwrapped to sm negative no.
                if(rn_<0n && rm_>=0n && r>=0n){vf=1}//NegMinusPos -> negative overwrapped to sm positive no. or zero
                if(vf===1){flags |= 0x8}//V
                this.CPSR=flags;
                return {signal: 'ok'};
            case ARM64_OPCODES.BEQ:
                //labels work yet to be done
                //other branching ops to come after this js aint writing now
                return {signal: 'ok'};
            case ARM64_OPCODES.LDR:
                addr=Number(this.registers[rn]);
                this.registers[rd]=BigInt(this.mem.readWord(addr));
                return {signal: 'ok'};
            case ARM64_OPCODES.LDRH:
                addr=Number(this.registers[rn]);
                this.registers[rd]=BigInt(this.mem.readHWord(addr));
                return {signal: 'ok'};
            case ARM64_OPCODES.LDRB:
                addr=Number(this.registers[rn]);
                this.registers[rd]=BigInt(this.mem.readByte(addr));
                return {signal: 'ok'};
            case ARM64_OPCODES.STR:
                addr=Number(this.registers[rn]);
                this.mem.writeWord(addr, Number(this.registers[rd]));
                return {signal: 'ok'};
            case ARM64_OPCODES.STRH:
                addr=Number(this.registers[rn]);
                this.mem.writeHWord(addr, Number(this.registers[rd]));
                return {signal: 'ok'};
            case ARM64_OPCODES.STRB:
                addr=Number(this.registers[rn]);
                this.mem.writeByte(addr, Number(this.registers[rd]));
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
                if(rd===0 && this.registers[8]===BigInt(93)){//EXIT CODE
                    return{signal:'HALT',EXIT_CODE:Number(this.registers[0])}
                }else if(rd===0 && this.registers[8]===BigInt(64)){
                    //print call
                    return{signal:'PRINT'}
                }else{return {signal:`UNKNOWN_SVC_CALL: x8(${this.registers[8]}) IMM_:${rd}`}}
            default://handle out of declaration opcodes
                return{signal:'FUCK_MAN_WE_DONT_HAVE_IT_YET'}
        }
    }
}

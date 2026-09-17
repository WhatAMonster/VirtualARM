//INTERPRETING
import {ARMProcessor} from './process.js';
import {ARM64_OPCODES} from './arm64.js'

export class ARMInterpreter{
    constructor(callers={}){
        this.sendToUI=callers.paintUI || (()=>{});
        this.sendToDebug=callers.writeDebug || (()=>{});
        this.cpu=new ARMProcessor();
    }
    //recieving input from ui
    Input_(str){
        const command=str.trim().replace(/\s+/g, ' ') //clears up both trailing(completely removed) and internal spaces(squished to one)
        //list registers
        if(command.toLowerCase()==="ls reg"){
            let output="---(*) REGISTER---\n"
            for(let i=0;i<32;i++){
                output+=`X${i}: ${this.cpu.registers[i]} `;
                output+="\n"
            }
            this.sendToUI(output);
            return;
        }
        //ASSEMBLER PARSER
        //MOV X{i} #\d+
        if(/^mov x\d+ #\d+$/i.test(command)){
            const matches=command.match(/\d+/g);//register value at index 0 and literal value at index 1
            const regIndex=parseInt(matches[0]);//in decimal
            const immediateValue=BigInt(matches[1]);//in binary
            if(regIndex<31){
                this.cpu.registers[regIndex]=immediateValue;
                this.sendToDebug(`Loaded ${immediateValue} in x${regIndex}.`);
            }else{this.sendToDebug(`Illegal assignment(${immediateValue}) to x${regIndex}.`)}
            return;
            }
        //MOV X{i} X{j} type2
        if(/^mov x\d+ x\d+$/i.test(command)){
            const matches=command.match(/\d+/g);//register vlaues at index 0 and 1
            const regIndex=parseInt(matches[0]);//in decimal
            const sourceReg=parseInt(matches[1])//in decimal
            if(regIndex<31){
                this.cpu.registers[regIndex]=this.cpu.registers[sourceReg];
                this.sendToDebug(`Loaded ${this.cpu.registers[sourceReg]} in x${regIndex}.`);
            }else{this.sendToDebug(`Illegal assignment(${this.cpu.registers[sourceReg]}) to x${regIndex}.`)}
            return;
        }
        //ADD(type 1) rd, rn, rm
        if(/^add x\d+ x\d+ x\d+$/i.test(command)){
            const matches=command.match(/\d+/g);
            let ins=ARM64_OPCODES.ADD;
            ins |= (parseInt(matches[2])<<16); //rm
            ins |= (parseInt(matches[1])<<5);  //rn
            ins |= parseInt(matches[0]); //rd
            const res=this.cpu.exec_(ins);
            this.sendToDebug(`Executed with return code: ${res.signal}`);
            return;
        }
        //ADD(type2 with immediate) rd, rn, #immediate
        if(/^add x\d+ x\d+ #\d+$/i.test(command)){
            const matches=command.match(/\d+/g);
            let ins=ARM64_OPCODES.ADD;
            //register 30 for immediate storing
            let oldval=this.cpu.registers[30]
            this.cpu.registers[30]=BigInt(matches[2]);
            ins |= (30<<16); //rm
            ins |= (parseInt(matches[1])<<5);  //rn
            ins |= parseInt(matches[0]); //rd
            const res=this.cpu.exec_(ins);
            this.sendToDebug(`Executed with return code: ${res.signal}`);
            //load back
            this.cpu.registers[30]=oldval
            return;
        }
        //SUB(type 1) rd, rn, rm
        if(/^sub x\d+ x\d+ x\d+$/i.test(command)){
            const matches=command.match(/\d+/g);
            let ins=ARM64_OPCODES.SUB;
            ins |= (parseInt(matches[2])<<16); //rm
            ins |= (parseInt(matches[1])<<5);  //rn
            ins |= parseInt(matches[0]); //rd
            const res=this.cpu.exec_(ins);
            this.sendToDebug(`Executed with return code: ${res.signal}`);
            return;
        }
        //SUB(type2 with immediate) rd, rn, #immediate
        if(/^sub x\d+ x\d+ #\d+$/i.test(command)){
            const matches=command.match(/\d+/g);
            let ins=ARM64_OPCODES.SUB;
            //register 30 for immediate storing
            let oldval=this.cpu.registers[30]
            this.cpu.registers[30]=BigInt(matches[2]);
            ins |= (30<<16); //rm
            ins |= (parseInt(matches[1])<<5);  //rn
            ins |= parseInt(matches[0]); //rd
            const res=this.cpu.exec_(ins);
            this.sendToDebug(`Executed with return code: ${res.signal}`);
            //load back
            this.cpu.registers[30]=oldval
            return;
        }
        //MUL(type 1) rd, rn, rm
        if(/^mul x\d+ x\d+ x\d+$/i.test(command)){
            const matches=command.match(/\d+/g);
            let ins=ARM64_OPCODES.MUL;
            ins |= (parseInt(matches[2])<<16); //rm
            ins |= (parseInt(matches[1])<<5);  //rn
            ins |= parseInt(matches[0]); //rd
            const res=this.cpu.exec_(ins);
            this.sendToDebug(`Executed with return code: ${res.signal}`);
            return;
        }
        //MUL(type2 with immediate) rd, rn, #immediate
        if(/^mul x\d+ x\d+ #\d+$/i.test(command)){
            const matches=command.match(/\d+/g);
            let ins=ARM64_OPCODES.MUL;
            //register 30 for immediate storing
            let oldval=this.cpu.registers[30]
            this.cpu.registers[30]=BigInt(matches[2]);
            ins |= (30<<16); //rm
            ins |= (parseInt(matches[1])<<5);  //rn
            ins |= parseInt(matches[0]); //rd
            const res=this.cpu.exec_(ins);
            this.sendToDebug(`Executed with return code: ${res.signal}`);
            //load back
            this.cpu.registers[30]=oldval
            return;
        }
        //SDIV(type 1) rd, rn, rm
        if(/^sdiv x\d+ x\d+ x\d+$/i.test(command)){
            const matches=command.match(/\d+/g);
            let ins=ARM64_OPCODES.SDIV;
            ins |= (parseInt(matches[2])<<16); //rm
            ins |= (parseInt(matches[1])<<5);  //rn
            ins |= parseInt(matches[0]); //rd
            const res=this.cpu.exec_(ins);
            this.sendToDebug(`Executed with return code: ${res.signal}`);
            return;
        }
        //SDIV(type2 with immediate) rd, rn, #immediate
        if(/^sdiv x\d+ x\d+ #\d+$/i.test(command)){
            const matches=command.match(/\d+/g);
            let ins=ARM64_OPCODES.SDIV;
            //register 30 for immediate storing
            let oldval=this.cpu.registers[30]
            this.cpu.registers[30]=BigInt(matches[2]);
            ins |= (30<<16); //rm
            ins |= (parseInt(matches[1])<<5);  //rn
            ins |= parseInt(matches[0]); //rd
            const res=this.cpu.exec_(ins);
            this.sendToDebug(`Executed with return code: ${res.signal}`);
            //load back
            this.cpu.registers[30]=oldval
            return;
        }
        //SVC #0
        if(/^svc #0$/i.test(command)){
            const matches=command.match(/\d+/g);
            let ins=ARM64_OPCODES.SVC;
            ins |= (0<<16); //rm
            ins |= (parseInt(matches[0])<<5); //rn
            ins |= 0; //rd
            const res=this.cpu.exec_(ins);
            this.sendToDebug(`SVC Call: retruned ${res.SIGNAL}`)
            return;
        }
        this.sendToUI(`Unknown Syntax: ${command}`);
        }
    }

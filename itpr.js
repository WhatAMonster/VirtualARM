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
            }
            this.sendToUI(output);
            return;
        }
        //ASSEMBLER PARSER
        //MOV X{i}, #\d+
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
        //SVC #0
        if(/^svc #0$/i.test(command)){
            const matches=command.match(/\d+/g);
            let ins=ARM64_OPCODES.SVC;
            ins |= (0<<16); //rm
            ins |= (parseInt(matches[0]<<5)); //rn
            ins |= 0; //rd
            const res=this.cpu.exec_(ins);
            this.sendToDebug(`SVC Call: retruned ${res.SIGNAL}`)
            return;
        }
        this.sendToUI(`Unknown Syntax: ${command}`);
        }
    }

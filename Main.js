//importing stuff
import { ARMInterpreter } from './itpr.js';
//setting up
const machinecont_ = document.getElementById('machinecont_');
const ink = machinecont_.getContext('2d');
//sharpner
const scale = window.devicePixelRatio || 1;
const viewWidth = 900;
const viewHeight = 700;
machinecont_.style.width = viewWidth + "px";
machinecont_.style.height = viewHeight + "px";
machinecont_.width = viewWidth * scale;
machinecont_.height = viewHeight * scale;
ink.scale(scale, scale); //scaling everything in the canva to match our window size cum devicePixelRatio
//----
const trw = [];
const maxtrw = 90;
let inputBuffer = "";
// VROOMIN'
const interpreter = new ARMInterpreter({
    paintUI: (txt) => { paint(txt); },
                                       writeDebug: (msg) => { paint(`[DEBUG] ${msg}`); }
});
let showcursor=true;
setInterval(()=>{
    showcursor = !showcursor;
    useink();
}, 500);
function useink() {
    ink.fillStyle = '#000000';
    ink.fillRect(0,0,900,700);
    ink.font = '12px monospace';
    ink.fillStyle = '#00ff00';
    const maxRows=50;
    const visiblelines=trw.slice(-maxRows);
    for(let i = 0; i < visiblelines.length; i++){
        ink.fillText(visiblelines[i], 20, 10 + (i * 13));
    }
    const inputlineY=10+(visiblelines.length*13)+13;
    const cursor=showcursor ? '_' : '';
    ink.fillText("./~: " + inputBuffer + cursor, 20, inputlineY);
}

function paint(string) {
    const segments = string.split('\n');
    segments.forEach(seg => {
        trw.push(seg);
        if(trw.length > maxtrw) trw.shift();
    });
        useink();
}

window.addEventListener('keydown', (x) => {
    if(x.key === 'Enter'){
        paint("./~: " + inputBuffer);
        interpreter.Input_(inputBuffer);
        inputBuffer = "";
    } else if(x.key === 'Backspace'){
        inputBuffer = inputBuffer.slice(0, -1);
    } else if(x.key.length === 1){
        inputBuffer += x.key;
    }
    useink();
});
paint("VirtualARM booted. \n+------+-----------------------------+\n|                                    |\n|        Welcome To VirtualARM       |\n| ********************************** |\n| CHANGE LOG:-                       |\n| 1.Fixed SVC Support                |\n| 2.Fixed LDRB/STRB Instruction s-   |\n|  -upport globally                  |\n|                                    |\n+------------------------------------+");

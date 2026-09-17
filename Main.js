//importing stuff
import { ARMInterpreter } from './itpr.js';
//setting up
const machinecont_ = document.getElementById('machinecont_');
const ink = machinecont_.getContext('2d');

const trw = [];
const maxtrw = 25;
let Streamline = "VirtualARM booted...";
let inputBuffer = "";
// VROOMIN'
const interpreter = new ARMInterpreter({
    paintUI: (txt) => { paint(txt); },
                                       writeDebug: (msg) => { paint(`[DEBUG] ${msg}`); }
});

function useink() {
    ink.fillStyle = '#000000';
    ink.fillRect(0,0,500,500);
    ink.font = '12px monospace';
    ink.fillStyle = '#00ff00';

    for(let i = 0; i < trw.length; i++){
        ink.fillText(trw[i], 20, 30 + (i * 15));
    }
    ink.fillText("arm64# " + inputBuffer + "_", 20, 480);
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
        paint("arm64# " + inputBuffer);
        interpreter.Input_(inputBuffer);
        inputBuffer = "";
    } else if(x.key === 'Backspace'){
        inputBuffer = inputBuffer.slice(0, -1);
    } else if(x.key.length === 1){
        inputBuffer += x.key;
    }
    useink();
});

paint("VirtualARM booted.");

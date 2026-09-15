// main.js
//setting up canvas for TUI
const machinecont_= document.getElementById('machinecont_');
const ink=machinecont_.getContext('2d');

//----------------------------------------------------Designing---------------------------------------------
const trw=[] //Terminal Rows
const maxtrw=25;
let Streamline="VirtualARM booted..."
function useink() {
    ink.fillStyle = '#000000';
    ink.fillRect(0,0,500,500);
    ink.font='12px monospace';
    ink.fillStyle='#00ff00';
    //render old
    for(let i=0;i<trw.length;i++){
        ink.fillText(trw[i], 20, 30 + (i * 13)) //13px shift for enough space for 12px font
    }
    ink.fillText(Streamline, 20, 30 + (trw.length * 18))
}

function paint(string) {
    trw.push(string);
    if(trw.length > maxtrw){
        trw.shift(); //removing the first element to make space
    }
    useink();
}

//keyboard input
window.addEventListener('keydown', (x) => {
    if(x.key === 'Enter'){
        paint(string)
        //ARM interpreter takes place here
        string="";//reset
    }else if(x.key==='Backspace'){
        string=string.slice(0,-1);//removin one letter at the end
    }else if(x.key.length===1){
        string+=x.key;//anyother key hook
    }
    useink();
});

//initialize frame
useink();

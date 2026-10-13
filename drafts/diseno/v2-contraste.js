const h=x=>{x=x.replace('#','');return[0,2,4].map(i=>parseInt(x.substr(i,2),16))};
const L=c=>{const [r,g,b]=h(c).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*r+.7152*g+.0722*b};
const cr=(a,b)=>{const x=L(a),y=L(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const T={
light:{bg:'#EDEDED',card:'#FBFBFA',text:'#202A42',muted:'#4A5470',faint:'#5A6480',acc:'#3A51C6',onacc:'#FFFFFF',pbg:'#3A51C6',vio:'#6639BA',ctl:'#5A6480',band:'#202A42',bandfg:'#EDEDED',bandlab:'#A9B8FF',rail:'#526DE5',line:'#A9AFC2'},
dark:{bg:'#0d1117',card:'#21262d',text:'#e6edf3',muted:'#9aa4b0',faint:'#8b95a1',acc:'#58a6ff',onacc:'#0d1117',pbg:'#58a6ff',vio:'#a78bfa',ctl:'#8b949e',band:'#161b22',bandfg:'#e6edf3',bandlab:'#58a6ff',rail:'#58a6ff',line:'#30363d'}};
const pairs=[['text','bg',4.5],['muted','bg',4.5],['faint','bg',4.5],['acc','bg',4.5],['text','card',4.5],['muted','card',4.5],['faint','card',4.5],['acc','card',4.5],['vio','bg',4.5],['vio','card',4.5],['onacc','pbg',4.5],['bandfg','band',4.5],['bandlab','band',4.5],['ctl','bg',3],['rail','bg',3],['acc','band',3]];
let bad=0;for(const k in T){console.log('--',k);for(const [a,b,min] of pairs){const r=cr(T[k][a],T[k][b]);const ok=r>=min;if(!ok)bad++;console.log((ok?'ok  ':'FAIL')+' '+a+' on '+b+' '+r.toFixed(2)+' (min '+min+')')}}
console.log('fallos',bad);

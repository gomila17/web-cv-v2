const h=x=>{x=x.replace('#','');return[0,2,4].map(i=>parseInt(x.substr(i,2),16))};
const L=c=>{const [r,g,b]=h(c).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*r+.7152*g+.0722*b};
const cr=(a,b)=>{const x=L(a),y=L(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const T={
light:{bg:'#EDEDED',surface:'#FBFBFA',ink:'#202A42',muted:'#4A5470',faint:'#5A6480',rule:'#202A42',line:'#A9AFC2',accent:'#526DE5',accentInk:'#3A51C6',onPrimary:'#FFFFFF',primary:'#3A51C6',violet:'#6639BA',ok:'#1A7F37',orange:'#B3470A',ctl:'#5A6480',band:'#202A42',bandInk:'#EDEDED',bandMuted:'#C5CBE0',bandAccent:'#A9B8FF'},
dark:{bg:'#0d1117',surface:'#21262d',ink:'#e6edf3',muted:'#9aa4b0',faint:'#8b95a1',rule:'#8b949e',line:'#30363d',accent:'#58a6ff',accentInk:'#58a6ff',onPrimary:'#0d1117',primary:'#58a6ff',violet:'#a78bfa',ok:'#3fb950',orange:'#f0883e',ctl:'#8b949e',band:'#161b22',bandInk:'#e6edf3',bandMuted:'#9aa4b0',bandAccent:'#58a6ff'}};
const pairs=[['ink','bg',4.5],['muted','bg',4.5],['faint','bg',4.5],['accentInk','bg',4.5],['ink','surface',4.5],['muted','surface',4.5],['faint','surface',4.5],['accentInk','surface',4.5],['violet','bg',3],['violet','surface',3],['onPrimary','primary',4.5],['bandInk','band',4.5],['bandMuted','band',4.5],['bandAccent','band',4.5],['ctl','bg',3],['ctl','surface',3],['rule','bg',3],['accent','bg',3],['accent','surface',3],['ok','surface',3],['orange','surface',4.5],['ok','bg',3],['line','bg',1.0]];
let bad=0;for(const k in T){console.log('--',k);for(const [a,b,min] of pairs){const r=cr(T[k][a],T[k][b]);const ok=r>=min;if(!ok)bad++;console.log((ok?'ok  ':'FAIL')+' '+a+' on '+b+' '+r.toFixed(2)+' (min '+min+')')}}
console.log('fallos',bad);

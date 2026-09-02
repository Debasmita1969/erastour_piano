/* Generated folk brushwork — lifted verbatim from the original
   single-file build. Paints into an <svg> element you hand it. */

/* ══ Painted decoration ════════════════════════════════════════
   Folk brushwork in the antique manner: layered zinnias, ruffled
   peonies and speckled sunflowers strung along a wandering vine,
   in the dusty maroon / mustard / cream palette these pieces are
   always painted in. Seeded, so the painting never changes. */
var NS="http://www.w3.org/2000/svg";
function rng(seed){
  return function(){ seed=(seed*1664525+1013904223)%4294967296; return seed/4294967296; };
}
function j(r,a){ return (r()*2-1)*a; }
function n(v){ return (Math.round(v*10)/10); }
function pick(r,arr){ return arr[Math.floor(r()*arr.length)]; }

/* dusty antique paint box — base coat and the tint it thins to */
var PAINT=[
  {base:"#6E1B2E",lite:"#A8465C"},  /* deep maroon   */
  {base:"#4A1526",lite:"#8A3348"},  /* burgundy      */
  {base:"#D9A62E",lite:"#F2D27B"},  /* mustard       */
  {base:"#EFE6D2",lite:"#FFF9EC"},  /* cream         */
  {base:"#E0A9B0",lite:"#F6D6D8"},  /* dusty pink    */
  {base:"#A99BC9",lite:"#D6CDEA"},  /* lavender      */
  {base:"#C8712B",lite:"#E9A863"},  /* burnt orange  */
  {base:"#5B2C57",lite:"#916089"},  /* plum          */
  {base:"#E8D98E",lite:"#F8F0C6"}   /* pale yellow   */
];
var LEAF="#4E8A72", LEAF_LITE="#82BBA0", LEAF_DARK="#22503E";

/* ── the brush ────────────────────────────────────────────────
   Petals are double-loaded, the way this painting is really done:
   one edge of the stroke carries the light tint, the other the
   dark, so each petal turns. Rings are seated on soft shadow so
   the head domes, and a glaze over the whole bloom keeps every
   flower lit from the same upper-left window. What keeps it a
   hand and not a machine: the outline never registers with the
   paint, no two tints match, and the odd petal is simply missed. */
function hx(c){ return [parseInt(c.substr(1,2),16),parseInt(c.substr(3,2),16),parseInt(c.substr(5,2),16)]; }
function mix(a,b,t){
  var A=hx(a), B=hx(b), o="#";
  for(var i=0;i<3;i++){
    var v=Math.max(0,Math.min(255,Math.round(A[i]+(B[i]-A[i])*t))).toString(16);
    o+=(v.length<2?"0":"")+v;
  }
  return o;
}
var SHADE="#31180F", CHALK="#FFF6E8";
var RAD=Math.PI/180;

function roundPetal(r,L,W){
  var a=W*(0.9+r()*0.32), b=W*(0.9+r()*0.32);
  return "M0,0 C"+n(-a)+","+n(-L*0.3)+" "+n(-a*1.08)+","+n(-L*(0.8+j(r,.06)))+" "+n(j(r,L*0.08))+","+n(-L)+
         " C"+n(b*1.08)+","+n(-L*(0.8+j(r,.06)))+" "+n(b)+","+n(-L*0.3)+" 0,0 Z";
}
function rayPetal(r,L,W){
  var a=W*(0.9+r()*0.3), b=W*(0.9+r()*0.3);
  return "M0,0 C"+n(-a)+","+n(-L*0.36)+" "+n(-a*0.5)+","+n(-L*0.76)+" "+n(j(r,L*0.05))+","+n(-L)+
         " C"+n(b*0.5)+","+n(-L*0.76)+" "+n(b)+","+n(-L*0.36)+" 0,0 Z";
}
function ruffPetal(r,L,W){
  var w=W*(0.82+r()*0.45);
  return "M0,0 C"+n(-w)+","+n(-L*0.26)+" "+n(-w*1.32)+","+n(-L*0.7)+" "+n(-w*0.36)+","+n(-L*0.92)+
         " C"+n(-w*0.05)+","+n(-L*1.06)+" "+n(w*0.42)+","+n(-L*1.02)+" "+n(w*0.46)+","+n(-L*0.87)+
         " C"+n(w*1.28)+","+n(-L*0.64)+" "+n(w)+","+n(-L*0.24)+" 0,0 Z";
}

function petal(r,shape,L,W,ang,c,litness){
  var d=shape(r,L,W);
  var dLine=shape(r,L*(0.97+r()*0.07),W*(0.94+r()*0.14));

  /* how the petal sits to the window: tip brightness, and which of
     its two long edges catches the light */
  var tipLit=Math.max(0,Math.cos((ang+45)*RAD));
  var side=-Math.cos((ang-45)*RAD);
  var sx=side>=0?1:-1, sMag=Math.abs(side);

  var mid=mix(c.base,c.lite,0.10+0.34*tipLit*litness+r()*0.12);
  if(r()<0.2) mid=mix(mid,SHADE,0.06+r()*0.10);
  var lo=mix(mid,SHADE,0.30+r()*0.16);
  var hi=mix(mid,c.lite,0.50+r()*0.28);
  var glint=mix(hi,CHALK,0.34+r()*0.24);

  var g='<g transform="rotate('+n(ang)+') translate('+n(j(r,0.9))+','+n(j(r,0.9))+')">';
  g+='<path d="'+d+'" fill="'+mid+'" opacity="'+(0.8+r()*0.2).toFixed(2)+'"/>';
  /* the dark half of the loaded brush, down the shadow edge */
  g+='<path d="'+d+'" fill="'+lo+'" opacity="'+(0.2+0.3*sMag).toFixed(2)+
     '" transform="translate('+n(-sx*W*0.34)+','+n(-L*0.02)+') scale(0.9)"/>';
  /* and the light half */
  g+='<path d="'+d+'" fill="'+hi+'" opacity="'+(0.26+0.34*sMag).toFixed(2)+
     '" transform="translate('+n(sx*W*0.30)+','+n(-L*0.05)+') scale(0.82)"/>';
  /* the tip, where the paint runs thinnest and the light lands */
  g+='<path d="'+d+'" fill="'+glint+'" opacity="'+(0.14+0.4*tipLit).toFixed(2)+
     '" transform="translate('+n(sx*W*0.12)+','+n(-L*0.2)+') scale(0.52)"/>';
  /* it tucks under its neighbours at the throat */
  g+='<ellipse cx="0" cy="'+n(-L*0.1)+'" rx="'+n(W*0.85)+'" ry="'+n(L*0.15)+
     '" fill="'+lo+'" opacity="'+(0.22+r()*0.16).toFixed(2)+'"/>';

  var streaks=1+Math.floor(r()*2);
  for(var k=0;k<streaks;k++){
    var off=j(r,W*0.5);
    g+='<path d="M'+n(off)+','+n(-L*(0.18+r()*0.14))+' Q'+n(off+j(r,1.5))+','+n(-L*0.56)+
       ' '+n(off+j(r,1.7))+','+n(-L*(0.8+r()*0.14))+
       '" fill="none" stroke="'+glint+'" stroke-width="'+n(W*(0.14+r()*0.24))+
       '" stroke-linecap="round" opacity="'+(0.12+r()*0.24).toFixed(2)+'"/>';
  }
  g+='<path d="'+dLine+'" fill="none" stroke="rgba(42,22,16,.13)" stroke-width="'+
     (0.35+r()*0.3).toFixed(2)+'" transform="translate('+n(j(r,0.8))+','+n(j(r,0.8))+')"/>';
  return g+'</g>';
}

/* the domed eye at the middle of a bloom */
function eye(r,rad,dark,light){
  return '<circle cx="'+n(j(r,.8))+'" cy="'+n(j(r,.8))+'" r="'+n(rad)+'" fill="'+dark+'" opacity=".85"/>'+
         '<circle cx="'+n(-rad*0.3)+'" cy="'+n(-rad*0.32)+'" r="'+n(rad*0.62)+
           '" fill="'+light+'" opacity=".45"/>'+
         '<circle cx="'+n(-rad*0.38)+'" cy="'+n(-rad*0.4)+'" r="'+n(rad*0.2)+
           '" fill="'+CHALK+'" opacity=".4"/>';
}

/* ── flower types ─────────────────────────────────────────────── */
function zinnia(r,sc,c,rot,id){
  var g="", rings=3+Math.floor(r()*2);
  for(var ring=0;ring<rings;ring++){
    var t=ring/(rings-1);
    var L=(16-9.5*t)*sc, W=(4.8-2.3*t)*sc;
    var count=Math.max(5,Math.round((10.5-3*t)+j(r,1.5)));
    var off=r()*360;
    g+='<g transform="translate('+n(j(r,1.7*sc))+','+n(j(r,1.7*sc))+')">';
    /* each ring seats on a soft shadow, which is what makes the
       head read as a dome rather than a flat rosette */
    if(ring>0) g+='<ellipse rx="'+n(L*1.15)+'" ry="'+n(L*1.1)+'" fill="url(#shade-'+id+
                  ')" opacity="'+(0.30+r()*0.12).toFixed(2)+'"/>';
    for(var i=0;i<count;i++){
      if(r()<0.05) continue;
      g+=petal(r,roundPetal,L*(0.88+r()*0.24),W,rot+off+(360/count)*i+j(r,9),c,1-0.3*t);
    }
    g+='</g>';
  }
  return g+eye(r,1.9*sc,"#3A1D0E",mix(c.lite,CHALK,.4));
}

function sunflower(r,sc,rot,id){
  var g="", rays=12+Math.floor(r()*5);
  var c=r()<.5?{base:"#D9A62E",lite:"#F2D680"}:{base:"#E4D68C",lite:"#F8F1C8"};
  for(var k=0;k<2;k++){
    var L=(25-k*7)*sc, W=4.4*sc, off=k*(180/rays)+j(r,8);
    g+='<g transform="translate('+n(j(r,1.4*sc))+','+n(j(r,1.4*sc))+')">';
    if(k) g+='<ellipse rx="'+n(L*1.2)+'" ry="'+n(L*1.15)+'" fill="url(#shade-'+id+')" opacity=".3"/>';
    for(var i=0;i<rays;i++){
      if(r()<0.05) continue;
      g+=petal(r,rayPetal,L*(0.85+r()*0.3),W,rot+off+(360/rays)*i+j(r,6),c,0.9);
    }
    g+='</g>';
  }
  g+='<circle r="'+n(7.6*sc)+'" fill="#472817" opacity=".93"/>';
  for(var s2=0;s2<28;s2++){
    var a=r()*6.2832, rr=Math.sqrt(r())*6.8*sc;
    g+='<circle cx="'+n(Math.cos(a)*rr)+'" cy="'+n(Math.sin(a)*rr)+'" r="'+(0.6*sc).toFixed(2)+
       '" fill="'+(r()<.4?"#9A6626":"#2A1508")+'" opacity="'+(.45+r()*.5).toFixed(2)+'"/>';
  }
  /* the seed head is a cushion, not a disc */
  g+='<ellipse cx="'+n(-2.2*sc)+'" cy="'+n(-2.4*sc)+'" rx="'+n(4.4*sc)+'" ry="'+n(4*sc)+
     '" fill="url(#dome-'+id+')" opacity=".3"/>';
  g+='<ellipse cx="'+n(2.4*sc)+'" cy="'+n(2.6*sc)+'" rx="'+n(5*sc)+'" ry="'+n(4.6*sc)+
     '" fill="url(#shade-'+id+')" opacity=".45"/>';
  return g;
}

function ruffle(r,sc,c,rot,id){
  var g="", outer=7+Math.floor(r()*4);
  for(var ring=0;ring<2;ring++){
    var count=Math.max(4,outer-ring*3);
    var L=(14.5-ring*5.5)*sc, W=(6.8-ring*1.7)*sc;
    g+='<g transform="translate('+n(j(r,1.6*sc))+','+n(j(r,1.6*sc))+')">';
    if(ring) g+='<ellipse rx="'+n(L*1.5)+'" ry="'+n(L*1.4)+'" fill="url(#shade-'+id+')" opacity=".34"/>';
    for(var i=0;i<count;i++){
      if(r()<0.05) continue;
      g+=petal(r,ruffPetal,L*(0.9+r()*0.2),W,rot+(360/count)*i+j(r,15)+ring*22,c,1-0.25*ring);
    }
    g+='</g>';
  }
  return g+eye(r,2.3*sc,mix(c.base,SHADE,.3),mix(c.lite,CHALK,.5));
}

function daisy(r,sc,c,rot,id){
  var g="", count=7+Math.floor(r()*4);
  for(var i=0;i<count;i++){
    if(r()<0.05) continue;
    g+=petal(r,roundPetal,11.5*sc*(0.88+r()*0.28),3.7*sc,rot+(360/count)*i+j(r,10),c,1);
  }
  g+='<ellipse rx="'+n(4.2*sc)+'" ry="'+n(4*sc)+'" fill="url(#shade-'+id+')" opacity=".4"/>';
  return g+eye(r,3*sc,"#B98C1C","#F3D678");
}

/* a closed bud, for the ends of the thinner shoots */
function bud(r,sc,c,rot,id){
  var L=11*sc, W=5*sc;
  var g='<g transform="rotate('+n(rot)+')">';
  g+='<path d="M0,0 C'+n(-W)+','+n(-L*0.45)+' '+n(-W*0.7)+','+n(-L)+' 0,'+n(-L*1.12)+
     ' C'+n(W*0.7)+','+n(-L)+' '+n(W)+','+n(-L*0.45)+' 0,0 Z" fill="'+c.base+'" opacity=".94"/>';
  g+='<path d="M0,0 C'+n(-W*0.5)+','+n(-L*0.5)+' '+n(-W*0.42)+','+n(-L*0.9)+' '+n(-W*0.1)+','+n(-L*1.05)+
     ' C'+n(W*0.1)+','+n(-L*0.86)+' '+n(W*0.08)+','+n(-L*0.4)+' 0,0 Z" fill="'+
     mix(c.lite,CHALK,.25)+'" opacity=".55"/>';
  /* calyx */
  g+='<path d="M'+n(-W*0.9)+','+n(-L*0.1)+' Q0,'+n(-L*0.62)+' '+n(W*0.9)+','+n(-L*0.1)+
     ' Q0,'+n(L*0.2)+' '+n(-W*0.9)+','+n(-L*0.1)+' Z" fill="'+LEAF+'" opacity=".95"/>';
  g+='<ellipse cy="'+n(-L*0.5)+'" rx="'+n(W*1.1)+'" ry="'+n(L*0.7)+'" fill="url(#shade-'+id+
     ')" opacity=".22" transform="translate('+n(W*0.35)+','+n(L*0.1)+')"/>';
  return g+'</g>';
}

function bloom(r,cx,cy,sc,id,small){
  var c=pick(r,PAINT), roll=r(), rot=j(r,34), body, R=16*sc;
  if(small && roll<0.35)   { body=bud(r,sc,c,rot+j(r,40),id); R=11*sc; }
  else if(roll<0.42)         body=zinnia(r,sc,c,rot,id);
  else if(roll<0.64)         body=ruffle(r,sc,c,rot,id);
  else if(roll<0.80)         body=sunflower(r,sc,rot,id);
  else                       body=daisy(r,sc,c,rot,id);
  /* heads are never quite round, and every one is lit by the same
     window: glaze on the upper left, shade falling lower right */
  return '<g transform="translate('+n(cx)+','+n(cy)+') scale('+(0.93+r()*0.14).toFixed(2)+','+
           (0.93+r()*0.14).toFixed(2)+')">'+
         '<ellipse cx="2" cy="3" rx="'+n(R*0.9)+'" ry="'+n(R*0.84)+'" fill="rgba(16,8,3,.16)"/>'+
         body+
         '<ellipse cx="'+n(-R*0.3)+'" cy="'+n(-R*0.32)+'" rx="'+n(R*0.78)+'" ry="'+n(R*0.74)+
           '" fill="url(#dome-'+id+')" opacity=".22"/>'+
         '<ellipse cx="'+n(R*0.34)+'" cy="'+n(R*0.36)+'" rx="'+n(R*0.8)+'" ry="'+n(R*0.76)+
           '" fill="url(#shade-'+id+')" opacity=".26"/>'+
         '</g>';
}

/* leaves go on in two strokes, one per half, so the halves never
   match — and the shadow half turns the leaf away from the light */
function leaf(r,cx,cy,ang,sc){
  var L=18*sc*(0.85+r()*0.4), W=6.6*sc*(0.85+r()*0.35);
  var lit=Math.max(0,Math.cos((ang+45)*RAD));
  var side=-Math.cos((ang-45)*RAD), sx=side>=0?1:-1;
  var half=function(dir){
    return "M0,0 C"+n(dir*W)+","+n(-L*0.28)+" "+n(dir*W*(0.72+r()*0.2))+","+n(-L*(0.74+j(r,.05)))+
           " "+n(j(r,1.4))+","+n(-L)+" L"+n(j(r,.8))+",0 Z";
  };
  var g='<g transform="translate('+n(cx)+','+n(cy)+') rotate('+n(ang)+')">';
  g+='<path d="'+half(sx)+'" fill="'+mix(LEAF,LEAF_LITE,0.14+0.42*lit+r()*0.16)+
     '" opacity="'+(0.84+r()*0.16).toFixed(2)+'"/>';
  g+='<path d="'+half(-sx)+'" fill="'+mix(LEAF,SHADE,0.12+r()*0.18)+
     '" opacity="'+(0.84+r()*0.16).toFixed(2)+'"/>';
  g+='<path d="M'+n(j(r,.8))+',0 Q'+n(j(r,1.2))+','+n(-L*0.5)+' '+n(j(r,1))+','+n(-L*0.9)+
     '" fill="none" stroke="'+mix(LEAF,LEAF_LITE,0.6)+'" stroke-width="'+n(0.85*sc)+
     '" stroke-linecap="round" opacity=".42"/>';
  g+='<path d="'+half(sx)+'" fill="none" stroke="rgba(20,48,38,.16)" stroke-width="'+
     (0.4+r()*0.25).toFixed(2)+'" transform="translate('+n(j(r,.7))+','+n(j(r,.7))+')"/>';
  return g+'</g>';
}

function vine(r,d,w){
  return '<path d="'+d+'" fill="none" stroke="'+LEAF_DARK+'" stroke-width="'+n(w*1.5)+
           '" stroke-linecap="round" opacity=".62" transform="translate('+n(j(r,.9))+','+n(j(r,.9))+')"/>'+
         '<path d="'+d+'" fill="none" stroke="'+LEAF+'" stroke-width="'+n(w*(0.9+r()*0.2))+
           '" stroke-linecap="round" opacity=".95"/>'+
         '<path d="'+d+'" fill="none" stroke="'+LEAF_LITE+'" stroke-width="'+n(w*0.28)+
           '" stroke-linecap="round" opacity=".42" transform="translate('+n(j(r,.7))+','+n(-w*0.32)+')"/>';
}

function meander(r,x0,y0,x1,y1,segs,amp){
  var d="M"+n(x0)+","+n(y0), px=x0, py=y0;
  for(var i=1;i<=segs;i++){
    var t=i/segs, x=x0+(x1-x0)*t, y=y0+(y1-y0)*t+j(r,amp*0.5);
    d+=" Q"+n((px+x)/2+j(r,amp*0.7))+","+n((py+y)/2+j(r,amp))+" "+n(x)+","+n(y);
    px=x; py=y;
  }
  return d;
}

/* ── the whole panel ──────────────────────────────────────────── */
function paint(svg,w,h,seed,id,opts){
  opts=opts||{};
  var r=rng(seed);
  svg.setAttribute("viewBox","0 0 "+w+" "+h);
  svg.innerHTML="";

  /* a probe path lets us walk the real curve to hang leaves and
     blossoms off it at the right angle */
  var probe=document.createElementNS(NS,"path");
  svg.appendChild(probe);
  function walk(d,step,fn){
    probe.setAttribute("d",d);
    var total=probe.getTotalLength();
    for(var len=step*0.6; len<total-step*0.3; len+=step){
      var p=probe.getPointAtLength(len), q=probe.getPointAtLength(Math.min(total,len+1));
      fn(p,Math.atan2(q.y-p.y,q.x-p.x)*180/Math.PI,len/total);
    }
  }
  function at(d,t){
    probe.setAttribute("d",d);
    return probe.getPointAtLength(probe.getTotalLength()*t);
  }

  /* routed panel frames, cut into the wood before anything is painted */
  var routing="";
  var frames=opts.frames||1, pad=9, gap=10;
  var fw=(w-pad*2-gap*(frames-1))/frames;
  for(var f=0;f<frames;f++){
    var fx=pad+f*(fw+gap);
    routing+='<rect x="'+n(fx)+'" y="'+pad+'" width="'+n(fw)+'" height="'+n(h-pad*2)+
      '" rx="7" fill="rgba(0,0,0,.13)" stroke="rgba(0,0,0,.5)" stroke-width="2.5"/>'+
      '<rect x="'+n(fx+2)+'" y="'+(pad+2)+'" width="'+n(fw-4)+'" height="'+n(h-pad*2-4)+
      '" rx="6" fill="none" stroke="rgba(255,214,168,.10)" stroke-width="1.4"/>';
  }

  /* the vine network: long lanes across the panel plus offshoots */
  var lanes=opts.lanes||2, paths=[], vines="", leaves="", blooms="";
  for(var b=0;b<lanes;b++){
    var y=lanes===1 ? h*0.52 : h*(0.30+0.42*(b/(lanes-1)));
    paths.push(meander(r,-16,y+j(r,h*0.06),w+16,y+j(r,h*0.06),
                       Math.max(3,Math.round(w/165)), h*0.18));
  }
  var shoots=Math.max(2,Math.round(w/270));
  for(var k=0;k<shoots;k++){
    var host=paths[Math.floor(r()*lanes)];
    var p0=at(host,0.06+r()*0.88);
    var dir=r()<.5?-1:1;
    var ty=Math.max(14,Math.min(h-14,p0.y+dir*h*(0.20+r()*0.22)));
    paths.push(meander(r,p0.x,p0.y,p0.x+j(r,w*0.06),ty,2,h*0.10));
  }

  paths.forEach(function(d,i){
    vines+=vine(r,d, i<lanes?3.1:2.1);
    walk(d, i<lanes?42:34, function(p,ang){
      if(r()<0.30) return;                       /* leave gaps, as a hand would */
      leaves+=leaf(r,p.x,p.y,ang+90+j(r,16),0.85+r()*0.4);
      leaves+=leaf(r,p.x,p.y,ang-90+j(r,16),0.85+r()*0.4);
    });
    /* every offshoot ends in a flower */
    if(i>=lanes){
      var tip=at(d,1);
      blooms+=bloom(r,tip.x,Math.max(16,Math.min(h-16,tip.y)),0.8+r()*0.55,id,true);
    }
  });

  /* heads strung along the lanes, then fillers to crowd it up */
  paths.slice(0,lanes).forEach(function(d){
    walk(d, opts.density||96, function(p){
      blooms+=bloom(r,p.x+j(r,10),Math.max(16,Math.min(h-16,p.y+j(r,h*0.10))),0.78+r()*0.62,id,false);
    });
  });
  var fill=Math.round(w/(opts.filler||150));
  for(var q=0;q<fill;q++){
    blooms+=bloom(r, w*((q+0.5)/fill)+j(r,26),
                  Math.max(18,Math.min(h-18,h*(0.2+r()*0.6))), 0.62+r()*0.45, id, true);
  }

  var art=vines+leaves+blooms;
  svg.innerHTML='<defs>'+
    '<radialGradient id="dome-'+id+'"><stop offset="0%" stop-color="#FFF3DC" stop-opacity=".9"/>'+
      '<stop offset="100%" stop-color="#FFF3DC" stop-opacity="0"/></radialGradient>'+
    '<radialGradient id="shade-'+id+'"><stop offset="0%" stop-color="#22100A" stop-opacity=".85"/>'+
      '<stop offset="100%" stop-color="#22100A" stop-opacity="0"/></radialGradient>'+
    '<filter id="brush-'+id+'" x="-12%" y="-18%" width="124%" height="136%">'+
      '<feTurbulence type="fractalNoise" baseFrequency="0.045 0.075" numOctaves="2" seed="'+
        (seed%97)+'" result="noise"/>'+
      '<feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" '+
        'xChannelSelector="R" yChannelSelector="G" result="rough"/>'+
      /* the paint soaks a hair into the grain — nothing on wood
         has a crisp edge */
      '<feGaussianBlur in="rough" stdDeviation="0.5" result="soft"/>'+
      /* bristle texture: high-frequency noise eaten out of the
         alpha, so the paint thins and skips like a dry brush */
      '<feTurbulence type="fractalNoise" baseFrequency="0.14 0.5" numOctaves="3" seed="'+
        ((seed+31)%89)+'" result="bristle"/>'+
      '<feColorMatrix in="bristle" type="matrix" result="bristleA" values="'+
        '0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.42 0 0 0 0.62"/>'+
      '<feComposite in="soft" in2="bristleA" operator="arithmetic" k1="1" k2="0" k3="0" k4="0"/>'+
    '</filter></defs>'+
    routing+
    '<g filter="url(#brush-'+id+')">'+art+'</g>';
}

export { paint };

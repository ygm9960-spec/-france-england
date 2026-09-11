// Approximate source-pixel face height and eye position, manually calibrated.
window.PORTRAIT_METRICS={
 louis14:[1152,768,120,106,603],anne_louis:[1152,768,130,145,591],
 french_official:[768,1152,180,149,447],french_reporter:[768,1152,180,149,447],
 robert:[768,1152,176,165,379],mp_leader:[768,1152,184,149,355],
 mp_secondary:[768,1152,180,155,384],parlement_rep:[768,1152,180,155,384],
 english_general:[768,1152,180,155,384],elizabeth:[768,1152,170,160,384],
 james1:[768,1152,180,155,384],charles1:[768,1152,180,155,384],james2:[768,1152,180,155,384]
};
window.portraitFrames=function(cast,width,height){
 const known=cast.filter(e=>PORTRAIT_METRICS[e.id]),cap=cast.length>=3?.43:.64;
 const face=Math.min(height*.155,...known.map(e=>{const m=PORTRAIT_METRICS[e.id];return width*cap*m[2]/m[0]}));
 return cast.map(e=>{
  const m=PORTRAIT_METRICS[e.id];if(!m)return null;
  const scale=face/m[2],center=cast.length===1?.5:e.slot==='left'?.28:e.slot==='right'?.77:.52,w=m[0]*scale;
  return {id:e.id,width:w,height:m[1]*scale,left:Math.max(4,Math.min(width-w-4,width*center-m[4]*scale)),top:height*.22-m[3]*scale,face};
 });
};

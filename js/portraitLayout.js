// v0.41 head-safe automatic portrait layout · stable spacing + silhouette geometry.
// Approximate source-pixel face height / eye position. Scene-specific manual coordinates are intentionally not used.
window.PORTRAIT_METRICS={
 louis14:[1152,768,120,106,603],anne_louis:[1152,768,130,145,591],
 french_official:[768,1152,180,149,447],french_reporter:[768,1152,180,149,447],
 robert:[768,1152,176,165,379],mp_leader:[768,1152,184,149,355],
 mp_secondary:[768,1152,180,155,384],parlement_rep:[768,1152,180,155,384],
 english_general:[768,1152,180,155,384],elizabeth:[768,1152,170,160,384],
 james1:[768,1152,180,155,384],charles1:[768,1152,180,155,384],james2:[768,1152,180,155,384],
 maid:[768,1152,180,155,384],french_general:[768,1152,180,155,384],unknown:[768,1152,180,155,384]
};
window.portraitFrames=function(cast,width,height){
 const known=cast.filter(e=>PORTRAIT_METRICS[e.id]);
 if(!known.length)return cast.map(()=>null);
 const count=cast.length;
 const cap=count>=3?.38:count===2?.50:.58;
 const face=Math.min(height*.148,...known.map(e=>{const m=PORTRAIT_METRICS[e.id];return width*cap*m[2]/m[0]}));
 const centers=count===1?{left:.50,center:.50,right:.50}:count===2?{left:.34,center:.50,right:.66}:{left:.25,center:.50,right:.75};
 const safeTop=Math.max(12,height*.035);
 const commonEye=Math.max(height*.31,safeTop+Math.max(...known.map(e=>{const m=PORTRAIT_METRICS[e.id];return m[3]*face/m[2]})));
 // Lift the whole cast slightly so the dialogue band covers less of the torso.
 // Keep scale and horizontal composition unchanged.
 const portraitLift=Math.min(34,height*.065);
 return cast.map(e=>{
  const m=PORTRAIT_METRICS[e.id];if(!m)return null;
  const scale=face/m[2],w=m[0]*scale,h=m[1]*scale;
  const center=centers[e.slot]??.5;
  const top=Math.max(safeTop,commonEye-m[3]*scale-portraitLift);
  const left=Math.max(6,Math.min(width-w-6,width*center-m[4]*scale));
  return {id:e.id,width:w,height:h,left,top,face};
 });
};

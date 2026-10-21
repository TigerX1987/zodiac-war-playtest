// Effect coordinates follow the three approved source images, rather than viewport guesses.
export const ARTWORKS = {
  'hero-wide-open-r12.webp': {width:1672,height:941,maps:{moon:[0,0,1,1],fire:[0,0,1,1],water:[0,0,1,1],sea:[0,0,1,1]},cards:{fire:[[95,271],[267,259],[335,506],[151,521]],water:[[1264,323],[1361,342],[1327,486],[1230,469]]}},
  'hero-landscape-open-r12.webp': {width:1843,height:853,maps:{moon:[-42.5,-16.645,.85,.85],fire:[3.5,4,.92,.90],water:[-11,5,.89,.89],sea:[-160,-40,1,.90]},cards:{fire:[[90,249],[240,237],[312,458],[151,471]],water:[[1146,292],[1233,310],[1199,439],[1113,423]]}},
  'hero-portrait-half-r12.webp': {width:887,height:1930,maps:{moon:[-1563.5,-185.865,1.45,1.45],fire:[-31.5,450.5,.72,.72],water:[-496,372,1,1],sea:[-2880,-337.4,2.23,2.6]},cards:{fire:[[38,650],[152,637],[213,813],[84,829]],water:[[771,694],[853,717],[817,848],[737,823]]}}
};
export const REGIONS={moon:[1390,80,1616,373],fire:[55,140,409,470],water:[1194,278,1418,515],sea:[1370,649,1614,722]};
export function artworkProfile(src){return ARTWORKS[new URL(src,'https://local.invalid/').pathname.split('/').pop()];}
export function fitArtwork(width,height,art,fit='cover',position='50% 50%'){
 const scale=(fit==='contain'?Math.min:Math.max)(width/art.width,height/art.height);
 const tokens=position.split(' '),fraction=value=>({left:0,top:0,center:.5,right:1,bottom:1}[value]??(parseFloat(value)/100));
 return {scale,x:(width-art.width*scale)*fraction(tokens[0]),y:(height-art.height*scale)*fraction(tokens[1]??tokens[0])};
}
export function materialPass(art,kind){
 const map=art.maps[kind],r=REGIONS[kind];
 return {map,region:[r[0]*map[2]+map[0],r[1]*map[3]+map[1],r[2]*map[2]+map[0],r[3]*map[3]+map[1]],quad:art.cards[kind]?.map(([x,y])=>[(x-map[0])/map[2],(y-map[1])/map[3]])??ARTWORKS['hero-wide-open-r12.webp'].cards.fire};
}
export function toScissor(region,fit,width,height,dpr=1){
 const [x1,y1,x2,y2]=region;
 const left=Math.min(Math.round(width*dpr),Math.max(0,Math.floor((fit.x+x1*fit.scale)*dpr)));
 const right=Math.max(0,Math.min(Math.round(width*dpr),Math.ceil((fit.x+x2*fit.scale)*dpr)));
 const top=Math.min(Math.round(height*dpr),Math.max(0,Math.floor((fit.y+y1*fit.scale)*dpr)));
 const bottom=Math.max(0,Math.min(Math.round(height*dpr),Math.ceil((fit.y+y2*fit.scale)*dpr)));
 return [left,Math.round(height*dpr)-bottom,Math.max(0,right-left),Math.max(0,bottom-top)];
}

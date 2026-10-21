export const vertexSource=`
attribute vec2 aPosition;
void main(){gl_Position=vec4(aPosition,0.0,1.0);}
`;
export const fragmentSource=`
precision highp float;
uniform sampler2D uImage;
uniform vec2 uResolution;
uniform vec2 uOffset;
uniform float uScale;
uniform float uTime;
uniform float uBlood;
uniform float uMotion;
uniform vec2 uArtSize;
uniform vec4 uRegionMap;
uniform vec2 uCard0,uCard1,uCard2,uCard3;
vec2 imageUv(vec2 p){return (p*uRegionMap.zw+uRegionMap.xy)/uArtSize;}
float box(vec2 p,vec4 r,float f){
 return smoothstep(r.x,r.x+f,p.x)*(1.0-smoothstep(r.z-f,r.z,p.x))*smoothstep(r.y,r.y+f,p.y)*(1.0-smoothstep(r.w-f,r.w,p.y));
}
float cross2(vec2 a,vec2 b){return a.x*b.y-a.y*b.x;}
float protectedQuad(vec2 p,vec2 a,vec2 b,vec2 c,vec2 d){
 float dist=min(min(cross2(b-a,p-a)/length(b-a),cross2(c-b,p-b)/length(c-b)),min(cross2(d-c,p-c)/length(d-c),cross2(a-d,p-d)/length(a-d)));
 return smoothstep(-9.0,-3.0,dist);
}
float fireCard(vec2 p){return protectedQuad(p,uCard0,uCard1,uCard2,uCard3);}
float waterCard(vec2 p){return protectedQuad(p,uCard0,uCard1,uCard2,uCard3);}
float noise1(float x){return fract(sin(x*127.1+17.3)*43758.5453);}
float noise2(vec2 p){
 vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 float a=noise1(dot(i,vec2(1.,157.))),b=noise1(dot(i+vec2(1.,0.),vec2(1.,157.)));
 float c=noise1(dot(i+vec2(0.,1.),vec2(1.,157.))),d=noise1(dot(i+vec2(1.,1.),vec2(1.,157.)));
 return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}
float warm(vec3 c){return smoothstep(.18,.50,c.r-c.b)*smoothstep(.32,.79,max(c.r,c.g));}
float aqua(vec3 c){return smoothstep(.025,.19,c.b-c.r)*smoothstep(.005,.14,c.g-c.r)*smoothstep(.34,.68,c.b);}
vec3 art(vec2 p){return texture2D(uImage,imageUv(p)).rgb;}
void main(){
 vec2 view=vec2(gl_FragCoord.x,uResolution.y-gl_FragCoord.y);
 vec2 p=((view-uOffset)/uScale-uRegionMap.xy)/uRegionMap.zw;
 vec4 source=texture2D(uImage,imageUv(p));
 vec3 rgb=source.rgb;
 vec3 result=rgb;
 float support=0.0;
 // Keep lunar craters and the existing light direction. Warm halo follows the disk.
 float md=length(p-vec2(1530.0,213.7));
 float disk=1.0-smoothstep(40.8,42.8,md);
 float halo=(1.0-smoothstep(41.0,67.0,md))*(1.0-disk);
 float luminance=dot(rgb,vec3(.2126,.7152,.0722));
 vec3 blood=vec3(luminance*.92,luminance*.29,luminance*.21);
 blood=mix(blood,vec3(.86,.48,.28),smoothstep(.84,1.0,luminance)*.08);
 result=mix(result,blood,disk*uBlood*.94);
 result+=vec3(.075,.006,.001)*halo*uBlood;
 support=max(support,(disk+halo)*uBlood);
 // Reflected red moonlight follows the bright cloud texture, not a flat red disk.
 float cloudArea=box(p,vec4(1392.,82.,1615.,371.),22.);
 float cloudFalloff=1.0-smoothstep(45.0,153.0,md);
 float cloudDetail=smoothstep(.115,.34,luminance);
 cloudDetail*=1.0-smoothstep(.62,.86,max(rgb.r,max(rgb.g,rgb.b)));
 cloudDetail*=smoothstep(-.025,.055,rgb.b-rgb.r);
 float cloud=cloudArea*cloudFalloff*cloudDetail*(1.0-disk)*uBlood;
 vec3 litCloud=vec3(luminance*1.18,luminance*.47,luminance*.43);
 result=mix(result,litCloud,cloud*.60);
 support=max(support,cloud);
 // Advect and curl the ORIGINAL fire texture upward. Both ends of every sample
 // stay outside the card protection polygon; fingers and the wrist are below it.
 float fireArea=box(p,vec4(58.,146.,403.,467.),20.)*(1.-fireCard(p));
 fireArea*=1.0-smoothstep(445.,465.,p.y);
 fireArea*=1.0-smoothstep(mix(390.,327.,smoothstep(300.,440.,p.y)),mix(407.,343.,smoothstep(300.,440.,p.y)),p.x);
 if(fireArea>.001&&uMotion>.0){
  vec2 n=vec2(p.x*.023,p.y*.019+uTime*.92);
  float curl=(noise2(n)*2.-1.)*9.+sin(p.y*.041+uTime*2.7)*3.;
  float lift=(noise2(n*1.7+vec2(19.,7.))*2.-1.)*4.;
  vec2 displaced=p+vec2(curl,lift)*fireArea;
  vec3 flowing=mix(art(displaced),rgb,fireCard(displaced));
  float material=max(warm(rgb),warm(flowing))*fireArea;
  float flicker=1.+sin(uTime*5.1+p.y*.039)*.035;
  result=mix(result,flowing*flicker,material*.96);
  support=max(support,material);
 }
 // Sparse embers are confined above the fire card, away from faces and controls.
 for(int i=0;i<9;i++){
  float id=float(i),life=3.2+noise1(id+9.)*2.0;
  float phase=fract(uTime/life+noise1(id+41.));
  float x=100.+noise1(id+2.)*235.+sin(phase*4.5+id)*7.;
  float y=270.+noise1(id+5.)*140.-phase*(110.+noise1(id+23.)*55.);
  vec2 q=(p-vec2(x,y))/vec2(.85+noise1(id+6.)*.6,1.7);
  float spark=exp(-dot(q,q)*1.8)*smoothstep(0.,.16,phase)*(1.-smoothstep(.74,1.,phase))*uMotion*(1.-fireCard(p));
  result+=vec3(.50,.24,.06)*spark;
  support=max(support,spark);
 }
 // Transport water detail clockwise around the card. Half-cycle crossfades hide
 // the UV reset, so there is no visible jump at the end of a flow cycle.
 vec2 waterEllipse=(p-vec2(1297.,402.))/vec2(96.,117.);
 float belt=smoothstep(.59,.78,length(waterEllipse))*(1.-smoothstep(1.12,1.25,length(waterEllipse)));
 float waterArea=box(p,vec4(1196.,279.,1416.,514.),17.)*(1.-waterCard(p))*belt;
 waterArea*=1.-smoothstep(498.,513.,p.y);
 if(waterArea>.001&&uMotion>.0){
  vec2 ellipse=(p-vec2(1297.,402.))/vec2(96.,117.);
  vec2 tangent=normalize(vec2(-ellipse.y*96.,ellipse.x*117.));
  vec2 normal=vec2(-tangent.y,tangent.x);
  float angle=atan(ellipse.y,ellipse.x);
  float ripple=sin(angle*7.-uTime*2.25+length(ellipse)*5.)*2.6;
  float phase=fract(uTime*.46),other=fract(phase+.5);
  float blend=1.-abs(phase*2.-1.);
  vec2 a=p+(tangent*(-20.*(phase-.5))+normal*ripple)*waterArea;
  vec2 b=p+(tangent*(-20.*(other-.5))+normal*ripple)*waterArea;
  vec3 sampleA=mix(art(a),rgb,waterCard(a));
  vec3 sampleB=mix(art(b),rgb,waterCard(b));
  vec3 flowing=mix(sampleB,sampleA,blend);
  float material=max(aqua(rgb),aqua(flowing))*waterArea;
  float crest=pow(.5+.5*sin(angle*4.-uTime*2.25+length(ellipse)*6.),4.);
  flowing+=vec3(.025,.075,.095)*(crest-.2)*aqua(flowing);
  result=mix(result,flowing,material*.95);
  support=max(support,material);
 }
 // Small horizontal gleams, confined to open sea; the mountain and cape are static.
 float sea=box(p,vec4(1373.,650.,1612.,721.),7.);
 sea*=smoothstep(1392.,1425.,p.x-(p.y-650.)*.42);
 sea*=smoothstep(.015,.12,rgb.b-rgb.r);
 float rows=.5+.5*sin(p.y*1.8+sin(p.x*.035-uTime*.35)*.65);
 float glint=pow(rows,9.)*pow(.5+.5*sin(p.x*.081-uTime*.72+sin(p.y*.5)),4.);
 result+=vec3(.035,.065,.09)*sea*(glint-.08)*uMotion;
 support=max(support,sea*uMotion);
 if(support<.001)discard;
 gl_FragColor=vec4(clamp(result,0.,1.),1.0);
}
`;

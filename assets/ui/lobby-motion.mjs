import {artworkProfile,fitArtwork,materialPass,toScissor} from './lobby-motion-geometry.mjs?v=web-9f5a6f776579d6db';
import {vertexSource,fragmentSource} from './lobby-motion-shader.mjs?v=web-9f5a6f776579d6db';

const root=document.getElementById('startScreen'),image=root?.querySelector('.scene-art img');
if(root&&image)start(root,image);
function start(root,image){
 const canvas=document.createElement('canvas');canvas.className='lobby-motion-layer';canvas.setAttribute('aria-hidden','true');root.append(canvas);
 const output=document.createElement('output');output.id='lobbyMotionStatus';output.hidden=true;root.append(output);
 const gl=canvas.getContext('webgl',{alpha:true,antialias:false,depth:false,stencil:false,premultipliedAlpha:false,powerPreference:'low-power'});
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const enabled=()=>!reduced.matches;
 let ready=false,disposed=false,profile,fit,width=0,height=0,dpr=1,raf=0,last=0,time=0,deadline=0,rendered=0,paused=true,blood=0,targetBlood=0,lastReport=0;
 let uniforms={};
 const report=extra=>{output.textContent=JSON.stringify({ready,enabled:enabled(),paused,mode:root.dataset.mode||'standard',blood:Math.round(blood*1000)/1000,rendered,effectSeconds:time,art:profile?[profile.width,profile.height]:null,viewport:[width,height],...extra});};
 const canRun=()=>!disposed&&!document.hidden&&!root.hidden&&!root.querySelector('dialog[open]');
 function compile(type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(shader));return shader;}
 function render(){
  if(!ready||disposed||!fit||!width||!height)return;
  gl.disable(gl.SCISSOR_TEST);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.enable(gl.SCISSOR_TEST);
  gl.uniform1f(uniforms.uTime,time);gl.uniform1f(uniforms.uBlood,blood);gl.uniform1f(uniforms.uMotion,enabled()?1:0);
  const kinds=[...(blood>.0001?['moon']:[]),...(enabled()?['fire','water','sea']:[])];canvas.hidden=!kinds.length;
  for(const kind of kinds){
   const pass=materialPass(profile,kind),box=toScissor(pass.region,fit,width,height,dpr);
   if(!box[2]||!box[3])continue;
   gl.uniform4f(uniforms.uRegionMap,...pass.map);
   for(const[index,point]of pass.quad.entries())gl.uniform2f(uniforms['uCard'+index],...point);
   gl.scissor(...box);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  }
  gl.disable(gl.SCISSOR_TEST);rendered++;
 }
 function tick(now){
  raf=0;if(!canRun()){paused=true;last=0;report();return;}
  paused=false;const elapsed=last?Math.min((now-last)/1000,.1):0;last=now;
  if(enabled())time+=elapsed;
  blood+=(targetBlood-blood)*(1-Math.exp(-elapsed*5.2));if(Math.abs(targetBlood-blood)<.001)blood=targetBlood;
  if(now>=deadline){render();deadline=now+1000/(width<900?24:30);}
  if(now-lastReport>500){lastReport=now;report();}
  if(enabled()||blood!==targetBlood)raf=requestAnimationFrame(tick);else{paused=true;last=0;report();}
 }
 function wake(){if(!ready||!canRun()||raf)return;last=0;deadline=0;raf=requestAnimationFrame(tick);}
 function interrupt(){if(!canRun()){if(raf)cancelAnimationFrame(raf);raf=0;last=0;paused=true;report();}else wake();}
 function resize(){
  if(!ready||root.hidden)return;
  width=root.clientWidth;height=root.clientHeight;if(!width||!height)return;
  dpr=Math.min(devicePixelRatio||1,width<900?1.25:1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
  gl.viewport(0,0,canvas.width,canvas.height);
  const bounds=image.getBoundingClientRect(),origin=root.getBoundingClientRect(),style=getComputedStyle(image);
  fit=fitArtwork(bounds.width,bounds.height,profile,style.objectFit,style.objectPosition);fit.x+=bounds.left-origin.left;fit.y+=bounds.top-origin.top;
  gl.uniform2f(uniforms.uResolution,canvas.width,canvas.height);gl.uniform2f(uniforms.uOffset,fit.x*dpr,fit.y*dpr);gl.uniform1f(uniforms.uScale,fit.scale*dpr);
  render();wake();
 }
 function syncMode(){const next=root.dataset.mode==='infection'?1:0;if(next!==targetBlood){targetBlood=next;if(reduced.matches){blood=next;render();report();}else wake();}}
 async function loadImage(){
  try{
   await image.decode();if(disposed)return;
   const next=artworkProfile(image.currentSrc);if(!next||next.width!==image.naturalWidth||next.height!==image.naturalHeight)throw Error('Unsupported lobby artwork; original image retained');
   profile=next;gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);gl.uniform2f(uniforms.uArtSize,profile.width,profile.height);ready=true;resize();syncMode();report();
  }catch(error){canvas.hidden=true;ready=false;report({error:String(error.message)});}
 }
 try{
  if(!gl)throw Error('WebGL unavailable; original image retained');
  const program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertexSource));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragmentSource));gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const attribute=gl.getAttribLocation(program,'aPosition');gl.enableVertexAttribArray(attribute);gl.vertexAttribPointer(attribute,2,gl.FLOAT,false,0,0);
  for(const name of ['uImage','uResolution','uOffset','uScale','uTime','uBlood','uMotion','uArtSize','uRegionMap','uCard0','uCard1','uCard2','uCard3'])uniforms[name]=gl.getUniformLocation(program,name);
  const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.uniform1i(uniforms.uImage,0);
  image.addEventListener('load',loadImage);new ResizeObserver(resize).observe(root);new ResizeObserver(resize).observe(image);
  new MutationObserver(records=>{if(records.some(record=>record.attributeName==='data-mode'))syncMode();interrupt();resize();}).observe(root,{attributes:true,attributeFilter:['data-mode','hidden']});
  for(const dialog of root.querySelectorAll('dialog'))new MutationObserver(interrupt).observe(dialog,{attributes:true,attributeFilter:['open']});
  document.addEventListener('visibilitychange',interrupt);addEventListener('pageshow',interrupt);
  reduced.addEventListener('change',()=>{if(reduced.matches)blood=targetBlood;render();interrupt();wake();});
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();disposed=true;canvas.hidden=true;interrupt();report({error:'Graphics context lost; original image retained'});});
  loadImage();
 }catch(error){canvas.hidden=true;report({error:String(error.message)});}
}

const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const root = require('node:path').resolve(__dirname, '..');
function load(name, symbol) { const context = { window: {}, console }; vm.createContext(context); vm.runInContext(fs.readFileSync(root+'/simulations/'+name+'/model.js','utf8'),context); return context.window[symbol]; }
if (true) {
 const M = load('segregation','SegregationModel');
 const options = {threshold:35,radius:1,mix:50,empty:20};
 const model = M.create(options,42), start=model.metrics();
 const counts=()=>Array.from(model.grid).reduce((n,v)=>{n[v]++;return n;},[0,0,0]); const before=counts();
 model.step();assert(model.moves.length>0);assert.equal(model.moves.length,model.metrics().moved);for(const move of model.moves){assert(move.from>=0&&move.to<model.grid.length);assert(move.type===1||move.type===2);}
 const visibleHappy=Array.from(model.grid,(_,i)=>model.grid[i]&&model.isHappy(i)).filter(Boolean).length;assert(Math.abs(visibleHappy/model.metrics().count*100-model.metrics().satisfied)<1e-9);
 for(let i=0;i<150;i++) { if(!model.step()) break; }
 assert.deepEqual(counts(),before); assert(model.metrics().mixing < start.mixing-10); assert(model.metrics().satisfied>95);
 const relaxed=M.create({...options,threshold:0},42); assert.equal(relaxed.step(),false); assert.equal(relaxed.metrics().satisfied,100);
 const wider=M.create({...options,radius:4},42); for(let i=0;i<20;i++) wider.step(); assert.notEqual(wider.metrics().mixing,model.metrics().mixing);
 console.log('PASS segregation: populations and vacancies conserved; modest preference forms clusters; threshold/radius change dynamics',start,model.metrics());
}
if(true) {
 const M=load('commons','CommonsModel');
 const options={regeneration:20,capacity:600,agents:30,pressure:.5,visibility:80,communication:true,monitoring:false};
 function run(overrides) {const m=M.create({...options,...overrides},42); for(let i=0;i<200;i++){const flow=m.step();assert(Math.abs(flow.start+flow.growth-flow.harvest-flow.end)<.00001);assert(flow.end>=0&&flow.end<=m.options.capacity);}return m;}
 const defaultRun=run({}); const collapse=run({regeneration:2,pressure:4,communication:true}); const stable=run({regeneration:25,pressure:.5}); const monitored=run({monitoring:true,visibility:100});
 assert.equal(collapse.metrics().resource,0);assert(stable.metrics().resource>450);assert(monitored.metrics().resource>300);
 assert(new Set(defaultRun.agents.map(a=>a.appetite.toFixed(2))).size>15);
 const hidden=run({visibility:0}), informed=run({visibility:100});assert.notEqual(hidden.metrics().resource,informed.metrics().resource);
 const isolated=run({communication:false});assert.notEqual(isolated.metrics().resource,defaultRun.metrics().resource);
 console.log('PASS commons: mass balance, capacity bounds, heterogeneous agents, collapse despite communication, sustained resource, rule effects', {default:defaultRun.metrics(),collapse:collapse.metrics(),stable:stable.metrics(),monitored:monitored.metrics()});
}
if(true) {
 const M=load('delay-trap','DelayModel'),options={target:37,response:.8,delay:6,patience:10,mode:'automatic'};
 const equilibrium=M.create({...options,target:35});for(let i=0;i<60;i++)equilibrium.step();assert.equal(equilibrium.metrics().temperature,35);
 function run(overrides){const m=M.create({...options,...overrides});for(let i=0;i<180;i++){const result=m.step();assert.equal(result.temperature,result.travelling[0]);assert(result.temperature>=15&&result.temperature<=55);assert(m.metrics().tap>=0&&m.metrics().tap<=100);assert.equal(m.pipeline.length,m.options.delay);}return m;}
 const span=m=>{const tail=m.history.slice(-60).map(x=>x.temperature);return Math.max(...tail)-Math.min(...tail);};
 const quick=run({delay:1}),reactive=run({}),patient=run({response:.3,patience:85});assert(span(quick)<.1);assert(span(reactive)>20);assert(span(patient)<.1);assert(Math.abs(patient.metrics().temperature-37)<.1);
 const manual=M.create({...options,mode:'manual'});manual.setTap(100);for(let i=0;i<6;i++){manual.step();assert.equal(manual.metrics().temperature,35);}manual.step();assert.equal(manual.metrics().temperature,55);manual.step();assert.equal(manual.metrics().temperature,55);manual.setTap(0);for(let i=0;i<6;i++)manual.step();assert.equal(manual.metrics().temperature,55);manual.step();assert.equal(manual.metrics().temperature,15);
 const coldTarget=run({delay:1,target:31}),hotTarget=run({delay:1,target:41});assert(Math.abs(coldTarget.metrics().temperature-31)<.1);assert(Math.abs(hotTarget.metrics().temperature-41)<.1);
 console.log('PASS shower delay: equilibrium, bounded mixing, exact transport delay, persistent manual tap, target response, short pipe settles, delayed strong corrections oscillate, patience settles',{quick:span(quick),reactive:span(reactive),patient:span(patient)});
}
if(true) {
 const M=load('flocking','FlockingModel'),options={separation:1.4,alignment:1.2,cohesion:.8,radius:80,agents:80,speed:1};
 function run(overrides){const m=M.create({...options,...overrides},42);for(let i=0;i<700;i++)m.step();for(const a of m.agents){assert(Number.isFinite(a.x+a.y+a.vx+a.vy));assert(a.x>=0&&a.x<m.width&&a.y>=0&&a.y<m.height);assert(Math.abs(Math.hypot(a.vx,a.vy)-2.2)<.000001);}return m;}
 const drifting=run({separation:0,alignment:0,cohesion:0});const initial=M.create({...options},42);assert(Math.abs(initial.metrics().agreement-drifting.metrics().agreement)<.0001);
 const aligned=run({radius:160,cohesion:0,alignment:3});assert(aligned.metrics().agreement>drifting.metrics().agreement+40);
 const standard=run({}),noCohesion=run({cohesion:0}),noSeparation=run({separation:0}),smallRadius=run({radius:20}),fast=run({speed:2});
 for(const other of [noCohesion,noSeparation,smallRadius,fast])assert(Math.abs(other.agents[0].x-standard.agents[0].x)>1);
 const disturbed=M.create({...options},42);const point={x:disturbed.agents[0].x+20,y:disturbed.agents[0].y};disturbed.setPointer(point);disturbed.step();const undisturbed=M.create({...options},42);undisturbed.step();assert.notEqual(disturbed.agents[0].vx,undisturbed.agents[0].vx);
 assert.equal(M.create({...options,agents:100},42).agents.length,100);
 console.log('PASS flocking: finite bounded motion, constant speed, no spontaneous heading agreement without rules, alignment coordinates, each rule/radius/speed/disturbance changes dynamics',{initial:initial.metrics().agreement,aligned:aligned.metrics().agreement,default:standard.metrics().agreement});
}

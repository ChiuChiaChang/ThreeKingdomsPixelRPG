const $=s=>document.querySelector(s), app=$("#app");
const heroNames=["劉備","關羽","張飛","趙雲","諸葛亮"], enemyNames=["黃巾將","黃巾兵","黃巾兵","黃巾兵","黃巾兵"];
let state={scene:"title",x:7,y:6,gold:120,food:500,sp:36,msg:"",turn:1,menu:0};
let party=heroNames.map((name,i)=>({name,hp:[420,560,590,520,350][i],max:[420,560,590,520,350][i],lv:[5,7,7,6,8][i]}));
let enemies=[];
const map=[
"################",
"#....tt....C...#",
"#..~~~~........#",
"#..~~~~..tt....#",
"#..............#",
"#...tt.........#",
"#......@.......#",
"#..........C...#",
"#..^^^^........#",
"#..^^^^...tt...#",
"#..............#",
"################"];
const tiles={"#":"tree",".":"grass","~":"water","^":"mount","C":"castle","t":"woods","@":"grass"};
function resetEnemies(){enemies=enemyNames.map((name,i)=>({name,hp:i?180:480,max:i?180:480,dead:false}))}
function px(name,enemy=false){let colors=enemy?["#bc3b35","#6b2525"]:name==="劉備"?["#d9c34c","#6a9a48"]:name==="關羽"?["#d33b35","#3e995a"]:name==="張飛"?["#7a4ca5","#b34b3f"]:name==="趙雲"?["#d7d7d7","#557fa8"]:["#efefdf","#5e62a9"];return `<div class="sprite ${enemy?"bad":""}" style="--a:${colors[0]};--b:${colors[1]}"><i class="hair"></i><i class="face"></i><i class="body"></i><i class="hand"></i><i class="sword"></i><i class="foot f1"></i><i class="foot f2"></i></div>`}
function frame(inner,cls=""){app.innerHTML=`<div class="console"><div class="screen ${cls}">${inner}</div><div class="brand">THREE KINGDOMS · 8-BIT RPG <small>v2.0.0.0</small></div></div>`}
function title(){frame(`<div class="title"><div class="sun"></div><h1>三國志<br><span>群雄傳</span></h1><p>THREE KINGDOMS<br>PIXEL RPG</p><button id="start">▶ 開始遊戲</button><small>方向鍵 / WASD 移動　Enter / Space 確認</small></div>`,"titlebg");$("#start").onclick=()=>{state.scene="world";world()}}
function world(){let html=map.map((row,y)=>[...row].map((c,x)=>`<i class="tile ${tiles[c]}" data-x="${x}" data-y="${y}"></i>`).join("")).join("");frame(`<div class="world"><div class="map">${html}<div class="player" style="left:${state.x*32}px;top:${state.y*32}px">${px("劉備")}</div></div><div class="sidebox"><b>幽州</b><hr>金　${state.gold}<br>糧　${state.food}<br>SP　${state.sp}<hr>劉備軍<br><small>尋訪義士<br>討伐黃巾</small></div><div class="dialog">▲ 涿郡附近<br>百姓：黃巾賊四處作亂，請將軍小心！</div></div>`,"game");}
function walk(dx,dy){if(state.scene!=="world")return;let nx=state.x+dx,ny=state.y+dy,c=map[ny]?.[nx];if(!c||c==="#"||c==="~"||c==="^")return;state.x=nx;state.y=ny;world();if(Math.random()<.18)setTimeout(battle,120)}
function battle(){state.scene="battle";resetEnemies();state.msg="黃巾賊出現了！";battleView()}
function row(u,enemy=false,i=0){let pct=Math.max(0,u.hp/u.max*100);return `<div class="warrior ${enemy?"enemy":""} ${u.dead?"dead":""}">${enemy?"":px(u.name)}<div class="stats"><b>${u.name}</b><span>${Math.max(0,u.hp)}</span><em><i style="width:${pct}%"></i></em></div>${enemy?px(u.name,true):""}</div>`}
function battleView(){frame(`<div class="battle"><div class="sky">黃巾之亂　　第 ${state.turn} 回合</div><div class="teams"><div>${party.map((u,i)=>row(u,false,i)).join("")}</div><div class="versus">⚔</div><div>${enemies.map((u,i)=>row(u,true,i)).join("")}</div></div><div class="battleui"><div class="face">${px(party[0].name)}<b>${party[0].name}</b></div><div class="commands"><div class="msg">${state.msg}</div>${["攻擊","策略","防禦","總攻擊","撤退"].map((x,i)=>`<button data-c="${i}">${i===state.menu?"▶":"　"} ${x}</button>`).join("")}</div><div class="res">SP ${state.sp}<br>金 ${state.gold}<br>糧 ${state.food}</div></div></div>`,"game");document.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>command(+b.dataset.c))}
function living(a){return a.filter(x=>!x.dead)}
function command(i){if(i===4){state.scene="world";state.msg="";world();return}if(i===1&&state.sp<5){state.msg="策略點不足！";battleView();return}let es=living(enemies);if(!es.length)return;let t=es[Math.floor(Math.random()*es.length)],d=i===1?(state.sp-=5,Math.floor(120+Math.random()*100)):i===3?Math.floor(90+Math.random()*90):Math.floor(55+Math.random()*80);t.hp-=d;if(t.hp<=0){t.hp=0;t.dead=true}state.msg=`${party[0].name}${i===1?"施展火計":"發動攻擊"}！ ${t.name}損失 ${d} 兵力`;battleView();setTimeout(enemyTurn,520)}
function enemyTurn(){if(!living(enemies).length){state.gold+=60;state.food+=100;state.msg="勝利！獲得 金60、糧100";battleView();setTimeout(()=>{state.scene="world";state.turn++;world()},1200);return}let e=living(enemies)[0],p=living(party)[Math.floor(Math.random()*living(party).length)],d=Math.floor(25+Math.random()*55);p.hp-=d;if(p.hp<=0)p.hp=1;state.msg=`${e.name}反擊！ ${p.name}損失 ${d} 兵力`;state.turn++;battleView()}
addEventListener("keydown",e=>{if(state.scene==="title"&&(e.key==="Enter"||e.key===" ")){state.scene="world";world();return}if(state.scene==="world"){let k=e.key.toLowerCase();if(k==="arrowup"||k==="w")walk(0,-1);if(k==="arrowdown"||k==="s")walk(0,1);if(k==="arrowleft"||k==="a")walk(-1,0);if(k==="arrowright"||k==="d")walk(1,0)}else if(state.scene==="battle"){if(e.key==="ArrowUp"){state.menu=(state.menu+4)%5;battleView()}if(e.key==="ArrowDown"){state.menu=(state.menu+1)%5;battleView()}if(e.key==="Enter"||e.key===" ")command(state.menu)}});title();
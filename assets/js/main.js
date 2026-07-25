(function(){
  var rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.rv');
  if(rm || !('IntersectionObserver' in window)){
    items.forEach(function(el){el.classList.add('in')});
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}
      });
    },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
    items.forEach(function(el){io.observe(el)});
  }

  /* ---- Glow with Flow: light dancing on water ---- */
  (function(){
    var section = document.querySelector('.glow');
    if(!section) return;
    var canvas = section.querySelector('canvas');
    var ctx = canvas.getContext('2d');
    var W=0,H=0,DPR=1;
    function resize(){
      DPR = Math.min(window.devicePixelRatio||1, 2);
      W = section.clientWidth; H = section.clientHeight;
      canvas.width = Math.max(1,W*DPR); canvas.height = Math.max(1,H*DPR);
      ctx.setTransform(DPR,0,0,DPR,0,0);
    }
    resize();
    window.addEventListener('resize', resize);

    function draw(t){
      ctx.clearRect(0,0,W,H);
      var base = ctx.createLinearGradient(0,0,0,H);
      base.addColorStop(0,'#0c1c1a'); base.addColorStop(1,'#0a1413');
      ctx.fillStyle=base; ctx.fillRect(0,0,W,H);
      /* rising glow from below */
      var rg = ctx.createRadialGradient(W*0.5,H*1.08,0, W*0.5,H*1.08,H*0.95);
      rg.addColorStop(0,'rgba(199,162,83,0.20)');
      rg.addColorStop(1,'rgba(199,162,83,0)');
      ctx.fillStyle=rg; ctx.fillRect(0,0,W,H);
      /* caustic light ribbons &mdash; light dancing on water */
      ctx.globalCompositeOperation='lighter';
      var bands=8;
      for(var i=0;i<bands;i++){
        var yBase=H*(0.16+i*0.086);
        var amp=16+i*5;
        var sp=0.4+i*0.11;
        var gold=(i%2===0);
        ctx.beginPath();
        for(var x=0;x<=W;x+=8){
          var y=yBase
            + Math.sin(x*0.008 + t*sp + i)*amp
            + Math.sin(x*0.021 - t*sp*0.6 + i*2)*amp*0.42;
          x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
        }
        var a=Math.max(0.03, 0.055 + 0.03*Math.sin(t*0.6+i));
        ctx.lineWidth=gold?2.4:1.8;
        ctx.strokeStyle=(gold?'rgba(220,192,133,':'rgba(120,190,175,')+a+')';
        ctx.stroke();
      }
      ctx.globalCompositeOperation='source-over';
    }

    var running=false, raf=null, t0=null;
    function loop(ts){
      if(t0===null) t0=ts;
      draw((ts-t0)/1000);
      raf=requestAnimationFrame(loop);
    }
    function start(){ if(running)return; running=true; raf=requestAnimationFrame(loop); }
    function stop(){ running=false; if(raf) cancelAnimationFrame(raf); raf=null; }

    /* reveal verse when in view */
    if('IntersectionObserver' in window){
      var vio=new IntersectionObserver(function(es){
        es.forEach(function(e){
          if(e.isIntersecting){ section.classList.add('lit'); if(!rm) start(); }
          else stop();
        });
      },{threshold:.12});
      vio.observe(section);
    } else { section.classList.add('lit'); if(!rm) start(); }

    if(rm){ draw(2.2); }   /* single static frame */
  })();

  var form = document.getElementById('enqForm');
  if(form){
    form.addEventListener('submit',function(ev){
      ev.preventDefault();
      var name = document.getElementById('f-name');
      var email = document.getElementById('f-email');
      var ok = true;
      [name,email].forEach(function(f){
        if(!f.value.trim()){f.style.borderColor='#B5533E';ok=false;}
        else{f.style.borderColor='';}
      });
      if(!ok){ name.value.trim()?email.focus():name.focus(); return; }
      var t = document.getElementById('toast');
      t.classList.add('show');
      form.querySelector('button[type=submit]').textContent='Sent';
      t.scrollIntoView({behavior: rm?'auto':'smooth', block:'center'});
    });
  }
})();

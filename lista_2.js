var img = new Image();
img.src = 'mapa.jpg';

window.addEventListener("load", init);

var matrizAdjacencia = [];
var matrizValorada = [];
var grauNo = [];
var nos = [];
var canvas;
var ctx;

function init(){
  document.getElementById("btnRun").addEventListener("click", atualizaGrafo);
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  geraNos();
  montaComboBox();
  atualizaGrafo();

  /*canvas.addEventListener('click', function(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    console.log("x: " + x + " y: " + y); 
  }, false);*/
}

function atualizaGrafo(){
  if(event.preventDefault) event.preventDefault();
  event.result = false;
  montaMatrizAdjacencia();
  montaGrauNo();
  desenhaGrafo();
}

function montaComboBox(){
  var docfragOrigem = document.createDocumentFragment();
  var docfragDestino = document.createDocumentFragment();
  for (var i = 0; i < nos.length; i++) {
      docfragOrigem.appendChild(new Option(nos[i].cidade, i));
      docfragDestino.appendChild(new Option(nos[i].cidade, i));
  }
  var origem = document.getElementById("origem");
  var destino = document.getElementById("destino");
  origem.appendChild(docfragOrigem);
  destino.appendChild(docfragDestino);
}

function geraLigacao(){
  var o = document.getElementById("origem").selectedIndex;
  var d = document.getElementById("destino").selectedIndex;
  var n = ";"+o+"-"+d;
  var ta = document.getElementById("txtadj").value;
  ta = ta+n;
  document.getElementById("txtadj").value = ta;
  atualizaGrafo();
}

function montaMatrizAdjacencia(){
  var teste = "0-0;1-1;2-2;3-3;4-4;5-5;6-6;7-7;8-8;9-9;10-10;11-11;12-12;13-13;14-14;15-15;16-16;17-17;18-18;19-19;20-20;21-21;22-22;23-23;24-24;25-25;26-26";
  var ligacoes = teste.concat(document.fadj.txtadj.value);
  ligacoes = ligacoes.split(";");
  for(var i in ligacoes){
    var ligacao = ligacoes[i];
    var nos = ligacao.split("-");
    var n1 = nos[0].trim();
    var n2 = nos[1].trim();
    if(!matrizAdjacencia[n1]){
      matrizAdjacencia[n1] = [];
    }
    if(!matrizAdjacencia[n2]){
      matrizAdjacencia[n2] = [];
    }
    matrizAdjacencia[n1][n2] = 1;
    matrizAdjacencia[n2][n1] = 1;
  }
  for(var i=0; i<matrizAdjacencia.length;i++ ){
    if(grauNo[i]===undefined){ grauNo[i] = 0;}
    if(nos[i]===undefined){
      nos[i] = new Ponto(i);
      nos[i].x = 20*(i+1)+150*Math.random();
      nos[i].y = 20*(i+1)+150*Math.random();
    }
    for(var j=0; j<matrizAdjacencia.length;j++ ){
      matrizAdjacencia[i][j] = matrizAdjacencia[i][j]?matrizAdjacencia[n1][n2]:0;
    }
  }
  imprimeMatrizAdjacencia();    
}

function montaGrauNo(){
  for(var i=0; i<matrizAdjacencia.length;i++ ){
    for(var j=0; j<matrizAdjacencia.length;j++ ){
      if(matrizAdjacencia[i][j]){
        grauNo[i]++;
      }
    }
    grauNo[i]-=1;
  }
  imprimeGrauNo();
}

function imprimeMatrizAdjacencia(){
  var adj = document.getElementById("adj");
  adj.innerHTML = "";
  var i, j;
  var tr, td, th;
  tr = document.createElement("tr");
  th = document.createElement("th");
  tr.appendChild(th);
  for(i=0;i<matrizAdjacencia.length;i++){
    th = document.createElement("th");
    th.innerText = "N"+i;
    tr.appendChild(th);
  }
  adj.appendChild(tr);
  for(i=0;i<matrizAdjacencia.length;i++){
    tr = document.createElement("tr");
    th = document.createElement("th");
    th.innerHTML = "N"+i;
    tr.appendChild(th);
    for(j=0;j<matrizAdjacencia.length;j++){
      var td = document.createElement("td");
      td.innerText = matrizAdjacencia[i][j];
      tr.appendChild(td);
    }
    adj.appendChild(tr);
  }          
}

function imprimeGrauNo(){
  var grau = document.getElementById("grau");
  grau.innerHTML="";
  for(i=0;i<matrizAdjacencia.length;i++){
    tr = document.createElement("tr");
    tr.innerHTML = "<th>N"+i+"</th><td>"+grauNo[i]+"</td>";
    grau.appendChild(tr);
  }
}

function geraMatrizValorada(o, d, v){
  if(v ==0) v=-1;
  matrizValorada[o][d]=v;
}

function limpaMatrizValorada(){
  for(i=matrizValorada.length;i>=0;i--){
    matrizValorada.splice(i, 1);
  }
  for(i=0;i<nos.length;i++){
    matrizValorada[i]=[];
    for(j=0;j<nos.length;j++){
        matrizValorada[i][j]=-1;
    }
  }
}

function desenhaGrafo(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  limpaMatrizValorada(); 
  for(i=0;i<matrizAdjacencia.length;i++){//Desenha as linhas
    no = nos[i];
    for(j=0;j<matrizAdjacencia.length;j++){
      if(matrizAdjacencia[i][j]){
        outra = nos[j];
        ctx.beginPath();
        ctx.moveTo(no.x, no.y);
        ctx.lineTo(outra.x, outra.y);
        ctx.closePath();
        if(matrizAdjacencia[i][j]!="*"){
          ctx.strokeStyle = "black";
          ctx.lineWidth = 0.4;
        }else{
          ctx.strokeStyle = "red";
          ctx.lineWidth = 1;
        }
        ctx.stroke();
        valorA = 0;
        valorB = 0;
        valor = 0;
        if(no.x > outra.x){
          valorA = no.x - outra.x;
        }
        if(no.x < outra.x){
          valorA = outra.x - no.x;
        }
        if(no.y > outra.y){
          valorB = no.y - outra.y;
        }
        if(no.y < outra.y){
          valorB = outra.y - no.y;
        }
        valor = parseInt(Math.hypot(valorA, valorB));
        geraMatrizValorada(no.id, outra.id, valor);
        if(valor > 0){
          ctx.font="12px arial";
          ctx.textAlign="center";
          ctx.fillStyle = "red"; 
          ctx.fillText(valor,outra.x + (no.x-outra.x)/2,outra.y + (no.y-outra.y)/2);//Coloca o texto nas ligações
        }
      }
    }
  }
  for (var i = 0; i < nos.length; i++) {//Desenha os nos
    no = nos[i];
    ctx.save();
    ctx.translate(no.x, no.y);
    ctx.beginPath();
    ctx.arc(0, 0, no.r, 0, 2*Math.PI, false);
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
    ctx.lineWidth = 1;
    //ctx.fillText(i,-no.r,no.r+12);//Coloca o texto nos nos
    ctx.restore();
  }
}

function calculoMenorCaminho(){
  var o = document.getElementById("origem").selectedIndex;
  var d = document.getElementById("destino").selectedIndex;
  if(o!=d){
    dijkstra(o,d);
  }else{
    document.getElementById("retorno").innerHTML = "O ponto de destino é o mesmo que de origem";
  }
}

function dijkstra(origem, destino){
  var i, v, min, cont = 0;
  var custos = [];
  var z = [];
  var dist = [];
  var tmp = [];
  var ant = [];
  for (i = 0; i < nos.length; i++) {
    if (matrizValorada[origem][i] != -1) {        
      ant[i] = origem;
      dist[i] = matrizValorada[origem][i];
    }else{
      ant[i]= -1;
      dist[i] = Infinity;
    }
    z[i]=0;
  }
  z[origem] = 1;
  dist[origem] = 0;  
  do {
    // Encontrando o vertice que deve entrar em z 
    min = Infinity;
    for (i=0;i<nos.length;i++){
      if (!z[i]){
        if (dist[i]>=0 && dist[i]<min) {
          min=dist[i];
          v=i;
        }
      }
    }
    //Calculando as distancias dos novos vizinhos de z
    if (min != Infinity && v != destino ) {
      z[v] = 1;
      for (i = 0; i < nos.length; i++){
        if (!z[i]) {
          if (matrizValorada[v][i] != -1 && dist[v] + matrizValorada[v][i] < dist[i]) {
            dist[i] = dist[v] + matrizValorada[v][i];
            ant[i]=v;
          }
        }
      }
    }
  }while(v != destino && min != Infinity);
   //Resultado da busca
   if (min == Infinity) {
     document.getElementById("retorno").innerHTML = ("Nao existe cidades que interligam a origem e destino selecionados");
   }
   else {
      i = destino;
      i = ant[i];
      tmp[cont++]=destino;
      while (i != -1) {
         tmp[cont] = i;
         cont++;
         i = ant[i];
      }
      
      var aux = "";
      var auxI = Infinity;
      var auxJ = Infinity;
      var auxK = 0;
      for (i = cont; i > 0 ; i--) {
        if (aux==""){
          aux = aux+nos[tmp[i-1]].cidade;
          aux = aux+" (0)(0)";
        }else{
          aux = aux+" -> "+nos[tmp[i-1]].cidade;
        }        
        if(auxI != Infinity && auxJ == Infinity){
          auxJ = tmp[i-1];
          auxK = auxK+matrizValorada[auxI][auxJ];
          aux = aux+" ("+matrizValorada[auxI][auxJ]+")"+"("+auxK+")";
          matrizAdjacencia[auxI][auxJ]="*";
          matrizAdjacencia[auxJ][auxI]="*";
          auxI = auxJ;
          auxJ = Infinity;
          desenhaGrafo();
        }else{
          auxI=tmp[i-1];
        }        
      }
      //alert(aux);
      document.getElementById("retorno").innerHTML = "O percurso com menor custo é:";
      document.getElementById("retorno2").innerHTML = aux;
   }
}
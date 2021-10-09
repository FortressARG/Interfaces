"use strict";
document.addEventListener("DOMContentLoaded", () => {
    var CARD_WIDTH = 100;
    var CARD_HEIGHT = 50;
    var img = new Image();
    var img2 = new Image();
    var img3 = new Image();
    var img4 = new Image();
    var coorY, coorX;
    var turno = 2;
    var valorDeLinea=0;
    var rivales = "";
    var lineaj1 = 0;
    var lineaj2 = 0;
    var matrix = new Array();
    const valoresOriginales = new Array();
    var state = {
        spaces: [
            { x: 0, y: 50, card: null },
            { x: 100, y: 50, card: null },
            { x: 200, y: 50, card: null },
            { x: 300, y: 50, card: null },
            { x: 400, y: 50, card: null },
            { x: 500, y: 50, card: null },
            { x: 600, y: 50, card: null },//4 en linea
            { x: 700, y: 50, card: null },//5 en linea
            { x: 800, y: 50, card: null },//6 en inea
            { x: 900, y: 50, card: null } //7 en inea
        ],
        fichas: [],
        holdingCard: null,
        isMouseDown: false,
        cursorOffset: null
    };
    var canvases = {
        spaces: document.getElementById('tablero'),
        drag: document.getElementById('movimiento'),
        cards: document.getElementById('fichas')
    };


    var context = {
        spaces: canvases.spaces.getContext('2d'),
        drag: canvases.drag.getContext('2d'),
        cards: canvases.cards.getContext('2d'),
    };
    var intervalo;

    var minutos= 1;
    var segundos = 30;
 //Definimos y ejecutamos los segundos
    function cargarSegundo(){

        
     let txtSegundos;
 
     if(segundos < 0){
         segundos = 59; 
     }
 
     //Mostrar Segundos en pantalla
     if(segundos < 10){
         txtSegundos = `0${segundos}`;
     }else{
         txtSegundos = segundos;
     }
     document.getElementById('segundos').innerHTML = txtSegundos;
     segundos--;
 
     cargarMinutos(segundos);
 }
 
 //Definimos y ejecutamos los minutos
 function cargarMinutos(segundos){
     let txtMinutos;
 
     if(segundos == -1 && minutos !== 0){
         setTimeout(() =>{
             minutos--;
         },500)
     }else if(segundos == -1 && minutos == 0){
         setTimeout(() =>{
             minutos = 1;
         },500)
     }
     
     //Mostrar Minutos en pantalla
     if(minutos < 10){
         txtMinutos = `0${minutos}`;
     }else{
         txtMinutos = minutos;
     }

     document.getElementById('minutos').innerHTML = txtMinutos;
     if(minutos == 0 && segundos == 0){
        document.getElementById('segundos').innerHTML = "Perdiste tu turno!";
        document.getElementById('minutos').innerHTML = "";
        segundos = 30
     }
    }





    var ctx = context.spaces;
    var ganador = document.getElementById("ganador");
    document.getElementById("nuevoJuego").addEventListener("click", () => {
        let juego = document.getElementById("selectJuego").value;
        valorDeLinea = parseInt(juego);
        rivales = document.getElementById("selectRivales").value;

        context.spaces.clearRect(
            0, 0,
            canvases.spaces.width,
            canvases.spaces.height
        );
        context.drag.clearRect(
            0, 0,
            canvases.drag.width,
            canvases.drag.height
        );
        context.cards.clearRect(
            0, 0,
            canvases.cards.width,
            canvases.cards.height
        );

        

        //Cargamos las imagenes y los subimos a los objetos
        img.src = "src/css/images/vacio.jpg";
        img.onload = function () {
            for (let x = 0; x < 8+valorDeLinea; x++) {
                let lugares = []
                for (let y = 0; y < 7+valorDeLinea; y++) {
                    coorY = y * 100;
                    if (y != 0) {
                        context.spaces.drawImage(img, coorX, coorY);
                        lugares.push({
                            coorY,
                            jugador: 0,
                        });
                    }
                }
                matrix[x] = lugares;
                coorX = x * 100;
            }
        }
        if (rivales = "aves") {
            img2.src = "src/css/images/fichaAguila.png";
            img3.src = "src/css/images/fichaCondor.png";
        } else if (rivales = "starWars") {
            img2.src = "src/css/images/fichaAmarilla.jpg";
            img3.src = "src/css/images/fichaRoja.jpg";
        } else if (rivales = "alien") {
            img2.src = "src/css/images/fichaAmarilla.jpg";
            img3.src = "src/css/images/fichaRoja.jpg";
        } else if (rivales = "mortalKombat") {
            img2.src = "src/css/images/fichaAmarilla.jpg";
            img3.src = "src/css/images/fichaRoja.jpg";
        }
        img2.onload = function () {
            for (let x = 8+valorDeLinea; x < 11+valorDeLinea; x++) {
                for (let y = 0; y < 7+valorDeLinea; y++) {
                    coorY = y * 80;
                    if (x > 8) {
                        state.fichas.push({
                            img: img2,
                            x: coorX, y: coorY,
                            width: img2.width, height: img2.height,
                            jugador:1,
                        })
                        valoresOriginales.push({
                            x: coorX, y: coorY,
                        })
                    }
                }
                coorX = x * 100;
            }
        }

        img3.onload = function () {
            for (let x = 10+valorDeLinea; x < 13+valorDeLinea; x++) {
                for (let y = 0; y < 7+valorDeLinea; y++) {
                    coorY = y * 80;
                    if (x > 10) {
                        state.fichas.push({
                            img: img3,
                            x: coorX, y: coorY,
                            width: img3.width, height: img3.height,
                            jugador:2,
                        })
                        valoresOriginales.push({
                            x: coorX, y: coorY,
                        })
                    }
                }
                coorX = x * 100;
            }
            drawSpaces();
            drawCards();
        }
        
        intervalo = setInterval(cargarSegundo,1000);  
    })
    //Dibujamos los espacios para depositar las fichas
    function drawSpace(space) {

        ctx.fillStyle = '#183DB0';
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#5B7BDD';
        ctx.fillRect(space.x, space.y, CARD_WIDTH, CARD_HEIGHT);
        ctx.strokeRect(space.x, space.y, CARD_WIDTH, CARD_HEIGHT);
    }

    function drawSpaces() {
        let tope = 0;
        state.spaces.forEach(function (space) {
            if(tope< (7+valorDeLinea)){
                 drawSpace(space);
                 tope++;
            }
               
        });
    }
    //Dibujamos las fichas
    function dibujarFicha(ficha, ctx) {
        ctx.drawImage(ficha.img, ficha.x, ficha.y);
    }

    function drawCards() {
        context.cards.clearRect(
            0, 0,
            canvases.cards.width,
            canvases.cards.height
        );
        state.fichas.forEach(function (ficha) {
            if (ficha !== state.holdingCard && ficha !=false) {
                dibujarFicha(ficha, context.cards);
            }

        });
    }
    canvases.drag.addEventListener("mousedown", function (e) {
        var ficha;
        ganador.innerHTML = ""
        state.isMouseDown = true;
        for (var index = 0; index < state.fichas.length; index++) {
            ficha = state.fichas[index];

            if ((e.clientX-200) >= ficha.x && (e.clientX-200) < ficha.width + ficha.x
                && (e.clientY-180) >= ficha.y && (e.clientY-180) < ficha.height + ficha.y) {
                
                if(turno!=state.fichas[index].jugador){
                    state.holdingCard = ficha;
                    state.cursorOffset = {
                        x: e.clientX - ficha.x,
                        y: e.clientY - ficha.y
                    };
                
                    drawCards();
                    context.drag.clearRect(0, 0,
                        canvases.drag.width,
                        canvases.drag.height,
                    );
                    dibujarFicha(state.holdingCard, context.drag);
                   
                    
                   
                    
                    break;
                }
                else{
                    ganador.innerHTML = "No es tu turno"
                }
            }
        }
    });

    canvases.drag.addEventListener("mouseup", function () {
        state.isMouseDown = false;
        var fichaPorCaer;
        var didMatch = false; // para identificar si entra o no la ficha
        if (state.cursorOffset != null) {
            var ficha = state.holdingCard;
            fichaPorCaer = ficha;

            state.cursorOffset = null;

            for (var index = 0; index < state.spaces.length; index++) {
                var s = state.spaces[index];

                if (Math.abs(ficha.x - s.x) < (CARD_WIDTH / 1.75) // si el 40% de la figura esta sobre el espacio se deposita
                    && Math.abs(ficha.y - s.y) < (CARD_HEIGHT / 1.75)
                ) {
                    ficha.x = s.x;
                    ficha.y = s.y;
                    didMatch = true;
                    turno = ficha.jugador;
                    state.holdingCard = null;
                    break;
                }
            }
        }
        
            
        if (didMatch) { //disparar evento de depositar ficha
            context.cards.clearRect(0, 0,   //borra de ficha canvas en movimiento y la deja en el tablero
                canvases.cards.width,
                canvases.cards.height
            );
            context.drag.clearRect(0, 0,
                canvases.cards.width,
                canvases.cards.height
            );
            let pos = state.fichas.indexOf(fichaPorCaer); 
            state.fichas.splice(pos,1,false) ;////reemplazo la ficha por un false para que no la dibuje
            drawCards();
            fichaCayendo(fichaPorCaer);
           
            minutos = 1;
            segundos = 30;
            
        } else {
            context.drag.clearRect(0, 0,
                canvases.drag.width,
                canvases.drag.height,
            );
            state.fichas.forEach(function (fichita) {
                if (fichita == state.holdingCard) {
                    var pos = state.fichas.indexOf(fichita);
                    var valor = valoresOriginales[pos];
                    state.holdingCard = null;
                    state.fichas[pos].x = valor.x;
                    state.fichas[pos].y = valor.y;
                }

            })
            drawCards();
        }

    });

    canvases.drag.addEventListener("mousemove", function (e) {
        if (state.cursorOffset && state.holdingCard != null) {
            var ficha = state.holdingCard;

            ficha.x = e.clientX - state.cursorOffset.x;         //tocar para modificar el margen
            ficha.y = e.clientY - state.cursorOffset.y;

            context.drag.clearRect(0, 0,
                canvases.drag.width,
                canvases.drag.height,
            );

            dibujarFicha(ficha, context.drag);
        }
    });
    function fichaCayendo(fichaPorCaer) {
        var jugador = 0;
        if (fichaPorCaer.jugador == 1) {
            if(rivales=="aves")
            img4.src = "src/css/images/fichaAguilaTablero.png";
            jugador = 1;
        }
        else {
            if(rivales=="aves"){
            img4.src = "src/css/images/fichaCondorTablero.png";
            jugador = 2;
            }
        }

        var cordenadaAnteriorY;
        var espacioenX = fichaPorCaer.x / 100 + 1;   //HARCODEADO
        var hastaDondeTienequeBajar;
        for (let y = 0; y < 6; y++) {
            if (matrix[espacioenX][y].jugador==0) {
                hastaDondeTienequeBajar = y;
            }

        }
       
        //el uno es por que empieza 100 pixeles abajo
        img4.onload = function () {  //if hasta donde tiene que bajar es igual a 0
            for (let y = 1; y <= hastaDondeTienequeBajar +1; y++) {
                coorX = fichaPorCaer.x;
                coorY = y * 100;
                if (y != 1) {
                    cordenadaAnteriorY = coorY - 100;
                }
                else {
                    cordenadaAnteriorY = coorY;
                }
                context.spaces.drawImage(img, coorX, cordenadaAnteriorY);
                context.spaces.drawImage(img4, coorX, coorY);

            }
            matrix[espacioenX][hastaDondeTienequeBajar].jugador = jugador;
            hayGanador(espacioenX, hastaDondeTienequeBajar, jugador)
        }
        

    }

    function hayGanador(numeroX, numeroY, j) {
       
        //AGARRAR LOS ALREDEDORES
        // 0 = vertical, cambia y
        // 1 = horizontal, cambia x
        // 2 = diagonal derecha, cambia x e y 
        // 3 = diagonal izquierda, cambia x e y 
        
        if((numeroX+1)<8 && matrix[numeroX+1][numeroY].jugador == j){      //X+1, Y
            console.log("hay algo X+1, Y");
            if(lineaj1 == j){
                lineaj1++;
            }
            else{
                lineaj2++;
            }
            
            haylinea(1,j,numeroX+1,numeroY);
            //linea = uncion recursiva hacia adelante 
            //linea += funcion recursiva hacia atras
        }
        if((numeroX-1)>0  && matrix[numeroX-1][numeroY] !=null && matrix[numeroX-1][numeroY].jugador == j){      //X-1, Y
            console.log("hay algo X-1, Y");
            if(lineaj1 == j){
                lineaj1++;
            }
            else{
                lineaj2++;
            }
            
            haylinea(1,j,numeroX-1,numeroY);
        }
        
        if((numeroX-1)>0  && (numeroY-1)>0 && matrix[numeroX-1][numeroY-1] != null && matrix[numeroX-1][numeroY-1].jugador == j){      //X-1, Y-1
            console.log("hay algo X-1, Y-1");
            if(lineaj1 == j){
                lineaj1++;
            }
            else{
                lineaj2++;
            }
            
            haylinea(2,j,numeroX-1,numeroY-1);
        }
        if((numeroX+1)<8 && (numeroY+1)<7 && matrix[numeroX+1][numeroY+1] != null &&matrix[numeroX+1][numeroY+1].jugador == j){      //X+1, Y+1
            console.log("hay algo X+1, Y+1");
            if(lineaj1 == j){
                lineaj1++;
            }
            else{
                lineaj2++;
            }
            haylinea(2,j,numeroX+1,numeroY+1);
        }
        if((numeroX+1)<8 && (numeroY-1)>0 && matrix[numeroX+1][numeroY-1] != null && matrix[numeroX+1][numeroY-1].jugador == j){      //X+1, Y-1
            console.log("hay algo X+1, Y-1");
            if(lineaj1 == j){
                lineaj1++;
            }
            else{
                lineaj2++;
            }
            
            haylinea(3,j, numeroX+1,numeroY-1);
        }
        if((numeroX-1)>0 && (numeroY+1)<7 && matrix[numeroX-1][numeroY+1] != null && matrix[numeroX-1][numeroY+1].jugador == j){      //X-1, Y+1
            console.log("hay algo X-1, Y+1");
            if(lineaj1 == j){
                lineaj1++;
            }
            else{
                lineaj2++;
            }
            haylinea(3,j,numeroX-1,numeroY+1);
        }
        if((numeroY+1)<7 && matrix[numeroX][numeroY+1] != null && matrix[numeroX][numeroY+1].jugador == j){      //X, Y+1
            console.log("hay algo X, Y+1");
            if(lineaj1 == j){
                lineaj1++;
            }
            else{
                lineaj2++;
            }
            
            haylinea(0, j ,numeroX,numeroY+1);
        }
        if((numeroY-1)>0 && matrix[numeroX][numeroY-1] !=null && matrix[numeroX][numeroY-1].jugador == j ){      //X, Y-1
            console.log("hay algo X, Y-1");
            if(lineaj1 == j){
                lineaj1++;
            }
            else{
                lineaj2++;
            }
            haylinea(0, j, numeroX, numeroY-1);
        }
    }
    function haylinea(tipoLinea, j, x, y){ 
        let suma = 0;
        let index = y;
        if(tipoLinea == 0){
            while(index<7 && matrix[x][index] !=null){
                if(matrix[x][index].jugador){
                    suma++;
                }
                index++;
            }
            console.log(suma)
            index = y;
            while(index>0 && matrix[x][index] !=null){ 
                if(matrix[x][index].jugador == j){
                    suma++;
                }
                index--;
            }
            if(lineaj1 == j){
                lineaj1+suma;
            }
            else{
                lineaj2+suma;
            }
            console.log(suma)
            
        }
        else if(tipoLinea == 1){
            while(y<7){ 
                if(matrix[x+1][y].jugador == j){
                    suma++;
                }
            }
            while(y>0){ 
                if(matrix[x-1][y].jugador == j){
                    suma++;
                }
            }
            if(lineaj1 == j){
                lineaj1+suma;
            }
            else{
                lineaj2+suma;
            }
        }
        else if(tipoLinea == 2){
            while(y<7){ 
                if(matrix[x+1][y+1].jugador == j){
                    suma++;
                }
            }
            while(y>0){ 
                if(matrix[x-1][y-1].jugador == j){
                    suma++;
                }
            }
            if(lineaj1 == j){
                lineaj1+suma;
            }
            else{
                lineaj2+suma;
            }
        }
        else{
            while(y<7){ 
                if(matrix[x-1][y+1].jugador == j){
                    suma++;
                }
            }
            while(y>0){ 
                if(matrix[x+1][y-1].jugador == j){
                    suma++;
                }
            }
            if(lineaj1 == j){
                lineaj1+suma;
            }
            else{
                lineaj2+suma;
            }
        }  
         if(lineaj1==3){
            console.log("gano");
            ganador.innerHTML = "gano el Jugador N° " + j
        }
 





    

        //por linea
/*   */ let linea = 1;
        let index =1;
//por linea

        while (matrix[index][numeroY].jugador == j && index<matrix.length) {
            linea++
            index++
            if (linea == 3) {// + valorDeLinea
                ganador.innerHTML = "gano el Jugador N° " + j
            //toggle para que se vaya el tablero y fichas
            return
            }   
        }


//por columna
        linea = 1;
        index = 0;
        console.log(matrix.length)
        console.log(matrix[numeroX].length)
        console.log(matrix[numeroX][numeroY])

        while (matrix[numeroX][index].jugador == j&&index < matrix[numeroY].length) {
            console.log(matrix[numeroX][index])
            linea++
            index++
            if (linea == 2 ) {//+ valorDeLinea
                ganador.innerHTML = "gano el Jugador N° " + j
                return
            }
        }
       

    }

})








module Cell {

    export enum E_StateCell {
        FREE = 0,
        BOMBILLA,
        ILUMINADO
    }
    
    export enum E_BlockCell {
        SOLID = -1,
        CERO = 0,
        UNO,
        DOS,
        TRES,
        CUATRO
    }

    export class Cell {
    }

    export class StateCell extends Cell {
        state_cell: E_StateCell;
        
        constructor(n: E_StateCell){
            super();
            this.state_cell = n;
        }
    }

    export class Block extends Cell{
        bombillas_vecinas: E_BlockCell;

        constructor(n: E_BlockCell){
            super();
            this.bombillas_vecinas = n;
        }
    }

}

class Tablero {
    private grid = document.getElementById("render-grid-id");
    private grid_section: any;

    private row:number; //This case is NxN Table
    private col:number;

    dim:number;
    private celdas: Cell.Cell[][];

    constructor(row: number, col: number) {
        this.grid.innerHTML = "";
        this.row=row;
        this.col=col;
        this.dim=row;
        this.render();
    }

    render(){
        this.render_grid_section();
        this.render_grid_layout(this.row,this.col);
        this.render_grid_fill();
    }

    render_grid_section(){
        let template = `<div id="render-grid-section" class="render-grid-section" 
                        style="display: grid;
                        border: 1px black solid;
                        height: 100%;
                        width: 100%";
                        </div>
                        `

        this.grid.innerHTML += template;
        this.grid_section = document.getElementById("render-grid-section");
    }

    render_grid_layout(height: number, width: number){
        this.grid_section.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
        this.grid_section.style.gridTemplateRows = `repeat(${height}, 1fr)`;
    }

    render_grid_fill(){
        const container = document.getElementById("render-grid-section");

        var i: number;
        var j: number;
        for (i=0; i< this.dim ; i++){
            for(j=0; j< this.dim ; j++) {
                let render_template = `
                            <div id="cell_${i}_${j}" class="cell_item" style=
                                                                        "   border: 1px orange solid;
                                                                            margin: 2px;
                                                                            text-align:center;
                                                                            height: 50px;
                                                                            width: 50px;
                                                                            cursor: pointer;">
                                
                            </div>
            `
            container.innerHTML += render_template;
            }
        }
    }

    change_status_cell(i_cell: number, j_cell: number){

        document.getElementById(`cell_${i_cell}_${j_cell}`).addEventListener('click', (e) => {
            let cell = document.getElementById(`cell_${i_cell}_${j_cell}`);
            switch(cell.innerHTML) {
                case "F":
                    cell.innerHTML = "-1";
                    cell.style.backgroundColor = "black";
                    cell.style.color = "black";
                    break;
                case "-1":
                    cell.innerHTML = "0";
                    cell.style.backgroundColor = "black";
                    cell.style.color = "white";
                    break;
                case "0":
                    cell.innerHTML = "1";
                    cell.style.backgroundColor = "black";
                    cell.style.color = "white";
                    break;
                case "1":
                    cell.innerHTML = "2";
                    break;
                case "2":
                    cell.innerHTML = "3";
                    break;
                case "3":
                    cell.innerHTML = "4";
                    break;
                case "4":
                    cell.innerHTML = "F";
                    cell.style.backgroundColor = "white";
                    cell.style.color = "white";
                    break;
                default:
                    cell.innerHTML = "-1";
                    cell.style.backgroundColor = "black";
                    break;
            }
        });
    }

    private unsetIluminado(row_free: number, col_free: number){
        this.unsetIluminadoRow(row_free, col_free);
        this.unsetIluminadoCol(row_free, col_free);
    }

    private unsetIluminadoCell(row: number, col: number){
        let cell = document.getElementById(`cell_${row}_${col}`);

        if(this.celdas[row][col] instanceof Cell.StateCell){
            if((this.celdas[row][col] as Cell.StateCell).state_cell == Cell.E_StateCell.ILUMINADO){

                (this.celdas[row][col] as Cell.StateCell).state_cell = Cell.E_StateCell.FREE;
                cell.style.backgroundColor = "white";
            }
            return true;
        }
        return false;
    }

    private unsetIluminadoRow(row_free: number, col_free: number){

        //Pintar y actualizar horizontalmente hacia la izquierda
        for(var i: number = col_free; i>=0 ; i--){
            if(this.celdas[row_free][i] instanceof Cell.Block){
                break;
            }
            else{
                if( (this.celdas[row_free][i] as Cell.StateCell).state_cell == Cell.E_StateCell.ILUMINADO){
                    this.unsetIluminadoCell(row_free, i);
                }
                continue; //Bombilla
            }
        }

        //Pintar y actualizar horizontalmente hacia la derecha
        for(var i: number = col_free; i<this.dim; i++){
            if(this.celdas[row_free][i] instanceof Cell.Block){
                break;
            }
            else {
                if( (this.celdas[row_free][i] as Cell.StateCell).state_cell == Cell.E_StateCell.ILUMINADO){
                    this.unsetIluminadoCell(row_free, i);
                }
                continue; //Bombilla
            }
        }
    }

    private unsetIluminadoCol(row_free: number, col_free: number){
        //Pintar y actualizar verticalmente hacia arriba
        for(var i: number = row_free; i >= 0 ; i--){
            if(this.celdas[i][col_free] instanceof Cell.Block){
                break;
            }
            else
            {
                if( (this.celdas[i][col_free] as Cell.StateCell).state_cell == Cell.E_StateCell.ILUMINADO){
                    this.unsetIluminadoCell(i, col_free);
                }
                continue; // Bombilla
            }
        }

        //Pintar y actualizar horizontalmente hacia abajo
        for(var i:number = row_free; i< this.dim; i++){
            if(this.celdas[i][col_free] instanceof Cell.Block){
                break;
            }
            else
            {
                if( (this.celdas[i][col_free] as Cell.StateCell).state_cell == Cell.E_StateCell.ILUMINADO){
                    this.unsetIluminadoCell(i, col_free);
                }
                continue; //Bombilla
            }
        }
    }

    private unsetBombillaCell(row: number, col: number){
        let cell = document.getElementById(`cell_${row}_${col}`);

        if(this.celdas[row][col] instanceof Cell.StateCell){
            if( (this.celdas[row][col] as Cell.StateCell).state_cell == Cell.E_StateCell.BOMBILLA){
                (this.celdas[row][col] as Cell.StateCell).state_cell = Cell.E_StateCell.FREE;

                cell.style.backgroundColor = "white";

                this.unsetIluminado(row, col);
            }
            return true;
        }
        return false;
    }

    private setBombillaCell(row: number, col: number){
        let cell = document.getElementById(`cell_${row}_${col}`);
        
        if(this.celdas[row][col] instanceof Cell.StateCell){
            if((this.celdas[row][col] as Cell.StateCell).state_cell == Cell.E_StateCell.FREE){
                (this.celdas[row][col] as Cell.StateCell).state_cell = Cell.E_StateCell.BOMBILLA;
                cell.style.backgroundColor = "orange";
                
                this.setIluminado(row,col);
            }
            return true;
        }
        return false;
    }

    private setIluminadoCell(row: number, col: number){
        let cell = document.getElementById(`cell_${row}_${col}`);

        if(this.celdas[row][col] instanceof Cell.StateCell){
            if((this.celdas[row][col] as Cell.StateCell).state_cell == Cell.E_StateCell.FREE){

                (this.celdas[row][col] as Cell.StateCell).state_cell = Cell.E_StateCell.ILUMINADO;
                cell.style.backgroundColor = "yellow";
            }
            return true;
        }
        return false;
    }

    private setIluminado(row: number, col: number){
        this.setIluminadoRow(row, col);
        this.setIluminadoCol(row, col);
    }

    private setIluminadoRow(row_bombilla: number, col_bombilla: number){

        //Pintar y actualizar horizontalmente hacia la izquierda
        for(var i: number = col_bombilla; i>=0 ; i--){
            if(this.celdas[row_bombilla][i] instanceof Cell.Block){
                break;
            }
            else{
                if( (this.celdas[row_bombilla][i] as Cell.StateCell).state_cell == Cell.E_StateCell.FREE){
                    this.setIluminadoCell(row_bombilla, i);
                }
                continue; //Bombilla
            }
        }

        //Pintar y actualizar horizontalmente hacia la derecha
        for(var i: number = col_bombilla; i<this.dim; i++){
            if(this.celdas[row_bombilla][i] instanceof Cell.Block){
                break;
            }
            else {
                if( (this.celdas[row_bombilla][i] as Cell.StateCell).state_cell == Cell.E_StateCell.FREE){
                    this.setIluminadoCell(row_bombilla, i);
                }
                continue; //Bombilla
            }
        }
    }
        
    private setIluminadoCol(row_bombilla: number, col_bombilla: number){

        //Pintar y actualizar verticalmente hacia arriba
        for(var i: number = row_bombilla; i >= 0 ; i--){
            if(this.celdas[i][col_bombilla] instanceof Cell.Block){
                break;
            }
            else
            {
                if( (this.celdas[i][col_bombilla] as Cell.StateCell).state_cell == Cell.E_StateCell.FREE){
                    this.setIluminadoCell(i, col_bombilla);
                }
                continue; // Bombilla
            }
        }

        //Pintar y actualizar horizontalmente hacia abajo
        for(var i:number = row_bombilla; i< this.dim; i++){
            if(this.celdas[i][col_bombilla] instanceof Cell.Block){
                break;
            }
            else
            {
                if( (this.celdas[i][col_bombilla] as Cell.StateCell).state_cell == Cell.E_StateCell.FREE){
                    this.setIluminadoCell(i, col_bombilla);
                }
                continue; //Bombilla
            }
        }
    }

    private isBlock(row: number, col:number){
        return this.celdas[row][col] instanceof Cell.Block;
    }

    private getNumberBlock(row: number, col: number){

        switch((this.celdas[row][col] as Cell.Block).bombillas_vecinas){
            case Cell.E_BlockCell.CERO:
                return 0;
            case Cell.E_BlockCell.UNO:
                return 1;
            case Cell.E_BlockCell.DOS:
                return 2;
            case Cell.E_BlockCell.TRES:
                return 3;
            case Cell.E_BlockCell.CUATRO:
                return 4;
        }
    }

    private isValidBombillasAroundTable(){
        for(var i:number = 0; i< this.dim; i++){
            for (var j: number = 0; j<this.dim; j++){
                if(this.isBlock(i,j)){
                    let n = this.getNumberBlock(i, j);

                    return this.getBombillasAround(i,j) > n ? false: true;
                }
            }
        }

        return true;
    }

    private isFinishTable(){
        return !this.find_free_cell() && this.isValidBombillasAroundTable();
    }

    private getBombillasAround(row: number, col:number){

        var count = 0;

        //Ver arriba
        if(row != 0){
            if(this.celdas[row-1][col] instanceof Cell.StateCell){
                if( (this.celdas[row-1][col] as Cell.StateCell).state_cell == Cell.E_StateCell.BOMBILLA){
                    count++;
                }
            }
        }

        //Ver abajo
        if(row != this.dim-1){
            if(this.celdas[row+1][col] instanceof Cell.StateCell){
                if ( (this.celdas[row+1][col] as Cell.StateCell).state_cell == Cell.E_StateCell.BOMBILLA){
                    count++;
                }
            }
        }

        //Ver izquierda
        if(col != 0){
            if(this.celdas[row][col-1] instanceof Cell.StateCell){
                if( (this.celdas[row][col-1] as Cell.StateCell).state_cell == Cell.E_StateCell.BOMBILLA){
                    count++;
                }
            }
        }

        //Ver derecha
        if(col!=this.dim-1){
            if(this.celdas[row][col+1] instanceof Cell.StateCell){
                if( (this.celdas[row][col+1] as Cell.StateCell).state_cell == Cell.E_StateCell.BOMBILLA){
                    count++;
                }
            }
        }

        return count;
    }
   
    model(){
        this.celdas = [];
        for(var i: number = 0; i< this.dim; i++){
            this.celdas[i] = [];
            for(var j: number = 0;j <this.dim; j++){
                let cell = document.getElementById(`cell_${i}_${j}`);

                switch(cell.innerHTML) {
                    case "F":
                        this.celdas[i][j] = new Cell.StateCell(Cell.E_StateCell.FREE);
                        break;
                    case "-1":
                        this.celdas[i][j] = new Cell.Block(Cell.E_BlockCell.SOLID);
                        break;
                    case "0":
                        this.celdas[i][j] = new Cell.Block(Cell.E_BlockCell.CERO);
                        break;
                    case "1":
                        this.celdas[i][j] = new Cell.Block(Cell.E_BlockCell.UNO);
                        break;
                    case "2":
                        this.celdas[i][j] = new Cell.Block(Cell.E_BlockCell.DOS);
                        break;
                    case "3":
                        this.celdas[i][j] = new Cell.Block(Cell.E_BlockCell.TRES);
                        break;
                    case "4":
                        this.celdas[i][j] = new Cell.Block(Cell.E_BlockCell.CUATRO);
                        break;
                    default:
                        this.celdas[i][j] = new Cell.StateCell(Cell.E_StateCell.FREE);
                        break;
                }
            }
        }
        alert('Model Generated!');
        //alert(`${((this.celdas[0][0]) as Cell.Block).bombillas_vecinas}`)
        //alert(`Existen: ${this.count_state_cells(Cell.E_StateCell.FREE)} espacios vacios`);
        //alert(`Existen: ${this.count_block_cells(Cell.E_BlockCell.TRES)} espacios de bloque con 3`);

        //this.setBombillaCell(0,0);

        //this.setBombillaCell(3,3);
        //this.setBombillaCell(2,2);

        //alert(`Existen: ${this.count_state_cells(Cell.E_StateCell.FREE)} espacios vacios`);

        //alert(`Existe: ${this.getBombillasAround(0,1)}`)

        //alert(`ES VALIDO EL TABLERO?: ${this.isValidBombillasAroundTable()}`);
        t.solve(this.celdas);
    }

    private count_block_cells(blockCelltToCount: Cell.E_BlockCell){
        var count = 0;
        switch(blockCelltToCount){
            case Cell.E_BlockCell.CERO:
                for(var i: number = 0; i<this.dim; i++){
                    for(var j: number = 0; j<this.dim; j++){
                        if(this.celdas[i][j] instanceof Cell.Block){
                            if( ((this.celdas[i][j]) as Cell.Block).bombillas_vecinas == Cell.E_BlockCell.CERO){
                                count++;
                            }
                        }
                    }
                }
                break;
            case Cell.E_BlockCell.UNO:
                for(var i: number = 0; i<this.dim; i++){
                    for(var j: number = 0; j<this.dim; j++){
                        if(this.celdas[i][j] instanceof Cell.Block){
                            if( ((this.celdas[i][j]) as Cell.Block).bombillas_vecinas == Cell.E_BlockCell.UNO){
                                count++;
                            }
                        }
                    }
                }
                break;
            case Cell.E_BlockCell.DOS:
                for(var i: number = 0; i<this.dim; i++){
                    for(var j: number = 0; j<this.dim; j++){
                        if(this.celdas[i][j] instanceof Cell.Block){
                            if( ((this.celdas[i][j]) as Cell.Block).bombillas_vecinas == Cell.E_BlockCell.DOS){
                                count++;
                            }
                        }
                    }
                }
                break;
            case Cell.E_BlockCell.TRES:
                for(var i: number = 0; i<this.dim; i++){
                    for(var j: number = 0; j<this.dim; j++){
                        if(this.celdas[i][j] instanceof Cell.Block){
                            if( ((this.celdas[i][j]) as Cell.Block).bombillas_vecinas == Cell.E_BlockCell.TRES){
                                count++;
                            }
                        }
                    }
                }
                break;
            case Cell.E_BlockCell.CUATRO:
                for(var i: number = 0; i<this.dim; i++){
                    for(var j: number = 0; j<this.dim; j++){
                        if(this.celdas[i][j] instanceof Cell.Block){
                            if( ((this.celdas[i][j]) as Cell.Block).bombillas_vecinas == Cell.E_BlockCell.CUATRO){
                                count++;
                            }
                        }
                    }
                }
                break;
        }
        return count;
    }
    private count_state_cells(stateCellToCount: Cell.E_StateCell){
        var count = 0;
        switch(stateCellToCount){
            case Cell.E_StateCell.BOMBILLA:
                for(var i: number = 0; i<this.dim; i++){
                    for(var j: number = 0; j<this.dim; j++){
                        if(this.celdas[i][j] instanceof Cell.StateCell){
                            if( ((this.celdas[i][j]) as Cell.StateCell).state_cell == Cell.E_StateCell.BOMBILLA){
                                count++;
                            }
                        }
                    }
                }
                break;
            case Cell.E_StateCell.FREE:
                for(var i: number = 0; i<this.dim; i++){
                    for(var j: number = 0; j<this.dim; j++){
                        if(this.celdas[i][j] instanceof Cell.StateCell){
                            if( ((this.celdas[i][j]) as Cell.StateCell).state_cell == Cell.E_StateCell.FREE){
                                count++;
                            }
                        }
                    }
                }
                break;
            case Cell.E_StateCell.ILUMINADO:
                for(var i: number = 0; i<this.dim; i++){
                    for(var j: number = 0; j<this.dim; j++){
                        if(this.celdas[i][j] instanceof Cell.StateCell){
                            if( ((this.celdas[i][j]) as Cell.StateCell).state_cell == Cell.E_StateCell.ILUMINADO){
                                count++;
                            }
                        }
                    }
                }
                break;
        }
        return count;
    }

    private tableFinished(table: Cell.Cell[][]){

        for(var i: number = 0; i< this.dim; i++){
            for(var j: number = 0;j<this.dim; j++){
                if(table[i][j] instanceof Cell.StateCell){
                    if((table[i][j] as Cell.StateCell).state_cell == Cell.E_StateCell.FREE){
                        return false;
                    }
                }
            }
        }

        return true;
    }

    solve(table: Cell.Cell[][]) {

        if(this.tableFinished(table)){
            return true;
        }

        var block_current = this.getBlockWithFreeCellsAround();
        // Block_current is an array of tuples

        if(block_current.length > 0){
            for(var i : number = 0; i< block_current.length; i = i+2){

                var row = block_current[i];
                var col = block_current[i+1];

                this.setBombillaCell(row, col);

                if( this.solve(t.celdas)){ //Recursive Function to Backtrack
                    return true;
                }
                    this.unsetBombillaCell(row, col);
            }
        }
        else {
            //si la respuesta es no: LLenar el tablero!
            this.completarTablero();
            return this.solve(table);
        }
        return false;
    }


    private completarTablero(){
        for(var i: number = 0;i<this.dim; i++){
            for(var j: number=0; j<this.dim; j++){
                if(this.celdas[i][j] instanceof Cell.StateCell){
                    if(this.isReallyValidCellToPutBombilla(i,j)){
                        this.setBombillaCell(i,j);
                    }
                }
            }
        }
    }

    private getBlockWithFreeCellsAround(){
        for(var i:number = 0; i< this.dim; i++){
            for(var j:number = 0; j<this.dim; j++){
                if(this.isBlock(i,j)){
                    if(this.getBombillasAround(i,j) < this.getNumberBlock(i,j) &&  this.getNumberBlock(i,j) != 0){

                        var array = this.getCellsFreeAroundBlock(i, j);

                        return array;
                    }
                }
            }
        }
        return [];
    }

    /*
        Devuelve un arreglo con las casillas posibles a rellenar

        [1,1,2,2,3,3]
        x = 1 -> row
        y = 1 -> col


    */
    private getCellsFreeAroundBlock(row: number, col: number) {

        var tuples = [];
        var count = 0;

        //It has left
        if(col != 0){
            if ( this.celdas[row][col-1] instanceof Cell.StateCell){
                if((this.celdas[row][col-1] as Cell.StateCell).state_cell == Cell.E_StateCell.FREE){
                    if(this.isReallyValidCellToPutBombilla(row, col-1)){
                        count++;
                        tuples.push(row);
                        tuples.push(col-1);
                    }
                }
            }
        }

        //It has right
        if(col != this.dim - 1){
            if ( this.celdas[row][col+1] instanceof Cell.StateCell){
                if((this.celdas[row][col+1] as Cell.StateCell).state_cell == Cell.E_StateCell.FREE){
                    if(this.isReallyValidCellToPutBombilla(row, col+1)){
                        count++;
                        tuples.push(row);
                        tuples.push(col+1);
                    }
                }
            }
        }

        //It has up
        if(row != 0) {
            if( this.celdas[row-1][col] instanceof Cell.StateCell){
                if( (this.celdas[row-1][col] as Cell.StateCell).state_cell == Cell.E_StateCell.FREE){
                    if(this.isReallyValidCellToPutBombilla(row-1,col )){
                        count++;
                        tuples.push(row-1);
                        tuples.push(col);
                    }
                }
            }
        }

        //It has down
        if(row != this.dim-1){
            if(this.celdas[row+1][col] instanceof Cell.StateCell){
                if ((this.celdas[row+1][col] as Cell.StateCell).state_cell == Cell.E_StateCell.FREE){
                    if(this.isReallyValidCellToPutBombilla(row+1,col )){
                        count++;
                        tuples.push(row+1);
                        tuples.push(col);
                    }
                }
            }
        }

        return tuples;
    }

    
    private isReallyValidCellToPutBombilla(row: number, col: number){
        this.setBombillaCell(row, col);

        if(!this.isValidBombillasAroundTable()){
            this.unsetBombillaCell(row, col);
            return false;
        }
        return true;
    }



    // Retorna las coordenadas [x, y] de una celda libre
    private find_free_cell(){
        for(var i: number = 0; i< this.dim; i++){
            for(var j: number = 0; j< this.dim; j++){
                if(this.celdas[i][j] instanceof Cell.StateCell){
                    if ( ( this.celdas[i][j] as Cell.StateCell ).state_cell == Cell.E_StateCell.FREE){
                        return [i, j];
                    }
                }
            }
        }
        return false;
    }
}

var t: Tablero;

var btnGenerateTable = document.getElementById("button-render");
btnGenerateTable.addEventListener('click', ()=> {

    let row = +(document.getElementById("row-number") as HTMLInputElement).value;
    let col = +(document.getElementById("column-number") as HTMLInputElement).value;

    t = new Tablero(row, col);

    var i: number;
    var j:number;

    for(i=0; i<t.dim; i++) {
        for(j=0; j<t.dim; j++ ) {
            t.change_status_cell(i, j);
        }
    }
    }
);



var btnSolverTable = document.getElementById("button-solver");
btnSolverTable.addEventListener('click', () => {

    t.model();

});
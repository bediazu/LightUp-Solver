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
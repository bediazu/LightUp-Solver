class Tablero {
    private grid = document.getElementById("render-grid-id");
    private grid_section: any;

    private row:number; //This case is NxN Table
    private col:number;

    dim:number;

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

        var i: number
        for (i=0; i< this.row * this.col ;i++){
            let render_template = `
                            <div id="cell_${i}" class="cell_item" style=
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

    change_status_cell(i_cell: number){

        document.getElementById(`cell_${i_cell}`).addEventListener('click', (e) => {
            let cell = document.getElementById(`cell_${i_cell}`);

            switch(cell.innerHTML) {
                case "0":
                    cell.innerHTML = "X";
                    cell.style.backgroundColor = "black";
                    cell.style.color = "black";
                    break;

                case "X":
                    cell.innerHTML = "1";
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
                    cell.innerHTML = "0";
                    cell.style.backgroundColor = "white";
                    cell.style.color = "white";
                    break;
                default:
                    cell.innerHTML = "X";
                    cell.style.backgroundColor = "black";
                    break;
            }
        });
    }
}

var btnGenerateTable = document.getElementById("button-render");
btnGenerateTable.addEventListener('click', ()=> {

    let row = +(document.getElementById("row-number") as HTMLInputElement).value;
    let col = +(document.getElementById("column-number") as HTMLInputElement).value;

    let t = new Tablero(row, col);

    var i:number
    for (i=0; i<t.dim*t.dim;i++){
        t.change_status_cell(i);
    }
});


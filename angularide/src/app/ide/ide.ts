import { Component } from '@angular/core';
//import { NgIf, NgForOf, CommonModule } from "../../../node_modules/@angular/common/common_module.d";>
import { Query } from '../services/query';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ide',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ide.html',
  styleUrl: './ide.css',
})
export class Ide {
  sql: string = '';
  historial: string[] = [];
  resultados: any[] = [];
  columnas: string[] = [];

  errorMsg: string = '';
  tablas: string[] = [];
  columnasTabla: string[] = [];
  sugerencias: string[] = [];


  constructor(private queryService: Query) {}

  ejecutar() {
    //console.log(this.sql);

    this.errorMsg = '';

    if(!this.sql.trim()) return;

    //guardar historial
    this.historial.unshift(this.sql);

    this.queryService.ejecutarSQL(this.sql).subscribe({
      next:(res: any[]) => {
        this.resultados = res;

        if(res.length > 0){
          this.columnas = Object.keys(res[0]);
        }
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Error en la consulta';
      }
    });
  }

  onKeyDown(event:KeyboardEvent){
    if(event.ctrlKey && event.key === 'Enter'){
      this.ejecutar();
    }
  }

  ngOnInit(){
    this.queryService.getTables().subscribe((res) => {
      this.tablas = res;
    });
  }

  usarTabla(tabla: string){
    this.queryService.getColumns(tabla).subscribe(cols => {
      this.columnasTabla = cols;

      this.sql = `SELECT ${cols.join(', ')} FROM ${tabla};`;
    });
  }

  onInputChange(){
    const texto = this.sql.toLowerCase();

    if(texto.endsWith('from ')){
      this.sugerencias = this.tablas;
    } else {
      this.sugerencias = [];
    }
  }

  insertarSugerencias(s: string){
    this.sql += s;
    this.sugerencias = [];
  }

}

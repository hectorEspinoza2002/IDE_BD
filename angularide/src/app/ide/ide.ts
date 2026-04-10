import { AfterViewInit, Component } from '@angular/core';
//import { NgIf, NgForOf, CommonModule } from "../../../node_modules/@angular/common/common_module.d";>
import { Query } from '../services/query';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import 'codemirror/mode/sql/sql';
import * as CodeMirror from 'codemirror';
import { timestamp } from 'rxjs';

@Component({
  selector: 'app-ide',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ide.html',
  styleUrl: './ide.css',
})
export class Ide {

  //implements AfterViewInit
  sql: string = '';
  resultados: any[] = [];
  columnas: string[] = [];

  errorMsg: string = '';

  // Mostrar bases de datos
  databases: string[] = [];
  tablas: string[] = [];

  columnasTabla: string[] = [];
  sugerencias: string[] = [];

  editor: any;

  historial: any[] = [];
  contadorHistorial: number = 1;

  // ngAfterViewInit(): void {
  //   this.editor = CodeMirror.fromTextArea(
  //     document.getElementById('editor') as HTMLTextAreaElement,
  //     {
  //       mode: 'text/x-sql',
  //       theme: 'material',
  //       lineNumbers: true,
  //     }
  //   );

  //   this.editor.on('change', () => {
  //     this.sql = this.editor.getValue();
  //   });
  // }


  constructor(private queryService: Query) {}

  ejecutar(){
    this.errorMsg = '';

    
    if(!this.sql.trim()) return;

    const inicio = performance.now();
    const query = this.sql;
    const hora = new Date().toLocaleTimeString();

    this.queryService.ejecutarSQL(query).subscribe({
      next: (res:any) => {
        
        const fin = performance.now();
        const tiempo = ((fin - inicio) / 1000).toFixed(3);
        //const hora = new Date().toLocaleTimeString();

        if(res.type === 'select'){
          this.resultados = res.data;

          if(res.data.length > 0){
            this.columnas = Object.keys(res.data[0]);
          }
        } else if(res.type === 'update'){
          this.resultados = [];
          this.columnas = [];

          this.errorMsg = '';

        } else if(res.type === 'error'){
          this.errorMsg = res.message;
        }

        this.historial.unshift({
          id: this.contadorHistorial++,
          time: tiempo + ' sec' ,
          action: query,
          message: res.message || (res.rows + ' rows'),
          //message: res.length + ' rows',
          horaseg: hora,
          
        });
      },
      error: () => {
        this.errorMsg = 'Error en la consulta';

        // this.historial.unshift({
        //   id: this.contadorHistorial++,
        //   time: '0 sec',
        //   action: query,
        //   message: 'Error',
        //   horaseg: hora
        // });
      }
    });

  }

  // ejecutar(){
  //   this.errorMsg = '';

    
  //   if(!this.sql.trim()) return;

  //   const inicio = performance.now();
  //   const query = this.sql;
  //   const hora = new Date().toLocaleTimeString();

  //   this.queryService.ejecutarSQL(query).subscribe({
  //     next: (res:any[]) => {
        
  //       const fin = performance.now();
  //       const tiempo = ((fin - inicio) / 1000).toFixed(3);
  //       //const hora = new Date().toLocaleTimeString();

  //       this.resultados = res;

  //       if(res.length > 0){
  //         this.columnas = Object.keys(res[0]);
  //       }

  //       this.historial.unshift({
  //         id: this.contadorHistorial++,
  //         time: tiempo + ' sec' ,
  //         action: query,
  //         message: res.length + ' rows',
  //         horaseg: hora,
          
  //       });
  //     },
  //     error: (err) => {
  //       this.errorMsg = err.error?.message || 'Error en la consulta';

  //       this.historial.unshift({
  //         id: this.contadorHistorial++,
  //         time: '0 sec',
  //         action: query,
  //         message: 'Error',
  //         horaseg: hora
  //       });
  //     }
  //   });

  // }
  
  // ejecutar() {
  //   //console.log(this.sql);

  //   this.errorMsg = '';

  //   if(!this.sql.trim()) return;

  //   //guardar historial
  //   this.historial.unshift(this.sql);

  //   this.queryService.ejecutarSQL(this.sql).subscribe({
  //     next:(res: any[]) => {
  //       this.resultados = res;

  //       if(res.length > 0){
  //         this.columnas = Object.keys(res[0]);
  //       }
  //     },
  //     error: (err) => {
  //       this.errorMsg = err.error?.message || 'Error en la consulta';
  //     }
  //   });
  // }

  onKeyDown(event:KeyboardEvent){
    if(event.ctrlKey && event.key === 'Enter'){
      this.ejecutar();
    }
  }

  ngOnInit(){

    // Consulta Base de datos
    this.queryService.getDatabases().subscribe(res =>{
      this.databases = res;
    })

    // Consulta columnas de tablas
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

  dbActual: string = '';

  seleccionarDB(db: string){
    this.dbActual = db;

    const query = `USE ${db};`;

    this.queryService.ejecutarSQL(query).subscribe((res: any) =>{
      console.log(res);
      //regresca tablas
      this.cargarTablas();
    });
  }

  cargarTablas(){
    this.queryService.getTables().subscribe(res => {
      this.tablas = res;
    });
  }

}

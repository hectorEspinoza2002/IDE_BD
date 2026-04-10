import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Query {

  private api = 'http://localhost:8080/api/execute';

  constructor(private http:HttpClient){}

  ejecutarSQL(sql: string){
    return this.http.post<any>(this.api, {sql});
  }

  getTables(){
    return this.http.get<string[]>('http://localhost:8080/api/tables');
  }

  getColumns(tabla: string){
    return this.http.get<string[]>(`http://localhost:8080/api/columns/${tabla}`);
  }

  getDatabases(){
    return this.http.get<string[]>('http://localhost:8080/api/databases');
  }

}

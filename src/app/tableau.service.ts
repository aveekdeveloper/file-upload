import { Injectable } from '@angular/core';
import * as jsonata from 'jsonata';

@Injectable({
  providedIn: 'root'
})
export class TableauService {
  tabFile;
  recipes= [
  {
    "name":"Get Columns",
    "Description": "Get column details along with formula and datasource name",
    "recipe": "$.workbook.datasources.datasource.($dsid:=$._attributes.name; $dscaption:=$._attributes.caption; $.column.{'dsid':$dsid,'dscaption':$dscaption,'colid':$._attributes.name,'colcaption':$._attributes.caption, 'colformula':$.calculation._attributes.formula})"
  },
  {
    "name":"Get Datasources",
    "Description":"Get basic DataSource details",
    "recipe":"$.workbook.datasources.datasource.{'id':$._attributes.name, 'caption':$._attributes.caption}"
  }
  ];


  constructor(){
  }

  getTableauFile(){
    return this.tabFile;
  }

  setTableauFile(tabFile){
    this.tabFile = tabFile;
  }

  getDatasources(){
    var expression = jsonata("$.workbook.datasources.datasource.{'id':$._attributes.name, 'caption':$._attributes.caption}");
    return expression.evaluate(this.tabFile);
  }

  getColumns(){
    var expression = jsonata("$.workbook.datasources.datasource.($dsid:=$._attributes.name; $dscaption:=$._attributes.caption; $.column.{'dsid':$dsid,'dscaption':$dscaption,'colid':$._attributes.name,'colcaption':$._attributes.caption, 'colformula':$.calculation._attributes.formula})");
    return expression.evaluate(this.tabFile);
  }

  //Expand a formula by replacing Calculation_*** with the column caption
  expandFormula(formula){

  }
}

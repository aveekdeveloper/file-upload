import { Component, OnInit } from '@angular/core';

import { UploadEvent, UploadFile } from 'ngx-file-drop';
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';
import { LocalDataSource } from 'ng2-smart-table';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'fileupload2';
  settings = {
    actions: {
      add: false,
      edit: true,
      delete: false,
      position: 'left',
    },
    edit: {
      editButtonContent: '<i class="material-icons">create</i>',
      saveButtonContent: '<i class="material-icons">save</i>',
      cancelButtonContent: '<i class="material-icons">clear</i>',
    },
    columns: {
      dscaption: {
        title: 'DS Caption'
      },
      /*dsname: {
        title: 'DS Name'
      },*/
      colcaption: {
        title: 'Col Caption'
      },
      /*colname: {
        title: 'Col Name'
      },*/
      formula: {
        title: 'Formula',
        width: '60%',
        editor: {
          type: 'textarea'
        }
      },
      comments: {
        title: 'Description'
      }
    },
    pager: {
      perPage: 30
    }
  };

  csvexportsettings = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    headers: ["Datasource Caption", "Datasource Name", "Col Caption","Col Name","Formula","Description"]
  };

  data: LocalDataSource = new LocalDataSource();

  public files: UploadFile[] = [];

  // Changes XML to JSON
  xmlToJson(xml) {

    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
      // do attributes
      if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j);
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType == 3) { // text
      obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
      for(var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof(obj[nodeName]) == "undefined") {
          obj[nodeName] = this.xmlToJson(item);
        } else {
          if (typeof(obj[nodeName].push) == "undefined") {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(this.xmlToJson(item));
        }
      }
    }
    return obj;
  };


  updateTable(final) {
    let newData = [];
    for(let i=0; i < final.workbook.datasources.datasource.length; i++) {
      if (final.workbook.datasources.datasource[i] && final.workbook.datasources.datasource[i].column) {
        for(let j=0; j < final.workbook.datasources.datasource[i].column.length; j++) {
          let formula = '';
          if (final.workbook.datasources.datasource[i].column[j]['calculation'] && final.workbook.datasources.datasource[i].column[j]['calculation']['@attributes'].formula) {
            formula = final.workbook.datasources.datasource[i].column[j]['calculation']['@attributes'].formula;
          }
          newData.push({
            dscaption: final.workbook.datasources.datasource[i]['@attributes'].caption,
            //dsname: final.workbook.datasources.datasource[i]['@attributes'].name,
            colcaption: final.workbook.datasources.datasource[i].column[j]['@attributes'].caption,
            //colname: final.workbook.datasources.datasource[i].column[j]['@attributes'].name,
            formula: formula
          });
        }
      }
    }
    this.data.load(newData);
  }

  openFile(event) {
    let input = event.target;
    for (var index = 0; index < input.files.length; index++) {
      let reader = new FileReader();
      reader.onload = () => {
          let text: any = reader.result;
          var parser = new DOMParser();
          var doc = parser.parseFromString(text, "application/xml");
          var jsonText = JSON.stringify(this.xmlToJson(doc));
          var final = JSON.parse(jsonText);
          //console.log("final ===> " + final.workbook.datasources.datasource);
          this.updateTable(final);
      }
      reader.readAsText(input.files[index]);
    };
  }

  exportDataToCsv(){
    const settings = this.csvexportsettings;
    this.data.getAll().then(function(result){
      new Angular5Csv(result, 'Twb Report',settings);
    }, function(err){
      alert("No data to export");
    })

  }

  public fileOver(event){
    console.log(event);
  }

  public fileLeave(event){
    console.log(event);
  }


  ngOnInit() {
 }
}

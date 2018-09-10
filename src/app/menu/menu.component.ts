import { Component, OnInit } from '@angular/core';
import { TableauService } from '../tableau.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  tabService : TableauService;
  recipes : ['rice','daal'];

  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import {MatChipsModule} from '@angular/material/chips'; 
import { RestService } from '../rest.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public rest:RestService) { 

    
  }
    private Login: LoginService;
    private isLogged: boolean;
    private documents: object;
    searchText = "";
  ngOnInit() {

  // To do - Make call to back end
    this.rest.getDocument().subscribe((data: {}) => {
      this.documents = data;
      console.log(this.documents);
    });

  }



}





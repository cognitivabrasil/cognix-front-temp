import { Component, OnInit, Input } from '@angular/core';
import { OBAA, OBAACreator } from '../metadata';
import { emptyMockOBAA, emptyMockOBAACreator } from '../mock-data';

import { RestService, endpoint } from '../rest.service';
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';
import {Router} from "@angular/router"
import { parameters } from '../search/searchParameters';
import {MatStepperModule} from '@angular/material/stepper'; 

@Component({
  selector: 'app-new-document-fast',
  templateUrl: './new-document-fast.component.html',
  styleUrls: ['./new-document-fast.component.css']
})
export class NewDocumentFastComponent implements OnInit {

  searchOptions: any;
  finalSearch: string;
  finalparam: string;
  finished:boolean;
  depth:number;
  path:number[];


  kind:any;
  target:any;
  age:any;
  resources:any;

  simple: any;

  currentPage: number;
  progressBarValue: number;


  OBAA: OBAACreator;
  public uploader: FileUploader = new FileUploader({url: endpoint + "/files/uploadFile", itemAlias: "file"});
  public uploader2: FileUploader = new FileUploader({url: endpoint + "/files/uploadFile", itemAlias: 'file'});
  

  constructor(public rest:RestService, private router:Router) { 
    this.rest.getID().subscribe((data: {}) => {
      //console.log(data)
      Object.assign(this.OBAA,data);
      //console.log(this.OBAA);
      this.uploader.onBuildItemForm = (item, form) => {
        form.append("docId", this.OBAA.id);
        form.append("filename", "Thumbnail");
      };

      this.uploader2.onBuildItemForm = (item, form) => {
        form.append("docId", this.OBAA.id);
        form.append("filename", "Material");
      };

    

    });
    
    this.simple = {
      name:"",
      language:"",
      keywords:"",
      description:"",
      interaction:"",
      interactionNumber:"",
      author:[{
        name: "",
        role:"",
      }],
      interactive:"",
      licence:"",
      kind: [],
      target: [],
      age: [],
      resources: [],
      bncc: "",
      owner:"admin",
      favorites:"admin",
      free:"",
      citeAuthor:"",
      alterations:"",
      comercialUse:"",




      id:0
    };
  }


  ngOnInit() {
    console.log(this.simple);
    this.currentPage = 1;
    this.progressBarValue = 100/7;
    this.kind = 
    [
      { 
        name: "Visual",
        isValid: false 
      },
      { 
        name: "Auditivo",
        isValid: false 
      },
      { 
        name: "Textual",
        isValid: false 
      },
      { 
        name: "Tátil",
        isValid: false 
      },
      
    ];

    this.target = 
    [
      { 
        name: "Estudante",
        isValid: false 
      },
      { 
        name: "Professor",
        isValid: false 
      },
      { 
        name: "Autor",
        isValid: false 
      },
      { 
        name: "Gestor",
        isValid: false 
      },
      
    ];

    this.age = 
    [
      { 
        name: "Educação infantil",
        isValid: false 
      },
      { 
        name: "Ensino fundamental - anos iniciais",
        isValid: false 
      },
      { 
        name: "Ensino fundamental - anos finais",
        isValid: false 
      },
      { 
        name: "Ensino médio",
        isValid: false 
      },
      { 
        name: "Ensino superior",
        isValid: false 
      },
      


    ];
    
    this.resources = [
      [ { 
        name: "Exercício",
        isValid: false 
      },
      { 
        name: "Tabela",
        isValid: false 
      },
      { 
        name: "Diagrama",
        isValid: false 
      },
      { 
        name: "Experimento",
        isValid: false 
      }  ],
      
      [{ 
        name: "Simulação",
        isValid: false 
      },
      { 
        name: "Aula",
        isValid: false 
      },
      { 
        name: "Figura",
        isValid: false 
      },
      { 
        name: "Prova",
        isValid: false 
      }],
      
      [{ 
        name: "Questionário",
        isValid: false 
      },
      { 
        name: "Texto narrativo",
        isValid: false 
      },
      { 
        name: "Gráfico",
        isValid: false 
      },
      { 
        name: "Enunciado de questão",
        isValid: false 
      }]
      
    ]


    this.OBAA = emptyMockOBAACreator;

    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader2.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      document.body.style.cursor="initial";
      this.router.navigate(['/']);
     };

     

     this.uploader2.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      if(this.uploader.queue.length > 0) {
        this.uploader.uploadAll();
      }
      else {
        this.router.navigate(['/']);
        document.body.style.cursor="initial";
        }
      };

     this.searchOptions = Object.assign({}, parameters);
     this.finalSearch = "área do conhecimento"; 
     this.finished = false;
     this.depth = 0;
     this.path = [];
  
  }

  finish(){
    

    for (var propt in this.simple){
      if (Object.prototype.hasOwnProperty.call(this.simple, propt)) {
          if(this.simple[propt] == "" && !(propt == "id" || propt == "kind" || propt == "age" || propt == "target" || propt == "resources")){
            
            return;
          }
      }
    }

    document.body.style.cursor="wait";
    console.log(this.kind);

    this.OBAA.metadata.general.titles[0] = this.simple.name;
    this.OBAA.metadata.general.descriptions[0] = this.simple.description;
    this.OBAA.metadata.general.keywords[0] = this.simple.keywords;
    this.OBAA.metadata.general.titles[0] = this.simple.name;
    this.updateSimple;
    this.addAuthor();

    console.log(this.simple.author);
    console.log( "BEFORE");
    console.log(this.OBAA);
    console.log(this.simple);


    this.OBAA.isVersion = "1";

    
    this.rest.addDocument(JSON.stringify(this.OBAA), this.OBAA.id).subscribe((data: {}) => {
      console.log(data);
      

      this.simple.id = this.OBAA.id;
      console.log(this.simple);
      this.rest.addDocumentSOLR(JSON.stringify([this.simple])).subscribe((data: {}) => {
        console.log(data);
        

        this.uploader2.uploadAll();
      });

    });



    
  }

  onSelect(index:number, selected:string){
    
    if (this.finished) {
      this.finalSearch = this.finalSearch.substring(0, this.finalSearch.length - this.finalparam.length - 1);  
    }
    
    this.finalparam = selected;

    if(this.searchOptions.next[index].hasOwnProperty("next")){



      this.finalSearch += "-" + selected;
      this.searchOptions = this.searchOptions.next[index];
      this.depth++;
      this.path.push(index);
      
      this.finished = false;
      

    }
    else{
      this.finalSearch += "-"+ selected;
      this.finished = true;
      //console.log(this.depth);
    }

    //console.log(this.finalSearch);

  }

  onSelectPrevious(){
    if(this.depth > 0){

      
      var x:any = Object.assign({}, parameters);
      this.finalSearch ="área do conhecimento";


      this.depth--;
      for(var i = 0; i < this.depth; i++){
        x = x.next[this.path[i]];
        this.finalSearch += "-" + x.name;
        
      }
      this.path.pop();
      this.searchOptions = x; 
      
      
      
      
      this.finalparam = this.searchOptions.name;
      this.finished = false;
    }


  }

  //Pagination starts here
  page(page: number){
    this.resetPagesBoldness();

    var currentPageString = "page" + this.currentPage;
    var currentPageStep = "step" + this.currentPage;
    document.getElementById(currentPageString).style.fontWeight = "normal";
    document.getElementById(currentPageStep).style.display = "none";

    

    var newPageString = "page" + page;
    var newStepString = "step" + page;
    document.getElementById(newPageString).style.fontWeight = "bold";
    document.getElementById(newStepString).style.display = "block";
    
    this.currentPage = page;
    this.progressBarValue = (100/7) * page;

    if(page == 7)
      this.updateSimple();

    window.scrollTo(0,0);

  }

  resetPagesBoldness(){
    for (var i = 1; i <= 7; i++){
      var pageString = "page" + i;
      document.getElementById(pageString).style.fontWeight = "normal";

    }
  }

  nextPage(){
      console.log(this.currentPage);
    if (this.currentPage != 7){
      this.page(this.currentPage + 1);
    }
  }

  prevPage(){
    if (this.currentPage != 1){
      this.page(this.currentPage - 1);
    }
  }

  formatLabel(value:number | null){
    switch(value){
      case 1:
        return "Nula";
        break;
      case 2:
        return "Baixa";
        break;
      case 3:
        return "Média";
        break;
      case 4:
        return "Alta";
        break;
    
      }
  }

  updateSimple(){
    this.simple.kind = [];
    this.simple.target = [];
    this.simple.resources = [];
    this.simple.age = [];

    for(var i = 0; i < this.kind.length; i++){
      if(this.kind[i].isValid){
        this.OBAA.metadata.general.coverages.push(this.kind[i].name);
        this.simple.kind.push(this.kind[i].name);

      }
    }

    for(var i = 0; i < this.target.length; i++){
      if(this.target[i].isValid){
        this.OBAA.metadata.technical.formats.push(this.target[i].name);
        this.simple.target.push(this.target[i].name);
      }
    }

    for(var i = 0; i < this.age.length; i++){
      if(this.age[i].isValid){
        this.OBAA.metadata.technical.supportedPlatforms.push(this.age[i].name);
        this.simple.age.push(this.age[i].name);
      }
    }

    for(var i = 0; i < this.resources.length; i++){
      for(var recIndex = 0; recIndex < this.resources[i].length; recIndex++){
        if(this.resources[i][recIndex].isValid){
          this.simple.resources.push(this.resources[i][recIndex].name);
        }
      }
    }

    
    this.simple.interaction = this.formatLabel(this.simple.interactionNumber);
    this.simple.bncc = this.finalSearch;
    
    this.check();

    
  }

  addAuthor(){
    var aut = {
      name:"",
      role:"",
    };

    this.simple.author.push(aut);



  }

  removeAuthor(){

    this.simple.author.pop();
  }

  check(){
    var complete = false;
    for (var propt in this.simple){
      if (Object.prototype.hasOwnProperty.call(this.simple, propt)) {
          if(this.simple[propt] == "" && !(propt == "id" || propt == "kind" || propt == "age" || propt == "target" || propt == "resources")){
            document.getElementById("incomplete").style.display="block";
            complete = true;
            console.log(propt);
          }
      }
    }

    if(!complete)
      document.getElementById("incomplete").style.display="none";
    
    if(this.uploader2.queue.length == 0){
      document.getElementById("uploadEmpty").style.display="block";
      return;
    }

    document.getElementById("uploadEmpty").style.display="none";

    

  }
  


}

import { Component, OnInit, AfterViewInit, TemplateRef, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap';
import { CompanyService } from '../../../services/company.service';
import {Config, Data, Layout} from 'plotly.js/dist/plotly.js';
import { LoaderEvent } from '../../../services/loader-event';
import { AppSettings } from '../../../app.setting';
import { ExcelService } from '../../../services/excelservice';

import * as Plotly from 'plotly.js/dist/plotly.js';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import * as $ from 'jquery';
import * as html2canvas from "html2canvas";
import * as ExcelJs from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

pdfMake.fonts = {
  helvetica: {
    normal: 'Helvetica-neue-normal.otf',
    bold: 'helvetica-neue-bold.ttf',
  }
};

@Component({
  selector: 'app-reports-export',
  templateUrl: './reports-export.component.html',
  styleUrls: ['./reports-export.component.css']
})
export class ReportsExportComponent implements OnInit {

  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  @ViewChild('dimensionTabs') dimensionTabs: TabsetComponent;

  public level = 180*52/100;
  public tempPdf:any;
  public base = AppSettings.BASE_PATH;
  public commentGeneral = '';
  public filterGroup = '';
  // Trig to calc meter point
  public degrees = 180 - this.level;
  public valuesMeter = [100/6,100/6,100/6,100/6,100/6,100/6,100];
  public valuesMeterReal = [16,18,18,18,18,12,100];
  public radius = .5;
  public radians = this.degrees * Math.PI / 180;
  public x = this.radius * Math.cos(this.radians);
  public y = this.radius * Math.sin(this.radians);
  public mainPath = 'M -.0 -0.025 L .0 0.025 L ';
  public pathX = String(this.x);
  public space = ' ';
  public pathY = String(this.y);
  public pathEnd = ' Z';
  public path = this.mainPath.concat(this.pathX,this.space,this.pathY,this.pathEnd);
  public levelFinal = 0;
  public d3 = Plotly.d3;
  public WIDTH_IN_PERCENT_OF_PARENT = 60;
  public HEIGHT_IN_PERCENT_OF_PARENT = 80;

  // public gd3 = this.d3.select('body')
  //     .append('div')
  //     .style({
  //         width: this.WIDTH_IN_PERCENT_OF_PARENT + '%',
  //         'margin-left': (100 - this.WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',

  //         height: this.HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
  //         'margin-top': (100 - this.HEIGHT_IN_PERCENT_OF_PARENT) / 2 + 'vh'
  //     });

  // public gd = this.gd3.node();

  public data = [
    { 
      type: 'scatter',
      x: [0], y:[0],
      marker: {
        size: 20, 
        color:'850000'
      },
      showlegend: false,
      name: 'speed',
      text: this.level,
      hoverinfo: 'none'
    },
    { 
      values: this.valuesMeter,
      rotation: 90,
      text: ['1-16', '17-34', '35-52','53-70', '71-88', '89-100', ''],
      textinfo: 'text',
      textposition:'inside',  

      // #ec1b30, #f69322, #00c484, #239fd7,
      marker: {colors:['#ec1b30', '#f69322','#00c484', '#239fd7','#1a486b', '#272264','rgba(255, 255, 255, 0)']},
      labels: ['Plasma', 'Gaseoso', 'Condensación', 'Líquido', 'Solidificación', 'Bases sólidas', ''],
      hoverinfo: 'none',
      hole: .5,
      type: 'pie',
      showlegend: false,
      direction: "clockwise",
      textfont: {
        family: '',
        size: 14,
        color: 'white'
      }
    }
  ];
  public diagnostic = [
    {
      name: 'Plasma',
      color: '#ec1b30'
    },
    {
      name: 'Gaseoso',
      color: '#f69322'
    },
    {
      name: 'Condensación',
      color: '#00c484'
    },
    {
      name: 'Líquido',
      color: '#239fd7'
    },
    {
      name: 'Solidificación',
      color: '#1a486b'
    },
    {
      name: 'Sólido',
      color: '#272264'
    }
  ]
  public layout = {
    shapes:[
      {
        type: 'path',
        path: this.path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }
    ],
    title: 'Puntaje obtenido: '+this.level + '%',
    height: 400,
    width: 560,
    margin:{
      t:30,
      b:0,
      l:0,
      r:0
    },
    xaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1], fixedrange: true},
    yaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1], fixedrange: true}
  };
  public competencias = [];
  public final_questions = [];
  public user;
  public id;
  public company = {
    name: ''
  }
  public grupos = [];
  public idGroup = '';
  public newDimensiones = [];
  public competetitionsFinal = [];
  public dimensiones = [];
  public href = '';
  public graphResult = '';
  public graphAreas = '';
  public logoCompany = '';

  // TAB DETAIL
    
  public dimensions = [];
  public numSelectGeneral = 0;
  public averagesDetailTab = ['100%','90%','80%','70%','60%','50%','40%','30%','20%','10%','0%'];
  public averagesTaB = ['100%','80%','60%','40%','20%','0%'];

  public questionsDetail = [];
  public objQuestionsDetails = {};
  public objAreas = [];
  public areas = [];

  public filterDetail = {
    company: '',
    behavior: '',
    group: '',
    area: '',
    dimension: '',
  };
  public selectedBehavior = '';

  // TAB DOWNLOADED
  
  public filterForExcel = {
    type: '',
    company: '',
    group: '',
  };

  public objDimensions = {};
  public generalArea = [];
  public generalAreaArea = [];
  public generalAreaGender = [];
  public generalAreaPosition = [];


  constructor(
    private router: Router,
    private modalService: BsModalService,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private loader: LoaderEvent,
    private excelService: ExcelService,

    ) { }

  ngOnInit() {

    this.user = JSON.parse(localStorage.getItem('user_lapsus'));
      this.route.params.subscribe(params => {
        this.id = params['id'];
        this.filterDetail.company = this.id;
        this.filterForExcel.company = this.id;
        this.companyService.getCompany_quantity(this.id)
        .subscribe(response => {
          this.company = response.result;
          this.logoCompany = this.base + response.result.image;
        });
        this.companyService.getGrupos(this.id)
          .subscribe(response =>{
              this.grupos = response.result.groups;
              if(this.grupos.length == 1){

                this.idGroup = this.grupos[0]._id;
                this.getDataReport(this.id, this.idGroup);
                this.filterDetail.group = this.grupos[0]._id;
                this.filterForExcel.group = this.grupos[0]._id;
                this.getPercentDimension(this.filterDetail);

              }else if(this.grupos.length > 1){
                this.idGroup = this.grupos[0]._id;
                this.getDataReport(this.id, this.idGroup);
                this.filterDetail.group = this.grupos[0]._id;
                this.getPercentDimension(this.filterDetail);
                this.filterForExcel.group = this.grupos[0]._id;

              }
         })
         this.companyService.getAreas(this.id)
          .subscribe(response => {
            this.areas = response.result.areas;
          });
      });

      let this_ = this;
      // $(window).onresize = function() {
      //   Plotly.Plots.resize(this_.gd);
      // };
  }

  getValueMeter(value){
    let sumValueMeter = 0;
    let sumValueMeterReal = 0;
    let real = 0;
    var offsetD = 0;
    var offsetA = 0;
    for (var i = 0; i <  this.valuesMeter.length; i++) {
      sumValueMeter +=  this.valuesMeter[i];
      sumValueMeterReal +=  this.valuesMeterReal[i];
      if(sumValueMeterReal >= value){
        //return sumValueMeter;
        if(value > 30 && value <= 34){
          offsetD = 2;
          offsetA = 5.5;
        }
        else if(value > 45 && value <= 52){
          offsetD = 0;
          offsetA = 0;
        }
        else if(value >= 17 && value <= 45){
          offsetD = 1;
          offsetA = 5.5;
        }
        else if(value >= 63 && value <= 79){
          offsetD = 1;
          offsetA = -4.5;
        }
        else if(value >= 80 && value <= 88){
          offsetD = 1;
          offsetA = -5.5;
        }
        else if(value >= 89 && value <= 94){
          offsetD = 2;
          offsetA = -6.5;
        }
        real = value*sumValueMeter/(sumValueMeterReal + offsetD) + offsetA;
        return real;
      }
    }

    return real;
  }

  getDataReport(id, idGroup){

    this.loader.fire(true);
    let dimensionesComment = [];

    let params = {
      company: id,
      group: idGroup
    }

    this.companyService.getGrupo(id, idGroup)
      .subscribe(response =>{
        this.loader.fire(false);
        if(response.result[0].retro_company){
          this.commentGeneral = response.result[0].retro_company;
        }else{
          this.commentGeneral = '';
        }

        if(response.result[0].retro_dimension > 0){
          dimensionesComment = response.result[0].retro_dimension;

          for(var i=0; i<this.dimensions.length; i++){
            for(var j=0; j<dimensionesComment.length; j++){
              if(this.dimensions[i]._id.dimension_id == dimensionesComment[j].dimension_id){
                this.dimensions[i].comments = dimensionesComment[j].text;
              }
            }
          }
        }

        // console.log(this.dimensions);
      })


    this.companyService.reportGeneral(params)
      .subscribe(response=>{

        let scope = this;
        let dimentions ;
        let competitions = [];
        let generalDimentions = [];
        this.dimensiones = [];

        if(response.result.generalArea.length > 0){
          dimentions = response.result.dimensions;
        }
        if(response.result.generalArea.length > 0){
          competitions = response.result.generalArea;
        }
        if(response.result.generalDimension.length > 0){
          generalDimentions = response.result.generalDimension;
          this.dimensiones = response.result.generalDimension;
        }
        // console.log('real: ' + (this.getValueMeter(response.result.generalAll[0].average)));
        if(response.result.generalAll.length > 0){
          this.levelFinal = response.result.generalAll[0].average;
          this.level = 180*((this.getValueMeter(response.result.generalAll[0].average)))/100;
        }else{
          this.levelFinal = 0;
          this.level = 0;
        }
        // this.level = 180*((this.getValueMeter(53))/100);

        this.degrees = 180 - this.level;
        this.radius = .5;
        this.radians = this.degrees * Math.PI / 180;
        this.x = this.radius * Math.cos(this.radians);
        this.y = this.radius * Math.sin(this.radians);
        this.mainPath = 'M -.0 -0.0208 L .0 0.0208 L ';
        this.pathX = this.x + '';
        this.space = ' ';
        this.pathY = this.y + '';
        this.pathEnd = ' Z';
        this.path = this.mainPath.concat(this.pathX,this.space,this.pathY,this.pathEnd);
        this.layout.shapes[0].path = this.path;
        this.layout.title = 'Puntaje obtenido: '+ Math.round(this.levelFinal) + '%',

        Plotly.newPlot('myDiv', this.data, this.layout, {displayModeBar: false});

        if(competitions.length > 0){

          for(var i=0; i<competitions.length; i++){

            let id_dimension = competitions[i]._id.dimension_id;
            let id_area = competitions[i]._id.area_id;
            competitions[i].weight = dimentions[id_dimension].areas[id_area].weight;
            competitions[i].color = this.setColor(dimentions[id_dimension].name);
            competitions[i].average = Math.round(competitions[i].average)+ '%';
            competitions[i].name = competitions[i]._id.area;
            competitions[i].dimension = dimentions[id_dimension].name;
            competitions[i].weight_dimension = dimentions[id_dimension].weight;

          }

          this.newDimensiones = this.setAreasInDimentions(generalDimentions, competitions);

          
          this.newDimensiones.forEach(function(item){
            item.areas.forEach(function(area){
              scope.competetitionsFinal.push(area);
            })
          })
        }else{
           this.newDimensiones.forEach(function(item){
            item.areas.forEach(function(area){
              scope.competetitionsFinal = [];
            })
          })
        }

        

        this.loader.fire(false);

      })
  }

  setAreasInDimentions(dimensiones, competitions){

    let finalDataReport = [];

    for(var i=0; i<dimensiones.length; i++){
      dimensiones[i].areas = [];

      for(var j=0; j<competitions.length; j++){
        if(dimensiones[i]._id.dimension == competitions[j].dimension){
          dimensiones[i].areas.push(competitions[j]);
        }
      }
      dimensiones[i].areas = this.orderArray(dimensiones[i].areas);
      dimensiones[i].average = Math.round(dimensiones[i].average);
      // console.log(dimensiones[i].areas);
    }

    // console.log(dimensiones);

    return dimensiones;
  }

  orderArray(array){

     array.sort(function (a, b) {
      if (a.weight > b.weight) {
        return 1;
      }
      if (a.weight < b.weight) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });

    return array;
  }

  setColor(name:String){

    let color = '';

    if(name == "Liderazgo"){
      color = '#1a486b'
    }else if(name == "Colaboración"){
      color = '#5196bb';
    }else if(name == "Experimentación"){
      color = '#239FD7';
    }else{
      color = '#1f78a7'
    }

    return color
  }

  selectTab(tab_id: number) {
    this.staticTabs.tabs[tab_id].active = true;
  }

  setColorResult(value: number){
    let color = '';
    if(value >=1 && value <=16){
      color = '#ec1b30'
    }else if(value >=17 && value <=34){
      color = '#f69322';
    }else if(value >=35 && value <=52){
      color = '#00c484';
    }else if(value >=53 && value <=70){
      color = '#239fd7';
    }else if(value >=71 && value <=88){
      color = '#1a486b';
    }else{
      color = '#272264';
    }
    return color
  }

  exportPdf(){

    let scope = this;

    this.loader.fire(true);

    this.convertHtmlToImage($('.statusFinal')[0])
      .then(res=>{
        scope.graphResult = res;
        scope.convertHtmlToImage($('.resumenDimensiones')[0])
          .then(res=>{
            scope.imgToBase64(scope.logoCompany, (logo)=>{
              // console.log(scope.logoCompany);
              // console.log(logo);
              scope.graphAreas = res;
              scope.tempPdf = {
                pageSize: "A4",
                pageMargins: [15, 45, 15, 15],
                 defaultStyle: {
                  font: 'helvetica'
                },
                header: {
                table: {
                  widths: ['10%', '90%'],
                  headerRows: 0,
                  body: [
                    [{image: logo, width: 50, fillColor: '#00656C'}, { text: [""], style: [ 'header-title-im'], fillColor: '#00656C'}],
                  ]
                },  
                layout: 'noBorders'
              },
                content: [
                ],
                pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
                  return (currentNode.startPosition.top >= 745 || (currentNode.table && currentNode.table.body.length == 1 && currentNode.pageNumbers.length > 1) || (currentNode.table && currentNode.table.headerRows == 2 && currentNode.startPosition.top > 719) || (currentNode.table && currentNode.table.body.length == 1 && currentNode.table.body[0] && currentNode.table.body[0].length == 3 && currentNode.table.body[0][0].style == 'tableFinal' && currentNode.startPosition.top > 740));
                },      
              };
              
         
              scope.tempPdf.content.push({
                style: 'table-header',
                table: {
                  widths: ['*'],
                  headerRows: 0,
                  body: [
                    [{ text: ["INFORME - DIAGNÓSTICO DE LA CULTURA DE INNOVACIÓN"], style: ['table-colaborador-header1']}],
                  ]
                },
                layout: 'noBorders'
              });
              scope.tempPdf.content.push({
                style: 'table-normal',
                table: {
                  widths: ['100%'],
                  headerRows: 0,
                  body: [
                    [{ text: 'Diagnóstico', style: [ 'table-colaborador-header2'], fillColor: '#217B8D', border: [false, false, false, false]}],
                  ]
                },
                layout: {
                  hLineColor: (i, node) => {
                    return '#BAC442';
                  },
                  vLineColor: (i, node) => {
                    return '#BAC442';
                  }
                }
              });
              scope.tempPdf.content.push({
                table: {
                  widths: ['auto'],
                  headerRows: 0,
                  body: [
                    [{image: scope.graphResult, width: 600}],
                  ]
                },
                layout: 'noBorders'
              });
              scope.tempPdf.content.push({
                style: 'table-normal5',
                table: {
                  widths: ['100%'],
                  headerRows: 0,
                  body: [
                    [{ text: 'Resumen General', style: [ 'table-colaborador-header2'], fillColor: '#217B8D', border: [false, false, false, false]}],
                  ]
                },
                layout: {
                  hLineColor: (i, node) => {
                    return '#BAC442';
                  },
                  vLineColor: (i, node) => {
                    return '#BAC442';
                  }
                }
              });
              scope.tempPdf.content.push({
                table: {
                  widths: ['auto'],
                  headerRows: 0,
                  body: [
                    [{image: scope.graphAreas, width: 600}],
                  ]
                },
                layout: 'noBorders'
              });
              scope.tempPdf.content.push({
                style: 'table-normal4',
                table: {
                  widths: ['100%'],
                  headerRows: 0,
                  body: [
                    [{ text: 'Comentario', style: [ 'table-colaborador-header3'], fillColor: '#217B8D', border: [false, false, false, false]}],
                  ]
                },
                layout: {
                  hLineColor: (i, node) => {
                    return '#BAC442';
                  },
                  vLineColor: (i, node) => {
                    return '#BAC442';
                  }
                }
              });
              scope.tempPdf.content.push({
                style: 'table-normal3',
                table: {
                  widths: ['100%'],
                  headerRows: 0,
                  body: [
                    [{ text: scope.commentGeneral, style: [ 'table-colaborador-header4'], border: [true, true, true, true]}],
                  ]
                },
                layout: {
                  hLineColor: (i, node) => {
                    return '#aeaeae';
                  },
                  vLineColor: (i, node) => {
                    return '#aeaeae';
                  }
                }
              });


              scope.addStyles(scope.tempPdf);
              pdfMake.createPdf(scope.tempPdf).download("Informe_final.pdf");

              scope.loader.fire(false);

              })
          })
      });
  }

  convertHtmlToImage(element){
    let scope = this;
    return html2canvas(element).then(function(canvas) {
        let image = canvas.toDataURL('image/png');
        return image;
    });
  }

  imgToBase64 = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result.replace('text/xml', 'image/jpeg'));
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.send();
  }

  addStyles(tempPdf) {
    tempPdf.styles = {
      header: {
        fontSize: 10,
        bold: true,
        margin: [0, 10, 0 ,0],
      },
      'header-title-im':{
        fontSize: 16,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 15],
      },
      
      'table-normal2':{
        fontSize: 10,
        bold: false,
        alignment: 'center',
        margin: [0, 0, 0, 0],
        color: '#777777'
      },
      'table-normal': {
        margin: [0, 10, 0, 25]
      },
      'table-normal3': {
        margin: [0, 0, 0, 0],
        fontSize: 8
      },
       'table-normal4': {
        margin: [0, 10, 0, 0]
      },
       'table-normal5': {
        margin: [0, 25, 0, 20]
      },
      'table-header': {
        margin: [0, 0, 0, 0]
      },

      'table-colaborador-header4':{
        fontSize: 11,
        bold:false,
        margin: [10, 8, 5, 8],
        color: 'gray',
        alignment: 'justify'

      },
      'table-colaborador-header3':{
        fontSize: 11,
        bold:false,
        margin: [10, 8, 5, 6],
        color: '#ffffff',

      },
      'table-colaborador-header2':{
        fontSize: 11,
        bold:false,
        margin: [10, 6, 10, 6],
        color: '#ffffff',

      },
      'table-colaborador-header1':{
        fontSize: 14,
        bold:false,
        margin: [13, 65, 5, 20],
        alignment: 'center',
        color: '#1a486b'
      },
      
    }
  }

 

// ***********************************************************************************************
// *****************************************DETAIL TAB********************************************
// ***********************************************************************************************

  getPercentDimension(params){

    this.companyService.getPercentDimension(params)
    .subscribe(response => {
      this.dimensions = response.result;
      this.loader.fire(false);
      if(this.dimensions.length > 0){

        for (var i = this.dimensions.length - 1; i >= 0; i--) {
          this.dimensions[i].name = this.dimensions[i]._id.dimension;
          this.dimensions[i]._id = this.dimensions[i]._id.dimension_id;
          this.dimensions[i].average = Math.round(this.dimensions[i].average*100)/100;
        }

        let id = this.id;
        let idGroup = this.idGroup;

        this.companyService.getGrupo(id, idGroup)
          .subscribe(response =>{
            let dimensionesComment = [];
            if(response.result[0].retro_dimension.length > 0){
              dimensionesComment = response.result[0].retro_dimension;
              for(var i=0; i<this.dimensions.length; i++){
                for(var j=0; j<dimensionesComment.length; j++){
                  if(this.dimensions[i]._id == dimensionesComment[j].dimension_id){
                    this.dimensions[i].comments = dimensionesComment[j].text;
                  }
                }
              }
            }
          });
        }
    });
  }

  getDataDetail(){
    var tfilter = JSON.parse(JSON.stringify(this.filterDetail));
    if(!tfilter.behavior || tfilter.behavior == ''){
      delete tfilter.behavior;
    }
    if(!tfilter.area || tfilter.area == ''){
      delete tfilter.area;
    }

    this.selectDimension(false);
  }

  selectBehaviorDetail(){
    this.selectedBehavior = this.filterDetail.behavior; 
    this.getDataDetail();
  }

  changeSelectedBehaviorDetail(){
    for (var i = this.objAreas.length - 1; i >= 0; i--) {
      this.objAreas[i].selected = false;
      if(this.selectedBehavior == this.objAreas[i]._id.area_id){
        this.objAreas[i].selected = true;
      }
    }   
  }

  selectGeneral(){
    if(this.numSelectGeneral == 0 && this.dimensions.length > 0){
      this.selectDimension(this.dimensions[0]._id);
      this.numSelectGeneral++;
    }
  }

  selectDimension(id){
    if(id){
      this.filterDetail.area = '';
      this.filterDetail.behavior = '';
      this.filterDetail.dimension = id;
    }    
    this.loader.fire(true);
    var tfilter = JSON.parse(JSON.stringify(this.filterDetail));
    if(!tfilter.behavior || tfilter.behavior == ''){
      delete tfilter.behavior;
    }
    if(!tfilter.area || tfilter.area == ''){
      delete tfilter.area;
    }
    this.companyService.getDimensionDetail(tfilter)
    .subscribe(response => {

      this.objAreas = response.result.generalArea;
      for (var i = this.objAreas.length - 1; i >= 0; i--) {
        this.objAreas[i].average = Math.round(this.objAreas[i].average*100)/100;
      }
      this.changeSelectedBehaviorDetail();
      this.objQuestionsDetails = {};
      this.questionsDetail = response.result.generalQuestion;
      for (var qd = this.questionsDetail.length - 1; qd >= 0; qd--) {
        this.objQuestionsDetails[qd] = [{alt: 10, value: ""}, {alt: 10, value: ""}];
      }

      this.loader.fire(false);
    });
  }

  selectQuestion(ev, id, in1, in2){
    if(ev){
      var tfilter = JSON.parse(JSON.stringify(this.filterDetail));
      if(!tfilter.behavior || tfilter.behavior == ''){
        delete tfilter.behavior;
      }
      if(!tfilter.area || tfilter.area == ''){
        delete tfilter.area;
      }
      tfilter['question'] = id;
      this.loader.fire(true);
      this.companyService.getPercentQuestion(tfilter)
      .subscribe(response => {
        var question = response.result.generalQuestion;
        var maxPoint = response.result.value;
        var maxSurveyeds = response.result.totalSurveyed;
        var resultAlt = [];
        var namePoint = {}
        namePoint['' + Math.round(maxPoint*100)/100 ] = 'Siempre';
        namePoint['' + Math.round(maxPoint*4/5*100)/100 ] = 'Casi siempre';
        namePoint['' + Math.round(maxPoint*3/5*100)/100 ] = 'A veces';
        namePoint['' + Math.round(maxPoint*2/5*100)/100 ] = 'Rara vez';
        namePoint['' + Math.round(maxPoint*1/5*100)/100 ] = 'Nunca';

        for (var i = 0; i < 5; i++) {
          var tPoint = Math.round(maxPoint*(i+1)/5*100)/100;
          var tValue = question.filter(item => (Math.round(item._id.points*100)/100) == tPoint);
          resultAlt.push({
            alt: namePoint['' + tPoint],
            value: tValue[0]?Math.round(tValue[0].count/maxSurveyeds*10000)/100:0,
          });
        }

        // for (var i = question.length - 1; i >= 0; i--) {
        //   resultAlt.push({
        //     alt: namePoint['' + Math.round(question[i]._id.points*100)/100],
        //     value: Math.round(question[i].count/maxSurveyeds*10000)/100
        //   });
        // }

        this.objQuestionsDetails[in2] = JSON.parse(JSON.stringify(resultAlt));
        resultAlt = null;
        this.loader.fire(false);
      });
    }
  }

  // ***********************************************************************************************
  // *****************************************DESCARGAR EXCEL********************************************
  // ***********************************************************************************************

  sort_id(a, b){
    if(a._id > b._id) return 1;
    if(b._id > a._id) return -1;
    return 0;
  }

  sort_area(a, b){
    if(a.area > b.area) return 1;
    if(b.area > a.area) return -1;
    return 0;
  }

  sort_gender(a, b){
    if(a.gender > b.gender) return 1;
    if(b.gender > a._id) return -1;
    return 0;
  }

  sort_behavior(a, b){
    if(a.jarea > b.jarea) return 1;
    if(b.jarea > a.jarea) return -1;
    return 0;
  }

  sort_position(a, b){
    if(a.position > b.position) return 1;
    if(b.position > a.position) return -1;
    return 0;
  }

  getAverage(value){
    if(value >= 1 && value <= 16){
      return 'ffec1b30';
    }
    else if(value >= 17 && value <= 34){
      return 'fff69322';
    }
    else if(value >= 35 && value <= 52){
      return 'ff00c484';
    }
    else if(value >= 53 && value <= 70){
      return 'ff239fd7';
    }
    else if(value >= 71 && value <= 88){
      return 'ff1a486b';
    }
    else if(value >= 89 && value <= 100){
      return 'ff272264';
    }
  }


  setNameExcel(type:String){

    let name = '';

    if(type == 'gender'){
      name = 'Sexo.xlsx';
    }else if(type=="position"){
      name = 'Cargo.xlsx';
    }else if(type=="area"){
      name = 'Area.xlsx';
    }else{
      name = 'Todos.xlsx';
    }

    return name;
  }

  exportXlsx(){

    this.loader.fire(true);
    this.companyService.forExcel(this.filterForExcel)
    .subscribe(response => {
      // console.log(response);
      this.objDimensions = {};
      this.generalArea = response.result.generalArea;
      this.generalAreaArea = response.result.generalAreaArea;
      this.generalAreaGender = response.result.generalAreaGender;
      this.generalAreaPosition = response.result.generalAreaPosition;

      this.generalArea.sort(this.sort_id);
      for (var i = this.generalArea.length - 1; i >= 0; i--) {
        this.generalArea[i].areas.sort(this.sort_area);
      }
      for (var i = this.generalArea.length - 1; i >= 0; i--) {
        this.objDimensions[this.generalArea[i]._id] = {};
        for (var o = this.generalArea[i].areas.length - 1; o >= 0; o--) {
          this.objDimensions[this.generalArea[i]._id][this.generalArea[i].areas[o].area] = this.generalArea[i].areas[o];
        }
      }

      // console.log(this.generalAreaGender);

      let headerStyleJs = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: 'FF0075B0'
        }
      };
      
      let whiteFontBold = {
        name: 'Calibri',
        color: {
          argb: 'FFFFFFFF'
        },
        bold: true,
        size: 10
      };

      let cellWrapCenter = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };

      // console.log(this.objDimensions);
      const workbook = new ExcelJs.Workbook();
      if(!this.filterForExcel.type || this.filterForExcel.type == '' || this.filterForExcel.type == 'gender'){
        this.generalAreaGender.sort(this.sort_id);
        for (var i = this.generalAreaGender.length - 1; i >= 0; i--) {
          this.generalAreaGender[i].areas.sort(this.sort_area);
          for (var o = this.generalAreaGender[i].areas.length - 1; o >= 0; o--) {
            this.generalAreaGender[i].areas[o].genders.sort(this.sort_gender);
          }
        }

        const si = workbook.addWorksheet('Género');
        si.getColumn('B').width = 15;
        si.getColumn('C').width = 25;
        si.getColumn('D').width = 12;
        si.getColumn('E').width = 10;
        si.getColumn('F').width = 10;
        si.getCell('B2').value = 'Dimensión';
        si.getCell('B2').fill = headerStyleJs;
        si.getCell('B2').font = whiteFontBold;
        si.getCell('B2').alignment = cellWrapCenter;
        si.mergeCells('B2:B3');
        si.getCell('C2').value = 'Comportamiento';
        si.getCell('C2').fill = headerStyleJs;
        si.getCell('C2').font = whiteFontBold;
        si.getCell('C2').alignment = cellWrapCenter;
        si.mergeCells('C2:C3');
        si.getCell('D2').value = this.company.name;
        si.getCell('D2').fill = headerStyleJs;
        si.getCell('D2').font = whiteFontBold;
        si.getCell('D2').alignment = cellWrapCenter;
        si.getCell('D3').value = this.generalArea[0].areas[0].surveyeds;
        si.getCell('D3').fill = headerStyleJs;
        si.getCell('D3').font = whiteFontBold;
        si.getCell('D3').alignment = cellWrapCenter;
        //si.mergeCells('D2:D3');
        var col = 1;
        var row = 4;
        for (var i = 0; i < this.generalAreaGender.length; i++) {
          col = 1;
          var tCol = col;
          var tRow = row;
          si.getCell(this.excelService.getLetter(col) + row).value = this.generalAreaGender[i]._id;
          for (var o = this.generalAreaGender[i].areas.length - 1; o >= 0; o--) {
            col = tCol;
            col++;
            si.getCell(this.excelService.getLetter(col) + row).value = this.generalAreaGender[i].areas[o].area;
            col++;
            // console.log(this.generalAreaGender[i]._id, this.generalAreaGender[i].areas[o].area);
            var average = Math.round(this.objDimensions[this.generalAreaGender[i]._id][this.generalAreaGender[i].areas[o].area].average*100)/100;
            si.getCell(this.excelService.getLetter(col) + row).value = average + '%';
            si.getCell(this.excelService.getLetter(col) + row).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {
                argb: this.getAverage(average),
              }
            };
            si.getCell(this.excelService.getLetter(col) + row).font = whiteFontBold;
            for (var u = this.generalAreaGender[i].areas[o].genders.length - 1; u >= 0; u--) {
              col++;
              if(i == 0){
                var hrow = 2;
                si.getCell(this.excelService.getLetter(col) + hrow).value = this.generalAreaGender[i].areas[o].genders[u].gender;
                si.getCell(this.excelService.getLetter(col) + hrow).fill = headerStyleJs;
                si.getCell(this.excelService.getLetter(col) + hrow).font = whiteFontBold;
                si.getCell(this.excelService.getLetter(col) + hrow).alignment = cellWrapCenter;
                hrow++;
                si.getCell(this.excelService.getLetter(col) + hrow).value = this.generalAreaGender[i].areas[o].genders[u].surveyeds;
                si.getCell(this.excelService.getLetter(col) + hrow).fill = headerStyleJs;
                si.getCell(this.excelService.getLetter(col) + hrow).font = whiteFontBold;
                si.getCell(this.excelService.getLetter(col) + hrow).alignment = cellWrapCenter;
              }
              si.getCell(this.excelService.getLetter(col) + row).value = Math.round(this.generalAreaGender[i].areas[o].genders[u].average*100)/100 + '%';
            }
            row++;
          }
          si.mergeCells(this.excelService.getLetter(tCol) + tRow + ':' + this.excelService.getLetter(tCol) + (row - 1));
          // this.generalArea[i]
        }
      }

      if(!this.filterForExcel.type || this.filterForExcel.type == '' || this.filterForExcel.type == 'area'){
        this.generalAreaArea.sort(this.sort_id);
        for (var i = this.generalAreaArea.length - 1; i >= 0; i--) {
          this.generalAreaArea[i].areas.sort(this.sort_area);
          for (var o = this.generalAreaArea[i].areas.length - 1; o >= 0; o--) {
            this.generalAreaArea[i].areas[o].areas.sort(this.sort_behavior);
          }
        }
        const si2 = workbook.addWorksheet('Área');
        si2.getColumn('B').width = 15;
        si2.getColumn('C').width = 25;
        si2.getColumn('D').width = 12;
        si2.getCell('B2').value = 'Dimensión';
        si2.getCell('B2').fill = headerStyleJs;
        si2.getCell('B2').font = whiteFontBold;
        si2.getCell('B2').alignment = cellWrapCenter;
        si2.mergeCells('B2:B3');
        si2.getCell('C2').value = 'Comportamiento';
        si2.getCell('C2').fill = headerStyleJs;
        si2.getCell('C2').font = whiteFontBold;
        si2.getCell('C2').alignment = cellWrapCenter;
        si2.mergeCells('C2:C3');
        si2.getCell('D2').value = this.company.name;
        si2.getCell('D2').fill = headerStyleJs;
        si2.getCell('D2').font = whiteFontBold;
        si2.getCell('D2').alignment = cellWrapCenter;
        si2.getCell('D3').value = this.generalArea[0].areas[0].surveyeds;
        si2.getCell('D3').fill = headerStyleJs;
        si2.getCell('D3').font = whiteFontBold;
        si2.getCell('D3').alignment = cellWrapCenter;
        //si2.mergeCells('D2:D3');
        var col = 1;
        var row = 4;
        for (var i = 0; i < this.generalAreaArea.length; i++) {
          col = 1;
          var tCol = col;
          var tRow = row;
          si2.getCell(this.excelService.getLetter(col) + row).value = this.generalAreaArea[i]._id;
          for (var o = this.generalAreaArea[i].areas.length - 1; o >= 0; o--) {
            col = tCol;
            col++;
            si2.getCell(this.excelService.getLetter(col) + row).value = this.generalAreaArea[i].areas[o].area;
            col++;
            // console.log(this.generalAreaArea[i]._id, this.generalAreaArea[i].areas[o].area);
            var average = Math.round(this.objDimensions[this.generalAreaArea[i]._id][this.generalAreaArea[i].areas[o].area].average*100)/100;
            si2.getCell(this.excelService.getLetter(col) + row).value = average + '%';
            si2.getCell(this.excelService.getLetter(col) + row).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {
                argb: this.getAverage(average),
              }
            };
            si2.getCell(this.excelService.getLetter(col) + row).font = whiteFontBold;
            for (var u = this.generalAreaArea[i].areas[o].areas.length - 1; u >= 0; u--) {
              col++;
              if(i == 0){
                var hrow = 2;
                si2.getColumn(this.excelService.getLetter(col)).width = 15;
                si2.getCell(this.excelService.getLetter(col) + hrow).value = this.generalAreaArea[i].areas[o].areas[u].jarea;
                si2.getCell(this.excelService.getLetter(col) + hrow).fill = headerStyleJs;
                si2.getCell(this.excelService.getLetter(col) + hrow).font = whiteFontBold;
                si2.getCell(this.excelService.getLetter(col) + hrow).alignment = cellWrapCenter;
                hrow++;
                si2.getCell(this.excelService.getLetter(col) + hrow).value = this.generalAreaArea[i].areas[o].areas[u].surveyeds;
                si2.getCell(this.excelService.getLetter(col) + hrow).fill = headerStyleJs;
                si2.getCell(this.excelService.getLetter(col) + hrow).font = whiteFontBold;
                si2.getCell(this.excelService.getLetter(col) + hrow).alignment = cellWrapCenter;
              }
              si2.getCell(this.excelService.getLetter(col) + row).value = Math.round(this.generalAreaArea[i].areas[o].areas[u].average*100)/100 + '%';
            }
            row++;
          }
          si2.mergeCells(this.excelService.getLetter(tCol) + tRow + ':' + this.excelService.getLetter(tCol) + (row - 1));
          // this.generalArea[i]
        }
      }

      if(!this.filterForExcel.type || this.filterForExcel.type == '' || this.filterForExcel.type == 'position'){
        this.generalAreaPosition.sort(this.sort_id);
        for (var i = this.generalAreaPosition.length - 1; i >= 0; i--) {
          this.generalAreaPosition[i].areas.sort(this.sort_area);
          for (var o = this.generalAreaPosition[i].areas.length - 1; o >= 0; o--) {
            this.generalAreaPosition[i].areas[o].positions.sort(this.sort_position);
          }
        }
        const si3 = workbook.addWorksheet('Cargo');
        si3.getColumn('B').width = 15;
        si3.getColumn('C').width = 25;
        si3.getColumn('D').width = 12;
        si3.getCell('B2').value = 'Dimensión';
        si3.getCell('B2').fill = headerStyleJs;
        si3.getCell('B2').font = whiteFontBold;
        si3.getCell('B2').alignment = cellWrapCenter;
        si3.mergeCells('B2:B3');
        si3.getCell('C2').value = 'Comportamiento';
        si3.getCell('C2').fill = headerStyleJs;
        si3.getCell('C2').font = whiteFontBold;
        si3.getCell('C2').alignment = cellWrapCenter;
        si3.mergeCells('C2:C3');
        si3.getCell('D2').value = this.company.name;
        si3.getCell('D2').fill = headerStyleJs;
        si3.getCell('D2').font = whiteFontBold;
        si3.getCell('D2').alignment = cellWrapCenter;
        si3.getCell('D3').value = this.generalArea[0].areas[0].surveyeds;
        si3.getCell('D3').fill = headerStyleJs;
        si3.getCell('D3').font = whiteFontBold;
        si3.getCell('D3').alignment = cellWrapCenter;
        //si3.mergeCells('D2:D3');
        var col = 1;
        var row = 4;
        for (var i = 0; i < this.generalAreaPosition.length; i++) {
          col = 1;
          var tCol = col;
          var tRow = row;
          si3.getCell(this.excelService.getLetter(col) + row).value = this.generalAreaPosition[i]._id;
          for (var o = this.generalAreaPosition[i].areas.length - 1; o >= 0; o--) {
            col = tCol;
            col++;
            si3.getCell(this.excelService.getLetter(col) + row).value = this.generalAreaPosition[i].areas[o].area;
            col++;
            // console.log(this.generalAreaPosition[i]._id, this.generalAreaPosition[i].areas[o].area);
            var average = Math.round(this.objDimensions[this.generalAreaPosition[i]._id][this.generalAreaPosition[i].areas[o].area].average*100)/100;
            si3.getCell(this.excelService.getLetter(col) + row).value = average + '%';
            si3.getCell(this.excelService.getLetter(col) + row).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {
                argb: this.getAverage(average),
              }
            };
            si3.getCell(this.excelService.getLetter(col) + row).font = whiteFontBold;
            for (var u = this.generalAreaPosition[i].areas[o].positions.length - 1; u >= 0; u--) {
              col++;
              if(i == 0){
                var hrow = 2;
                si3.getColumn(this.excelService.getLetter(col)).width = 15;
                si3.getCell(this.excelService.getLetter(col) + hrow).value = this.generalAreaPosition[i].areas[o].positions[u].position;
                si3.getCell(this.excelService.getLetter(col) + hrow).fill = headerStyleJs;
                si3.getCell(this.excelService.getLetter(col) + hrow).font = whiteFontBold;
                si3.getCell(this.excelService.getLetter(col) + hrow).alignment = cellWrapCenter;
                hrow++;
                si3.getCell(this.excelService.getLetter(col) + hrow).value = this.generalAreaPosition[i].areas[o].positions[u].surveyeds;
                si3.getCell(this.excelService.getLetter(col) + hrow).fill = headerStyleJs;
                si3.getCell(this.excelService.getLetter(col) + hrow).font = whiteFontBold;
                si3.getCell(this.excelService.getLetter(col) + hrow).alignment = cellWrapCenter;
              }
              si3.getCell(this.excelService.getLetter(col) + row).value = Math.round(this.generalAreaPosition[i].areas[o].positions[u].average*100)/100 + '%';
            }
            row++;
          }
          si3.mergeCells(this.excelService.getLetter(tCol) + tRow + ':' + this.excelService.getLetter(tCol) + (row - 1));
          // this.generalArea[i]
        }
      }

      let scope = this;
      this.loader.fire(false);

      workbook.xlsx.writeBuffer().then(function (data) {
        const blob = new Blob(
          [data],
          {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
        );
        saveAs(blob, scope.setNameExcel(scope.filterForExcel.type));

      });
    })
  }

}

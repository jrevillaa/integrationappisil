import { Component, OnInit, AfterViewInit, TemplateRef, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import * as $ from 'jquery';
import * as Plotly from 'plotly.js/dist/plotly.js';
import { TabsetComponent } from 'ngx-bootstrap';
import { CompanyService } from '../../../services/company.service';
import { LoaderEvent } from '../../../services/loader-event';
import * as ExcelJs from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import { ExcelService } from '../../../services/excelservice';

@Component({
  selector: 'app-reports-export2',
  templateUrl: './reports-export2.component.html',
  styleUrls: ['./reports-export2.component.css']
})
export class ReportsExport2Component implements OnInit {

  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  @ViewChild('dimensionTabs') dimensionTabs: TabsetComponent;


  public questions_ref = [
    {
      id: 0,
      title: 'Antes de comenzar introduzca su código de acceso.',
      last_result: 'E012',
      date_last:'18'
    },
    {
      id: 1,
      title: 'Área/ Unidad organizacional a la que pertenece.',
      last_result: 'RRHH',
      date_last:'18'
    },
    {
      id: 2,
      title: 'Cuánto tiempo vienes trabajando en la organización.',
      last_result: '2 años',
      date_last:'18'
    },
    {
      id: 3,
      title: ' ¿Actualmente ocupas un cargo de líder?',
      last_result: 'Bar',
      date_last:'18',
      yes: 80,
      no: 20
    }
  ]

  public final_questions = [];
  public user;
  public id;
  public company;
  public dimensions = [];
  public numSelectGeneral = 0;
  public averagesDetailTab = ['100%','90%','80%','70%','60%','50%','40%','30%','20%','10%','0%'];
  public questionsDetail = [];
  public objQuestionsDetails = {};
  public objAreas = [];
  public grupos = [];
  public areas = [];

  public filterDetail = {
    company: '',
    behavior: '',
    group: '',
    area: '',
    dimension: '',
  };
  public selectedBehavior = '';
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
    ) {
      this.loader.fire(true);
    }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user_lapsus'));

    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.filterDetail.company = this.id;
      this.filterForExcel.company = this.id;
      this.companyService.getGrupos(this.id)
      .subscribe(response =>{
          this.grupos = response.result.groups
          // console.log(this.grupos);
          if(this.grupos.length > 0){
            this.filterDetail.group = this.grupos[0]._id;
            this.filterForExcel.group = this.grupos[0]._id;
            this.getPercentDimension(this.filterDetail);
          }          
          this.loader.fire(false);
      })

      this.companyService.getAreas(this.id)
      .subscribe(response => {
        this.areas = response.result.areas;
      });

      this.companyService.getCompany_quantity(this.id)
      .subscribe(response => {
			  this.company = response.result;
      });

    });
  }

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

  selectTab(tab_id: number) {
    this.staticTabs.tabs[tab_id].active = true;
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

        for (var i = question.length - 1; i >= 0; i--) {
          resultAlt.push({
            alt: namePoint['' + Math.round(question[i]._id.points*100)/100],
            value: Math.round(question[i].count/maxSurveyeds*10000)/100
          });
        }

        this.objQuestionsDetails[in2] = JSON.parse(JSON.stringify(resultAlt));
        resultAlt = null;
        this.loader.fire(false);
      });
    }
  }

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

  exportXlsx(){
    this.companyService.forExcel(this.filterForExcel)
    .subscribe(response => {
      //console.log(response);
      this.objDimensions = {};
      this.generalArea = response.result.generalArea;
      this.generalAreaArea = response.result.generalAreaArea;
      this.generalAreaGender = response.result.generalAreaGender;
      this.generalAreaPosition = response.result.generalAreaPosition;

      this.generalArea.sort(this.sort_id);
      for (var i = this.generalArea.length - 1; i >= 0; i--) {
        this.generalArea[i].areas.sort(this.sort_area);
      }
      this.generalAreaGender.sort(this.sort_id);
      for (var i = this.generalAreaGender.length - 1; i >= 0; i--) {
        this.generalAreaGender[i].areas.sort(this.sort_area);
        for (var o = this.generalAreaGender[i].areas.length - 1; o >= 0; o--) {
          this.generalAreaGender[i].areas[o].genders.sort(this.sort_gender);
        }
      }
      this.generalAreaPosition.sort(this.sort_id);
      for (var i = this.generalAreaPosition.length - 1; i >= 0; i--) {
        this.generalAreaPosition[i].areas.sort(this.sort_area);
        for (var o = this.generalAreaPosition[i].areas.length - 1; o >= 0; o--) {
          this.generalAreaPosition[i].areas[o].positions.sort(this.sort_position);
        }
      }
      this.generalAreaArea.sort(this.sort_id);
      for (var i = this.generalAreaArea.length - 1; i >= 0; i--) {
        this.generalAreaArea[i].areas.sort(this.sort_area);
        for (var o = this.generalAreaArea[i].areas.length - 1; o >= 0; o--) {
          this.generalAreaArea[i].areas[o].areas.sort(this.sort_behavior);
        }
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
            si.getCell(this.excelService.getLetter(col) + row).value = average;
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
              si.getCell(this.excelService.getLetter(col) + row).value = Math.round(this.generalAreaGender[i].areas[o].genders[u].average*100)/100;
            }
            row++;
          }
          si.mergeCells(this.excelService.getLetter(tCol) + tRow + ':' + this.excelService.getLetter(tCol) + (row - 1));
          // this.generalArea[i]
        }
      }

      if(!this.filterForExcel.type || this.filterForExcel.type == '' || this.filterForExcel.type == 'area'){
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
            console.log(this.generalAreaArea[i]._id, this.generalAreaArea[i].areas[o].area);
            var average = Math.round(this.objDimensions[this.generalAreaArea[i]._id][this.generalAreaArea[i].areas[o].area].average*100)/100;
            si2.getCell(this.excelService.getLetter(col) + row).value = average;
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
              si2.getCell(this.excelService.getLetter(col) + row).value = Math.round(this.generalAreaArea[i].areas[o].areas[u].average*100)/100;
            }
            row++;
          }
          si2.mergeCells(this.excelService.getLetter(tCol) + tRow + ':' + this.excelService.getLetter(tCol) + (row - 1));
          // this.generalArea[i]
        }
      }

      if(!this.filterForExcel.type || this.filterForExcel.type == '' || this.filterForExcel.type == 'position'){
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
            si3.getCell(this.excelService.getLetter(col) + row).value = average;
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
              si3.getCell(this.excelService.getLetter(col) + row).value = Math.round(this.generalAreaPosition[i].areas[o].positions[u].average*100)/100;
            }
            row++;
          }
          si3.mergeCells(this.excelService.getLetter(tCol) + tRow + ':' + this.excelService.getLetter(tCol) + (row - 1));
          // this.generalArea[i]
        }
      }

      workbook.xlsx.writeBuffer().then(function (data) {
        const blob = new Blob(
          [data],
          {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
        );
        saveAs(blob,'Dashboard.xlsx');
      });
    })
  }

}

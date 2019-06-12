import { Component, OnInit, AfterViewInit, TemplateRef, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { CompanyService } from '../../../services/company.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LoaderEvent } from '../../../services/loader-event';
import { TabsetComponent } from 'ngx-bootstrap';
import * as $ from 'jquery';
import * as moment from 'moment';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent implements OnInit {

  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  @ViewChild('dimensionTabs') dimensionTabs: TabsetComponent;

  public final_questions = [];
  public user;
  public id;
  public company = {
    name: ''
  }
  public areas = [];
  public grupos = [];
  public filter = {
    company: '',
    dateWeek: '',
    group: '',
    area: ''
  };
  public evo = {
    all: 0,
    completeds: 0,
    average: ''
  };
  public weeks = [];
  
  constructor(
    private router: Router,
    private modalService: BsModalService,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private loader: LoaderEvent
    ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user_lapsus'));
      this.route.params.subscribe(params => {

        // console.log(this.myTime(4000));

        // console.log(params);
        this.id = params['id'];
        this.filter.company = this.id;
        this.companyService.getCompany_quantity(this.id)
        .subscribe(response => {
          this.company = response.result;
          // console.log(response);
        });

        this.getAreas();
        this.companyService.getGrupos(this.id)
          .subscribe(response =>{
              // console.log(response);
              this.grupos = response.result.groups
              // console.log(this.grupos);
              this.loader.fire(false);

              if(this.grupos.length == 1){
                this.filter.group = this.grupos[0]._id;
                this.getData(this.filter);
                this.getWeeks(this.grupos[0]._id);
              }else if(this.grupos.length > 1){
                this.filter.group = this.grupos[this.grupos.length - 1]._id;
                this.getData(this.filter);
                this.getWeeks(this.grupos[this.grupos.length - 1]._id);
                
              }

         })
      });

  }

  getAreas(){
    this.companyService.getAreas(this.id)
      .subscribe(response => {
        this.areas = response.result.areas;
        this.company.name = response.result.name;
        this.addShowActionsData(this.areas);
      });
  }

  getWeeks(id){
    let params = {
      company: this.id,
      group: id
    }
    this.companyService.getWeeks(params)
      .subscribe(response=>{
        this.weeks = response.result;
    })
  }

  addShowActionsData(areas){
    areas.forEach(area =>{
      area.showEdit = false;
      area.showButtons = true;
      area.company = this.id;
    })
  }

  getData(filter, group = false){

    // console.log(group);
    this.loader.fire(true);

    if(group){
      this.getWeeks(this.filter.group);
    }

    this.companyService.reportEvolution(filter)
      .subscribe(response =>{
        // console.log('reporte',response);
        this.loader.fire(false);
        this.evo.all = response.result.all;
        this.evo.completeds = response.result.completeds;

        if( response.result.averageTimeout.length > 0){
          this.evo.average = this.myTime(response.result.averageTimeout[0].average);
        }else{
          this.evo.average = '0';
        }

      })
  }

  myTime(time) {
    var hr = ~~(time / 3600);
    var min = ~~((time % 3600) / 60);
    var sec = time % 60;
    var sec_min = "";
    if (hr > 0) {
       sec_min += "" + hr + " hr y " + (min < 10 ? "0" : "");
    }
    sec_min += "" + min.toFixed(0) + " min y " + (sec < 10 ? "0" : "");
    sec_min += "" + sec.toFixed(0);
    return sec_min+ " seg";
  }

}

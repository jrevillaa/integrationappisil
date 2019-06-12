import { Component, OnInit, AfterViewInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import * as $ from 'jquery';
import * as Plotly from 'plotly.js/dist/plotly.js';
import {Config, Data, Layout} from 'plotly.js/dist/plotly.js';
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-reports-answers',
  templateUrl: './reports-answers.component.html',
  styleUrls: ['./reports-answers.component.css']
})
export class ReportsAnswersComponent implements OnInit {

   public filtro = {
  	 dimension: '',
  	 area: '',
  	 area_empresa: ''
  };

  public dimensiones = [
  	{
  		id:1,
  		name: 'Líderes'
  	},
  	{
  		id:2,
  		name: 'Colaboración'
  	},
  	{
  		id:3,
  		name: 'Experimentación'
  	},
  	{
  		id:4,
  		name: 'Recursos'
  	}
  ]

  public areas = [];

  public areas_list = [
  	{
  		id:1,
  		id_d: 1,
  		name: 'Trabajo Desafiante'
  	},
  	{
  		id:2,
  		id_d: 1,
  		name: 'Autonomia'
  	},
  	{
  		id:3,
  		id_d: 1,
  		name: 'Agilidad para Generar Valor'
  	},
  	{
  		id:4,
  		id_d: 1,
  		name: 'Lideres que Inspiran'
  	},
  	{
  		id:5,
  		id_d: 2,
  		name: 'Asertividad'
  	},
  	{
  		id:6,
  		id_d: 2,
  		name: 'Receptividad'
  	},
  	{
  		id:7,
  		id_d: 2,
  		name: 'Diversidad'
  	},
  	{
  		id:8,
  		id_d: 2,
  		name: 'Trabajo en Equipo'
  	},
  	{
  		id:5,
  		id_d: 3,
  		name: 'Apertura a la Incertidumbre'
  	},
  	{
  		id:6,
  		id_d: 3,
  		name: 'Interdisciplinariedad'
  	},
  	{
  		id:7,
  		id_d: 3,
  		name: 'Valoración del Aprendizaje'
  	},
  	{
  		id:8,
  		id_d: 3,
  		name: 'Innovación Abierta'
  	},
  	{
  		id:5,
  		id_d: 4,
  		name: 'Incentivos a la Innovación'
  	},
  	{
  		id:6,
  		id_d: 4,
  		name: 'Recursos para la Innovación'
  	},
  	{
  		id:7,
  		id_d: 4,
  		name: 'Tiempo para la Innovación'
  	}
  ]

  public areas_empresa = [
  	{
  		id: '',
  		name: 'Administración'
  	},
  	{
  		id: '',
  		name: 'RRHH'
  	},
  	{
  		id: '',
  		name: 'Sistemas'
  	},
  	{
  		id: '',
  		name: 'Contabilidad'
  	},
  	{
  		id: '',
  		name: 'Diseño Gráfico'
  	},
  	{
  		id: '',
  		name: 'Tecnología'
  	},
  	{
  		id: '',
  		name: 'Servidores'
  	},
  	{
  		id: '',
  		name: 'Plataforma'
  	},
  	{
  		id: '',
  		name: 'Ventas'
  	},
  	{
  		id: '',
  		name: 'Auditóría'
  	}
  ];

  public liviano = {
      view: [500, 300],
      showLegend: true,
      showLabels: true,
      explodeSlices: false,
      doughnut: false,
      autoScale: true,
      title: 'Livianos',
      data: [ ]
  };

  public data = [{
	  values: [19, 26],
	  labels: ['% Obtenido', '% Restante'],
	  type: 'pie',
    marker: {
      colors:  ['rgba(208, 164, 99, .8)', 'rgba(208, 164, 99, .5)'],
    },
    textfont:{
      size: 20,
      color: '#ffffff'
    }
  }];

  public layout = {
    title: '',
    titlefont: {
      size: 25,
      color: '#777777',
      // family: 'Montserrat',

    },
    textfont: {
      size: 25,
      color: '#212529'
    },
    width: 300,
    height: 350,
     margin: {
        l: 0,
        r: 0,
        b: 50,
        t: 50
      },
  };

  public user;
  public id;
  public company;

  constructor(
  	private router: Router,
    private modalService: BsModalService,
    private companyService: CompanyService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
     this.user = JSON.parse(localStorage.getItem('user_lapsus'));
      this.route.params.subscribe(params => {
        // console.log(params);
        this.id = params['id'];
        this.companyService.getCompany_quantity(this.id)
        .subscribe(response => {
          this.company = response.result;
          // console.log(response);
        });
      });
      Plotly.newPlot('myDiv', this.data, this.layout, {displayModeBar: false});
  }

  changeDimension(id){

  	let this_ = this;

  	this.areas = [];

  	this.areas_list.forEach(function(area){
  		if(id == area.id_d){
  			this_.areas.push(area);
  		}
  	})

  	this.filtro.area = this.areas[0].id;

  }



}

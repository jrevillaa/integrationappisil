import { Component, OnInit, AfterViewInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { SurveyQuestionService } from '../../../services/survey_questions'; 
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LoaderEvent } from '../../../services/loader-event';
import * as $ from 'jquery';


@Component({
  selector: 'app-preguntas-crear',
  templateUrl: './preguntas-crear.component.html',
  styleUrls: ['./preguntas-crear.component.css']
})
export class PreguntasCrearComponent implements OnInit {


  public pregunta = {
  	 dimension: '',
  	 name: '',
  	 area: ''
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
  public id;
  public idArea;
  public area = {
    _id: '',
    dimension: '',
    name: '',
    dimension_name: '',
    weight: 0,
    text: '',
  }
  public question = {
    dimension: '',
    dimension_name: '',
    area: '',
    area_name: '',
    _id: '',
    text: '',
    weight: 0,
    type: '',
    answers: [],
    correct: 0,
  }

  constructor(
  	private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private loader: LoaderEvent,
    private surveyService: SurveyQuestionService,
  ) {
    this.loader.fire(true);
  }

  ngOnInit() {
    // this.loader.fire(true);
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.idArea = params['idArea'];
      this.area.dimension = this.id;
      this.area._id = this.idArea;
      this.question.dimension = this.id;
      this.question._id = this.idArea;
      this.surveyService.getArea(this.area)
      .subscribe(response => {
        this.area.dimension_name = response.result.dimension;
        this.area.name = response.result.name;
        this.question.dimension_name = response.result.dimension;
        this.loader.fire(false);
      });
    });
  }

  onChangeType(ev){
    console.log(ev);
    if(!ev || ev == 3){
      this.question.answers = [];
    }
    else if(ev == 1){
      this.question.answers = [
        {
          text: 'Falso',
        },
        {
          text: 'Verdadero'
        }
      ]
    }
    else if(ev == 2){
      this.question.answers = [
        {
          text: 'Respuesta',
        },
        {
          text: 'Respuesta',
        },
        {
          text: 'Respuesta',
        },
      ]
    }
  } 

  addAnswer(){
    this.question.answers.push({
      text: 'Respuesta', 
    })
  }

  deleteAnswer(i){
    this.question.answers.splice(i, 1);
  }

  save(){
    if(this.question.text){
      if(!this.question.weight){
        this.question.weight = 0;
      }
      this.loader.fire(true);
      this.surveyService.createQuestion(this.question)
      .subscribe(response => {
        this.loader.fire(false);
        this.router.navigate(['admin/preguntas/' + this.question.dimension + '/' + this.question._id + '/lista-preguntas']);
      })
    }
  }

  changeDimension(id){
  	let this_ = this;
  	this.areas = [];
  	this.areas_list.forEach(function(area){
  		if(id == area.id_d){
  			this_.areas.push(area);
  		}
  	})
  	this.pregunta.area = this.areas[0].id;
  }
}

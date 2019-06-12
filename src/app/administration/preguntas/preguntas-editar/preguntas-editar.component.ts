import { Component, OnInit, AfterViewInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { SurveyQuestionService } from '../../../services/survey_questions'; 
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LoaderEvent } from '../../../services/loader-event';
import * as $ from 'jquery';

@Component({
  selector: 'app-preguntas-editar',
  templateUrl: './preguntas-editar.component.html',
  styleUrls: ['./preguntas-editar.component.css']
})
export class PreguntasEditarComponent implements OnInit {

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
      this.question.dimension = this.id;
      this.question.area = this.idArea;
      this.question._id = params['idPregunta'];
      this.surveyService.getQuestion(this.question)
      .subscribe(response => {
        this.question.dimension_name = response.result.dimension;
        this.question.area_name = response.result.area;
        this.question.text = response.result.text;
        this.question.weight = response.result.weight;
        this.question.type = (response.result.type?response.result.type:'');
        var answers = JSON.parse(JSON.stringify(response.result.answers));
        this.onChangeType(this.question.type);
        this.question.answers = JSON.parse(JSON.stringify(answers));
        console.log(this.question.answers);
        var correct = this.question.answers.findIndex(item => item.text == response.result.correct);
        console.log(correct);
        this.question.correct = correct;
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

  updateQuestion(){
    if(this.question.text){
      if(!this.question.weight){
        this.question.weight = 0;
      }
      this.loader.fire(true);
      this.surveyService.updateQuestion(this.question)
      .subscribe(response => {
        this.loader.fire(false);
        this.router.navigate(['admin/preguntas/' + this.question.dimension + '/' + this.question.area + '/lista-preguntas']);
      });
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

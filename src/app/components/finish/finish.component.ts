import { Component, OnInit, ViewChild, ElementRef, ViewChildren } from '@angular/core';
// import * as Chart from 'chart.js';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-finish',
  templateUrl: './finish.component.html',
  styleUrls: ['./finish.component.css']
})
export class FinishComponent implements OnInit {
	@ViewChildren('chartsX') mycanvas;
	dimension = [];

	total = {
		name: 'Total',
		point: 0,
		total: 0,
		percent: 0,
		bar: 0,
	}

	resultGeneral = {
		view: [500,400],
		colorScheme: {
			name: 'nightLights',
			selectable: false,
			group: 'Ordinal',
			domain: [
			  '#4e31a5', '#9e81f5', '#9c25a7', '#3065ab', '#57468b', '#904497', '#46648b', 
			  '#32118d', '#a00fb3', '#1052a2', '#6e51bd', '#b63cc3', '#6c97cb', '#8671c1', '#b455be', '#7496c3'
			]
		},
		onLegendLabelClick: function(entry){
			console.log('Legend clicked', entry);
		},
		single: [
			{
				name: 'val',
				value: 800
			},
			{
				name: 'tac',
				value: 500
			}
		],
		gradient: false,
		animations: true,
		tooltipDisabled: true,
		pieTooltipText: this.pieTooltipText,
		select: function(entry){
			console.log('Legend clicked', entry);
		},
		valueFormatting: function(value: number) {
		    return `${Math.round(value).toLocaleString()} €`;
	  	}
	}

	myData = [
	  ['London', {v: 8136000, f: '8,1360'}],
	  ['New York', {v: 8538000, f: '8,530'}],
	];

	myOptions = {
	  colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'],
	  // is3D: true,
	  pieHole: 0.4,
	};

  constructor( 
  	public session: SessionService,
  	) { }

  ngOnInit() {
  	var question = this.session.getObject('survey');
  	this.session.destroy('token_survey');
  	if(question){
  		question = question['survey_question'];
  	}
  	console.log(question);
  	var oDimension = {};
  	for (var i = question.length - 1; i >= 0; i--) {
  		if(!oDimension[question[i].dimension_id]){
  			oDimension[question[i].dimension_id] = {
  				name: question[i].dimension,
  				points: 0,
  				total: 0,
  				percent: 0,
  				bar: 0,
  			}
  		}
  		oDimension[question[i].dimension_id].points += question[i].points;
  		oDimension[question[i].dimension_id].total += 5;
  		oDimension[question[i].dimension_id].percent = Math.round(oDimension[question[i].dimension_id].points/oDimension[question[i].dimension_id].total*10000)/100;
  		oDimension[question[i].dimension_id].bar = oDimension[question[i].dimension_id].percent >= 100?99.99:oDimension[question[i].dimension_id].percent;
  		this.total.point += question[i].points;
  		this.total.total += 5;
  		this.total.percent = Math.round(this.total.point/this.total.total*10000)/100;
  		this.total.bar = this.total.percent >= 100?99.99:this.total.percent;
  	}
  	for(var kDimension in oDimension){
  		this.dimension.push(oDimension[kDimension]);
  	}
  	console.log(this.dimension);
	console.log(this.mycanvas);
  }



  pieTooltipText(data) {
    return "";
  }

}

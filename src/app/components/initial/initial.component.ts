import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-initial',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.css']
})
export class InitialComponent implements OnInit {

  constructor(
  	private router: Router,
  	) { }

  ngOnInit() {
  	// setTimeout(()=>{
  	// 	this.router.navigate(['preInicio']);
  	// }, 5500);
  }

}

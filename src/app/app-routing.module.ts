import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PreQuizComponent } from './components/pre-quiz/pre-quiz.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { SegmentsComponent } from './components/segments/segments.component';
import { FinishComponent } from './components/finish/finish.component';
import { PreStartComponent } from './components/pre-start/pre-start.component';
import { LoginComponent } from './components/login/login.component';
import { InitialComponent } from './components/initial/initial.component';
import { InfoComponent } from './components/info/info.component';

const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: '/users'},
	// { path:'intro', component: InitialComponent },
	// { path:'preInicio', component: PreStartComponent },
	// { path:'preInicio/:code', component: PreStartComponent },
	// { path:'inicio', component: HomeComponent },
	// { path:'segmentos', component: SegmentsComponent },
	// { path:'informacion', component: PreQuizComponent },
	// { path:'encuesta', component: QuizComponent },
	// { path:'final', component: FinishComponent },
	// { path:'info', component: InfoComponent },
 //  	{ path:'login', component: LoginComponent },
	{ path: '*', redirectTo: '/users'},
	
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

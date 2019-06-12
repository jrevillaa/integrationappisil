import { Component } from '@angular/core';
import { LoaderEvent } from "./services/loader-event";
import { Router, NavigationStart, NavigationEnd} from '@angular/router';
import { SessionService } from './services/session.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'app';
  public suscribeLoader;
  public showLoader = false;

  constructor(
    private loader: LoaderEvent,
    private router: Router,
    private session: SessionService,
  ) {
    this.showLoader = false;
  }

  ngOnInit() {
    this.registerBroadcast();

    // this.router.events.subscribe(
    //  (event)=>{
    //    if(this.router.url != '/login'){

    //    }else{

    //      console.log('entro');
    //      if(this.session.getItem('user_lapsus')){
    //        console.log('llevalo');
    //        this.router.navigate(['/admin/empresas'])
    //      }
    //    }
    //  })
  }

  registerBroadcast() {
    // console.log('dasdas');
    this.suscribeLoader = this.loader.on()
    .subscribe(value => {
      this.showLoader = value;
    });
  }
}

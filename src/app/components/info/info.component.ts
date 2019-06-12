import { Component, OnInit, AfterViewInit, TemplateRef, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap';
import { SessionService } from '../../services/session.service';

import * as $ from 'jquery';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  @ViewChild('staticTabs') staticTabs: TabsetComponent;
   public liderazgo = [
    {
      id: 1,
      header: "Trabajo desafiante",
      content: "Es muy difícil proponer mejoras si tu trabajo te aburre. Al ejercer las labores cotidianas existe espacio para retos ya sea a nivel intelectual, motivacional o de ejecución. Esto permite un entorno de constante aprendizaje y desarrollo de habilidades técnicas e interpersonales.",
       img: './assets/images/trabajo_desafiante.png'
    },
    {
      id: 2,
      header: "Autonomía",
      content: " Los colaboradores con un mayor control sobre su trabajo contribuye a que sean más innovadores, están más satisfechos y tienen un mejor desempeño. Contempla que una persona dentro de la organización desarrolle la confianza en sus capacidades y en la importancia de sus acciones y decisiones para generar innovación.",
       img: './assets/images/autonomia.png' 
    },
    {
      id: 3,
      header: "Agilidad para Generar Valor",
      content: "Un líder innovador evita la paralisis por análisis. Capacidad de interpretar la información, medir riesgos y tomar acción para lograr un objetivo definido. Si existen barreras poder sortearlas rápidamente y asegurar controles reduciendo la burocracia.",
       img: './assets/images/agilidad.png' 
    },
    {
      id: 4,
      header: "Líderes que Inspiran",
      content: "Nada inspira más en una cultura de innovación que un líder que se compromete con su equipo. Contemplan habilidades que permiten influir o inspirar a otras personas para conseguir colectivamente un logro o meta. Procurando un equipo autoorganizado donde la transparencia, flexibilidad y confianza en las capacidades de los compañeros es lo más importante.",
       img: './assets/images/lideres.png' 
    }
  ];

  public colaboracion = [
    {
      id: 5,
      header: "Asertividad",
      content: "Capacidad de comunicar pensamientos, ideas y acciones para que sean percibidos y entendidos por su interlocutor. implica decir lo que se siente y/o piensa sin lastimar a los demás y evitando sentirnos mal por nuestra conducta.",
       img: './assets/images/asertividad.png'
    },
    {
      id: 6,
      header: "Receptividad",
      content: "Capacidad de estar abierto a diferentes opiniones incluso si estas entran en discrepancia con las ideas propias. aceptar y comunicar ",
       img: './assets/images/receptividad.png' 
    },
    {
      id: 7,
      header: "Diversidad",
      content: "Las salsas secretas incorporan distintos ingredientes. Capacidad de la empresa en preocuparse de reclutar capital humano distinto entre si, en personalidad, habilidades y conocimiento , buscando generar innovación a partir de las diferencias de las personas.",
       img: './assets/images/diversidad.png' 
    },
    {
      id: 8,
      header: "Trabajo en Equipo",
      content: "Si quieres innovar, hazlo en equipo. El trabajo en equipo aporta ideas más variadas y posiblemente mejores. Es la facilidad de las personas en tener un nivel de buenas relaciones que decanten en expresar ideas constructivas en un espacio de cooperación.",
       img: './assets/images/trabajo.png' 
    }
  ]

  public experimentacion = [
    {
      id: 9,
      header: "Apertura a la Incertidumbre",
      content: "Locura es hacer siempre lo mismo y esperar resultados distintos. Capacidad de tomar riesgos y enrumbarse en un camino a pesar de no poseer toda la información necesaria. Mantener la serenidad ante los espacios y situaciones que no manejamos y convertirlos en una oportunidad para generar valor.",
       img: './assets/images/apertura.png'
    },
    {
      id: 10,
      header: "Interdisciplinariedad",
      content: "Un buen choque entre disciplinas puede generar chispas creativas. Contempla la tendencia a que colaboradores estén abiertos a traspasar los límites de sus propias disciplinas para integrar experiencias y que al explorar estas intersecciones se rompa intencionalmente el status quo y los silos en la organización.  Genera proactividad que cruza las disciplinas para descubrir nuevos caminos y perspectivas para resolver problemas.",
       img: './assets/images/inter.png' 
    },
    {
      id: 11,
      header: "Valoración del Aprendizaje",
      content: "El error es uno de los mejores instrumentos de aprendizaje. Capacidad de percibir el valor en la búsqueda constante de nuevo conocimiento. Ser tolerante al error y flexible a la exploración para alcanzar los objetivos de la empresa.",
       img: './assets/images/valoracion.png' 
    },
    {
      id: 12,
      header: "Innovación Abierta",
      content: "La colaboración de personas externas es una fuente de innovadoras. Es la capacidad de apertura de las empresas para colaborar con expertos externos (como clientes, proveedores y otras organizaciones)  con el objetivo de mejorar constantemente la propuesta de valor y/o generar ideas innovadoras. ",
       img: './assets/images/innovacion.png' 
    }
  ]

  public recursos = [
    {
      id: 13,
      header: "Incentivos a la Innovación",
      content: "El reconocimiento de las nuevas ideas potencia la creatividad Decisión y capacidad de la organizacion para motivar y reconocer a los colaboradores a que promuevan y/o faciliten procesos de innovación a través de alicientes tangibles o intangibles.",
       img: './assets/images/incentivo.png'
    },
    {
      id: 14,
      header: "Recursos para la Innovación",
      content: "Si no invierten en sus procesos de innovación ¿como espera obetener resultados de ellos?. Direccionar los recursos actuales (espacio, útiles de escritorio, tecnología) sin incurrir en gastos adicionales, y/o asignar un presupuesto exclusivo que facilite los procesos de innovación.",
       img: './assets/images/recursos.png' 
    },
    {
      id: 15,
      header: "Tiempo para la Innovación",
      content: "No pidas nuevas ideas si no brindas tiempo para generarlas. Es la capacidad de organizarse para distribuir el tiempo tanto en funciones y responsabilidades actuales como para el desarrollo de nuevas iniciativas. Es el tiempo asignado que tienen los colaboradores en sus labores cotidianas para generar nuevas ideas y convertirlos en prototipos/pilotos.",
       img: './assets/images/tiempo.png' 
    }
  ]

  constructor(
  	private router: Router,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private session: SessionService,

   ) { }

  ngOnInit() {
     if(!this.session.getItem('token_survey')){
        this.router.navigate(['/preInicio'])
     }
  }

  selectTab(tab_id: number) {
    this.staticTabs.tabs[tab_id].active = true;
  }

  collapse(i){
    // console.log(i);
    $( ".body-collapse.index" + i ).slideToggle( "slow" );
  }

}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdministrationComponent } from './administration.component';
import { UserSistemCreateComponent } from './usuarios-sistema/user-sistem-create/user-sistem-create.component';
import { UserSistemEditComponent } from './usuarios-sistema/user-sistem-edit/user-sistem-edit.component';
import { UserSistemListComponent } from './usuarios-sistema/user-sistem-list/user-sistem-list.component';

const routes: Routes = [
 
    // { path: 'admin/empresas', component: AdministrationComponent,
    //     children:[
    //         { path: '', component: EmpresaListComponent },
    //         { path: 'crear', component: EmpresaCrearComponent },
    //         { path: ':id', component: EmpresaDetailComponent },
    //         { path: ':id/usuarios', component: UsuariosListComponent },
    //         { path: ':id/areas', component: AreasListComponent },
    //         { path: ':id/editar', component: EmpresaEditarComponent },
    //         { path: ':id/reportes', component: ListReportsComponent },
    //         { path: ':id/reportes/status', component: ResumenComponent }, 
    //         { path: ':id/reportes/respuestas', component: ReportsAnswersComponent },
    //         { path: ':id/reportes/diagnostic', component: ReportsExportComponent },
    //         { path: ':id/reportes/diagnostic2', component: ReportsExport2Component },
    //         { path: ':id/grupos', component: GruposListComponent },
    //         { path: ':id/grupos/crear', component: GruposCrearComponent },
    //         { path: ':id/grupos/:idGrupo/editar', component: GruposEditarComponent },
    //     ]
    // },
    // { path: 'admin/preguntas_iniciales', component: AdministrationComponent,
    //     children:[
    //         { path: '', component: PreguntaInitialListComponent },
    //         { path: 'crear', component: PreguntaInitialCrearComponent },
    //         { path: ':id', component: PreguntaInitialEditarComponent },
    //     ]
    // },
    // { path: 'admin/preguntas', component: AdministrationComponent,
    //     children:[
    //         { path: '', component: DimensionesComponent },
    //         { path: ':id', component: DimensionComponent },
    //         { path: ':id/editar', component: DimensionEditarComponent },
    //         { path: ':id/:idArea/lista-preguntas', component: PreguntasListComponent },
    //         { path: ':id/:idArea/editar', component: AreaEditarComponent },
    //         { path: ':id/:idArea/crear-pregunta', component: PreguntasCrearComponent },
    //         { path: ':id/:idArea/editar-pregunta/:idPregunta/editar', component: PreguntasEditarComponent },
    //     ]
    // },
    { path: 'users', component: AdministrationComponent,
        children:[
            { path: '', component: UserSistemListComponent },
            { path: 'crear', component: UserSistemCreateComponent },
            { path: ':id', component: UserSistemEditComponent }
        ]
    },
   
];


@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
    providers: []
})
export class AdministrationRoutingModule { }
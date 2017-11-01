import { Routes, RouterModule } from '@angular/router';
import { Login, 
         Home, 
         tender,
         editTender, 
         vendor, 
         configs, 
         medicine, 
         demand,
         editdemand,
         financialbidding,
         blank,
         technicalqualification,
         pcohome,
         pcosingledemand,
         userSingleDemand,
         vendorprequali,
         vendortechquali,
         tenderdepartments,
         tenderddistricts,
         tenderdddemands,
         passedbids,
         goodsrecieved,
         purchaseorder,
         contracts,
         contracttemplates,
         blacklistrequest,
         blacklistvendor,
         userdashboard,
         prequalification,
         editUser } from './components/component-index'
import { AuthGuard } from './_gaurds/auth.gaurd'


export const ROUTES: Routes = [
  { path: '',      
    component: Login 
  },
  { path: 'login',      
    component: Login 
  },
  { path: 'blank',      
    component: blank 
  },
  {
    path: 'home',
    component: Home,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'tenders',
    component: tender,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'tenders/:tenderid/departments',
    component: tenderdepartments,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'tenders/:tenderid/departments/:departmentid',
    component: tenderddistricts,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'tenders/:tenderid/departments/:departmentid/:district',
    component: tenderdddemands,
    canActivate: [ AuthGuard ]
  },
  {    
    path: 'vendors',
    component: vendor,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'configs',
    component: configs,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'medicines',
    component: medicine,
    canActivate: [AuthGuard]
  },
  {
    path: 'financialbidding',
    component: financialbidding,
    canActivate: [AuthGuard]
  },
  {
    path: 'passedbids',
    component: passedbids,
    canActivate: [AuthGuard]
  },
  {
    path: 'goodsrecieved',
    component: goodsrecieved,
    canActivate: [AuthGuard]
  },
  {
    path: 'purchaseorder',
    component: purchaseorder,
    canActivate: [AuthGuard]
  },
  {
    path: 'demands',
    component: demand,
    canActivate: [AuthGuard]
  },
  {
    path: 'editdemand/:demandid',
    component: editdemand,
    canActivate: [AuthGuard]
  },
  {
    path: 'prequalification',
    component: prequalification,
    canActivate: [AuthGuard]
  },
  {
    path: 'techqualification',
    component: technicalqualification,
    canActivate: [AuthGuard]
  },  
  {
    path: 'vendorprequali',
    component: vendorprequali,
    canActivate: [AuthGuard]
  },
  {
    path: 'vendortechquali',
    component: vendortechquali,
    canActivate: [AuthGuard]
  },
  {
    path: 'contracts',
    component: contracts,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'contracttemplates',
    component: contracttemplates,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'blacklistrequest',
    component: blacklistrequest,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'blacklistvendor',
    component: blacklistvendor,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'pcohome',
    component: pcohome,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'userdashboard',
    component: userdashboard,
    canActivate: [ AuthGuard ]
  }, 
  {
    path: 'editUser/:edituserId',
    component: editUser,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'pcosingledemand/:tenderId',
    component: pcosingledemand,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'usersingledemand/:tenderId',
    component: userSingleDemand,
    canActivate: [ AuthGuard ]
  },
  { path: 'edittender/:tenderId',  
    component: editTender,
    canActivate: [ AuthGuard ]
  }
  // ,  
  // { 
  //   path: 'settings',  
  //   component: settings 
  // }
  ,
  { path: '**',    
    component: blank 
  }
];

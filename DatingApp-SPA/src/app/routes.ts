import {Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver} from './_resolver/member-detail.resolver';
import { MemberListResolver } from './_resolver/member-list.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolver/member-edit.resolver';
import { PreventChanges } from './_guards/prevent-changes.guard';



export const appRoutes: Routes = [
{path: '' , component: HomeComponent},
{

path: '',
runGuardsAndResolvers: 'always',
canActivate: [AuthGuard],
children: [
    {path: 'members' , component: MemberListComponent, canActivate: [AuthGuard], resolve: {users: MemberListResolver} },
    {path: 'members/:id' , component: MemberDetailComponent, canActivate: [AuthGuard], resolve: {user: MemberDetailResolver} },
    {path: 'member/edit', component: MemberEditComponent, canActivate: [AuthGuard], canDeactivate: [PreventChanges] ,
     resolve: {user: MemberEditResolver}},
    {path: 'messages' , component: MessagesComponent},
    {path: 'lists' , component: ListsComponent, canActivate: [AuthGuard]}

]
},

{path: '**' , redirectTo: '', pathMatch: 'full'}
];
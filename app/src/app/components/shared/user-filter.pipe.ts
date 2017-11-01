import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "userFilter"
})
export class userFilterPipe implements PipeTransform {
    transform(array: any[], query: string, option: string): any {
        console.log("In Tender filter pipe");
        console.log("QUERY In filter pipe:", query);
        if (query) {
            console.log("ARRAY In filter pipe", array);
            console.log("Option in filter pipe",option)
            if (option==='username' || option===null) return _.filter(array, row => row.username.indexOf(query) > -1)
            if (option==='email') return _.filter(array, row => row.email.indexOf(query) > -1)
            if (option==='role') return _.filter(array, row => row.role.indexOf(query) > -1)
            // if (option==='demanddateto') return _.filter(array, row => row.demanddateto.indexOf(query) > -1)
            // if (option==='demanddatefrom') return _.filter(array, row => row.demanddatefrom.indexOf(query) > -1)
            // if (option==='advdate') return _.filter(array, row => row.advdate.indexOf(query) > -1)
            // if (option==='department') {
            //     return _.filter(array, row => { 
            //         let depExist:boolean = false
            //         row.department.forEach(function(val,i){
            //             if (val.name.indexOf(query) > -1) depExist = true
            //         })
            //         return depExist
            //     })
            // }
        }
        console.log("ARRAY In filter pipe", array);
        return array
    }
}
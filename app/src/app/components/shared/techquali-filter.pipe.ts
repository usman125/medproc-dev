import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "techQualiFilter"
})
export class techQualiFilterPipe implements PipeTransform {
    transform(array: any[], query: string, option: any): any {
        console.log("In Tech Quali filter pipe", option);
        console.log("QUERY In filter pipe:", query);
        if (query) {
          // return _.filter(array, row => row.name.indexOf(query) > -1)
            // console.log("ARRAY In filter pipe", array);
            // console.log("Option in filter pipe",option)
            if (option==='name' || option===null) return _.filter(array, row => row.name.indexOf(query) > -1)
            if (option==='address') return _.filter(array, row => row.address.indexOf(query) > -1)
            if (option==='status') return _.filter(array, row => row.status.indexOf(query) > -1)
            // if (option==='meditype') return _.filter(array, row => row.meditype.indexOf(query) > -1)
            // if (option==='sgtdquantity') return _.filter(array, row => row.sgtdquantity.indexOf(query) > -1)
            // if (option==='estprice') return _.filter(array, row => row.estprice.indexOf(query) > -1)
            // if (option==='department') {
            //     return _.filter(array, row => { 
            //         let depExist:boolean = false
            //         row.department.forEach(function(val,i){
            //             if (val.name.indexOf(query) > -1) depExist = true
            //         })
            //         return depExist
            //     });
            // }
        }
        console.log("ARRAY In filter pipe", array);
        return array;
    }
}
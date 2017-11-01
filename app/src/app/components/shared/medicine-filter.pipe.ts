import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "medicineFilter"
})
export class MedicineFilterPipe implements PipeTransform {
    transform(array: any[], query: string, option: string): any {
        console.log("In Tender filter pipe");
        console.log("QUERY In filter pipe:", query);
        if (query) {
            console.log("ARRAY In filter pipe", array);
            console.log("Option in filter pipe",option)
            if (option==='name' || option===null) return _.filter(array, row => row.name.indexOf(query) > -1)
            if (option==='mediunit') return _.filter(array, row => row.mediunit.indexOf(query) > -1)
            if (option==='medisize') return _.filter(array, row => row.medisize.indexOf(query) > -1)
            if (option==='meditype') return _.filter(array, row => row.meditype.indexOf(query) > -1)
            if (option==='sgtdquantity') return _.filter(array, row => row.sgtdquantity.indexOf(query) > -1)
            if (option==='estprice') return _.filter(array, row => row.estprice.indexOf(query) > -1)
            if (option==='quantity') return _.filter(array, row => row.quantity.indexOf(query) > -1)
            if (option==='department') {
                return _.filter(array, row => { 
                    let depExist:boolean = false
                    row.department.forEach(function(val,i){
                        if (val.name.indexOf(query) > -1) depExist = true
                    })
                    return depExist
                });
            }
        }
        console.log("ARRAY In filter pipe", array);
        return array;
    }
}
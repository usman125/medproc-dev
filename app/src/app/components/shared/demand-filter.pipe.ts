import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "demandFilter"
})
export class DemandFilterPipe implements PipeTransform {
    transform(array: any[], query: string, option: string): any {
        console.log("In Demand filter pipe");
        console.log("QUERY In filter pipe:", query);
        if (query) {
            console.log("ARRAY In filter pipe", array);
            console.log("Option in filter pipe",option)
            if (option==='year' || option===null) return _.filter(array, row => row.year.indexOf(query) > -1)
            if (option==='districtname') return _.filter(array, row => row.districtname.indexOf(query) > -1)
            if (option==='tendername') return _.filter(array, row => row.tendername.indexOf(query) > -1)
        }
        console.log("ARRAY In filter pipe", array);
        return array
    }
}
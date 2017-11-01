import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "dataFilter"
})
export class DataFilterPipe implements PipeTransform {
    transform(array: any[], query: string): any {
        console.log("In filter pipe");
        console.log("QUERY In filter pipe:", query);
        if (query) {
            console.log("ARRAY In filter pipe", array);
            return _.filter(array, row => row.name.indexOf(query) > -1);
        }
        console.log("ARRAY In filter pipe", array);
        return array;
    }
}
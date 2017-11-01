import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "vendorFilter"
})
export class VendorFilterPipe implements PipeTransform {
    transform(array: any[], query: string, option: string): any {
        console.log("In Vendor filter pipe");
        console.log("QUERY In filter pipe:", query);
        if (query) {
            console.log("ARRAY In filter pipe", array);
            console.log("Option in filter pipe",option)
            if (option==='name' || option===null) return _.filter(array, row => row.name.indexOf(query) > -1)
            if (option==='address') return _.filter(array, row => row.address.indexOf(query) > -1)
        }
        console.log("ARRAY In filter pipe", array);
        return array
    }
}
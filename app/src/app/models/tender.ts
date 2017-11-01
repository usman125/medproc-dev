export class Tender {
  constructor(
    public name: string,
    public fiscalyear: string,
    public tenderdate: string,
    public demanddateto: string,
    public demanddatefrom: string,
    public advdate: string,
    public department: string,
    public pubinnews: string,
    public pubinppra: string,
    public prequalification: string,
    public emergancy: string){ }
}
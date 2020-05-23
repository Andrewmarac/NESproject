export class Icon { //viene richiamato il metodo scaledSize, e viene istanziato dentro il costruttore
    public scaledSize:ScaledSize;
    constructor(public url: string, size: number){
    this.scaledSize = new ScaledSize(size,size);
 }
 setSize(size: number) { //Metodo per permettere di cambiare la grandezza dell'icona
    this.scaledSize = new ScaledSize(size,size);
 }
}
export class ScaledSize { //classe che contiene i valori dati per permettere di modificare Icon
 constructor(
    public width: number,
    public height: number){}
}

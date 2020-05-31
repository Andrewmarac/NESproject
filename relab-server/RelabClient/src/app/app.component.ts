import { Component, OnInit } from '@angular/core';
import { GeoFeatureCollection } from './models/geojson.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ci_vettore } from './models/ci_vett.model';
import { Marker } from './models/marker.model';
import { MouseEvent } from '@agm/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ang-maps';

  zoom: number = 12;
  geoJsonObject: GeoFeatureCollection;
  fillColor: string = "#FF0000";
  obsGeoData: Observable<GeoFeatureCollection>;
  lng: number = 9.205331366401035;
  lat: number = 45.45227445505016;
  obsCiVett : Observable<Ci_vettore[]>
  markers: Marker[];
  foglio : string;
  circleLat : number = 0; //Latitudine e longitudine iniziale del cerchio
  circleLng: number = 0;
  maxRadius: number = 400; //Voglio evitare raggi troppo grossi
  radius : number = this.maxRadius; //Memorizzo il raggio del cerchio
  serverUrl : string = "https://3000-d1470ac1-7e04-42dd-a27e-d6d3f3d95eef.ws-eu01.gitpod.io";

  constructor(public http: HttpClient) {
  //Facciamo iniettare il modulo HttpClient dal framework Angular (ricordati di importare la libreria)
  }

  //Metodo che scarica i dati nella variabile geoJsonObject
  prepareData = (data: GeoFeatureCollection) => {
    this.geoJsonObject = data
    console.log( this.geoJsonObject );
  }

  //Una volta che la pagina web è caricata, viene lanciato il metodo ngOnInit scarico i    dati
  //dal server
  ngOnInit() {

  }

  cambiaFoglio(foglio) : boolean
  {
    let val = foglio.value;
    this.obsCiVett = this.http.get<Ci_vettore[]>(`${this.serverUrl}/ci_vettore/${val}`);
    this.obsCiVett.subscribe(this.prepareCiVettData);
    console.log(val);
    return false;
  }

  avgColorMap = (media) =>
  {
    if(media <= 36) return "#00FF00";
    if(36 < media && media <= 40) return "#33ff00";
    if(40 < media && media <= 58) return "#66ff00";
    if(58 < media && media <= 70) return "#99ff00";
    if(70 < media && media <= 84) return "#ccff00";
    if(84 < media && media <= 100) return "#FFFF00";
    if(100 < media && media <= 116) return "#FFCC00";
    if(116 < media && media <= 1032) return "#ff9900";
    if(1032 < media && media <= 1068) return "#ff6600";
    if(1068 < media && media <= 1948) return "#FF3300";
    if(1948 < media && media <= 3780) return "#FF0000";
    return "#FF0000"
  }
  styleFunc = (feature) => {
    return ({
      clickable: false,
      fillColor: this.avgColorMap(feature.i.media),
      strokeWeight: 1,
      fillOpacity : 1
    });
  }
   prepareCiVettData = (data: Ci_vettore[]) =>
  {
    let latTot = 0;
    let lngTot = 0;
    console.log(data);
    this.markers = [];

    for (const iterator of data) {
      let m = new Marker(iterator.WGS84_X,iterator.WGS84_Y,iterator.CI_VETTORE);
      latTot += m.lat;
      lngTot += m.lng;
      this.markers.push(m);
    }
    this.lng = lngTot/data.length;
    this.lat = latTot/data.length;
    this.zoom = 16;
  }

  mapClicked($event: MouseEvent) {
    this.circleLat = $event.coords.lat;
    this.circleLng = $event.coords.lng;
    this.lat = this.circleLat;
    this.lng = this.circleLng;
    this.zoom = 15;
  }




circleRedim(newRadius : number){
    console.log(newRadius)
    this.radius = newRadius;
  }


circleDoubleClicked(circleCenter)
  {
    console.log(circleCenter);
    console.log(this.radius);
    this.circleLat = circleCenter.coords.lat;
    this.circleLng = circleCenter.coords.lng;
    if(this.radius > this.maxRadius)
    {
      console.log("area selezionata troppo vasta sarà reimpostata a maxRadius");
      this.radius = this.maxRadius;
    }

    let raggioInGradi = (this.radius * 0.00001)/1.1132;


    const urlciVett = `${this.serverUrl}/ci_geovettore/
    ${this.circleLat}/
    ${this.circleLng}/
    ${raggioInGradi}`;

    const urlGeoGeom = `${this.serverUrl}/geogeom/
    ${this.circleLat}/
    ${this.circleLng}/
    ${raggioInGradi}`;

    this.obsCiVett = this.http.get<Ci_vettore[]>(urlciVett);
    this.obsCiVett.subscribe(this.prepareCiVettData);

    this.obsGeoData = this.http.get<GeoFeatureCollection>(urlGeoGeom);
    this.obsGeoData.subscribe(this.prepareData);



  }



}

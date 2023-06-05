import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import Overlay from 'ol/Overlay';
import { altKeyOnly } from 'ol/events/condition';
import DragRotate from 'ol/interaction/DragRotate.js';
import Draw from 'ol/interaction/Draw';
import GeoJSON from 'ol/format/GeoJSON.js';
import { defaults } from 'ol/control/defaults';
import FullScreen from 'ol/control/FullScreen.js';
import MousePosition from 'ol/control/MousePosition.js';
import OverviewMap from 'ol/control/OverviewMap.js';
import ScaleLine from 'ol/control/ScaleLine.js';
import ZoomSlider from 'ol/control/ZoomSlider.js';
import ZoomToExtent from 'ol/control/ZoomToExtent.js';
import LayerGroup from 'ol/layer/Group.js';

import TileDebug from 'ol/source/TileDebug.js';

import TileArcGISRest from 'ol/source/TileArcGISRest.js';
import TileWMS from 'ol/source/TileWMS.js';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild('coordinates', { static: true }) popupCoordinates: ElementRef<HTMLElement>;

  map: Map | undefined;

  get popupElement() {
    return this.popupCoordinates.nativeElement;
  }

  constructor() { }


  ngOnInit(): void {

    const fullScreenControl = new FullScreen();
    const mousePositionControl = new MousePosition();
    const overviewMapControl = new OverviewMap({
      collapsed: false,
      layers: [
        new TileLayer({
          source: new OSM(),
          opacity: 0.7,
        })
      ]
    });

    const scaleLineControl = new ScaleLine()
    const zoomSliderControl = new ZoomSlider();
    const zoomToExtentControl = new ZoomToExtent();

    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
          opacity: 1,
          zIndex: 1,
          // extent: [12153051.421774272, -5661712.999483634, 17323431.235979613, -981375.663527] //[minx, miny, maxx, maxy].

        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 3,
        // maxZoom: 6,
        minZoom: 2,
        rotation: 0.1, // in radian: 360degrees =  2PI = 6.28rad
        // extent: [12153051.421774272, -5661712.999483634, 17323431.235979613, -981375.663527] //[minx, miny, maxx, maxy].

      }),
      keyboardEventTarget: document,
      controls: defaults().extend([
        fullScreenControl,
        mousePositionControl,
        overviewMapControl,
        scaleLineControl,
        zoomSliderControl,
        zoomToExtentControl
      ])
    });

    const layerGroup = new LayerGroup({
      layers: [
        new TileLayer({
          source: new OSM({
            url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
          }),
          zIndex: 0,
          visible: true
        }),
      ]
    });

    this.map.addLayer(layerGroup)

    const tileDebugLayer = new TileLayer({
      source: new TileDebug(),
      visible: true,
      zIndex: 3
    })
    this.map.addLayer(tileDebugLayer);

    // Tile ArcGIS REST API layer: Made by Esri
    const tileArcGISLayer = new TileLayer({
      source: new TileArcGISRest({
        url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Elevation/WorldElevations/MapServer'
        // url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Military/MapServer'
      }),
      visible: true,
      zIndex: 4
    });

    this.map.addLayer(tileArcGISLayer);


    // WMS: Web Map Service (WMS) was created by the Open Geospatial Consortium (OGC)
    // https://nowcoast.ncep.noaa.gov/  // NOAA WMS Layer
    const NOAAWMSLayer = new TileLayer({
      source: new TileWMS({
        url: 'https://nowcoast.ncep.noaa.gov/arcgis/services/nowcoast/analysis_meteohydro_sfc_qpe_time/MapServer/WMSServer?',
        params: {
          LAYERS: 1,
          FORMAT: 'image/png',
          TRANSPARENT: true
        },
        attributions: '<a href="https://nowcoast.ncep.noaa.gov/">© NOAA</a>'
      }),
      zIndex: 5,
    })
    this.map.addLayer(NOAAWMSLayer);

    NOAAWMSLayer.getSource()?.setAttributions('Set by setAttributions()');

    console.log(NOAAWMSLayer.getKeys());
    NOAAWMSLayer.set('maxZoom', 5);



    this.createPopupOverlay();

    this.addDragRotateInteraction();

    this.drawPolygon();
  }

  createPopupOverlay() {
    const popup = new Overlay({
      element: this.popupElement,
      positioning: 'center-left'  // positions exactly center right of the mouse pointer, so always oposite of this text value
    });

    this.map?.addOverlay(popup);


    this.map?.on('click', (e) => {
      popup.setPosition(undefined); // make sure there is not spawning several overlays
      popup.setPosition(e.coordinate);
      this.popupElement.textContent = `X:${e.coordinate[0]}   Y:${e.coordinate[1]}`

    })


  }

  addDragRotateInteraction() {
    // interaction is interact with the map without ui elements
    this.map?.addInteraction(new DragRotate({ condition: altKeyOnly }));
  }

  drawPolygon() {
    const drawInteraction = new Draw({
      type: 'Polygon',
      // freehand: true
    });

    this.map?.addInteraction(drawInteraction)

    drawInteraction.on('drawend', (e) => {
      let parser = new GeoJSON();
      let drawnFeatures = parser.writeFeaturesObject([e.feature]);
      console.log((drawnFeatures.features[0].geometry as any).coordinates); // convert to any because type issue in Geometry polygon missing coordinates in the type
    })
  }


  // CONTROLS:
  // --> Attribution: Display credits
  // --> Zoom in and out
  // --> Rotate: Button only shows when rotated




}



// Raster layers:
// -Tiled raster layer: images divided in grids/small images
// -Untiled raster layer: 1 single image.

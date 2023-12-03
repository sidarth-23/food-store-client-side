import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  LatLng,
  LatLngExpression,
  LatLngLiteral,
  LatLngTuple,
  LeafletMouseEvent,
  Marker,
  icon,
  latLng,
  map,
  marker,
  tileLayer,
} from 'leaflet';
import { LocationService } from '../../../services/location.service';
import { CommonModule } from '@angular/common';
import { Address } from '../../../shared/models/User';

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css'],
})
export class MapsComponent implements OnInit {
  @Output() locationClicked: EventEmitter<LatLngLiteral> =
    new EventEmitter<LatLngLiteral>();
  @Input()
  address!: Address;
  @Input()
  readonly = false;
  private markerHasBeenSet = false;
  private readonly MARKER_ZOOM_LEVEL = 16;
  private readonly MARKER_ICON = icon({
    iconUrl:
      'https://res.cloudinary.com/foodmine/image/upload/v1638842791/map/marker_kbua9q.png',
    iconSize: [42, 42],
    iconAnchor: [21, 42],
  });

  @ViewChild('map', { static: true })
  mapRef!: ElementRef;

  map!: any;
  currentMarker!: Marker;
  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.locationService.getCurrentLocation().subscribe((latLng) => {
      if (this.address) {
        this.addressLatLng = {lat: this.address.lat, lng:this.address.lng}
      } else {
        this.addressLatLng = latLng || { lat: 11, lng: 84 };
      }
      this.markerHasBeenSet = false;
      if (this.readonly) {
        this.showLocationOnReadOnlyMode();
        return;
      }
      this.initializeMap(this.addressLatLng as LatLng);
    });
  }

  showLocationOnReadOnlyMode() {
    const m = this.map;
    this.setMarker(this.addressLatLng);
    m.setView(this.addressLatLng, this.MARKER_ZOOM_LEVEL);
    this.map.options.minZoom = 12;
    this.map.options.maxZoom = 14;
    m.dragging.disable();
    m.touchZoom.disable();
    m.doubleClickZoom.disable();
    m.scrollWheelZoom.disable();
    m.boxZoom.disable();
    m.keyboard.disable();
    m.off('click');
    m.tap?.disable();
    this.currentMarker.dragging?.disable();
  }

  initializeMap(latLng?: LatLng) {
    if (this.map) return;

    this.map = map(this.mapRef.nativeElement, {
      attributionControl: false,
    }).setView(this.addressLatLng, 40);

    this.map.options.minZoom = 4;
this.map.options.maxZoom = 18;
    // tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map);
    tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(this.map);

    if (latLng) {
      this.map.setView(latLng, this.MARKER_ZOOM_LEVEL);
      this.setMarker(latLng);
      this.markerHasBeenSet = true;
    } else {
      this.map.setView(this.addressLatLng, 5);
    }

    this.map.on('click', (e: LeafletMouseEvent) => {
      this.setMarker(e.latlng);
    });
  }

  findMyLocation() {
    this.locationService.getCurrentLocation().subscribe({
      next: (latlngLiteral: LatLngLiteral) => {
        const latlng: LatLng = latLng(latlngLiteral.lat, latlngLiteral.lng);
        this.map.setView(latlng, this.MARKER_ZOOM_LEVEL);
        this.setMarker(latlng);
      },
    });
  }

  setMarker(latlng: LatLngExpression) {
    console.log('latlng',latlng)
    this.addressLatLng = latlng as LatLng;
    this.locationClicked.emit(this.addressLatLng);

    // Check if the marker has not been set yet
    // if (!this.markerHasBeenSet) {
    if (this.currentMarker) {
      this.currentMarker.setLatLng(latlng);
      return;
    }

    this.currentMarker = marker(latlng, {
      draggable: true,
      icon: this.MARKER_ICON,
    }).addTo(this.map);

    this.currentMarker.on('dragend', () => {
      this.addressLatLng = this.currentMarker.getLatLng();
    });

    //   this.markerHasBeenSet = true // Set the flag to true to prevent further updates
    // }
  }

  set addressLatLng(latlng: LatLngLiteral) {
    if (!latlng) return;
    this.locationService.latLngStore = latlng;
  }

  get addressLatLng() {
    return this.locationService.latLngStore as LatLng;
  }
}

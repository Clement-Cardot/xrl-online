import { Component, Input } from '@angular/core';
import { LoadingService } from 'src/app/core/services/loading-service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {

  loading$ = this.loadingService.loading$;

  constructor(private loadingService: LoadingService) {}
}

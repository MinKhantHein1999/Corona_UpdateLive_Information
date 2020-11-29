import { Component, OnInit, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ApiService } from '../service/api.service';
import { Covid } from '../covid';
import { CovidBarChart } from './covid-bar-chart';

@Component({
  selector: 'app-covid',
  templateUrl: './covid.component.html',
  styleUrls: ['./covid.component.scss'],
  providers: [DecimalPipe],
})
export class CovidComponent implements OnInit {
  // countries$: Observable<Country[]>;
  covidobjs$: Observable<Covid[]>;
  filter = new FormControl('');
  originalData: Covid[];

  covidBarChart: CovidBarChart[] = [];
  view: any[] = [1500, 2500];

  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Country';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Infected Cases';
  barPadding: number = 2;
  colorScheme = {
    domain: [],
  };

  constructor(private pipe: DecimalPipe, private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getInformation().subscribe((data: Covid[]) => {
      // console.log(data);
      data.forEach((obj: Covid) => {
        this.covidBarChart.push({ name: obj.country, value: obj.cases });
        const hexColor = '#' + ((Math.random() * 0xffffff) << 0).toString(16);
        this.colorScheme.domain.push(hexColor);
      });

      this.originalData = data;
      this.covidobjs$ = this.filter.valueChanges.pipe(
        startWith(''),
        map((text) => this.search(text, this.pipe, this.originalData))
      );
    });
  }
  search(text: string, pipe: PipeTransform, covids: Covid[]): any {
    return covids.filter((covid) => {
      const term = text.toLowerCase();
      return (
        (covid.country && covid.country.toLowerCase().includes(term)) ||
        (covid.cases && pipe.transform(covid.cases).includes(term)) ||
        (covid.todayCases && pipe.transform(covid.todayCases).includes(term)) ||
        (covid.deaths && pipe.transform(covid.deaths).includes(term)) ||
        (covid.todayDeaths &&
          pipe.transform(covid.todayDeaths).includes(term)) ||
        (covid.recovered && pipe.transform(covid.recovered).includes(term)) ||
        (covid.active && pipe.transform(covid.active).includes(term)) ||
        (covid.critical && pipe.transform(covid.critical).includes(term)) ||
        (covid.casesPerOneMillion &&
          pipe.transform(covid.casesPerOneMillion).includes(term)) ||
        (covid.deathsPerOneMillion &&
          pipe.transform(covid.deathsPerOneMillion).includes(term)) ||
        (covid.tests && pipe.transform(covid.tests).includes(term))
      );
    });
  }
}

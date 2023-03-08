import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';

import { FdDate } from '@fundamental-ngx/core/datetime';
import {
  TableDataSource,
  TableDataProvider,
  TableState,
  TableRowToggleOpenStateEvent,
  TableRowsRearrangeEvent,
} from '@fundamental-ngx/platform/table';
// @ts-ignore
import * as Dracula from 'graphdracula';

declare var Raphael: any;

@Component({
  selector: 'app-table-tree',
  templateUrl: './table-tree.component.html',
  styleUrls: ['./table-tree.component.scss'],
})
export class TableTreeComponent implements AfterViewInit {
  @ViewChild('startingElement') startingElement: ElementRef | undefined;
  @ViewChild('endingElement') endingElement: ElementRef | undefined;

  source: TableDataSource<ExampleItem>;
  footerSource: TableDataSource<ExampleFooter>;
  tableWidth = '300px';

  constructor() {
    this.source = new TableDataSource(new TableDataProviderExample());
    this.footerSource = new TableDataSource(new FooterTableProvider());
  }

  alert(message: string): void {
    alert(message);
  }

  ngAfterViewInit() {
    // const line = new LeaderLine(
    //   this.startingElement?.nativeElement,
    //   this.endingElement?.nativeElement,
    //   { color: 'green', size: 2, endPlugSize: 3 }
    // );
    let paper = Raphael(document.getElementById('canvas'), 500, 500);
    paper.path('M0,200L900,500');

    const Graph = Dracula.Graph;
    const Renderer = Dracula.Renderer.Raphael;
    const Layout = Dracula.Layout.Spring;

    const graph = new Graph();

    graph.addEdge('GroupContent', 'equals', { directed: true });
    graph.addEdge('GroupIndex', 'equals', { directed: true });
    graph.addEdge('equals', 'LastPage', { directed: true });

    const layout = new Layout(graph);
    const renderer = new Renderer('#paper', graph, 900, 400);
    renderer.draw();
  }

  onRowToggleOpenState(event: TableRowToggleOpenStateEvent<ExampleItem>): void {
    console.log(event);
  }

  onRowsRearrange(event: TableRowsRearrangeEvent<ExampleItem>): void {
    console.log(event);
  }
}

export interface ExampleItem {
  structure: string;
  occurence: string;
  children?: ExampleItem[];
}

export interface ExampleFooter {
  name: string;
  children?: ExampleFooter[];
}

/**
 * Table Data Provider Example
 *
 */
export class TableDataProviderExample extends TableDataProvider<ExampleItem> {
  override items: ExampleItem[] = [...ITEMS];
  override totalItems = ITEMS.length;

  override fetch(tableState?: TableState): Observable<ExampleItem[]> {
    this.items = [...ITEMS];

    // apply searching
    if (tableState?.searchInput) {
      this.items = this.search(this.items, tableState);
    }

    this.totalItems = this.items.length;

    return of(this.items);
  }

  override search(
    items: ExampleItem[],
    { searchInput, columnKeys }: TableState
  ): ExampleItem[] {
    const searchText = searchInput?.text || '';
    const keysToSearchBy = columnKeys;

    if (searchText.trim() === '' || keysToSearchBy.length === 0) {
      return items;
    }

    return items.filter((item) => {
      const valuesForSearch = keysToSearchBy.map((key) =>
        getNestedValue(key, item)
      );
      return valuesForSearch
        .filter((value) => !!value)
        .map((value): string => value.toString())
        .some((value) =>
          value.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())
        );
    });
  }
}

export class FooterTableProvider extends TableDataProvider<ExampleFooter> {
  override items: ExampleFooter[] = [...ITEMS_FOOTER];
  override totalItems = ITEMS.length;

  override fetch(tableState?: TableState): Observable<ExampleFooter[]> {
    this.items = [...ITEMS_FOOTER];

    // apply searching
    if (tableState?.searchInput) {
      this.items = this.search(this.items, tableState);
    }

    this.totalItems = this.items.length;

    return of(this.items);
  }
}

function getNestedValue<T extends Record<string, any>>(
  key: string,
  object: T
): any {
  return key.split('.').reduce((a, b) => (a ? a[b] : null), object);
}

// Example items
const ITEMS: ExampleItem[] = [
  {
    structure: 'root',
    occurence: '1..1',
    children: [
      {
        structure: 'page',
        occurence: '1..1',
      },
      {
        structure: 'lastpage',
        occurence: '1..1',
      },
      {
        structure: 'bounces',
        occurence: '0..*',
        children: [
          {
            structure: 'messageId',
            occurence: '1..1',
          },
          {
            structure: 'recipient',
            occurence: '1..1',
          },
          {
            structure: 'errorCode',
            occurence: '1..1',
          },
          {
            structure: 'errorText',
            occurence: '1..1',
          },
          {
            structure: 'type',
            occurence: '1..1',
          },
        ],
      },
    ],
  },
];

const ITEMS_FOOTER: ExampleFooter[] = [
  {
    name: 'Arithmetic',
  },
  {
    name: 'Boolean',
    children: [{ name: 'func 1' }, { name: 'func 2' }],
  },
  {
    name: 'Constants',
    children: [{ name: 'func 1' }, { name: 'func 2' }],
  },
  {
    name: 'Conversions',
  },
];

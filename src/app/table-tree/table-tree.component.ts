import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';

import { FdDate } from '@fundamental-ngx/core/datetime';
import {
  TableDataSource,
  TableDataProvider,
  TableState,
  TableRowToggleOpenStateEvent,
  TableRowsRearrangeEvent,
} from '@fundamental-ngx/platform/table';

@Component({
  selector: 'app-table-tree',
  templateUrl: './table-tree.component.html',
  styleUrls: ['./table-tree.component.scss'],
})
export class TableTreeComponent {
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

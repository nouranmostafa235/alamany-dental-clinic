import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchTerm: string, fields?: string[]): any[] {
    if (!items || !items.length) {
      return items;
    }
    if (!searchTerm || !searchTerm.trim()) {
      return items;
    }
    const searchLower = searchTerm.toLowerCase().trim();
    return items.filter(item => {
      // If specific fields are provided, search only in those fields
      if (fields && fields.length > 0) {
        return fields.some(field => {
          const value = this.getNestedProperty(item, field);
          return value && value.toString().toLowerCase().includes(searchLower);
        });
      }

      // Otherwise, search in all string properties
      return this.searchInObject(item, searchLower);
    });
  }
  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }
  private searchInObject(obj: any, searchTerm: string): boolean {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        if (value === null || value === undefined) {
          continue;
        }

        // If it's a string, check if it includes the search term
        if (typeof value === 'string' && value.toLowerCase().includes(searchTerm)) {
          return true;
        }

        // If it's a number, convert and check
        if (typeof value === 'number' && value.toString().includes(searchTerm)) {
          return true;
        }

        // If it's an object (but not Date), search recursively
        if (typeof value === 'object' && !(value instanceof Date)) {
          if (this.searchInObject(value, searchTerm)) {
            return true;
          }
        }
      }
    }
    return false;
  }
}

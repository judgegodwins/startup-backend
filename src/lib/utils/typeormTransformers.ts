/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */

export class ColumnNumericTransformer {
  // eslint-disable-next-line
  to(data: number): number {
    return data;
  }

  // eslint-disable-next-line
  from(data: string): number {
    return parseFloat(data);
  }
}

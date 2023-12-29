import { getCurrentPage, getTotalPages } from "../utils";

describe('getCurrentPage', () => {
  test('should return 1 if data is undefined', () => {
    expect(getCurrentPage(undefined)).toBe(1);
  });

  test('should calculate current page based on the next property', () => {
    const data = { next: 'url?page=3&otherParam', count: 100, results: new Array(20), previous: null };
    expect(getCurrentPage(data)).toBe(2);
  });

  test('should calculate current page based on the previous property', () => {
    const data = { previous: 'url?page=1&otherParam', count: 100, results: new Array(20), next: null };
    expect(getCurrentPage(data)).toBe(2);
  });

  test('should handle the scenario where there is no next or previous page', () => {
    const data = { count: 20, results: new Array(20), previous: null, next: null };
    expect(getCurrentPage(data)).toBe(1);
  });
});


describe('getTotalPages', () => {
  test('should return 1 if data is undefined', () => {
    expect(getTotalPages(undefined)).toBe(1);
  });

  test('should calculate total pages when next is not null', () => {
    const data = { next: 'url?page=3&otherParam', count: 100, results: new Array(20), previous: null };
    expect(getTotalPages(data)).toBe(5);
  });

  test('should return the current page as total when there is no next page', () => {
    const data = { count: 40, results: new Array(20), previous: null, next: null };
    const currentPage = getCurrentPage(data);
    expect(getTotalPages(data)).toBe(currentPage);
  });
});

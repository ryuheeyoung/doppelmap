import { describe, expect, it } from 'vitest';

import {
  extractGpsFromExif,
  isValidCoordinate,
  sortByTimestamp,
} from '../exif';

describe('extractGpsFromExif', () => {
  it('should return GPS data when valid EXIF data provided', () => {
    // Arrange
    const exifData = {
      latitude: 37.5665,
      longitude: 126.978,
      DateTimeOriginal: new Date('2024-05-01T10:00:00'),
    };

    // Act
    const result = extractGpsFromExif(exifData);

    // Assert
    expect(result).toEqual({
      lat: 37.5665,
      lng: 126.978,
      timestamp: new Date('2024-05-01T10:00:00').toISOString(),
    });
  });

  it('should return null when latitude is missing', () => {
    // Arrange
    const exifData = { longitude: 126.978 };

    // Act
    const result = extractGpsFromExif(exifData);

    // Assert
    expect(result).toBeNull();
  });

  it('should return null when longitude is missing', () => {
    // Arrange
    const exifData = { latitude: 37.5665 };

    // Act
    const result = extractGpsFromExif(exifData);

    // Assert
    expect(result).toBeNull();
  });

  it('should return null when exif data is empty', () => {
    // Arrange & Act
    const result = extractGpsFromExif({});

    // Assert
    expect(result).toBeNull();
  });

  it('should set timestamp to null when DateTimeOriginal is missing', () => {
    // Arrange
    const exifData = { latitude: 37.5665, longitude: 126.978 };

    // Act
    const result = extractGpsFromExif(exifData);

    // Assert
    expect(result?.timestamp).toBeNull();
  });
});

describe('isValidCoordinate', () => {
  it('should return true for valid Korean coordinates', () => {
    expect(isValidCoordinate(37.5665, 126.978)).toBe(true);
  });

  it('should return false when latitude is out of range', () => {
    expect(isValidCoordinate(91, 126.978)).toBe(false);
    expect(isValidCoordinate(-91, 126.978)).toBe(false);
  });

  it('should return false when longitude is out of range', () => {
    expect(isValidCoordinate(37.5665, 181)).toBe(false);
    expect(isValidCoordinate(37.5665, -181)).toBe(false);
  });

  it('should return false for NaN values', () => {
    expect(isValidCoordinate(NaN, 126.978)).toBe(false);
    expect(isValidCoordinate(37.5665, NaN)).toBe(false);
  });
});

describe('sortByTimestamp', () => {
  it('should sort GPS points by timestamp ascending', () => {
    // Arrange
    const points = [
      { lat: 37.1, lng: 126.1, timestamp: '2024-05-01T12:00:00.000Z' },
      { lat: 37.2, lng: 126.2, timestamp: '2024-05-01T10:00:00.000Z' },
      { lat: 37.3, lng: 126.3, timestamp: '2024-05-01T11:00:00.000Z' },
    ];

    // Act
    const result = sortByTimestamp(points);

    // Assert
    expect(result[0].lat).toBe(37.2);
    expect(result[1].lat).toBe(37.3);
    expect(result[2].lat).toBe(37.1);
  });

  it('should place null timestamp points at the end', () => {
    // Arrange
    const points = [
      { lat: 37.1, lng: 126.1, timestamp: null },
      { lat: 37.2, lng: 126.2, timestamp: '2024-05-01T10:00:00.000Z' },
    ];

    // Act
    const result = sortByTimestamp(points);

    // Assert
    expect(result[0].lat).toBe(37.2);
    expect(result[1].lat).toBe(37.1);
  });
});

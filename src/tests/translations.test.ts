import * as msg_en from '../lang/en.json';
import * as msg_fr from '../lang/fr.json';

describe('Translations', () => {
  it('Should have no missing translations keys', () => {
    function compareJsonKeys(json1: any, json2: any, parentKey = ''): boolean {
      const keys1 = Object.keys(json1);
      const keys2 = Object.keys(json2);
      let hasError = false;

      // Check if all keys from json1 exist in json2
      for (const key of keys1) {
        if (!keys2.includes(key)) {
          console.log(`Missing key: ${parentKey}${parentKey ? '.' : ''}${key}`);
          hasError = true;
        }

        const value1 = json1[key];
        const value2 = json2[key];

        // Recursively compare nested objects
        if (typeof value1 === 'object' && typeof value2 === 'object') {
          const nestedParentKey = parentKey ? `${parentKey}.${key}` : key;
          compareJsonKeys(value1, value2, nestedParentKey);
        }
      }

      // Check if all keys from json2 exist in json1
      for (const key of keys2) {
        if (!keys1.includes(key)) {
          console.log(`Missing key: ${parentKey}${parentKey ? '.' : ''}${key}`);
          hasError = true;
        }

        const value1 = json1[key];
        const value2 = json2[key];

        // Recursively compare nested objects
        if (typeof value1 === 'object' && typeof value2 === 'object') {
          const nestedParentKey = parentKey ? `${parentKey}.${key}` : key;
          compareJsonKeys(value1, value2, nestedParentKey);
        }
      }
      return hasError;
    }

    expect(compareJsonKeys(msg_en, msg_fr)).toBe(false);
  });
});

import { sayHello } from '../functions/hello';

test('says hello', () => {
  expect(sayHello('Sample')).toBe('Hello Sample!');
});

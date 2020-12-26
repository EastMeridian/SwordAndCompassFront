import { getDirectionFromOrientation, Direction } from './Direction';

describe('getDirectionFromOrientation()', () => {
  it('should return the rights direction', () => {
    expect(getDirectionFromOrientation(400, 300, 608, 230)).toBe(Direction.RIGHT);

    expect(getDirectionFromOrientation(400, 300, 414, 418)).toBe(Direction.DOWN);

    expect(getDirectionFromOrientation(400, 300, 193, 330)).toBe(Direction.LEFT);

    expect(getDirectionFromOrientation(400, 300, 355, 175)).toBe(Direction.UP);
  });
});

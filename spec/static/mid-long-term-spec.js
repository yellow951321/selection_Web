import contentFilter from '../../mid-long-term/models/operations/content-filter.js'

describe("In mid-long-term operations,", function() {
    it("content-filter", function() {
      let expectation = contentFilter({
        aspect: 0,
        keypoint: 0,
        method: 0,
        dataId: 0,
      })
      expect(expectation === empty || typeof expectation === "array").toBe(true);
    });
    it("contains spec with an expectation", function() {
      expect(false).toBe(true);
    });
    it("contains spec with an expectation", function() {
      expect(false).toBe(true);
    });
  });